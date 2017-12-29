import { Component } from 'react';
import {logDetail } from 'serves/appTile';
import {Modal,Row, Col, Button} from 'tinper-bee';
class LogDetail extends Component{

    state={
        logMsg:'',
        logfile:''
    }

    componentDidMount(){
        this.logDetail();
    }

    logDetail = () =>{
        let logfileId = this.props.logfileId;
        logDetail(logfileId).then((res)=>{
            let data = res.data;
            if(data.flag === "success"){
                this.setState({
                    logMsg: data.logfileMsg,
                    logfile:data
                })
            }
        })

    }

    handleBack = () =>{
        this.props.back();
    }

    render() {
        let {logMsg, logfile} = this.state;
        return (
            <Modal
                show={ true}
                className="simple-modal"
                onHide={ this.handleBack }>
                <Modal.Header closeBtn>
                    <Modal.Title className="modal-head">日志文件详情</Modal.Title>
                </Modal.Header>
                <Modal.Body className="logfile-detail">
                    <div >
                        <div className="title">
                            <div>
                                <span >{logfile.logfileName}</span>
                                <span >{logfile.createTime}</span>
                            </div>
                            <div>
                                <textarea
                                className="text-area"
                                value={logMsg}
                                />
                                <img className="img-style" alt={logfile.imageName} src={logfile.imageSrc} />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer  className="modal-footer">
                    <Button colors="primary"  onClick={ this.handleBack } shape="squared">返回</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default LogDetail;
