import {Component} from 'react';
import Title from 'components/Title';
import {Col, Table, Pagination, Message, Icon, Popconfirm, Button, InputGroup, FormControl} from 'tinper-bee';
import { Link, hashHistory } from 'react-router';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import ErrorModal from 'components/ErrorModal';
import {deleteRestReports, restJobReports} from 'serves/testCenter';
import './index.less'

class ReportsHistory extends Component{
  state={
    pages: 0,
    activePage: 0,
    searchData: [],
    checkedAllJob:false,
    showLoading:true,
    showDelBatchModal:false
  }

  componentDidMount() {
    this.getRestReports()
  }

  getRestReports =(param2) =>{
    let data = this.props.location.state;
    let { restjobId } = data;
    let param = `?search_EQ_restjobId=${restjobId}&pageSize=10`;
    if(param2){
      param = param.concat('&').concat(param2);
    }
    restJobReports(param).then((res)=>{
      let data = res.data;
      if(data.flag === 'success'){
        let reportsList = data.data.content;
        reportsList.forEach((item) =>{
          item.checked = false;
        })
        this.setState({
          searchData: reportsList,
          pages: data.data.totalPages,
          showLoading:false
        })
      }else{
        Message.create({content: data.msg, color: 'danger', duration: 1.5})
      }
    })
  }


  /**
   * 分页换页
   *
   */
  handleSelectPage = (eventKey) => {
    this.setState({
      activePage: eventKey
    });
    this.getRestReports(`pageIndex=${eventKey-1}`)
  }



  /**
   * 全选/全反选
   */

  oncheckAll = () =>{
    if (!this.state.checkedAllJob) {
      this.state.searchData.forEach(function (item) {
        item.checked = true;
      })
    } else {
      this.state.searchData.forEach(function (item) {
        item.checked = false;
      })
    }
    this.setState({checkedAllJob: !this.state.checkedAllJob});
  }


  /**
   * 单选任务
   */
  onChioseJob = (e) => {
    let index = e.target.index;
    let checkedAll = true;
    this.state.searchData[index].checked = !this.state.searchData[index].checked;
    this.setState({searchData: this.state.searchData});
    if (e.target.checked) {
      this.state.searchData.forEach(function (item, i) {
        if (i !== index && !item.checked) {
          return checkedAll = false;
        }
      })
      if (checkedAll) {
        this.setState({checkedAllJob: true});
      }
    } else {
      this.setState({checkedAllJob: false});
    }
  }

  /**
   * 批量删除确认
   */
  handleDelebatch = () =>{
    this.setState({
      showDelBatchModal:true
    })
  }

  /**
   * 批量删除取消
   */
  closeModal = () =>{
    this.setState({
      showDelBatchModal:false
    })
  }


  /**
   * 时间格式化
   * @param key
   */
  fmtDate = (obj) => {
    if (!obj && typeof(obj)!="undefined" && obj!=0){
      return ''
    }
    if( typeof(obj) == "undefined" ){//undefined返回空
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
   * 查看一个报告详情
   * @param key
   */
  handleView = (obj) =>() =>{
    let propsData = this.props.location.state;
    let { restjobId } = propsData;

    let data ={
      restreportId: obj.restreportId,
      restjobId: restjobId,
    }
    let path={
      pathname:'/reports/report-detail',
      state:data
    }
    hashHistory.push(path)
  }

  /**
   * 执行批量删除
   */
  handleEnsure = () =>{
    this.closeModal();
    let data=[];
    let searchData = this.state.searchData;
    searchData.forEach((item)=> {
      let obj = {};
      if (item.checked) {
        obj = {
          "restreportId": item.restreportId,
        }
      }
      if(obj.restreportId){data.push(obj)}
    })
    if (!data) return  Message.create({content: "请选择要删除的数据！", color: 'warning', duration: 1.5}) ;

    deleteRestReports(data).then((res) => {
      let data = res.data;
      if (data.flag==="fail") {
        return Message.create({
          content: data.msg,
          color: 'danger',
          duration: 1.5
        })
      }
      Message.create({
        content: data.msg,
        color: 'success',
        duration: 1.5
      })
      this.getRestReports()
    })
  }

  /**
   * 删除报告
   * @param key
   */
  handleDelete =(obj) =>()=>{
    let data = {
      "restreportId": obj.restreportId,
    }
    let arry = [];
    arry.push(data);
    deleteRestReports(arry).then((res)=>{
      console.log(res)
    })
    this.getRestReports()
  }

  render(){
    let {searchData, checkedAllJob, pages, activePage} = this.state;
    let title = '接口报告';
    let columns =[
      {
        title: (<Checkbox  checked={checkedAllJob} onChange={this.oncheckAll}/>),
        dataIndex: 'checked',
        key: 'checked', render: (flag, record, index) => {
        return <Checkbox index={index} checked={flag} onChange={this.onChioseJob}/>
      }},
      {title: '任务名称', dataIndex:'restjobName', key:'restjobName'},
      {title: '执行时间', dataIndex:'createTime', key:'createTime',render: (text)=>{
        return(
          this.fmtDate(text)
        )
      }},
      {title: '用例总数', dataIndex:'scriptTotal', key:'scriptTotal'},
      {title: '用例失败数', dataIndex:'scriptFailed', key:'scriptFailed'},
      {title: '断言总数', dataIndex:'assertionTotal', key:'assertionTotal'},
      {title: '断言失败数', dataIndex:'assertionFailed', key:'assertionFailed'},
      {title: '总流量(byte)', dataIndex:'dataTotal', key:'dataTotal'},
      {title: '总耗时(ms)', dataIndex:'timeTotal', key:'timeTotal'},
      {title: '平均响应时间(ms)', dataIndex:'timeAverage', key:'timeAverage'},
      {title: '操作', dataIndex:'name', key:'name',render:(text, rec)=>{
        return(
          <div className="control-icon">
            <span onClick={this.handleView(rec)}>查看</span>
            <Popconfirm placement="bottom" onClose={ this.handleDelete(rec) } content="确认要删除吗？">
              <span>删除</span>
            </Popconfirm>
          </div>
        )
      }}
    ]

    return(
      <Col className="rest-reports-list">
        <Title name={ title } showBack={ false } className="create-test-job"/>
        <Col sm={12} className="control-bar">
            <Link to="/" style={{color: "#fff"}}>
              <Button
                shape="squared"
                colors="primary">
                返回
              </Button>
            </Link>
            <Button
                className="control-button"
                shape="squared"
                colors="default"
                onClick={ this.handleDelebatch}>
                批量删除
            </Button>
        </Col>

        <Col md={12} className="test-list">
          <Table data={ searchData } columns={ columns }/>
              {
                pages > 1 ? (
                  <Pagination
                    className="info-pagination"
                    first
                    last
                    prev
                    next
                    boundaryLinks
                    items={pages}
                    maxButtons={5}
                    activePage={activePage}
                    onSelect={this.handleSelectPage}/>
                ) : null
              }
        </Col>

                <ErrorModal
                  show ={this.state.showDelBatchModal}
                  onEnsure={this.handleEnsure}
                  onClose={this.closeModal}
                  message={"确定要删除这些历史报告吗？"}
                  title={"删除报告"}
                  />

      </Col>
    )
  }
}
export default ReportsHistory;
