import React, { Component, PropTypes } from 'react';
import { Row, Col, Label, Breadcrumb, Tooltip, Button, Select, Table, Message, Popconfirm, FormControl, InputGroup, Icon } from 'tinper-bee';
import classnames from 'classnames';
import DatePicker from 'bee-datepicker';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import { getOption } from '../../statis-util/data'
import ReactEcharts from 'echarts-for-react';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import Header from '../../statis-util/header';
import { getQuery } from '../../statis-util/util';
import TIME_INFO from '../../statis-util/timeInfo';
import { getInterfaceName, toolTipData } from '../../mscon-utils/util';

class Statis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uv: getOption('uv', this.getAxios(), this.getSerious()),
            pvNo: 'none',
            uvNo: 'none',
            appList: [],
            appId: '',
            timeId: getQuery().timeId || TIME_INFO[0].id
        };

    }

    handleAppChange = (id) => {
        this.setState({
            appId: id,
        })
    }

    handleTimeChange = (id) => {
        this.setState({
            timeId: id,
        })
    }
    getAxios = () => {
        let colors = ['#5793f3', '#d14a61', '#675bba'];
        let obj = [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return 'uv1  ' + params.value
                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        }
                    }
                },
                data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
            },
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return 'uv2访问量  ' + params.value
                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        }
                    }
                },
                data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
            }
        ];
        return obj;
    }
    getSerious = () => {
        let obj = [
            {
                name: '2016 uv访问量',
                type: 'line',
                xAxisIndex: 1,
                smooth: true,
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
                name: '2017 uv访问量',
                type: 'line',
                smooth: true,
                data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
            }
        ];
        return obj;
    }
    gotoServerPage = (e) => {
        let { changeState } = this.props;
        if (changeState) {
            changeState("1");
        }
    }
    /**
     * 生成x轴的data
     * @param interval  增加类型
     * @param number  增加个数
     * @param fmt 格式化参数
     * @param count 次数
     * @param date 开始时间，不传为new Date()
     * @returns {Array.<*>}   x轴对象数组
     */
    dataAry(interval, number, count, fmt, date) {
        let now = new Date();
        if (date) {
            now = new Date(date)
        }
        let ary = [];
        now = dateSubtract(interval, 0, now);
        ary.push(dataPart(now, fmt));
        for (let i = 1; i < count; i++) {
            now = dateSubtract(interval, number, now);
            ary.push(dataPart(now, fmt));
        }
        return ary.reverse();
    }
    xAis() {

    }
    noData(type, style) {
        let self = this;
        style = style || 'block';
        if (type) {
            self.setState({
                type: style
            })
        } else {
            self.setState({
                pvNo: style,
                uvNo: style,
            });
        };
    }

    clearCharts() {
        this.setState({
            uv: getOption('uv'),

        })
    }


    render() {
        let { interface_name, service_name } = this.props;
        let placeHode = "请输入毫秒值";
        let interfaceName = getInterfaceName(interface_name);

        return (
            <div className="currentLimitWrap">
                <Col md={12} sm={12}>

                    <Breadcrumb>

                        <span className="curpoint" onClick={this.gotoServerPage}>
                            <Icon type="uf-anglepointingtoleft" > 返回</Icon>
                        </span>

                        <Breadcrumb.Item className="margin-left-20">
                            {<OverlayTrigger overlay={toolTipData(interface_name)} placement="bottom">
                                <div className="font-style">{interfaceName}</div>
                            </OverlayTrigger>}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {service_name}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    

                </Col>
                <div className="linkWrap">
                    <Header
                        defaultAppId={getQuery().appId}
                        defaultTimeId={getQuery().timeId}
                        options={this.state.appList}
                        onChange={this.handleAppChange}
                        onChangeTime={this.handleTimeChange}
                    />
                    <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }} option={this.state.uv}>

                    </ReactEcharts>
                </div>
            </div>
        )
    }
}

export default Statis;
