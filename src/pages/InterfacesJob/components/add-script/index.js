import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {InputGroup, FormControl, Pagination, Icon, Message, Col, Modal, Button} from 'tinper-bee';
import LoadingTable from 'components/loading-table';
import {getScriptlist} from 'serves/testCenter';
import  './index.less';
class AddScriptModal extends Component{
  state={
    pages:0,
    showLoading:true,
    activePage:0,
    searchValue:'',
    scriptList:[],
    selectedScript:{}
  }

  componentWillReceiveProps(nextProps) {
    let type = 'postman';
    if (nextProps.showScriptModal) {
      this.getScripts(`?search_productId=${nextProps.app_id}&search_testscriptType=${type}&search_testscriptState=Y&pageIndex=0&pageSize=10`);
    }
  }

  getScripts = (param ='') => {
    getScriptlist(param).then((res)=> {
      let data = res.data;
      if (data.flag === "success") {
        this.setState({
          scriptList: data.data.content,
          pages: data.data.totalPages,
          showLoading:false
        })
      } else {
        Message.create({content: data.msg, color: 'danger', duration: null})
      }
    })
  }

  /**
   * 关闭模态框
   */
  handleCancel = () => {
    this.setState({
      pages:0,
      showLoading:true,
      activePage:0,
      searchValue:''
    })
    this.props.close("script");
  }


  /**
   * 分页查询
   */
  handleSelectPage = (eventKey) =>{
    this.setState({
      activePage: eventKey
    });
    this.getScripts(`?search_productId=${this.props.app_id}&search_testscriptType=postman&pageIndex=${eventKey}`)
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
    let  type = 'postman';
    this.setState({
      showLoading: true
    });
    this.getScripts(`?&search_testscriptType=${type}&search_productId=${this.props.app_id}&search_LIKE__testscriptName=${searchValue}&search_LIKE__userName=${searchValue}&search_LIKE__productName=${searchValue}`)
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
    let type = 'postman';
    this.setState({
      searchValue: '',
    })
    this.getScripts(`?search_productId=${this.props.app_id}&search_testscriptType=${type}`);
  }
  /**
   * 点击选中脚本
   */
  handleRowClick =(record, index ) =>{
    let dom =  findDOMNode(this.refs.table);
    let elems = dom.getElementsByTagName("tr");
    for(let i=0; i<elems.length; i++){
      elems[i].style.backgroundColor = "#FFFFFF";
    }
    let tr = dom.getElementsByTagName("tr")[index + 1];
    tr.style.backgroundColor = "#e9f7fc";
    this.setState({
      selectedScript:record
    })
  }


  /**
   * 状态解释
   * @param key
   */
  stateExplan = (state) => {
    if(state === 'Y')return "激活";
    if(state === 'start') return "执行中";
    if(state === 'stop')return "已停止";
    if(state === 'N') return "停用";
  }

  /**
   * 确定选择
   */
  handleEnsure =() =>{
    let rec = this.state.selectedScript;
    this.handleCancel();
    this.props.onSelect(rec);
  }

  render(){
    let {showScriptModal} = this.props;
    let searchColumns = [
      {title: '脚本名称', dataIndex: 'testscriptName', key: 'testscriptName'},
      {title: '脚本状态', dataIndex: 'testscriptState', key: 'testscriptState',render:(text,rec) =>{
        let background = '#fff';
        if(text === 'Y'){
          background = '#4CAF50'
        }else{
          background = '#FB8C00'
        }
    return(
      <div className="state" style={{background:background}}> {this.stateExplan(text)}</div>
    )}},
      {title: '脚本描述', dataIndex: 'testscriptNote', key: 'testscriptNote'},
      {title: '应用名称', dataIndex: 'productName', key: 'productName',},
      {title: '上传人', dataIndex: 'userName', key: 'userName'},
    ]

    return(
      <Modal
        show={ showScriptModal }
        className="min-set"
        size="lg"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="title">
            {
              <span>选择脚本</span>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="modal-search">
            <InputGroup  simple>
              <FormControl
                ref="search"
                placeholder="请输入脚本名称/应用名称/上传人"
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
                className="scripts-table"
                ref = "table"
                showLoading={ this.state.showLoading }
                data={this.state.scriptList}
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
            <Button onClick={ this.handleEnsure } className="footer-button" style={{marginLeft: 25}} colors="primary" shape="squared">确定</Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default AddScriptModal;
