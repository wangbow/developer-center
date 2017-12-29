import { Component } from 'react';
import {
    InputGroup,
    FormControl,
    Pagination,
    Checkbox,
    Icon,
    Message,
    Col
} from 'tinper-bee';
import {getCaseList} from 'serves/appTile';
import LoadingTable from 'components/loading-table';
import './index.less';

class TestCase extends Component{
  state = {
    searchValue:'',
    searchPage: 0,
    activePage: 0,
    showLoading: true,
    searchResult: [],

  }

  componentDidMount(){
    let appId = this.props.appId;
    let state = 'Y';

    this.getCaselist(`?search_productId=${appId}&search_LIKE_testcaseState=${state}`);
  }

  componentWillReceiveProps(nextProps) {
    //手动一一点选全选后，全选自动选上

    if(nextProps.cases.length === this.state.searchResult.length && !nextProps.checkedAll){
      this.props.checkAll(this.state.searchResult);
    }
  }


  getCaselist = (param ='') => {
    getCaseList(param).then((res)=> {
        let data = res.data;
        if (data.flag === "success") {
          this.setState({
            searchResult: data.data.content,
            pages: data.totalPages,
            showLoading:false
          })
        } else {
          Message.create({content: data.msg, color: 'danger', duration: null})
        }
      })
  }

  /**
   * 搜索
   */
  handleSearch =() =>{
    let appId = this.props.appId;
    let searchValue  = this.state.searchValue;
    let state = 'Y';
    this.setState({
      showLoading: true
    });
    if(searchValue === ''){
      return this.getCaselist(`?search_productId=${appId}&search_LIKE_testcaseState=${state}`);
    }
    this.getCaselist(`?search_productId=${appId}&search_LIKE_testcaseName=${searchValue}&search_LIKE_testcaseState=${state}`)
  }

  handleInputChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  /**
   * 回车触发搜索
   * @param e
   */
  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  /**
   * 分页查询
   */
  handleSelectPage = (eventKey) =>{
    let state = 'Y';
    this.setState({
      activePage: eventKey
    });
    this.getCaselist(`?search_productId=${appId}&pageIndex=${eventKey}&search_LIKE_testcaseState=${state}`)
  }



  /**
   * 清空输入框后搜索
   */
  emptySearch = () => {
    let state = 'Y';
    this.setState({
      searchValue: '',
    })
    let appId = this.props.appId;
    this.getCaselist(`?search_productId=${appId}&search_LIKE_testcaseState=${state}`);
  }

  render () {
    let searchColumns = [
      {
        title: (
          <input
            type="checkbox"
            checked={this.props.checkedAll}
            onChange={this.props.checkAll(this.state.searchResult)}/>
        ),
        dataIndex: 'testcaseId',
        key: 'testcaseId',
        render: (text, record) => {
          let checked = this.props.cases.some(item => {
            return item.testcaseId === text;
          })
          return <input
            type="checkbox"
            checked={checked}
            onChange={this.props.onChioseCase(record)}/>
        }},
      {title: '用例名称', dataIndex: 'testcaseName', key: 'testcaseName',},
      {title: '应用名称', dataIndex: 'productName', key: 'productName',},
      {title: '创建人', dataIndex: 'userName', key: 'userName',},
      {title: '创建时间', dataIndex: 'createTime', key: 'createTime',render:(text,rec) =>{
        return (
          this.props.fmtDate(text)
        )
      }},
    ]
    return (
      <div className="test-case">
        <div className="modal-search">
          <div className="modal-search-user">
            <InputGroup className="search" simple>
              <FormControl
                ref="search"
                placeholder="请输入用例名称"
                onChange={ this.handleInputChange }
                onKeyDown={ this.handleSearchKeyDown }
                value={ this.state.searchValue }
              />
              {
                this.state.searchValue ? (
                    <Icon type="uf-close-c" onClick={ this.emptySearch } className="empty-search"/>
                ) : null
              }
              <InputGroup.Button>
                <i className="cl cl-search" onClick={ this.handleSearch }/>
              </InputGroup.Button>
            </InputGroup>
          </div>
        </div>
        <div className="add-case-button">
          <Col md={12} sm={12}>
            <a className="u-button u-button-sm u-button-primary u-button-border add-case" target="_blank" href="/fe/casesManager/index.html">
              <Icon type="uf-plus" />
              用例管理
            </a>
          </Col>
        </div>
        <div className="loading-table">
          <Col md={12} sm={12}>
            <LoadingTable
              showLoading={ this.state.showLoading }
              data={this.state.searchResult}
              onRowClick={ this.handleRowClick }
              columns={searchColumns}
            />
          </Col>
        </div>
        {
          this.state.searchPage > 1 ? (
            <Pagination
              prev
              next
              items={this.state.searchPage}
              maxButtons={5}
              activePage={this.state.activePage}
              onSelect={this.handleSelectPage}/>
          ) : ''
        }
      </div>
    )
  }
}

export default TestCase;
