import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Title from 'components/Title';
import { Row, Col, Button, Form, Label, FormControl, Select, FormGroup, Upload, Icon, Table, Message } from 'tinper-bee';
import { getRegisterInstance } from 'serves/microServe'
import {getCookie} from 'components/util';
import classnames from 'classnames';
import { err, warn, success } from 'components/message-util';
import './index.less';


class LookInstance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            activePage: '1',
            page: '1'

        }
        this.columns = [{
            title: '应用',
            dataIndex: 'appName',
            key: 'appName'
        }, {
            title: '实例',
            dataIndex: 'uniqueId',
            key: 'uniqueId'
        }, {
            title: '环境',
            dataIndex: 'profile',
            key: 'profile',
            render: function (text, rec) {
                let envObj = {};
                switch (text) {
                    case "online":
                        envObj = {
                            env: "生产环境",
                            env_color: "online"
                        }
                        break;
                    case "dev":
                        envObj = {
                            env: "开发环境",
                            env_color: "dev"
                        }

                        break;
                    case "stage":
                        envObj = {
                            env: "灰度环境",
                            env_color: "stage"
                        }

                        break;
                    case "test":
                        envObj = {
                            env: "测试环境",
                            env_color: "test"
                        }
                        break;
                    default:
                        envObj = {
                            env: "生产环境",
                            env_color: "online"
                        }
                }
                let env_color = envObj.env_color;
                return <span className={classnames({
                    online: env_color == "online",
                    dev: env_color == "dev",
                    stage: env_color == "stage",
                    test: env_color == "test"
                })}> {envObj.env} </span>

            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        }];
    }

    componentWillReceiveProps(props) {
        let appCode = props.appCode;
        if (appCode) {
            this.getServer(appCode);
        }
    }
    componentDidMount(props) {
        let appCode = this.props.appCode;
        if (appCode) {
            this.getServer(appCode);
        }
    }


    getServer(appCode) {
        let providerId = getCookie("u_providerid");
        let params = {
            name: appCode,
            providerId: providerId
        }
        if (appCode) {
            getRegisterInstance(params)
                .then(data => {
                    if (data && data.data.error_code) {
                        return err("接口异常，请重试 " + data.data.error_message);
                    } else if (data.data.detailMsg.data.objects && Array.isArray(data.data.detailMsg.data.objects)) {
                        this.setState({
                            data: data.data.detailMsg.data.objects
                        })
                    }
                })
                .catch((error) => {
                    return err(error.message);
                })
        }

    }

    render() {

        return (
            <div className="appManage-instance-wraper">
                <Col md={12} className="padding-horizontal-0 ">
                    <Table data={this.state.data} columns={this.columns} />
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
            </div>
        )
    }
}

export default LookInstance;
