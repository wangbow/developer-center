import React, { Component, PropTypes } from 'react';
import { Row, Col, Tabs, TabPanel, Button, Breadcrumb, Checkbox, Tooltip, Select, Table, Message, PanelGroup, Panel, Popconfirm, Icon, FormControl, Modal } from 'tinper-bee';
import { Link } from 'react-router';
import classnames from 'classnames';
import './index.less';
import { sendMain } from 'serves/microServe';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { err, warn, success } from 'components/message-util';


class AuthDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false, //复选框未选中
            choseData: [] //选择的app应用列表的数据
        };
    }


    /**
     * 申请授权
     */
    apply = () => {
        let { saveDataArray } = this.props;
        let choseData = [];
        let allApp = document.getElementById("allApp");
        let choseCheck = allApp.querySelectorAll(".is-checked");
        if (choseCheck.length<=0) {
            return err("请勾选需要授权的应用");
        } else {
            for (let i = 0; i < choseCheck.length; i++) {
                let item = choseCheck[i].getElementsByClassName("u-checkbox-label")[0].innerText;
                for (let j = 0; j < saveDataArray.length; j++) {
                    if (saveDataArray[j].app_name == item) {
                        choseData.push(saveDataArray[j].app_code);
                        break;
                    }
                }
            }
        }
        console.log(choseData);
        this.getSearver(choseData);
    }
    /**
     * 调用申请授权的接口
     */

    getSearver = (choseData) => {
        let { data } = this.props;
        let params = {
            interfaceName: data.interfaceName,
            providerId: data.providerId,
            serviceName: data.serviceName,
            appCode: choseData
        };

        sendMain(params)
            .then(data => {
                this.onConfirm();
                if (data && data.data.error_code) {
                    return err("接口异常，请重试 " + data.data.error_message);
                } else if (data.data.detailMsg.status == "true") {
                    return success(data.data.detailMsg.msg);
                }

            })
            .catch((error) => {
                this.onConfirm();
                return err(error.message);
            })

    }
    /**
     * 选中所有checkbox
     */
    onCheckedAll = () => {
        this.setState(function (prevState, props) {
            return { checked: !prevState.checked }
        });
    }

    /**
     * 点击每个checkbox
     */
    changeCheck = (checked) => (e) => {
        this.setState({ checked: !this.state.checked });
    }

    /**
     * 关闭弹出框
    */
    onConfirm = () => {
        let { close } = this.props;
        close && close();
    }

    render() {
        let { showModal, saveDataArray, close } = this.props;
        let modalSize = 'lg';

        return (
            <div>
                <Modal show={showModal} size={modalSize} onHide={close} >
                    <Modal.Header closeButton>
                        <Modal.Title >
                            <h2 className="text-center"> 选择需要授权的应用: </h2>
                        </Modal.Title>
                    </Modal.Header >
                    <Modal.Body id="allApp" className="text-warper">
                        <Button onClick={this.onCheckedAll} colors="info" className="margin-right-10" size="sm">全选</Button>
                        <div className="clearfix">
                            <Row>
                                <Col md={6} sm={6}>
                                    <h3> 应用名称</h3>
                                    {
                                        saveDataArray.map((item) => {
                                            if (item.app_name && item.app_code) {
                                                return <div className="margin-vertical-5"><Checkbox checked={this.state.checked} onClick={this.changeCheck(this.state.checked)}> {item.app_name} </Checkbox></div>
                                            }
                                        })
                                    }

                                </Col>

                                <Col md={6} sm={6}>
                                    <h3> 应用编码</h3>
                                    {
                                        saveDataArray.map((item) => {
                                            if (item.app_name && item.app_code) {
                                                return <div className="margin-vertical-5">{item.app_code}</div>
                                            }
                                        })
                                    }
                                </Col>
                            </Row>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.apply} colors="info" className="margin-right-10"> 申请 </Button>
                        <Button onClick={this.onConfirm} colors="info" className="margin-right-10"> 关闭 </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default AuthDialog;
