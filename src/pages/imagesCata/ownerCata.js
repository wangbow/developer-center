import React, {Component, PropTypes} from 'react'
import {Row, Col, Breadcrumb, Tile, Table, Popconfirm, Icon, Message, Pagination} from 'tinper-bee'
import {getOwnerImage, deleteImageTag} from '../../serves/imageCata'

import {formateDate, clone, lintAppListData} from '../../components/util';
import NoData from './components/noData/noData';
import PageLoading from '../../components/loading/index';
import { warn, success, err } from 'components/message-util';
import Search from 'components/search';

import verifyAuth from '../../components/authPage/check';

class OwnerCata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showLoading: true,
      activePage: 1,
      page: 0,
      searchValue: ''
    };
    this.columns = [{
      title: '',
      dataIndex: 'dr',
      key: 'dr',
      render: function () {
        return (<Icon type="uf-box-2" style={{color: '#00bc9b', fontSize: 20}}/>)
      },
      width: '1%'
    }, {
      title: '镜像名称',
      dataIndex: 'pure_image_name',
      key: 'pure_image_name',
    }, {
      title: '上传用户',
      dataIndex: 'user_name',
      key: 'user_name',
    }, {
      title: '创建时间',
      dataIndex: 'ts',
      key: 'ts',
      render: function (text, record, index) {
        return formateDate(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: this.renderCellTwo.bind(this),
    }];

  }

  componentDidMount() {
    this.getPrivate();
  }

  getPrivate = (index = 0, searchValue = '') => {
    //获取私有镜像列表
    this.setState({
      showLoading: true,
      activePage: index + 1
    });
    let param = `?pageSize=10&pageIndex=${index}`;
    if(searchValue !== ''){
      param = `?pageSize=10&pageIndex=${index}&name=${searchValue}`;
    }
    getOwnerImage(param).then((res) => {

      let data = res.data;
      if(data.error_code){
        err(`${data.error_code}:${data.error_message}`)
      }
      if (data.data instanceof Array) {
        data.data.forEach(function (item, index) {
          item.key = index;
        });
          this.setState({
            data: data.data,
            showLoading: false,
            page: Math.ceil(data.max_count/10)
          })
      }


    })
  }

  /**
   * 渲染表格操作列
   * @param text
   * @param record
   * @param index
   * @returns {XML}
   */
  renderCellTwo = (text, record, index) => {
    return (
      <div>
        <i style={{cursor: 'pointer'}} className="cl cl-permission" title="权限管理"
           onClick={this.managerAuth(record)}/>
        <Popconfirm content="确认删除?" placement="bottom" onClick={this.onDelete}
                    onClose={this.handleDeleteClick(record, index)}>
            <span style={{cursor: 'pointer'}} title="删除">
            <Icon type="uf-del"/>
            </span>
        </Popconfirm>
      </div>
    );
  }

  /**
   * 管理权限
   * @param rec
   */
  managerAuth = (rec) => {
    return (e) => {
      e.stopPropagation();
      verifyAuth('app_docker_registry', rec, () => {
        this.context.router.push(`/auth/${rec.pure_image_name}?id=${rec.id}&userId=${rec.created_user_id || ""}&providerId=${rec.provider_id}&backUrl=md-service&busiCode=app_docker_registry`);
      });

    }
  }

  /**
   * 删除按钮的点击函数
   * @param e
   */
  onDelete = (e) => {
    e.stopPropagation();
  }

  /**
   * 删除的回调函数
   * @param record
   * @param index
   * @returns {Function}
   */
  handleDeleteClick = (record, index) => {
    const self = this;

    let data = clone(this.state.data);
    return function (e) {

      //删除镜像
      deleteImageTag(`?image_name=${record.image_name}`, function (res) {
        if (res.data.error_code) {
          Message.create({content: res.data.error_message, color: 'danger', duration: 4.5});
        } else {

          data.splice(index, 1);
          self.setState({
            data: data
          });
          Message.create({content: '删除成功', color: 'success', duration: 1.5});
        }
      })
      // e.stopPropagation();
    }
  }

  /**
   * 表格的行点击事件
   * @param record 当前行数据对象
   * @param index 当前行索引
   */
  handleClick = (record, index) => {
    this.context.router.push(`/ownercata/versionlist?id=${record.id}`);
  }

  /**
   * 分页点击
   * @param index
   */
  handleSelect = (index) => {
    this.getPrivate(index - 1, this.state.searchValue);
  }



  /**
   * 搜索
   */
  handleSearch = (value) => {
    this.setState({
      showLoading: true,
      searchValue: value
    });
    this.getPrivate(0, value);
  }

  handleSearchEmpty = () => {
    this.setState({
      searchValue: ''
    });
    this.getPrivate();
  }

  render() {
    return (
      <Col md={12} className="private-registry">
        <div className="clearfix">
          <Search
            onSearch={this.handleSearch}
            onEmpty={ this.handleSearchEmpty }
          />
        </div>

        <Table
          bordered
          data={ this.state.data }
          columns={ this.columns }
          onRowClick={ this.handleClick }
          emptyText={function () {
            return (<NoData />)
          }}
        />
        <Pagination
          first
          last
          prev
          next
          boundaryLinks
          className="private-registry-pagination"
          items={this.state.page}
          maxButtons={5}
          activePage={this.state.activePage}
          onSelect={this.handleSelect}
        />
        <PageLoading show={ this.state.showLoading }/>
      </Col>
    )
  }
}

OwnerCata.contextTypes = {
  router: PropTypes.object
};

export default OwnerCata;
