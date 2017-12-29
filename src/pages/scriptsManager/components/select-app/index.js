import {Component} from 'react';
import {InputGroup, FormControl, Pagination, Icon, Message, Col, Modal, Button} from 'tinper-bee';
import LoadingTable from 'components/loading-table';
import {getAppListSearch, getAppList} from 'serves/appTile';
import {findDOMNode} from 'react-dom';
import  './index.less';
class SelectAppModal extends Component{
  state={
    pages:0,
    showLoading:true,
    activePage:0,
    searchValue:'',
    appList:[],
    selectedApp:{}
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.showAppModal){
      this.getApplist(`?page=1&limit=10`);
    }
  }
  /**
   * 加载应用列表
   */
  getApplist = (param ='') => {
    let appList = [];
    getAppList(param).then((res)=> {
      let data = res.data;
      appList = data.data;
      if(res.status === 200){
        this.setState({
          appList:appList,
          showLoading:false,
          pages:Math.ceil(data.total/10)
        })
      }else{
        Message.create({content: res.statusText, color: 'danger', duration: null})
      }
     })
  }
  /**
   * 搜索应用
   */
  getApplistSearch = (param ='') =>{
    getAppListSearch(param).then((res)=>{
      let applist = res.data;
      if(res.status === 200){
        this.setState({
          appList:applist,
          showLoading:false,
          pages:Math.ceil(res.data.length/10),///////////////此处返回值中没有页数等信息
        })
      }else{
        Message.create({content: res.statusText, color: 'danger', duration: null})
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
    this.props.close();
  }

  /**
   * 确定选择
   */
  handleEnsure =() =>{
    let rec = this.state.selectedApp;
    this.handleCancel();
    this.props.onSelect(rec);
  }


  /**
   * 分页查询
   */
  handleSelectPage = (eventKey) =>{
    this.setState({
      activePage: eventKey
    });
    this.getApplist(`?page=${eventKey}&limit=10`);
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
  handleSearch = () =>{
    let searchValue  = this.state.searchValue;
    this.setState({
      showLoading: true
    });
    if(searchValue === ''){
      return  this.getApplist(`?page=1&limit=10`);
    }
    this.getApplistSearch(`?app_name=${searchValue}&page=0&limit=10`)
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
    this.setState({
      searchValue: '',
    })
    this.getApplist(`?page=1&limit=10`);
  }

  /**
   * 点击选中应用
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
      selectedApp:record
    })
  }

  render(){
    let {showAppModal} = this.props;
    let searchColumns = [
      {title: '应用名称', dataIndex: 'app_name', key: 'app_name',},
      {title: '创建人', dataIndex: 'user_name', key: 'user_name',},
      {title: '应用id', dataIndex: 'db_app_id', key: 'db_app_id',}
    ]
    return(
      <Modal
        show={ showAppModal }
        className="min-set"
        size="lg"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="title">
            {
              <span>新增脚本——关联应用</span>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="modal-search">
            <InputGroup  simple>
              <FormControl
                ref="search"
                placeholder="请输入应用名称"
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
                ref = "table"
                showLoading={ this.state.showLoading }
                data={this.state.appList}
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
            <Button onClick={ this.handleCancel }  className="footer-button" colors="default"  shape="squared">取消</Button>
            <Button onClick={ this.handleEnsure } className="footer-button" style={{marginLeft: 25, marginRight: 15}} colors="primary" shape="squared">确定</Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }

}
export default SelectAppModal;
