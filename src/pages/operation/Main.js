import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tile, Button, Message, ButtonGroup, Select, Panel, Row } from 'tinper-bee';
import { dateSubtract, dataPart, splitParam, lintAppListData, getCountDays } from '../../components/util';
import axios from 'axios';
import { getOption } from './data'
import ReactEcharts from 'echarts-for-react';
import { GetPublishList } from '../../serves/appTile'
import style from './index.css';
import taskEmptyImg from '../../assets/img/taskEmpty.png';
import noDataImg from '../../assets/img/no-data.png';
import classnames from 'classnames';
import PageLoading from '../../components/loading/index';


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timerOther: false,
            empty: 'none',
            timer: '其它时间段',
            open: false,
            pv: getOption('pv'),
            uv: getOption('uv'),
            browserType: getOption('browserType'),
            statusCode: getOption('statusCode'),
            operatingSystem: getOption('operatingSystem'),
            responseTime: getOption('responseTime'),
            region: getOption('region'),
            flow: getOption('flow'),
            more: 'none',
            appList: [],
            time: '15min',
            appId: '',
            appName: '',
            pvNo: 'none',
            uvNo: 'none',
            btNo: 'none',
            scNo: 'none',
            osNo: 'none',
            rtNo: 'none',
            regionNo: 'none',
            flowNo: 'none',
            loading: false
        };
        this.timeClick = this.timeClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.more = this.more.bind(this);
        this.appClick = this.appClick.bind(this);
        this.selectClick = this.selectClick.bind(this);
        this.empty = this.empty.bind(this);
        this.loadShow = this.loadShow.bind(this);
        this.loadHide = this.loadHide.bind(this);
    }


    loadShow() {
        this.setState({
            loading: true
        });
    }

    loadHide() {
        let self = this;
        window.setTimeout(() => {
            self.setState({
                loading: false
            })
        }, 300);
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

    /**
     * * 生成x轴数据
     * @param time 时间段标示
     * @param nowTime 当前时间
     时间段    点数    间隔
     15分钟    5    3min
     30分钟    6    5min
     1小时     6    10min
     12小时    6    2h
     24小时    6    4h
     7天       7    1d
     30天      6    5d
     60天      6    10d
     90天      6    15d
     6月       6    1mon
     1年       6     2mon
     2年       6    4mon
     5年       5    1y
     * @returns { startTime:开始时间,data:数组,interval:时间间隔,size:总点数 }
     */
    xAis(time, nowTime) {
        let now = new Date(nowTime);
        let hours = now.getHours();
        let week = now.getDay();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        if (time.indexOf('now') != -1) {
            switch (time) {
                case 'now-nd':
                    return {
                        startTime: dataPart(now, 'yyyy/MM/dd 00:00:00'),
                        data: this.dataAry('h', 1, hours, 'hh:mm', dataPart(now, 'yyyy/MM/dd hh:00:00')),
                        interval: '1h',
                        size: hours,
                        fmt: 'hh'
                    };
                    break;
                case 'now-nw':
                    return {
                        startTime: this.dataAry('d', week - 1, 2, 'yyyy/MM/dd 00:00:00')[0],
                        data: this.dataAry('d', 1, week, 'MM/dd', dataPart(now, 'yyyy/MM/dd 00:00:00')),
                        interval: '1d',
                        size: week,
                        fmt: 'MM/dd'
                    };
                    break;
                case 'now-nmon':
                    return {
                        startTime: dataPart(now, 'yyyy/MM/01 00:00:00'),
                        data: this.dataAry('d', 1, day, 'MM/dd', dataPart(now, 'yyyy/MM/dd 00:00:00')),
                        interval: '1d',
                        size: day,
                        fmt: 'dd'
                    };
                    break;
                case 'now-ny':
                    return {
                        startTime: dataPart(now, 'yyyy/01/01 00:00:00'),
                        data: this.dataAry('d', 30, month, 'yyyy/MM', dataPart(now, 'yyyy/MM/dd 00:00:00')),
                        interval: '30d',
                        size: month,
                        fmt: 'MM'
                    };
                    break;
                case 'now-yd':
                    return {
                        startTime: dataPart(dateSubtract('d', 1, now), 'yyyy/MM/dd 00:00:00'),
                        data: this.dataAry('h', 4, 6, 'MM/dd hh', dataPart(now, 'yyyy/MM/dd 00:00:00')),
                        interval: '4h',
                        size: 6,
                        fmt: 'MM/dd hh',
                        endTime: dataPart(dateSubtract('d', 0, now), 'yyyy/MM/dd 00:00:00')
                    };
                    break;
                case 'now-ld':
                    return {
                        startTime: dataPart(dateSubtract('d', 2, now), 'yyyy/MM/dd 00:00:00'),
                        data: this.dataAry('h', 4, 6, 'MM/dd hh', dataPart(dateSubtract('d', 1, nowTime), 'yyyy/MM/dd 00:00:00')),
                        interval: '4h',
                        size: 6,
                        fmt: 'MM/dd hh',
                        endTime: dataPart(dateSubtract('d', 1, now), 'yyyy/MM/dd 00:00:00')
                    };
                    break;
                case 'now-lw':
                    return {
                        startTime: dataPart(dateSubtract('d', 7, now), 'yyyy/MM/dd 00:00:00'),
                        data: this.dataAry('h', 4, 6, 'yyyy/MM/dd hh', dataPart(dateSubtract('d', 6, nowTime), 'yyyy/MM/dd 00:00:00')),
                        interval: '4h',
                        size: 6,
                        fmt: 'MM/dd hh',
                        endTime: dataPart(dateSubtract('d', 6, now), 'yyyy/MM/dd 00:00:00')
                    };
                    break;
                case 'now-yw':
                    return {
                        startTime: dataPart(dateSubtract('d', 8, now), 'yyyy/MM/dd 00:00:00'),
                        data: this.dataAry('d', 1, 7, 'yyyy/MM/dd', dateSubtract('d', week, nowTime)),
                        interval: '1d',
                        size: 7,
                        fmt: 'yyyy/MM/dd',
                        endTime: dataPart(dateSubtract('d', 5, now), 'yyyy/MM/dd 23:59:59')
                    };
                    break;
                case 'now-ymon':
                    let number = getCountDays(dateSubtract('mon', 1, now));
                    return {
                        startTime: dataPart(dateSubtract('mon', 1, now), 'yyyy/MM/01 00:00:00'),
                        data: this.dataAry('d', 5, Math.ceil(number / 5), 'MM/dd', dataPart(dateSubtract('mon', 1, now), 'yyyy/MM/' + number + ' 00:00:00')),
                        interval: '5d',
                        size: Math.ceil(number / 5),
                        fmt: 'MM/dd',
                        endTime: dataPart(dateSubtract('mon', 1, now), 'yyyy/MM/' + number + ' 23:59:59'),
                    };
                    break;
                case 'now-yy':
                    return {
                        startTime: dataPart(dateSubtract('y', 1, now), 'yyyy/01/01 00:00:00'),
                        data: this.dataAry('d', 60, 6, 'yyyy/MM', dataPart(dateSubtract('y', 1, nowTime), 'yyyy/12/MM 00:00:00')),
                        interval: '60d',
                        size: 6,
                        fmt: 'yyyy/MM',
                        endTime: dataPart(dateSubtract('y', 1, now), 'yyyy/12/31 23:59:59'),
                    };
                    break;
            }
        } else {
            switch (time) {
                case '15min':
                    return {
                        startTime: this.dataAry('min', 3, 5, 'yyyy/MM/dd hh:mm:00', now)[0],
                        data: this.dataAry('min', 3, 5, 'hh:mm', now),
                        interval: '3m',
                        size: 5,
                        fmt: 'hh:mm'
                    };
                    break;
                case '30min':
                    return {
                        startTime: this.dataAry('min', 5, 6, 'yyyy/MM/dd hh:mm:00', now)[0],
                        data: this.dataAry('min', 5, 6, 'hh:mm', now),
                        interval: '5m',
                        size: 6,
                        fmt: 'hh:mm'
                    };
                    break;
                case '1h':
                    return {
                        startTime: this.dataAry('min', 10, 7, 'yyyy/MM/dd hh:mm:00', now)[0],
                        data: this.dataAry('min', 10, 7, 'hh:mm', now),
                        interval: '10m',
                        size: 7,
                        fmt: 'hh:mm'
                    };
                    break;
                case '4h':
                    return {
                        startTime: this.dataAry('min', 40, 6, 'yyyy/MM/dd hh:mm:00', now)[0],
                        data: this.dataAry('min', 40, 6, 'hh:mm', now),
                        interval: '40m',
                        size: 6,
                        fmt: 'hh:mm'
                    };
                    break;
                case '12h':
                    return {
                        startTime: this.dataAry('h', 2, 6, 'yyyy/MM/dd hh:00:00', now)[0],
                        data: this.dataAry('h', 2, 6, 'MM/dd hh', now),
                        interval: '2h',
                        size: 6,
                        fmt: 'MM/dd hh'
                    };
                    break;
                case '1d':
                    return {
                        startTime: this.dataAry('h', 4, 6, 'yyyy/MM/dd hh:00:00', now)[0],
                        data: this.dataAry('h', 4, 6, 'MM/dd hh', now),
                        interval: '4h',
                        size: 6,
                        fmt: 'MM/dd hh'
                    };
                    break;
                case '1w':
                    return {
                        startTime: this.dataAry('d', 1, 7, 'yyyy/MM/dd 00:00:00', now)[0],
                        data: this.dataAry('d', 1, 7, 'dd', now),
                        interval: '1d',
                        size: 7,
                        fmt: 'dd'
                    };
                    break;
                case '30d':
                    return {
                        startTime: this.dataAry('d', 5, 7, 'yyyy/MM/dd 00:00:00', now)[0],
                        data: this.dataAry('d', 5, 7, 'MM/dd', now),
                        interval: '5d',
                        size: 7,
                        fmt: 'MM/dd'
                    };
                    break;
                case '60d':
                    return {
                        startTime: this.dataAry('d', 10, 7, 'yyyy/MM/dd 00:00:00', now)[0],
                        data: this.dataAry('d', 10, 7, 'MM/dd', now),
                        interval: '10d',
                        size: 7,
                        fmt: 'MM/dd'
                    };
                    break;
                case '90d':
                    return {
                        startTime: this.dataAry('d', 15, 7, 'yyyy/MM/dd 00:00:00', now)[0],
                        data: this.dataAry('d', 15, 7, 'MM/dd', now),
                        interval: '15d',
                        size: 7,
                        fmt: 'MM/dd'
                    };
                    break;
                case '6mon':
                    return {
                        startTime: this.dataAry('mon', 1, 6, 'yyyy/MM/01 00:00:00', now)[0],
                        data: this.dataAry('mon', 1, 6, 'yyyy/MM', now),
                        interval: '1M',
                        size: 6,
                        fmt: 'yyyy/MM'
                    };
                    break;
                case '1y':
                    return {
                        startTime: this.dataAry('mon', 1, 12, 'yyyy/MM/01 00:00:00', now)[0],
                        data: this.dataAry('mon', 1, 12, 'yyyy/MM', now),
                        interval: '1M',
                        size: 12,
                        fmt: 'yyyy/MM'
                    };
                    break;
                case '2y':
                    return {
                        startTime: this.dataAry('mon', 1, 24, 'yyyy/MM/01 00:00:00', now)[0],
                        data: this.dataAry('mon', 1, 24, 'yyyy/MM', now),
                        interval: '1M',
                        size: 24,
                        fmt: 'yyyy/MM'
                    };
                    break;
                case '5y':
                    return {
                        startTime: this.dataAry('y', 1, 5, 'yyyy/01/01 00:00:00', now)[0],
                        data: this.dataAry('y', 1, 5, 'yyyy', now),
                        interval: '1y',
                        size: 5,
                        fmt: 'yyyy'
                    };
                    break;
            }
        }
    }

    getNowTime(appID, timer) {
        let self = this;
        axios.post('/ycm-yyy/web/v1/serinfo/getservertime')
            .then(function (res) {
                if (res.data.servertime) {
                    self.setMap(appID, timer, res.data.servertime);
                } else {
                    return Message.create({ content: '请求出错', color: 'danger', duration: null });
                }
            })
            .catch(function (err) {
                console.log(err);
                return Message.create({ content: '请求出错', color: 'danger', duration: null });
            });



    }

    /**
     * 数值处理
     * 最大值
     * 大于1000B，变成KB
     * 大于10000B，变成MB
     * 大于100000B，变成GB
     * 大于1000000B，变成TB
     * */
    fmt(res) {
        let obj = {};
        obj.res = [];
        obj.unit = '';
        if (res && res.length) {
            let max = Math.max.apply('', res);
            if (max > 1000) {
                obj.res = res.map((item) => Number(item) / 1024);
                obj.unit = 'KB'
            } else if (max > 10000) {
                obj.res = res.map((item) => Number(item) / 1024 / 1024);
                obj.unit = 'MB'
            } else if (max > 100000) {
                obj.res = res.map((item) => Number(item) / 1024 / 1024 / 1024);
                obj.unit = 'GB'
            } else if (max > 1000000) {
                obj.res = res.map((item) => Number(item) / 1024 / 1024 / 1024 / 1024);
                obj.unit = 'TB'
            } else {
                obj.res = res;
                obj.unit = 'B'
            }
            obj.res = obj.res.map(item => Math.round(Number(item)));
            return obj;
        }

    }

    fmtDate(res, fmt) {
        let obj = {};
        let ary = [];
        if (res && res.length) {
            ary = res.map(item => dataPart(item, fmt))
        }
        obj.ary = ary;
        return obj;
    }

    /**
     * 格式化 返回数据
     * @param res
     * @param applicationName  应用id
     * @param size  size
     */
    formatRes(res, applicationName, size) {
        if (res.data.error_code) {
            return false;
        } else {
            let lineSeriesData = [];
            let pieX = [];
            let pieSeriesDate = [];
            let obj = {
                x: pieX,
                y: lineSeriesData,
                xy: pieSeriesDate
            };
            if (res.data && res.data.detailMsg && res.data.detailMsg.data && res.data.detailMsg.data[applicationName] && res.data.detailMsg.data[applicationName].detail && res.data.detailMsg.data[applicationName].detail.length) {
                let data = res.data.detailMsg.data[applicationName].detail;
                for (let i = 0; i < data.length; i++) {
                    let temp = data[i];
                    lineSeriesData.push(temp.value);
                    pieX.push(temp.name);
                    let pieObj = {
                        value: temp.value,
                        name: temp.name
                    };
                    pieSeriesDate.push(pieObj);
                }
                obj.x = pieX.splice(0, size);
                obj.y = lineSeriesData.splice(0, size);
                obj.xy = pieSeriesDate.splice(0, size);
            }
            return obj;
        }

    }

    getAppList() {
        let self = this;
        GetPublishList().then(function (res) {
            let appList = lintAppListData(res);
            if (appList && appList.length) {
                let appId = appList[0].app_id;
                let appName = appList[0].name;
                ReactDOM.findDOMNode(self.refs.operation).className = "u-row operation-m";
                self.setState({
                    appId: appId,
                    appList: appList,
                    appName: appName,
                    operation: 'block'
                });
                self.getNowTime(appId, null);
            } else {
                self.noData();
                self.empty();
                self.clearCharts();
            }
        })
            .catch(function (err) {
                self.noData();
                self.empty();
                console.log(err);
                return Message.create({ content: '请求出错', color: 'danger', duration: null });
            });
    }

    handleChange(appId) {
        this.setState({
            appId: appId
        });
        this.getNowTime(appId);
    }

    more() {
        this.setState({
            more: 'inline-block'
        })
    }

    empty() {
        this.setState({
            empty: 'block'
        });
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
                btNo: style,
                scNo: style,
                osNo: style,
                rtNo: style,
                regionNo: style,
                flowNo: style
            });
        };
    }

    clearCharts() {
        this.setState({
            pv: getOption('pv'),
            uv: getOption('uv'),
            browserType: getOption('browserType'),
            statusCode: getOption('statusCode'),
            operatingSystem: getOption('operatingSystem'),
            responseTime: getOption('responseTime'),
            region: getOption('region'),
            flow: getOption('flow'),
        })
    }

    setMap(appID, timer, nowTime) {
        let self = this;
        let time = timer || self.state.time;
        let appId = appID || self.state.appId;
        self.setState({
            time: time,
            appId: appId
        });
        let xAisObj = self.xAis(time, nowTime);
        let fmt = xAisObj.fmt;
        //let xData = xAisObj.data;//横坐标
        let et = xAisObj.endTime || nowTime;//结束时间
        et = new Date(et).getTime();
        let st = new Date(xAisObj.startTime).getTime();//开始时间
        let interval = xAisObj.interval;//间隔  分m，小时h，天d，周w，月M，年y
        let size = xAisObj.size;//点数
        //let providerId = getCookie('u_providerid');
        let providerId = '#providerId#';
        let query = 'appId:' + appId + ' AND providerId:' + providerId;
        //query = 'lId:nginx';//测试使用
        let param = {
            pv: {
                queryParams: '{"index": "iuap","type": "nginx_notype","st": "' + st + '","et": "' + et + '",providerid:"' + providerId + '","tgs": [{"metric": [{"type": "count"}],"query": "' + query + '","group": [{"field": "ts","type": "date_histogram","interval": "' + interval + '","size": ' + size + '}],"nm": "' + appId + '","datatype": "es"}]}'
            },
            uv: {
                queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"field":"remote_addr","type":"cardinality"}],"query":"' + query + '","group":[{ "field":"ts","type":"date_histogram", "interval":"' + interval + '","size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
            },
            bv: {//浏览器类型
                queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"browser.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
            },
            status: {//状态码
                queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"status.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
            },
            systemVersion: {//操作系统类型
                queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"system.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
            },
            province: {//地区
                queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"city.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
            },
            rt: {//响应时间
                queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"field":"request_time","type":"avg"}],"query":"' + query + '","group":[{ "field":"ts","type":"date_histogram", "interval":"' + interval + '","size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
            },
            qps: {//流量
                queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"field":"bytes_sent","type":"sum"}],"query":"' + query + '","group":[{ "field":"ts","type":"date_histogram", "interval":"' + interval + '","size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
            }
        };
        //self.loadShow();
        axios.all([
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.pv)),
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.uv)),
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.bv)),
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.status)),
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.systemVersion)),
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.province)),
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.rt)),
            axios.post('/ycm-yyy/web/v1/graphquery/query', splitParam(param.qps))
        ])
            .then(axios.spread(function (resPv, resUv, resBv, resStatus, resSystemVersion, resProvince, resRt, resQps) {
                //self.loadHide();
                let pvXd = self.formatRes(resPv, appId, size).x;
                let pvYd = self.formatRes(resPv, appId, size).y;
                let uvYd = self.formatRes(resUv, appId, size).y;
                let uvXd = self.formatRes(resUv, appId, size).x;
                let browserTypeX = self.formatRes(resBv, appId, size).x;
                let browserTypeXY = self.formatRes(resBv, appId, size).xy;
                let statusCodeX = self.formatRes(resStatus, appId, size).x;
                let statusCodeXY = self.formatRes(resStatus, appId, size).xy;
                let operatingSystemX = self.formatRes(resSystemVersion, appId, size).x;
                let operatingSystemXY = self.formatRes(resSystemVersion, appId, size).xy;
                let rtXd = self.formatRes(resRt, appId, size).x;
                let responseTimeY = self.formatRes(resRt, appId, size).y;
                let flowXd = self.formatRes(resQps, appId, size).x;
                let flowYd = self.formatRes(resQps, appId, size).y;
                let regionX = self.formatRes(resProvince, appId, size).x;
                let regionXY = self.formatRes(resProvince, appId, size).xy;
                if (pvXd && pvYd && uvXd && uvYd && browserTypeX && browserTypeXY && statusCodeX && statusCodeXY && operatingSystemX && operatingSystemXY && rtXd && responseTimeY && flowXd && flowYd && regionX && regionXY) {
                    //pv
                    let pvX = self.fmtDate(pvXd, fmt).ary;
                    pvX && pvX.length && self.setState({ pvNo: 'none' });
                    let pvY = pvYd;
                    let pvUnit = self.fmt(pvYd).unit;

                    //uv
                    let uvX = self.fmtDate(uvXd, fmt).ary;
                    uvX && uvX.length && self.setState({ uvNo: 'none' });
                    let uvY = uvYd;
                    let uvUnit = self.fmt(uvYd).unit;

                    //浏览器类型
                    browserTypeX && browserTypeX.length && self.setState({ btNo: 'none' });

                    //状态码
                    statusCodeX && statusCodeX.length && self.setState({ scNo: 'none' });

                    //操作系统
                    operatingSystemX && operatingSystemX.length && self.setState({ osNo: 'none' });
                    if (operatingSystemXY && operatingSystemXY.length) {
                        for (let i = 0; i < operatingSystemXY.length; i++) {
                            let temp = operatingSystemXY[i];
                            if (temp.name.indexOf('windows') || temp.name.indexOf('WINDOWS')) {
                                operatingSystemXY[i].name = temp.name.replace('windows', 'win');
                                operatingSystemXY[i].name = temp.name.replace('WINDOWS', 'win');
                            }
                        }
                    }

                    //响应时间
                    let responseTimeX = self.fmtDate(rtXd, fmt).ary;
                    responseTimeX && responseTimeX.length && self.setState({ rtNo: 'none' });
                    if (responseTimeY && responseTimeY.length) {
                        responseTimeY = responseTimeY.splice(0, size);
                        responseTimeY = responseTimeY.map((item) => Math.round(Number(item)));
                    } else {
                        self.noData('rtNo');
                    }
                    //流量
                    let flowX = self.fmtDate(flowXd, fmt).ary;
                    flowX && flowX.length && self.setState({ flowNo: 'none' });
                    let flowY = self.fmt(flowYd).res;
                    let flowYUnit = self.fmt(flowYd).unit;
                    //地图
                    regionX && regionX.length && self.noData({ regionNo: 'none' });
                    self.setState({
                        pv: getOption('pv', pvX, pvY, pvUnit),
                        uv: getOption('uv', uvX, uvY, uvUnit),
                        browserType: getOption('browserType', browserTypeX, browserTypeXY),
                        statusCode: getOption('statusCode', statusCodeX.x, statusCodeXY),
                        operatingSystem: getOption('operatingSystem', operatingSystemX, operatingSystemXY),
                        responseTime: getOption('responseTime', responseTimeX, responseTimeY),
                        flow: getOption('flow', flowX, flowY, flowYUnit),
                        region: getOption('region', regionX, regionXY)
                    });
                } else {
                    self.noData();
                    self.clearCharts();
                    return Message.create({ content: '查询服务出现异常', color: 'danger' });
                }


            }))
            .catch(function (err) {
                //self.loadHide();
                self.noData();
                self.clearCharts();
                console.log(err);
                return Message.create({ content: '请求出错', color: 'danger' });
            });
    }

    componentDidMount() {
        this.getAppList();
    }

    timeClick(e) {
        let self = this;
        let target = e.target;
        let time = target.getAttribute('data-time');
        if (target.getAttribute('data-other')) {
            self.setState({
                timerOther: true,
                timer: target.innerHTML,
                open: false
            })
        } else {
            self.setState({
                timerOther: false,
                timer: '其它时间段',
                open: false
            });
        }
        /*let array = document.getElementsByClassName('u-button');
        for (let i = 0; i < array.length; i++) {
            array[i].className = 'u-button u-button-border';
        }
        target.className = 'u-button u-button-border active';
        if(target.getAttribute('data-other')){
            ReactDOM.findDOMNode(self.refs.timeOther).className='u-button u-button-border active';
        }*/
        self.setState({
            time: time
        });
        self.getNowTime(null, time);
    }

    selectClick() {
        this.setState({
            open: false
        })
    }

    appClick() {
        ReactDOM.findDOMNode(this.refs.app).click();
        this.setState({
            open: false
        })
    }

    render() {

        return (
            <div>
                <PageLoading show={this.state.loading} />
                <div className="nothing" style={{ 'display': this.state.empty }}>
                    <img src={taskEmptyImg} width="160" height="160" />
                    <span>去上传个应用吧</span>
                </div>
                <Row className="operation-m opacity" ref="operation" style={{ 'display': this.state.operation }}>


                    <div className="top clearfix">
                        <div className="app">
                            <h3>应用选择</h3>
                            <Select ref="app" onClick={this.selectClick} size="lg" value={this.state.appId} style={{ width: 200, marginRight: -1, height: '30px' }}
                                onChange={this.handleChange}>
                                {
                                    this.state.appList.map(function (item) {
                                        return <Option key={item.id} value={item.app_id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                            <Button shape='squared' bordered onClick={this.appClick}>
                                <i className="uf uf-triangle-down" style={{ 'color': '#0084FF' }}> </i>
                            </Button>
                        </div>
                        <div className="time">
                            <h3>时间选择</h3>
                            <ButtonGroup >
                                <Button shape='squared' className={classnames({ 'u-button': true, 'active': this.state.time == '15min' })} bordered data-time="15min" onClick={this.timeClick}>15分钟</Button>
                                <Button shape='squared' className={classnames({ 'u-button': true, 'active': this.state.time == '1h' })} bordered data-time="1h" onClick={this.timeClick}>1小时</Button>
                                <Button shape='squared' className={classnames({ 'u-button': true, 'active': this.state.time == '12h' })} bordered data-time="12h" onClick={this.timeClick}>12小时</Button>
                                <Button shape='squared' className={classnames({ 'u-button': true, 'active': this.state.time == '1d' })} bordered data-time="1d" onClick={this.timeClick}>24小时</Button>
                                <Button shape='squared' className={classnames({ 'u-button': true, 'active': this.state.time == '1w' })} bordered data-time="1w" onClick={this.timeClick}>1周</Button>
                            </ButtonGroup>
                            <div className="time-other">
                                <Button ref="timeOther" className={classnames({ 'u-button': true, 'active': this.state.timerOther })} shape='squared' bordered onClick={() => this.setState({ open: !this.state.open })}>
                                    {this.state.timer}
                                </Button>
                                <Button shape='squared' bordered style={{ marginLeft: -1 }} onClick={() => this.setState({ open: !this.state.open })}>
                                    <i className="uf uf-triangle-down" style={{ 'color': '#0084FF' }}> </i>
                                </Button>
                                <Panel className="time-other-list" collapsible expanded={this.state.open}>
                                    <ul className="time-ul">
                                        <li><Button data-time="now-nd" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-nd' })} data-other="1" onClick={this.timeClick}>今天</Button><Button data-other="1" data-time="30min" className={classnames({ 'u-button': true, 'active': this.state.time == '30min' })} onClick={this.timeClick}>30分钟</Button></li>
                                        <li><Button data-time="now-nw" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-nw' })} data-other="1" onClick={this.timeClick}>本周</Button><Button data-other="1" data-time="4h" className={classnames({ 'u-button': true, 'active': this.state.time == '4h' })} onClick={this.timeClick}>4小时</Button></li>
                                        <li><Button data-time="now-nmon" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-nmon' })} data-other="1" onClick={this.timeClick}>本月</Button><Button data-other="1" data-time="30d" className={classnames({ 'u-button': true, 'active': this.state.time == '30d' })} onClick={this.timeClick}>30天</Button></li>
                                        <li><Button data-time="now-ny" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-ny' })} data-other="1" onClick={this.timeClick}>今年</Button><Button data-other="1" data-time="60d" className={classnames({ 'u-button': true, 'active': this.state.time == '60d' })} onClick={this.timeClick}>60天</Button></li>
                                        <li><Button data-time="now-yd" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-yd' })} data-other="1" onClick={this.timeClick}>昨天</Button><Button data-other="1" data-time="90d" className={classnames({ 'u-button': true, 'active': this.state.time == '90d' })} onClick={this.timeClick}>90天</Button></li>
                                        <li><Button data-time="now-ld" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-ld' })} data-other="1" onClick={this.timeClick}>前天</Button><Button data-other="1" data-time="6mon" className={classnames({ 'u-button': true, 'active': this.state.time == '6mon' })} onClick={this.timeClick}>6月</Button></li>
                                        <li><Button data-time="now-lw" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-lw' })} data-other="1" onClick={this.timeClick}>上周今天</Button><Button data-other="1" data-time="1y" className={classnames({ 'u-button': true, 'active': this.state.time == '1y' })} onClick={this.timeClick}>1年</Button></li>
                                        <li><Button data-time="now-yw" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-yw' })} data-other="1" onClick={this.timeClick}>前一周</Button><Button data-other="1" data-time="2y" className={classnames({ 'u-button': true, 'active': this.state.time == '2y' })} onClick={this.timeClick}>2年</Button></li>
                                        <li><Button data-time="now-ymon" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-ymon' })} data-other="1" onClick={this.timeClick}>前一月</Button><Button data-other="1" data-time="5y" className={classnames({ 'u-button': true, 'active': this.state.time == '5y' })} onClick={this.timeClick}>5年</Button></li>
                                        <li><Button data-time="now-yy" className={classnames({ 'u-button': true, 'active': this.state.time == 'now-yy' })} data-other="1" onClick={this.timeClick}>前一年</Button></li>
                                    </ul>
                                </Panel>
                            </div>
                        </div>
                    </div>


                    <div className="map clearfix">
                        <div className="top-left">
                            <Tile border={false}>
                                <div className="no-data pv" style={{ 'display': this.state.pvNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }} option={this.state.pv}>

                                </ReactEcharts>
                            </Tile>
                            <Tile border={false}>
                                <div className="no-data uv" style={{ 'display': this.state.uvNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }} option={this.state.uv}>

                                </ReactEcharts>
                            </Tile>
                            <Tile border={false}>
                                <div className="no-data rt" style={{ 'display': this.state.rtNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }}
                                    option={this.state.responseTime}>

                                </ReactEcharts>

                            </Tile>
                        </div>
                        <div className="top-right">
                            <Tile className="tile-map" border={false}>
                                <div className="no-data region" style={{ 'display': this.state.regionNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '630px', 'paddingTop': '15px' }} option={this.state.region}>

                                </ReactEcharts>

                            </Tile>
                            <Tile border={false}>
                                <div className="no-data flow" style={{ 'display': this.state.flowNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }} option={this.state.flow}>

                                </ReactEcharts>

                            </Tile>
                        </div>
                        <div className="foot">
                            <Tile border={false}>
                                <div className="no-data os" style={{ 'display': this.state.osNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }}
                                    option={this.state.operatingSystem}>

                                </ReactEcharts>

                            </Tile>
                            <Tile border={false}>
                                <div className="no-data sc" style={{ 'display': this.state.scNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }} option={this.state.statusCode}>

                                </ReactEcharts>
                            </Tile>
                            <Tile border={false}>
                                <div className="no-data bt" style={{ 'display': this.state.btNo }}>
                                    <img src={noDataImg} height="110px" />
                                </div>
                                <ReactEcharts theme={"macarons"} style={{ 'height': '272px', 'paddingTop': '15px' }}
                                    option={this.state.browserType}>

                                </ReactEcharts>
                            </Tile>
                        </div>
                    </div>


                </Row>
            </div>
        )
    }
}
export default Main;
