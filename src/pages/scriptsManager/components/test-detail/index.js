import { Component } from 'react';
import {getScriptlist} from 'serves/testCenter';
import {Modal, Table, Message} from 'tinper-bee';
import './index.less';
class DetailTest extends Component{
  state={
    testscript:''
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.showDetailModal){
      this.setState({
        testscript:nextProps.data
      })
    }
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
    let{testscript} = this.state;
    let background = '#fff';
    if(testscript.testscriptState === 'Y'){
      background = '#4CAF50'
    }else{
      background = '#FB8C00'
    }
    let type = '';
    if(testscript.testscriptType === 'postman') {
      type = "接口测试"
    }else{
      type = "webUI测试"
    }
    return(
      <Modal
        size="md"
        show={ this.props.showDetailModal }
        className="simple-modal"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="modal-head">查看脚本详情</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <ul className="test-detail">
            <li >
              <label className="label">
                脚本名称：
              </label>
                <span>
                  {
                    testscript.testscriptName
                  }
                </span>
            </li>
            <li>
              <label className="label">
                脚本状态：
              </label>
              <span>
                {
                  <div className="script-detail-state" style={{background:background}}> {this.stateExplan(testscript.testscriptState)}</div>
                }
              </span>
            </li>
            <li >
              <label className="label">
                脚本类型：
              </label>
              <span>
                {
                  type
                }
              </span>
            </li>
            <li>
              <label className="label">
                应用名称：
              </label>
              <span>
                {
                  testscript.productName
                }
              </span>
            </li>

            <li>
              <label className="label">
                上传人：
              </label>
              <span>
                {
                  testscript.userName
                }
              </span>
            </li>
            <li>
              <label className="label">
                上传时间：
              </label>
              <span>
                {
                  this.props.fmtDate(testscript.createTime)
                }
              </span>
            </li>
            <li>
              <label className="label">
                描述信息：
              </label>
              <span>
                {
                  testscript.testscriptNote
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
