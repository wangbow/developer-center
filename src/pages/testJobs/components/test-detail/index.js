import { Component } from 'react';
import {viewTestJob} from 'serves/appTile';
import {Modal, Table, Message} from 'tinper-bee';
import './index.less';
class DetailTest extends Component{
  state={
    testDetail:'',
    bootTestJob:''
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.showDetailModal){
      this.viewDetail(nextProps.dataId);
    }
  }

  viewDetail = (id) =>{
    viewTestJob(id).then((res) =>{
      let data = res.data;
      this.setState({
        testDetail:data.data,
        bootTestJob:data.data.bootTestJob
      })
    })
  }

  handleCancel = () => {
    this.props.closeViewDetailModal()
  }

  stateExplan = (state) =>{
    if(state === 'Y')return "激活";
    if(state === 'start') return "执行中";
    if(state === 'stop')return "已停止";
    if(state === 'N') return "停用";
  }

  render() {
    let data = this.state.testDetail;
    let bootTestJob = this.state.bootTestJob;
    let background = '#fff';
    if(bootTestJob.testjobState === 'Y'){
      background = '#4CAF50'
    }else if(bootTestJob.testjobState === 'start'){
      background = '#29B6F6'
    }else if(bootTestJob.testjobState === 'stop'){
      background = '#DD3730'
    }else {
      background = '#FB8C00'
    }

    let columns =[
      {title: '用例名称', dataIndex: 'testcaseName', key: 'testcaseName'},
      {title: '执行顺序', dataIndex: 'executeOrder', key: 'executeOrder'}
    ]
    return(
      <Modal
        show={ this.props.showDetailModal }
        className="simple-modal"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="modal-head">查看任务详情</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <ul className="test-detail">
            <li >
              <label className="label">
                任务名称：
              </label>
              <span>
                                {
                                  bootTestJob.testjobName
                                }
                            </span>
            </li>
            <li>
              <label className="label">
                任务状态：
              </label>
              <span>
                 {
                   <div className="testjob-detail-state" style={{background:background}}> {this.stateExplan(bootTestJob.testjobState)}</div>
                 }

              </span>
            </li>
            <li >
              <label className="label">
                设备IP：
              </label>
              <span>
                                    {
                                      bootTestJob.deviceIp
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                应用名称：
              </label>
              <span>
                                    {
                                      bootTestJob.productName
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                浏览器类型：
              </label>
              <span>
                                    {
                                      bootTestJob.browserType
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                动作间隔：
              </label>
              <span>
                                    {
                                      bootTestJob.sleepTime
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                执行时间：
              </label>
              <span>
                                    {
                                      this.props.fmtDate(bootTestJob.executeTime)
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                邮件接收人：
              </label>
              <span>
                                    {
                                      bootTestJob.email
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                任务描述：
              </label>
              <span>
                                    {
                                      bootTestJob.testjobNote
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                测试人：
              </label>
              <span>
                                    {
                                      bootTestJob.userName
                                    }
                                </span>
            </li>
            <li>
              <label className="label">
                创建时间：
              </label>
              <span>
                                    {
                                      this.props.fmtDate(bootTestJob.createTime)
                                    }
                                </span>
            </li>
          </ul>

          <Table data={ data.bootJobCaseList } columns={ columns } />
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    )
  }
}

export default DetailTest;
