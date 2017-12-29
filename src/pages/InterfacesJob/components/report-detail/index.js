import {Component} from 'react'
import Title from 'components/Title';
import {Table, Pagination, Col, Message, Button, Tooltip} from 'tinper-bee';
import { Link, hashHistory } from 'react-router';
import {resJobReportDetail} from 'serves/testCenter';
import './index.less'
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';

class ReportDetail extends Component{
  state={
    searchData:[],
    activePage:0,
    pages:0
  }

  componentDidMount(){
    this.getReportDetail()
  }

  /**
   * 鼠标悬浮提示
   * @param key
   */
  toolTipData = (data) => {
    return <Tooltip inverse id="toolTipId">
      <span className="tooltip-font-style">{data}</span>
    </Tooltip>
  }


  /**
   * 查看报告详情
   * @param key
   */
  getReportDetail = (param2) =>{
    let data = this.props.location.state;
    let {restreportId } = data;
    let param = `?restreportId=${restreportId}`;
    if(param2){
      param = param.concat('&').concat(param2);
    }
    resJobReportDetail(param).then((res)=>{
      let data = res.data;
      if(data.flag === "success"){
        this.setState({
          searchData:data.data.content,
          pages:data.data.totalPages,
        })
      }else{
        Message.create({content: data.msg, color: 'danger', duration: 1.5})
      }
    })
  }

  /**
   * 分页查询
   * @param key
   */
  handleSelectPage =(eventKey)=>{
    this.setState({
      activePage: eventKey
    });
    this.getReportDetail(`pageIndex=${eventKey-1}`)
  }


  backToReports = () =>{
    let propsData = this.props.location.state;
    let {restjobId } = propsData;
    let data ={
      restjobId: restjobId,
    }
    let path={
      pathname:'/reports',
      state:data
    }
    hashHistory.push(path)
  }

  render(){
    let {searchData, pages, activePage} = this.state;
    let title = "报告详情";
    let columns =[
      {title:'报告名称',dataIndex:'name',key:'name'},
      {title:'url',dataIndex:'url',key:'url',render:(text,rec)=>{
        return(
          <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
            <div className="font-style">{text}</div>
          </OverlayTrigger>
        )}},
      {title:'请求类型',dataIndex:'method',key:'method',},
      {title:'状态返回码',dataIndex:'code',key:'code',},
      {title:'断言总数',dataIndex:'assertionTotal',key:'assertionTotal',},
      {title:'断言失败数',dataIndex:'assertionFailed',key:'assertionFailed',},
      {title:'流量(byte)',dataIndex:'responseSize',key:'responseSize',},
      {title:'耗时(ms)',dataIndex:'responseTime',key:'responseTime',},
    ]

    return(
      <Col className="test-job-list">
        <Title name={title } showBack={ false }  path={'/reports:'} className="create-test-job"/>
        <Col sm={12} className="control-bar">
            <Button
              shape="squared"
              colors="primary"
              onClick={this.backToReports}>
              返回
            </Button>

        </Col>
        <Col md={12} className="report-detail-list">
          <Table data={ searchData } columns={ columns } />
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
      </Col>
    )
  }
}
export default ReportDetail;
