import {Component} from 'react';
import {Modal, Row, Col, Label, Table, Message} from 'tinper-bee';
import {viewTestLog} from 'serves/appTile';
import './index.less';
class LogTest extends Component {

  state = {
    testLog:'',
    logfileId:'',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showLogModal) {
      this.viewLog(nextProps.dataId);
    }
  }

  /**
   * 获取日志信息
   */
  viewLog = (dataId) => {
    viewTestLog(dataId).then((res) => {
      let data = res.data;
      if(data.flag === "fail") {
        return Message.create({
          content: data.msg,
          color: 'danger',
          duration: 1.5
        })
      }else {
        this.setState({
          testLog: data.testLog,
        })
      }
    })
  }

  handleCancel = () => {
    this.props.closeViewLogModal()
  }



  render(){
    let {testLog} = this.state;

    return(
      <Modal
        show={ this.props.showLogModal }
        className="simple-modal"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="modal-head">查看测试日志</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <div>
                <ul className="test-log">
                  <li >
                    <label className="label">
                      任务名称：
                    </label>
                    <span>
                      {
                        testLog.testjobName
                      }
                    </span>
                  </li>
                  <li>
                    <label className="label">
                      测试状态：
                    </label>
                    <span>
                      {
                        (typeof(testLog.executeState) == "string") ? (
                          (testLog.executeState === 'Y') ? (
                            <span>成功</span>
                          ):(
                            <span>失败</span>
                          )
                        ):(<span></span>)
                      }
                    </span>
                  </li>
                  <li >
                    <label className="label">
                      执行时间：
                    </label>
                    <span>
                      {
                        this.props.fmtDate(testLog.executeTime)
                      }
                    </span>
                  </li>
                  <li>
                    <label className="label">
                      完成时间：
                    </label>
                    <span>
                      {
                        this.props.fmtDate(testLog.finishTime)
                      }
                    </span>
                  </li>
                  <li>
                    <label className="label">
                      创建时间：
                    </label>
                    <span>
                      {
                        this.props.fmtDate(testLog.createTime)
                      }
                    </span>
                  </li>
                  <li>
                    <label className="label">
                      测试人：
                    </label>
                    <span>
                      {
                        testLog.userName
                      }
                    </span>
                  </li>
                  <li>
                    <label className="label">
                      日志信息：
                    </label>
                    <span>
                      {
                        testLog.testlogMsg
                      }
                    </span>
                  </li>
                </ul>
              </div>

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    )
  }

}
export default LogTest;
