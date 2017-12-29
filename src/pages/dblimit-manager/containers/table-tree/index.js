import {Component, PropTypes} from 'react';
import {Row, Pagination, Message, Table, Button, InputGroup, Icon, FormControl} from 'tinper-bee';
import Checkbox from 'rc-checkbox';

import AuthModal from '../../../../components/authModal';
import Title from '../../../../components/Title';
import {getCookie} from '../../../../components/util';

import {getTree} from '../../../../serves/dblimit-manager';

import 'rc-checkbox/assets/index.css';
import './index.less';


class TableTree extends Component {
  static propTypes = {};
  static defaultProps = {};
  static contextTypes = {
    router: PropTypes.object
  };
  state = {
    data: [],
    showData: [],
    activePage: 1,
    totalPage: 0,
    searchValue: '',
    checkedGroup: [],
    showAddModal: false,
    authData: {},
    expandRow: []
  };
  selected = '';

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '批量授权',
      dataIndex: 'b',
      key: 'b',
      render: (text, rec) => {
        let { checkedGroup } = this.state;
        let checked = checkedGroup.indexOf(rec.key) > -1 || checkedGroup.indexOf(rec.parent) > -1;
        return (
          <Checkbox checked={ checked } onChange={ this.handleCheckboxChange(rec) }/>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'c',
      key: 'c',
      render: (text, rec) => {
        return (
          <span className="limit" onClick={ this.goToAuth(rec) }>权限</span>
        )
      }
    },
  ];

  componentDidMount() {
    this.getTreeData('?group=false');
    let {authData} = this.state;
    authData.providerId = getCookie('u_providerid');
    authData.busiCode = 'data_search';
    authData.userId = '';
    authData.id = '';
    this.setState({
      authData
    })
  }

  /**
   * 跳到auth
   */
  goToAuth = (rec) => {
    return () => {
      let {authData} = this.state;

      this.context.router.push(encodeURI(`/auth/${rec.name}?id=${rec.key}&providerId=${authData.providerId}&busiCode=${authData.busiCode}&userId=${authData.userId}`));
    }
  }

  /**
   * 获取树数据
   * @param param
   */
  getTreeData = (param) => {

    getTree(param).then((res) => {
      let data = res.data;
      if (data.error_code) {
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      }
      let showData = data.slice(0, 10);
      let totalPage = Math.ceil(data.length / 10);
      data.forEach((item, index) => {
        item.key = item.tableName;
        item.name = item.tableName;
        item.children = [];
        item.columnList.forEach((item2, index2) => {
          item.children.push({
            name: item2,
            key: `${item.tableName}@__@${item2}`,
            parent: item.tableName
          })
        })
      });
      this.setState({
        data,
        showData,
        totalPage
      })
    })
  }

  /**
   * checkbox选择
   * @param rec
   * @returns {function(*)}
   */
  handleCheckboxChange = (rec) => {
    return (e) => {
      let {checkedGroup, authData} = this.state;
      if (e.target.checked) {
        checkedGroup.push(rec.key);
      } else {
        let index = checkedGroup.indexOf(rec.key);
        if (index > -1) {
          checkedGroup.splice(index, 1);
        }
      }
      authData.id = checkedGroup.join(',');
      this.setState({
        checkedGroup,
        authData
      })
    }
  }

  /**
   * 分页按钮点击
   * @param eventKey
   */
  handleSelect = (eventKey) => {
    let {searchValue, data} = this.state;
    if (searchValue !== '') {
      data = this.filter(searchValue, data)
    }
    let showData = data.slice((eventKey-1) * 10, eventKey * 10);
    this.setState({
      activePage: eventKey,
      showData
    })
  }

  /**
   * 搜索输入框事件
   * @param e
   */
  handleInputChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  /**
   * 模态框显示控制
   * @param value
   * @returns {function()}
   */
  showModal = (value) => {
    return () => {
      let { checkedGroup } = this.state;
      if(value === true && checkedGroup.length === 0){
        return Message.create({
          content: '请先选择数据表',
          color: 'warning',
          duration: 4.5
        })
      }
      this.setState({
        showAddModal: value
      })
    }

  }


  /**
   * 搜索
   */
  handleSearch = () => {
    let {searchValue, data} = this.state;
    if(searchValue === ''){
      let totalPage = Math.ceil(data.length/10);
      let showData = data.slice(0, 10);
      this.setState({
        showData,
        activePage: 1,
        totalPage
      })
    }else{
      data = this.filter(searchValue, data);
      let totalPage = Math.ceil(data.length/10);
      let showData = data.slice(0, 10);

      this.setState({
        showData,
        activePage: 1,
        totalPage
      })
    }

  }

  /**
   * 过滤函数
   * @param searchValue
   * @param data
   * @returns {*}
   */
  filter = (searchValue, data) => {
    if (!searchValue || searchValue === '') return data;
    let regExp = new RegExp(searchValue, 'ig');
    return data.filter((item) => {
      return regExp.test(item.name)
    })
  }

  /**
   * 输入框点击事件
   * @param e
   */
  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  /**
   * 清空输入
   */
  clearSearch = () => {
    let { data} = this.state;
    let showData = data.slice(0, 10);
    let totalPage = Math.ceil(data.length/10);
    this.setState({
      showData,
      activePage: '1',
      totalPage,
      searchValue: ''
    })
  }

  /**
   * 批量授权
   */
  authorization = () => {
    let {checkedGroup} = this.state;
  }

  /**
   * 点击展开
   * @param record
   * @param index
   */
  handleRowClick = (record, index) => {
    let { expandRow } = this.state;
    if(expandRow.indexOf(index) > -1){
      expandRow.splice(expandRow.indexOf(index), 1);
    }else{
      expandRow.push(index)
    }
    this.setState({
      expandRow
    })
  }

  render() {
    let {authData} = this.state;

    return (
      <div>
        <Title name="数据库权限管理" showBack={false}/>
        <div className="container">
          <Button shape="squared" colors="primary" onClick={ this.showModal(true)}>批量授权</Button>
          <InputGroup simple className="table-tree-search">
            <FormControl
              value={ this.state.searchValue }
              onChange={ this.handleInputChange }
              onKeyDown={ this.handleKeyDown }
              type="text"
            />
            <InputGroup.Button shape="border">
              {
                this.state.searchValue === "" ? null : (
                  <Icon onClick={ this.clearSearch } className="deleteSearchValue" type="uf-close-c"/>
                )
              }
              <Icon type="uf-search" onClick={ this.handleSearch }/>
            </InputGroup.Button>
          </InputGroup>
          <Table
            className="table-data"
            data={ this.state.showData }
            columns={ this.columns }
          />
          {
            this.state.totalPage > 1 ? (
              <Pagination
                first
                last
                prev
                next
                boundaryLinks
                items={this.state.totalPage}
                maxButtons={5}
                activePage={this.state.activePage}
                onSelect={this.handleSelect}
              />
            ) : null
          }

        </div>
        <AuthModal
          show={ this.state.showAddModal }
          onClose={this.showModal(false) }
          onEnsure={ this.authorization }
          data={ authData }
        />
      </div>
    )
  }
}

export default TableTree;
