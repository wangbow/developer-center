import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Title from 'components/Title';
import { Row, Col, Button, Form, Label, FormControl, Select, FormGroup, Upload, Icon, Table, Message } from 'tinper-bee';
import { GetConfigFileFromCenter, GetConfigVersionFromCenter, GetConfigEnvFromCenter, GetConfigAppFromCenter, addConfigFile } from 'serves/confCenter';
import { Base64 } from 'js-base64';
import qs from 'qs';

const Option = Select.Option;

class PowerManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            activePage: '1',
            page: '1'
        }
        this.columns = [{
            title: '调用者',
            dataIndex: 'appName',
            key: 'appName'
        }, {
            title: '授权时间',
            dataIndex: 'path',
            key: 'path'
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation'
        }];
    }
    componentDidMount() {
        GetConfigEnvFromCenter((res) => {
            if (res.data.success === 'true') {
                this.setState({
                    envList: res.data.page.result
                })
            } else {
                Message.create({
                    content: res.data.message,
                    color: 'danger',
                    duration: null
                })
            }
        })

    }
    render() {
        return (
            <Row>
                <Title name="权限列表" />
                <Col md={12}>
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
            </Row>
        )
    }
}

export default PowerManager;