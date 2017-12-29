import {Component} from 'react';
import {InputGroup, FormControl, Pagination, Icon, Message, Col, Modal, Button} from 'tinper-bee';
import LoadingTable from 'components/loading-table';
import {getScriptlist} from 'serves/testCenter';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import  './index.less';
class AddScriptModal extends Component{
  state={
    selectedScripts:[],
    scripts:[],
    checkAllScripts:false,
    pages:0,
    showLoading:true,
    activePage:0,
    searchValue:''
  }

  componentWillReceiveProps(nextProps){
    let type = 'selenium';
    if(nextProps.showAddCaseModal){
      this.getScripts(`?search_productId=${this.props.app_id}&search_testscriptType=${type}&search_testscriptState=Y&pageIndex=0&pageSize=5`);
    }
  }


  getScripts = (param ='') => {
    let scriptList = [];
    getScriptlist(param).then((res)=> {
      let data = res.data;
      scriptList = data.data.content;
      scriptList.forEach((item) =>{
        item.checked = false;
      })
      if (data.flag === "success") {
        this.setState({
          scripts: scriptList,
          pages: data.data.totalPages,
          showLoading:false
        })
      } else {
        Message.create({content: data.msg, color: 'danger', duration: null})
      }
    })
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
   * 关闭模态框
   */
  handleCancel = () => {
    let str = "scripts" ;
    this.setState({
      selectedScripts:[],
      scripts:[],
      checkAllScripts:false,
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
    this.state.scripts.forEach((item)=>{
      if(item.checked){arry.push(item)}
    })
    this.handleCancel();
    this.props.onSelect(arry);
  }

  /**
   * 分页查询
   */
  handleSelectPage = (eventKey) =>{
    let type = 'selenium';
    this.setState({
      activePage: eventKey
    });
    this.getScripts(`?search_productId=${this.props.app_id}&search_testscriptType=${type}&search_testscriptState=Y&&pageIndex=${eventKey}&pageSize=5`)
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
    let type = 'selenium';
    this.setState({
      showLoading: true
    });
    if(searchValue !== ''){
     return this.getScripts(`?search_productId=${this.props.app_id}&search_testscriptType=${type}&search_testscriptState=Y&pageIndex=0&pageSize=5&search_LIKE__userName=${searchValue}&search_LIKE__productName=${searchValue}&search_LIKE__testscriptName=${searchValue}`);
    }else{
      this.getScripts(`?search_productId=${this.props.app_id}&search_testscriptType=${type}&search_testscriptState=Y&pageIndex=0&pageSize=5`)
    }
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
  }
  /**
   * 全选用例
   */
  checkAll = () =>{
    if (!this.state.checkAllScripts) {//影响每一行选择状态
      this.state.scripts.forEach(function (item) {
        item.checked = true;
      })
    } else {
      this.state.scripts.forEach(function (item) {
        item.checked = false;
      })
    }
    this.setState({checkAllScripts: !this.state.checkAllScripts});
  }

  /**
   * 选中当前行用例
   */
  selectCase =(e) =>{
    let index = e.target.index;
    let checkedAll = true;
    this.state.scripts[index].checked = !this.state.scripts[index].checked;
    this.setState({scripts: this.state.scripts});
    if (e.target.checked) {
      this.state.scripts.forEach(function (item, i) {
        if (i !== index && !item.checked) {
          return checkedAll = false;
        }
      })
      if (checkedAll) {
        this.setState({checkAllScripts: true});
      }
    } else {
      this.setState({ checkAllScripts: false});
    }
  }

  render(){
    let {showAddCaseModal} = this.props;
    let searchColumns = [{
      title: (<Checkbox  checked={this.state.checkAllScripts} onChange={this.checkAll}/>),
      dataIndex: 'checked',
      key: 'checked', render: (flag, record, index) => {
        return <Checkbox index={index} checked={flag} onChange={this.selectCase}/>
      }
    },
      {title: '脚本名称', dataIndex: 'testscriptName', key: 'testscriptName',},
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
              <span>新增用例——关联脚本</span>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="modal-search">
            <InputGroup  simple>
              <FormControl
                ref="search"
                placeholder="请输入脚本名称或应用名称或创建人"
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
                data={this.state.scripts}
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
          <div className="modal-footer" style={{textAlign:'center'}}>
            <Button onClick={ this.handleCancel } className="footer-button" colors="default"  shape="squared">取消</Button>
            <Button onClick={ this.handleEnsure } className="footer-button" style={{marginLeft: 25,marginRight: 15}} colors="primary" shape="squared">确定</Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default AddScriptModal;
