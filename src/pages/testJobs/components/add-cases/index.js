import {Component} from 'react';
import {InputGroup, FormControl, Pagination, Icon, Message, Col, Modal, Button} from 'tinper-bee';
import LoadingTable from 'components/loading-table';
import {getCaseList} from 'serves/appTile';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import  './index.less';
class AddCaseModal extends Component{
  state={
    selectedCases:[],
    cases:[],
    checkAllCases:false,
    pages:0,
    showLoading:true,
    activePage:0,
    searchValue:''
  }

  componentWillReceiveProps(nextProps) {
    let state = 'Y';
    if (nextProps.showAddCaseModal) {
      this.getCaselist(`?search_productId=${nextProps.app_id}&search_testcaseState=${state}`);
    }
  }


  getCaselist = (param ='') => {
    let caseList = [];
    getCaseList(param).then((res)=> {
      let data = res.data;
      caseList = data.data.content;
      caseList.forEach((item) =>{
        item.checked = false;
      })
      if (data.flag === "success") {
        this.setState({
          cases: caseList,
          pages: data.data.totalPages,
          showLoading:false
        })
      } else {
        Message.create({content: data.msg, color: 'danger', duration: 1.5})
      }
    })
  }

  /**
   * 关闭模态框
   */
  handleCancel = () => {
    let str = "cases" ;
    this.setState({
      selectedCases:[],
      cases:[],
      checkAllCases:false,
      pages:0,
      showLoading:true,
      activePage:0,
      searchValue:''
    })
    this.props.close(str);
  }

  /**
   * 确定选择
   */
  handleEnsure =() =>{
    let arry = [];
    this.state.cases.forEach((item)=>{
      if(item.checked){arry.push(item)}
    })
    this.handleCancel();
    this.props.onSelect(arry);
  }

  /**
   * 分页查询
   */
  handleSelectPage = (eventKey) =>{
    let state = 'Y';
    this.setState({
      activePage: eventKey
    });
    this.getCaselist(`?search_productId=${this.props.app_id}&pageIndex=${eventKey}&search_testcaseState=${state}`)
  }

  /**
   * 搜索值
   */
  handleInputChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }


  /**
   * 搜索
   */
  handleSearch =() =>{
    let searchValue  = this.state.searchValue;
    let state = 'Y';
    this.setState({
      showLoading: true
    });
    if(searchValue === ''){
     return this.getCaselist(`?search_productId=${this.props.app_id}&search_testcaseState=${state}`);
    }
    this.getCaselist(`?search_productId=${this.props.app_id}&search_LIKE_testcaseName=${searchValue}&search_testcaseState=${state}`)
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
   * 清空输入框后搜索
   */
  emptySearch = () => {
    let state = 'Y';
    this.setState({
      searchValue: '',
    })
    this.getCaselist(`?search_productId=${this.props.app_id}&search_testcaseState=${state}`);
  }

  /**
   * 时间格式化
   * @param key
   */
  fmtDate = (obj) => {
    if( typeof(obj) == "undefined" ){
      return ''
    }
    let date =  new Date(obj);
    let y = 1900+date.getYear();
    let m = "0"+(date.getMonth()+1);
    let d = "0"+date.getDate();
    let h = "0"+ date.getHours();
    let mm = "0" + date.getMinutes();
    let s = "0" + date.getSeconds();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+" "+
      h.substring(h.length-2,h.length)+":"+mm.substring(mm.length-2,mm.length)+":"+s.substring(s.length-2,s.length);
  }


  /**
   * 全选用例
   */
  checkAll = () =>{
    if (!this.state.checkAllCases) {//影响每一行选择状态
      this.state.cases.forEach(function (item) {
        item.checked = true;
      })
    } else {
      this.state.cases.forEach(function (item) {
        item.checked = false;
      })
    }
    this.setState({checkAllCases: !this.state.checkAllCases});
  }

  /**
   * 选中当前行用例
   */
  selectCase =(e) =>{
    let index = e.target.index;
    let checkedAll = true;
    this.state.cases[index].checked = !this.state.cases[index].checked;
    this.setState({cases: this.state.cases});
    if (e.target.checked) {
      this.state.cases.forEach(function (item, i) {
        if (i !== index && !item.checked) {
          return checkedAll = false;
        }
      })
      if (checkedAll) {
        this.setState({checkAllCases: true});
      }
    } else {
      this.setState({ checkAllCases: false});
    }
  }

  render(){
    let {showAddCaseModal} = this.props;
    let searchColumns = [{
      title: (<Checkbox  checked={this.state.checkAllCases} onChange={this.checkAll}/>),
      dataIndex: 'checked',
      key: 'checked', render: (flag, record, index) => {
        return <Checkbox index={index} checked={flag} onChange={this.selectCase}/>
      }
    },
      {title: '用例名称', dataIndex: 'testcaseName', key: 'testcaseName',},
      {title: '应用名称', dataIndex: 'productName', key: 'productName',},
      {title: '创建人', dataIndex: 'userName', key: 'userName',},
      {title: '创建时间', dataIndex: 'createTime', key: 'createTime',render:(text,rec) =>{
        return (
          this.fmtDate(text)
        )
      }}
    ]

    return(
      <Modal
        show={ showAddCaseModal }
        className="min-set"
        size="lg"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="title">
            {
              <span>新增测试任务——关联用例</span>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="modal-search">
            <InputGroup  simple>
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
          <div className="loading-table">
            <Col md={12} sm={12}>
              <LoadingTable
                showLoading={ this.state.showLoading }
                data={this.state.cases}
                onRowClick={ this.handleRowClick }
                columns={searchColumns}
              />
              {
                this.state.pages > 1 ? (
                  <Pagination
                    className="info-pagination"
                    prev
                    next
                    items={this.state.pages}
                    maxButtons={5}
                    activePage={this.state.activePage}
                    onSelect={this.handleSelectPage}/>
                ) : ''
              }
            </Col>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <div className="modal-footer">
            <Button onClick={ this.handleCancel } className="footer-button" colors="default"  shape="squared">取消</Button>
            <Button onClick={ this.handleEnsure } className="footer-button" style={{marginLeft: 25,marginRight: 15}} colors="primary" shape="squared">确定</Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default AddCaseModal;
