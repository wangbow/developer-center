import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Title from 'components/Title';
import { Row, Col, Button, Form, Label, FormControl, Select, FormGroup, Upload, Icon, Table, Message } from 'tinper-bee';
import { getRegisterServerList, listDetails } from 'serves/microServe';
import ShowModel from '../ShowModel';
import './index.less';


class ServerManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            activePage: '1',
            page: '1',
            showModalState: false,
            clickIndex: null,
            ret: {}
        }
        this.columns = [{
            title: '服务名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '服务简介',
            dataIndex: 'note',
            key: 'note'
        }, {
            title: '调用方式',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, rec, index) => {
                return (
                    <span className="cursor-pointer">
                        <a
                            className="btnStyle"
                            href={this.handleDownloadAll(this.props.params.name)}
                        >java
                       </a>
                    </span>
                )
            }
        }];
    }

    /**
     * 真实dom渲染完毕后，请求数据接口，用来展示table数据
     */
    componentDidMount() {
        if (this.props.params.name) {
            getRegisterServerList(this.props.params.name)
                .then(data => {

                    if (data && data.data.error_code) {
                        return Message.create({
                            content: "接口异常，请重试",
                            color: 'danger',
                            duration: null
                        })
                    } else if (data.data.detailMsg.data.objects && Array.isArray(data.data.detailMsg.data.objects)) {
                        this.setState({
                            data: data.data.detailMsg.data.objects
                        })
                    }

                })
                .catch((error) => {
                    console.log('操作失败');
                    console.log(error.message);
                    console.log(error.stack);
                    return Message.create({
                        content: error.message,
                        color: 'danger',
                        duration: null
                    })
                })
        } 

    }

    /**
    * 批量下载
    */
    handleDownloadAll = (appName) => {
        let host = `http://${window.location.host}/mircoservice-console/discovery/downLoadSDK/`;
        let href = `${host}` + appName;
        return href;

    }


    /**
     * 遍历数组，返回字符串
     */
    arrayTostring = (arry) => {
        if (arry && Array.isArray(arry)) {
            let str = "";
            arry.map(function (item) {
                str += item + " / ";
            })
            return str;
        }
    }
    /**
     *  渲染每行点击后，应该展示的数据
     */
    handleExpand = (res, index) => {
        let rec = this.state.ret[index];
        if (rec == undefined || (typeof rec != "object")) {
            return;
        }
        let reqType = this.arrayTostring(rec.requestType);
        let reqAddress = this.arrayTostring(rec.mappingUrl);
        let reqParmName = this.arrayTostring(rec.paramsName);
        let reqParmType = this.arrayTostring(rec.paramsType);
        let reqDes = this.arrayTostring(rec.paramsDesc);

        return (
            <div className="infoList">
                <Row>
                    <Col md={12}>
                        <span className="tag">请求类型: </span>
                        <span> {reqType} </span>
                    </Col>
                </Row>

                <Row className="margin-top-10">
                    <Col md={12}>
                        <span className="tag">请求地址:</span>
                        <span>{reqAddress}</span>
                    </Col>
                </Row>

                <Row className="margin-top-10">
                    <Col md={12}>
                        <span className="tag">获取方法的信息:</span>
                        <span>{rec['name']}</span>
                    </Col>
                </Row>
                <Row className="margin-top-10">
                    <Col md={12}>
                        <span className="tag">为页面提供所需要的数据:</span>
                        <span>{rec['note']}</span>
                    </Col>
                </Row>
                <Row className="margin-top-10">
                    <Col md={12}>
                        <ul className="clearfix paramList">
                            <li>
                                <div className="tag">参数</div>
                                {
                                    rec.paramsName ? rec.paramsName.map(function (item, index) {
                                        return <div>{item}</div>
                                    }) : ""
                                }
                            </li>
                            <li>
                                <div className="tag">值</div>
                                {
                                    rec.paramsType ? rec.paramsType.map(function (item, index) {
                                        return <div>{item}</div>
                                    }) : ""
                                }
                            </li>
                            <li>
                                <div className="tag">描述</div>
                                {
                                    rec.paramsDesc ? rec.paramsDesc.map(function (item, index) {
                                        return <div>{item}</div>
                                    }) : ""
                                }
                            </li>
                        </ul>
                    </Col>
                </Row>

                <Row className="margin-top-10">
                    <Col md={12}>
                        <span className="tag">响应类型:</span>
                        <span>{rec['returnType']}</span>
                    </Col>
                </Row>


            </div>
        );
    }

    /**
     * 每行点击的时候，进行接口请求
     */
    handleRownClick = (rec, index) => {
        let self = this;
        let params = self.props.params.name;
        if (this.state.clickIndex === rec['name']) {
            this.setState({ clickIndex: null })
        } else {
            this.setState({ clickIndex: rec['name'] })
        }

        listDetails(params)
            .then(data => {
                if (data && data.data.error_code) {
                    return Message.create({
                        content: "接口异常，请重试",
                        color: 'danger',
                        duration: null
                    })
                } else if (data.data[0].remoteMethods && Array.isArray(data.data[0].remoteMethods)) {
                    self.setState({
                        ret: data.data[0].remoteMethods

                    })
                }

            })
            .catch((error) => {
                console.log('操作失败');
                console.log(error.message);
                console.log(error.stack);
                return Message.create({
                    content: error.message,
                    color: 'danger',
                    duration: null
                })
            })

    }

    render() {

        return (
            <div>
                <Row>
                    <Title name="服务列表" />

                    <Col md={12}>
                        <Table data={this.state.data}
                            columns={this.columns}
                            rowKey={(rec, index) => { return rec.name }}
                            expandedRowRender={this.handleExpand}
                            expandedRowKeys={[this.state.clickIndex]}
                            onRowClick={this.handleRownClick}
                        />
                        {
                            this.state.page > 1 ? (
                                <Pagination
                                    first
                                    last
                                    prev
                                    next
                                    boundaryLinks
                                    items={this.state.page}
                                    maxButtons={5}
                                    activePage={this.state.activePage}
                                    onSelect={this.handleSelect} />
                            ) : ""
                        }
                    </Col>

                </Row>

                <ShowModel showModalState={this.state.showModalState} />
            </div>
        )
    }
}

export default ServerManager;