import { Component } from 'react';
import {viewRestJob} from 'serves/testCenter';
import {Modal, Table, Message} from 'tinper-bee';
import './index.less';
class DetailTest extends Component{
  state={
    restJob:''
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.showDetailModal){
      this.viewDetail(nextProps.dataId);
    }
  }

  viewDetail = (id) =>{
    viewRestJob(id).then((res)=>{
      console.log(res)
      let data = res.data;
      this.setState({
        restJob:data.data.restJob
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
    let bootTestJob = this.state.restJob;
    let background = '#fff';
    if(bootTestJob.restjobState === 'Y'){
      background = '#4CAF50'
    }else if(bootTestJob.restjobState === 'start'){
      background = '#29B6F6'
    }else if(bootTestJob.restjobState === 'stop'){
      background = '#DD3730'
    }else {
      background = '#FB8C00'
    }
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
                                  bootTestJob.restjobName
                                }
                            </span>
            </li>
            <li>
              <label className="label">
                任务状态：
              </label>
              <span>
                 {
                   <div className="state" style={{background:background}}> {this.stateExplan(bootTestJob.restjobState)}</div>
                 }

              </span>
            </li>
            <li>
              <label className="label">
                产品名称：
              </label>
              <span>
                                    {
                                      bootTestJob.productName
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
                                      bootTestJob.restjobNote
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

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    )
  }
}

export default DetailTest;
