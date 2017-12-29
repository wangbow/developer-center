import React, { Component, PropTypes } from 'react';
import { Row, Col, Label, Modal, Breadcrumb, Button, Select, Table, Message, Popconfirm, FormControl, InputGroup, Icon } from 'tinper-bee';
import classnames from 'classnames';
import './index.less';
import { updateConfig, getConfig } from 'serves/microServe';
import { getQueryString, splitParam } from 'components/util';
import { Base64 } from 'js-base64';
import { err, warn, success } from 'components/message-util';
import PageLoading from 'components/loading';

class CurrentLimit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            appCode: props.appCode,//应用名
            interface_name: props.interface_name,//接口名
            serviceName: props.service_name, //服务名
            showModal: props.showModal,//弹出框的显示/隐藏
            service_name: "",
            num: props.num,
            qps: "",
            threadCount: "",
            verQps: props.verQps,
            verThreadCount: props.verThreadCount,
            configData: {
                "appName": "",
                "strategy": [{}]
            },
            envType: props.envType,
            param: props.param
        };
    }
    /**
     *
     * 监听父组件的props变化，更新showModal状态
     */
    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.showModal,
            service_name: props.service_name,
            serviceName: props.service_name,
            num: props.num,
            verQps: props.verQps,
            verThreadCount: props.verThreadCount,
            param: props.param,
            interface_name: props.interface_name
        })
    }
    componentDidUpdate() {
        let { appCode, showModal, num, service_name, param } = this.state;
        if (appCode && showModal && num) {
            this.getConfigServer(appCode, service_name, param);
        }
    }

    /**
    * 获取后端接口返回的配置信息
    */

    getConfigServer(appCode, service_name, param) {
        let { changeNum, interface_name } = this.props;
        let { envType } = this.state;
        let params = {
            appCode: appCode,
            interface_name: interface_name,
            service_name: service_name,
            envType: envType
        }
        
        getConfig(params)
            .then(data => {
                if (data && JSON.parse(data.data.detailMsg.msg).error_code) {
                    if (changeNum) {
                        changeNum();
                    }
                    return err("接口异常，请重试 " + JSON.parse(data.data.detailMsg.msg).error_message);
                } else if (data.data.detailMsg.msg) {
                    let valueDecode;
                    let flag = false;
                    let configData, qps, threadCount;
                    let valueCode = JSON.parse(data.data.detailMsg.msg).data.value;
                    if (valueCode) {
                        valueDecode = Base64.decode(valueCode);
                        configData = JSON.parse(valueDecode);
                        if (valueDecode != "{}" && configData.strategy[0] && JSON.stringify(configData.strategy[0]) != "{}") {
                            configData.strategy.map(function (item, index) {
                                if (item.desc == (interface_name + "#" + service_name + param)) {
                                    qps = item.qps;
                                    threadCount = item.threadCount;
                                    flag = true;
                                }
                            })
                            if (flag == false) {
                                qps = "";
                                threadCount = "";
                            }

                            this.setState({
                                configData: configData,
                                qps: qps,
                                threadCount: threadCount,
                                num: false
                            })
                        }
                    } else {
                        let newConfigData = {
                            "appName": "",
                            "strategy": [{}]
                        };
                        newConfigData.appName = this.state.appCode;
                        this.setState({
                            configData: newConfigData,
                            qps: "",
                            threadCount: "",
                            num: false
                        })
                    }

                    if (changeNum) {
                        changeNum();
                    }
                }

            })
            .catch((error) => {
                if (changeNum) {
                    changeNum();
                }
                return err(error.message);
            })

    }
    /**
     * 点击按钮，调用后台接口，进行配置文件更新
     * 开启弹出框
     */
    handClick = () => {
        let { onConfirm, interface_name, service_name, changeNumVer } = this.props;
        let { configData, appCode, serviceName, qps, threadCount, param } = this.state;
        let posPattern = /^\d+$/;
        if (!posPattern.test(qps)) {
            if (changeNumVer) {
                changeNumVer(true, "qps");
            }
        }
        if (!posPattern.test(threadCount)) {
            if (changeNumVer) {
                changeNumVer(true, "threadCount");
            }
        }

        if (posPattern.test(qps) && posPattern.test(threadCount)) {
            if (configData.strategy && configData.strategy.length > 0 && JSON.stringify(configData.strategy[0]) != "{}") {
                let flag = false;
                configData.strategy.map(function (item, index) {
                    if (item.desc == (interface_name + "#" + service_name + param)) {
                        item.qps = qps;
                        item.threadCount = threadCount;
                        flag = true;
                    }
                })
                if (flag == false) {
                    let obj = {};
                    obj.qps = qps;
                    obj.threadCount = threadCount;
                    obj.desc = interface_name + "#" + service_name + param;
                    configData.strategy.push(obj);
                }
            } else {
                configData.strategy[0].qps = qps;
                configData.strategy[0].threadCount = threadCount;
                configData.strategy[0].desc = interface_name + "#" + service_name + param;
            }

            this.updateConfigServer(configData, appCode);

            if (onConfirm) {
                onConfirm();
                this.setState({
                    qps: "",
                    threadCount: ""
                })
            }
        }
    }
    /**
     * 更新配置文件的信息
     */

    updateConfigServer = (parm, appCode) => {
        let { envType } = this.state;
        this.setState({
            showLoading: true
        })
        updateConfig(parm, appCode, envType)
            .then(data => {
                this.setState({
                    showLoading: false
                })
                if (data && data.data.detailMsg.status == "false") {
                    return warn("文件更新失败，请重试");
                } else if (data && data.data.detailMsg.status == "true") {
                    return success("文件更新成功");
                }

            })
            .catch((error) => {
                return err(error.message);
            })
    }
    /**
     * 关闭弹出框
     */
    close = () => {
        let { close } = this.props;
        if (close) {
            close();
            this.setState({
                qps: "",
                threadCount: ""
            })
        }
    }
    /**
     * input输入框onchange
     */
    handleInputChange = (name) => (e) => {
        let { changeNumVer } = this.props;
        let { configData } = this.state;
        let inputValue = e.target.value;
        let posPattern = /^\d+$/;
        if (name == "qps") {
            this.setState({
                qps: inputValue
            })


        } else if (name == "threadCount") {
            this.setState({
                threadCount: inputValue
            })

        }
    }

    /**
     * handOnblur 输入框失去焦点
     */
    handOnblur = (name) => (e) => {
        let { changeNumVer } = this.props;
        let inputValue = e.target.value;
        let posPattern = /^\d+$/;
        if (name == "qps") {
            if (!posPattern.test(inputValue)) {
                changeNumVer(true, name);
            } else {
                changeNumVer(false, name);
            }


        }
        if (name == "threadCount") {
            if (!posPattern.test(inputValue)) {
                changeNumVer(true, name);
            } else {
                changeNumVer(false, name);
            }

        }
    }

    render() {
        let { interface_name, service_name } = this.props;
        let { configData, qps, threadCount, verQps, verThreadCount, showLoading } = this.state;

        return (
            <div className="currentLimitWrap">

                <Modal
                    show={this.state.showModal}
                    onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>限流</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="info">
                            <div className="name clearfix margin-vertical-10">
                                <Col md={4} sm={4} className="text-right">
                                    <Label labelFor="qps">QPS:</Label>
                                </Col>
                                <Col md={4} sm={4}>
                                    <FormControl id="qps" ref="qps" placeholder="请输入内容" value={qps} onChange={this.handleInputChange('qps')} onBlur={this.handOnblur('qps')} />
                                </Col>
                                <Col md={4} sm={4}>
                                    {
                                        verQps ? (<span> 只能输入数字 </span>) : ""
                                    }
                                </Col>
                            </div>

                            <div className="count clearfix margin-vertical-10">
                                <Col md={4} sm={4} className="text-right">
                                    <Label>线程数:</Label>
                                </Col>
                                <Col md={4} sm={4}>
                                    <FormControl ref="count" placeholder="请输入内容" value={threadCount} onChange={this.handleInputChange('threadCount')} onBlur={this.handOnblur('threadCount')} />
                                </Col>
                                <Col md={4} sm={4}>
                                    {
                                        verThreadCount ? (<span> 只能输入数字 </span>) : ""
                                    }
                                </Col>
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.close} shape="border" className="margin-right-50" >关闭</Button>
                        <Button onClick={this.handClick} colors="primary">提交</Button>
                    </Modal.Footer>
                </Modal>
                <PageLoading show={showLoading} />
            </div>
        )
    }
}

export default CurrentLimit;
