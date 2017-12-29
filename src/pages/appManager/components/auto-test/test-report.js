import {Component} from 'react';
import {Modal, Row, Col, Label, Message} from 'tinper-bee';
import {viewTestReport} from 'serves/appTile';
import './index.less';

class ReportTest extends Component {

    state = {
        testReport:''
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.showReportModal){
          if(nextProps.excuting.indexOf(nextProps.dataId)== -1){
            this.viewData(nextProps.dataId);
          }else{
            this.setState({
              testReport:''
            })
          }
        }
    }

    viewData = (dataId) => {
            viewTestReport(dataId).then((res) => {
                let data = res.data;
                if(data.flag === "fail") {
                    return Message.create({
                        content: data.msg,
                        color: 'danger',
                        duration: null
                    })
                }else {
                    this.setState({
                        testReport: data.data
                    })
                }
            })
    }

    handleCancel = () => {
        this.props.closeViewReportModal()
    }


    render(){
        let data = this.state.testReport;
        return(
            <Modal
                show={ this.props.showReportModal }
                className="simple-modal"
                onHide={ this.handleCancel }>
                <Modal.Header closeBtn>
                    <Modal.Title className="modal-head">查看测试报告</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                        <ul className="test-report">
                        <li>
                                <label  className="label">
                                    应用名称：
                                </label>
                                <span>
                                    {
                                        data.productName
                                    }
                                </span>
                        </li>
                        <li>
                                <label  className="label">
                                    任务名称：
                                </label>
                                <span>
                                    {
                                        data.testjobName
                                    }
                                </span>
                    </li>
                    <li>
                                <label  className="label">
                                    用例成功率：
                                </label>
                                <span>
                                    {
                                        data.caseSuccessRate
                                    }
                                </span>
                    </li>
                        <li>
                                <label className="label">
                                    用例总数：
                                </label>
                                <span>
                                    {
                                        data.caseSummaryCount
                                    }
                                </span>
                        </li>
                        <li>
                                <label className="label">
                                   用例成功数：
                                </label>

                                <span>
                                    {
                                        data.caseSuccessCount
                                    }
                                </span>
                        </li>
                        <li>
                                <label className="label">
                                   用例失败数：
                                </label>

                                <span>
                                    {
                                        data.caseFailedCount
                                    }
                                </span>
                        </li>
                        <li>
                                <label className="label">
                                    脚本执行成功率：
                                </label>

                                <span>
                                    {
                                        data.lineSuccessRate
                                    }
                                </span>
                        </li>
                        <li>
                                <label className="label">
                                    脚本行执行总数：
                                </label>

                                <span>
                                    {
                                        data.lineSummaryCount
                                    }
                                </span>
                        </li>
                        <li>
                                <label className="label">
                                    脚本行执行成功数：
                                </label>

                                <span>
                                    {
                                        data.lineSuccessCount
                                    }
                                </span>
                        </li>
                        <li>
                                <label className="label">
                                    脚本行执行失败数：
                                </label>

                                <span>
                                    {
                                        data.lineFailedCount
                                    }
                                </span>
                        </li>
                        <li>
                                <label className="label">
                                   执行时间：
                                </label>

                                <span>
                                    {
                                        this.props.fmtDate(data.createTime)
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
export default  ReportTest;
