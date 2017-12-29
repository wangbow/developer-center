import { Component } from 'react';
import {viewTestCases} from 'serves/testCenter';
import {Modal, Table, Message} from 'tinper-bee';
import './index.less';
class DetailTest extends Component{
  state={
    bootCaseScriptList:[],
    testcase:{}
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.showDetailModal){
      this.viewDetail(nextProps.dataId);
    }
  }

  viewDetail = (id) =>{
    viewTestCases(id).then((res) =>{
      let data = res.data;
      this.setState({
        bootCaseScriptList:data.data.bootCaseScriptList,//脚本
        testcase:data.data.testcase//用例信息
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
    let{testcase, bootCaseScriptList} = this.state;
    let background = '#fff';
    if(testcase.testcaseState === 'Y'){
      background = '#4CAF50'
    }else{
      background = '#FB8C00'
    }
    let columns =[
      {title: '脚本名称', dataIndex: 'testscriptName', key: 'testscriptName'},
      {title: '执行顺序', dataIndex: 'executeOrder', key: 'executeOrder'},
    ]
    return(
      <Modal
        size="md"
        show={ this.props.showDetailModal }
        className="simple-modal"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="title">
            {
              <span>查看用例详情</span>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <ul className="test-detail">
            <li >
              <label className="label">
                用例名称：
              </label>
                <span>
                  {
                    testcase.testcaseName
                  }
                </span>
            </li>
            <li>
              <label className="label">
                用例状态：
              </label>
              <span>
                {
                  <div className="case-detail-state" style={{background:background}}> {this.stateExplan(testcase.testcaseState)}</div>
                }
              </span>
            </li>
            <li >
              <label className="label">
                用例类型：
              </label>
              <span>
                {
                  testcase.testcaseType
                }
              </span>
            </li>
            <li>
              <label className="label">
                应用名称：
              </label>
              <span>
                {
                  testcase.productName
                }
              </span>
            </li>
            <li>
              <label className="label">
                用例描述：
              </label>
              <span>
                {
                  testcase.testcaseNote
                }
              </span>
            </li>

            <li>
              <label className="label">
                创建人：
              </label>
              <span>
                {
                  testcase.userName
                }
              </span>
            </li>
            <li>
              <label className="label">
                创建时间：
              </label>
              <span>
                {
                  this.props.fmtDate(testcase.createTime)
                }
              </span>
            </li>
          </ul>

          <Table data={ bootCaseScriptList } columns={ columns } />
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    )
  }
}

export default DetailTest;
