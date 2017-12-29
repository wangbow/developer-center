import {Component} from 'react';
import {Modal, Row, Col, Label, Table, Message} from 'tinper-bee';
import {viewTestLog} from 'serves/appTile';
import LogDetail from './logfile-detail';
import './index.less';

class LogTest extends Component {

    state = {
        testLog:'',
        step: 1,
        logfileId:'',
        logFile:[]
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.showLogModal) {
        if (nextProps.excuting.indexOf(nextProps.dataId)== -1) {
          this.viewLog(nextProps.dataId);
        } else {
          this.setState({
            testLog:'',
            logFile:[]
          })
        }
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
                    logFile:data.logFileList
                })
            }
        })
    }

    handleCancel = () => {
        this.props.closeViewLogModal()
    }

    /**
     * 查看日志文件
     */
    handleView = id => () =>{
        this.setState({
            step: 2,
            logfileId:id
        })
    }
    /**
     * 返回日志列表
     */
    backtoLogList = () =>{
        this.setState({
            step:1
        })
    }


    render(){
        let {testLog, logFile} = this.state;
        let columns =[
            {title: '错误日志名称', dataIndex: 'logfileName', key: 'logfileName'},
            {
                title: '操作', dataIndex: 'name', key: 'name', width: '30%', render: (text, rec) => {
                return (
                    <div className="control-icon">
                        <span onClick={this.handleView(rec.logfileId)}>查看</span>
                    </div>
                )
            }}
        ]
        return(
            <Modal
                show={ this.props.showLogModal }
                className="simple-modal"
                onHide={ this.handleCancel }>
                <Modal.Header closeBtn>
                    <Modal.Title style={{marginTop:40,marginBottom:-30}}>查看测试日志</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.state.step === 1?(
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
                            <Table data={ logFile } columns={ columns } />
                        </div>

                        ):(
                            <LogDetail
                                logfileId={this.state.logfileId}
                                back={this.backtoLogList}
                                />
                        )
                    }
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        )
    }

}
export default LogTest;
