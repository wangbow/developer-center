import React, { Component, PropTypes } from 'react';
import { Row, Col, Label, Breadcrumb, Tooltip, Button, Select, Table, Message, Popconfirm, FormControl, InputGroup, Icon, Pagination } from 'tinper-bee';
import classnames from 'classnames';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import DatePicker from 'bee-datepicker';
import "bee-datepicker/build/DatePicker.css";
import './index.less';
import { trace } from 'serves/microServe';
import { getQueryString, splitParam, formateDate } from 'components/util';
import { err, warn, success } from 'components/message-util';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { getDefaultStartTime, getDefaultEndTime } from '../../link-util/util';
import PageLoading from 'components/loading';
import { getInterfaceName, toolTipData } from '../../mscon-utils/util';
import moment from 'moment';

class LinkPath extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,//loading进度条的显示与否
            dataSource: [],
            activePage: 1,
            page: 1,
            startTime: getDefaultStartTime().ms,
            endTime: getDefaultEndTime().ms,
            timeCon: "",
            inputStartData: "",
            inputEndData: "",
            placeHode: "请输入毫秒值"
        };
    }

    componentDidMount() {
        this.getServer();
    }
    /**
     * 显示链路下钻的界面
     */
    gotoPageList = (name, traceId) => (e) => {
        let { changeParentState, interface_name, service_name } = this.props;
        if (changeParentState) {
            changeParentState("121", interface_name, service_name, "", traceId);
        }
    }

    // table列要展示的字段
    renderTableColumns = () => {
        const columns = [{
            title: '调用发起方',
            dataIndex: "client",
            key: 'client',
        }, {
            title: '链路长度',
            dataIndex: 'stackDeepth',
            key: 'stackDeepth',
        },
        {
            title: 'traceId',
            dataIndex: 'traceId',
            key: 'traceId',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: function (text, rec) {
                let stautsInfo;
                if (text == "-1") {
                    stautsInfo = "失败";
                } else {
                    stautsInfo = "成功";
                }
                return (<span>
                    {stautsInfo}
                </span>)
            }
        },
        {
            title: '耗时(ms)',
            dataIndex: 'duration',
            key: 'duration',
            render: function (text, rec) {
                let durationInfo;
                if (text != null && text != "null") {
                    durationInfo = Math.ceil(parseInt(text)/1000);
                } else {
                    durationInfo = "-   -";
                }
                return (
                    <span>{durationInfo} </span>
                )
            }
        },
        {
            title: '调用时间',
            dataIndex: 'timestamp_millis',
            key: 'timestamp_millis',
            render: function (text, rec) {
                let timestamp;
                if (text != null && text != "null") {
                    timestamp = formateDate(text);
                } else {
                    timestamp = "-   -";
                }
                return (
                    <span>{timestamp} </span>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, rec, index) => {
                return (
                    <span className="cursor-pointer">
                        <Button
                            className="btnStyle"
                            onClick={this.gotoPageList("linkRoad", rec.traceId)}
                        >查看</Button>
                    </span>
                )
            }
        }];

        return columns;

    }

    /**
     * 开始时间选择
     */
    onSelectStart = (d) => {
        if (d) {
            this.setState({
                startTime: d._d.getTime()
            })
        }

    }
    /**
     * 开始时间改变
     */
    onChangeStart = (d) => {
        if (d) {
            this.setState({
                startTime: d._d.getTime()
            })
        }
    }

    /**
    * 结束时间选择
    */
    onSelectEnd = (d) => {
        if (d) {
            this.setState({
                endTime: d._d.getTime()
            })
        }
    }
    /**
     * 结束时间改变
     */
    onChangeEnd = (d) => {
        if (d) {
            this.setState({
                endTime: d._d.getTime()
            })
        }
    }

    /**
     * handClickSearch 搜索事件
     */
    handClickSearch = () => {
        this.setState({
            activePage: 1,
            showLoading: true
        }, () => {
            this.getServer();
        });
    }
    /**
     * 耗时时长输入
     */
    handleInputStartChange = (e) => {
        let inputStartValue = e.target.value;
        this.setState({
            inputStartData: inputStartValue.replace(/[^\d]/g, '')
        })

    }
    /**
     * 结束时长输入
     */
    handleInputEndChange = (e) => {
        let inputEndValue = e.target.value;
        this.setState({
            inputEndData: inputEndValue.replace(/[^\d]/g, '')
        })
    }

    /**
     * 默认获取当前时间当天的的数据
     */
    getServer = () => {
        console.log(this.state.activePage);
        let { startTime, endTime, inputStartData, inputEndData, activePage } = this.state;
        let { appCode, envType, interface_name, service_name } = this.props;
        let params = {
            size: 10,
            index: activePage,
            startTime: startTime,
            endTime: endTime,
            inputStartData: inputStartData,
            inputEndData: inputEndData,
            appCode: appCode,
            interface_name: interface_name,
            serverName: service_name,
            envType: envType
        }
        trace(params)
            .then(data => {
                this.setState({
                    showLoading: false
                })
                if (data && data.data.error_code) {
                    return err("接口异常，请重试,链路查询 " + data.data.error_message);
                } else if (data.data.detailMsg.data.content) {
                    this.setState({
                        dataSource: data.data.detailMsg.data.content || [],
                        page: data.data.detailMsg.data.totalPages || 1
                    })
                }

            })
            .catch((error) => {
                this.setState({
                    showLoading: false
                })
                return err("接口异常，请重试,链路查询 " + error.message);
            })

    }

    /**
    * 选中第几页
    */
    handleSelect = (key) => {
        console.log(key);
        this.setState({
            activePage: key,
            showLoading: true
        }, () => {
            console.log(this.state.activePage);
            this.getServer();
        });
    }

    /**
     * 返回到主页
     */

    gotoServerPage = (e) => {
        let { changeState } = this.props;
        if (changeState) {
            changeState("1");
        }
    }

    render() {
        console.log(this.state.activePage);
        let { dataSource, placeHode, startTime, endTime, page, activePage,inputStartData,inputEndData } = this.state;
        startTime = formateDate(new Date(startTime));
        endTime = formateDate(new Date(endTime));
        let { interface_name, service_name } = this.props;
        let interfaceName = getInterfaceName(interface_name);
        return (
            <div className="linkWrap">
                <Col md={12} sm={12} className="padding-0">
                    <Breadcrumb>
                        <span className="curpoint" onClick={this.gotoServerPage}>
                            <Icon type="uf-anglepointingtoleft" > 返回</Icon>
                        </span>
                        <Breadcrumb.Item className="margin-left-20">
                            {<OverlayTrigger overlay={toolTipData(interface_name)} placement="bottom">
                                <div className="font-style">{interfaceName}</div>
                            </OverlayTrigger>
                            }
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {service_name}
                        </Breadcrumb.Item>
                    </Breadcrumb>

                </Col>

                <div className="linkHead clearfix">
                    <Col md={6} sm={6}>
                        <Col md={4} sm={4} className="text-right"> 开始时间</Col>
                        <Col md={8} sm={8}>
                            <DatePicker
                                format={"YYYY/MM/DD HH:mm:ss"}
                                onSelect={this.onSelectStart}
                                onChange={this.onChangeStart}
                                locale={zhCN}
                                value={moment(startTime)}
                            />
                        </Col>
                        <Col md={4} sm={4} className="text-right margin-top-10"> 耗时</Col>
                        <Col md={8} sm={8} className="margin-top-10">
                            <Col md={5} sm={5} className="timeCon-start padding-0">
                                <FormControl placeholder={'只能输入数字'} onChange={this.handleInputStartChange} value={inputStartData}/>
                            </Col>
                            <Col md={1} sm={1} className="padding-0">
                                <span> ~~~ </span>
                            </Col>
                            <Col md={5} sm={5} className="timeCon-end padding-0">
                                <FormControl placeholder={'只能输入数字'} onChange={this.handleInputEndChange} value={inputEndData}/>
                            </Col>
                            <Col md={1} sm={1} className="padding-left-5">
                                <span>ms</span>
                            </Col>
                        </Col>
                    </Col>
                    <Col md={6} sm={6}>
                        <Col md={4} sm={4} className="text-right"> 截止时间</Col>
                        <Col md={8} sm={8}>
                            <DatePicker
                                format={"YYYY/MM/DD HH:mm:ss"}
                                onSelect={this.onSelectEnd}
                                onChange={this.onChangeEnd}
                                locale={zhCN}
                                value={moment(endTime)}
                            />
                        </Col>
                        <Col md={5} sm={5}>
                            <div className="btn-wrape text-right">
                                <Button className="margin-top-10 search-btn" onClick={this.handClickSearch}>搜索</Button>
                            </div>
                        </Col>
                    </Col>
                </div>
                <Col md={12} sm={12} className="margin-top-20 linkBody">
                    <Table
                        data={dataSource}
                        columns={this.renderTableColumns()}
                        rowKey={(rec, index) => { return (rec.traceId + index) }}
                    />
                    <div className="pull-right">
                        {
                            this.state.page > 1 ? (
                                <Pagination
                                    first
                                    last
                                    prev
                                    next
                                    boundaryLinks
                                    items={page}
                                    maxButtons={5}
                                    activePage={activePage}
                                    onSelect={this.handleSelect} />
                            ) : ""
                        }
                    </div>
                    <PageLoading show={this.state.showLoading} />
                </Col>

            </div>
        )
    }
}

export default LinkPath;