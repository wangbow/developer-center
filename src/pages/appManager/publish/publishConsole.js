import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Row, Col, Button, InputGroup, FormControl, Icon,Popconfirm,ButtonGroup,Message } from 'tinper-bee';
import {PublishReadFile,GetPublishDetailTask,RunLogs} from '../../../serves/appTile';
import {splitParam,lintAppListData,spiliCurrentTime,dataPart} from '../../../components/util';
import PageLoading from '../../../components/loading/index.js'





class PublishConsole extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            activeKey: this.props.activeKey,
            currentKey: "6",
            consoleData: [],
            cleanData: "",
            offset: 0,
            scrollTop: 0,
            indexFlag: 0,
            onScrollStop: false,
            taskList: [],
            togglePauseFlag:false,
            historyTimeYears: 2017,
            historyTimeMonths: 3,
            historyTimeWeeks: 1,
            historyTimeDays: 1,
            historyTimeHours: 12,
            historyTimeMinutes: 10,
            showLoading:false,
            searchFlag:false,
            timeoutFlag:false,

        };
        this.loopGetConsole = this.loopGetConsole.bind(this);
        this.getPublishDetailTask = this.getPublishDetailTask.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeKey !== this.state.currentKey){
            window.clearInterval(this.loopPublishTimer);
            return;
        }
        //如果向上滚动 则不阻断父局组件过来的更新
        if(this.state.onScrollStop) {
            window.clearInterval(this.loopPublishTimer);
            delete this.loopPublishTimer;
            return;
        }

        this.setState({currentId:this.props.id});
        //如果是更新过来的，则肯定已经做过了task的接口
        let self = this;

        if(nextProps.forbidTaskUploadFlag) return;

        // this.getPublishDetailTask(function() {
        //     console.log("continue");
        //     self.loopGetConsole();
        // })
        this.loopRunLogs();
    }

    componentDidMount() {
        let self = this;
        if(this.state.activeKey !== this.state.currentKey) return;
        // 第一次进来有可能tab直接切换到日志。日志打印依赖taskId,则先走task接口
        let taskList= JSON.parse(sessionStorage.getItem("taskList&"+this.state.id));
        //如果taskList没有请求 也就是一开始就走console 则先去请求taskList
        //if(!taskList) {
        if(taskList) {
            self.setState({taskList:taskList});
        }
        // self.getPublishDetailTask(function() {
        //     self.loopGetConsole();
        // })
        this.loopRunLogs();
        let currentTime = spiliCurrentTime();
        this.setState({
            historyTimeYears: currentTime.year,
            historyTimeMonths: currentTime.month,
            historyTimeWeeks: currentTime.week,
            historyTimeDays: currentTime.day,
            historyTimeHours: currentTime.hour,
            historyTimeMinutes: currentTime.minute,
        })
    }

    componentWillUnmount(){
        window.clearInterval(this.loopPublishTimer);
    }
    /**
     * 暂停或者启动console轮询
     * @param
     */
    pauseConsole = () => {
        if(!this.state.togglePauseFlag) {
            this.setState({onScrollStop:true})
            window.clearInterval(this.loopRunLogTimer);
            delete this.loopRunLogTimer;
        }else {
            this.loopRunLogs();
            this.setState({onScrollStop:false});
        }
        this.setState({togglePauseFlag:!this.state.togglePauseFlag})
    }

    handleScroll = (e) => {

        let searchValue = ReactDom.findDOMNode(this.refs.searchValue).value;
        if(this.state.showLoading) return;
        if(this.refs.view.scrollTop == 0) {
            if(!this.state.consoleData || !this.state.consoleData.length) return;
            //let len = this.state.consoleData.length;
            let formateSearchTime = dataPart(new Date(this.state.consoleData[0].timestamp),'yyyy-MM-dd hh:mm:ss.S');
            let offset = this.state.consoleData[0].offset;

            let param = {
                appid: this.props.appid,
                search: searchValue,
                to_offset: offset-1,
                to_time: formateSearchTime,
            }

            let self = this;
            setTimeout(function() {
                self.refs.view.scrollTop = 20;
                self.searchLog(param,true);
            }, 100);

        }else if((this.refs.view.scrollTop + this.refs.view.offsetHeight) == this.refs.view.scrollHeight ) {
            if(this.state.searchHistoryFlag) {
                return;
            }
            if(searchValue != ""){
                let len = this.state.consoleData.length;
                let formateSearchTime = dataPart(new Date(this.state.consoleData[len-1].timestamp),'yyyy-MM-dd hh:mm:ss.S')
                let offset = this.state.consoleData[len-1].offset;
                let param = {
                    appid: this.props.appid,
                    from_offset: offset+1,
                    search: searchValue,
                    from_time: formateSearchTime,
                }

                this.searchLog(param);
                this.refs.view.scrollTop = this.refs.view.scrollHeight;
            }else {
                window.clearInterval(this.loopRunLogTimer);
                delete this.loopRunLogTimer;
                this.loopRunLogs();
            }

        }

    }


    /**
     * 查询实例：日志基于实例
     */
    getPublishDetailTask(callback) {
        let id = this.props.id;
        let self = this;

        GetPublishDetailTask(id).then(function(response){
            let taskList = lintAppListData(response);
            if(!taskList || taskList.error_code) return;
            self.setState({taskList:taskList});
            sessionStorage.setItem("taskList&"+id,JSON.stringify(taskList));

            if(callback) {
                callback();
            }
        }).catch(function(e){
             console.log(e);
         })
    }
    /**
     * 轮询console
     */
    loopGetConsole(index=0) {
        let self = this;
        let fileLen;
        let taskList = JSON.parse(sessionStorage.getItem("taskList&"+this.state.id));
        if(!taskList || taskList.length==0) {
            return;
        };
        let taskid = taskList[index].id;

        let param = {
            task_id: taskid,
            app_id: this.state.id,
            filename: "stdout",
            offset:this.state.offset,
            limit:2000,
        }

        self.loopPublishTimer = setTimeout(function () {

            PublishReadFile(splitParam(param)).then(function(response){

                let consoleList = lintAppListData(response,null,null);

                if(!consoleList || consoleList.error_code) {
                    window.clearInterval(self.loopPublishTimer);
                    return;
                };

                //滚动条始终在最下面 日后要改
                self.refs.view.scrollTop = self.refs.view.scrollHeight;

                self.setState({
                    consoleData: `${self.state.consoleData}${consoleList.data}`,
                    cleanData:`${self.state.cleanData}${consoleList.data}`,
                    offset:consoleList.offset,
                    scrollTop: self.refs.view.scrollTop
                })

                if(self.refs.searchValue != '') {
                    self.searchKey();
                }else {
                    self.setState({consoleData:self.state.cleanData})
                }

                //轮询自己
                self.loopGetConsole(index);

            }).catch(function() {
                window.clearInterval(self.loopPublishTimer);
            })
        }, 1000)
    }


    loopRunLogs = () => {
        let self = this;
        let formateSearchTime;
        let offset;
        if(this.state.consoleData.length) {

            let len = this.state.consoleData.length;
            formateSearchTime = dataPart(new Date(this.state.consoleData[len-1].timestamp),'yyyy-MM-dd hh:mm:ss.S');
            offset  = this.state.consoleData[len-1].offset;
        }else {
            formateSearchTime = '';
            offset = 0;
        }

        let param = {
            appid: this.props.appid,
            from_offset: offset+1,
            from_time: formateSearchTime,
        }
        if(!self.state.timeoutFlag) {
            self.setState({timeoutFlag:true});
            self.loopRunLogTimer = setTimeout(function () {

                RunLogs(splitParam(param),function(response){

                    let consoleList = lintAppListData(response,null,null);

                    if(!consoleList || consoleList.error_code) {
                        window.clearInterval(self.loopRunLogTimer);
                        return;
                    };

                    consoleList = consoleList.reverse();
                    let overFlowLen;
                    if((consoleList.length+self.state.consoleData.length)>500) {
                        overFlowLen = consoleList.length+self.state.consoleData.length - 500;
                        let len = self.state.consoleData.length;
                        self.state.consoleData.split(len-overFlowLen,overFlowLen);
                    }

                    self.state.consoleData.push.apply(self.state.consoleData, consoleList);

                    let top = 0, height = 0;
                    if(self.refs.view){
                        top = self.refs.view.scrollTop;
                        height = self.refs.view.scrollHeight;
                    }
                    self.setState({
                        consoleData: self.state.consoleData,
                        scrollTop: top,
                        timeoutFlag:false,
                    })
                    if(self.refs.view){
                        self.refs.view.scrollTop = height;
                    }


                })
            }, 1000)
        }
    }

    searchByKey = () => {

        this.state.consoleData = [];
        let param = {
            appid: this.props.appid,
            search: ReactDom.findDOMNode(this.refs.searchValue).value,
        }
        if(param.search == "") {
            this.setState({searchHistoryFlag:false});
            window.clearInterval(this.loopRunLogTimer);
            delete this.loopRunLogTimer;
            this.loopRunLogs();
        }else {
            this.setState({searchFlag:true});
            this.searchLog(param);
        }

    }

    reback = () => {
        this.state.consoleData.length = 0;
        ReactDom.findDOMNode(this.refs.searchValue).value = '';
        this.setState({searchFlag:false});
        this.setState({searchHistoryFlag:false});
        window.clearInterval(this.loopRunLogTimer);
        delete this.loopRunLogTimer;
        this.loopRunLogs();
    }

    searchDetailInfo = (e) => {
        //let self = this;

        if(!this.state.searchFlag) return;
        let offset = e.target.getAttribute("offset");
        let param = {
            appid: this.props.appid,
            search: ReactDom.findDOMNode(this.refs.searchValue).value,
            offset: offset,
        }
        this.searchLog(param);
        this.setState({searchFlag:false})
    }

    /**
     * 搜索关键
     * @param preFlag:true 向前滚动
     */
    searchLog = (param,preFlag) => {
        let self = this;

        if(this.loopRunLogTimer) {
            this.setState({onScrollStop:true});
            window.clearInterval(this.loopRunLogTimer);
            delete this.loopRunLogTimer;
        }
        this.setState({showLoading:true});
        RunLogs(splitParam(param),function(response){

            let consoleList = lintAppListData(response,null,null);
            setTimeout(function() {
                self.setState({showLoading:false});
            }, 300);
            if(!consoleList || consoleList.error_code || !consoleList.length) {
                Message.create({content: "没有更多相关数据", color: 'warning',duration:1});
                //window.clearInterval(self.loopRunLogTimer);
                return;
            };

            consoleList = consoleList.reverse();
            let overFlowLen;
            if((consoleList.length+self.state.consoleData.length)>500) {
                overFlowLen = consoleList.length+self.state.consoleData.length - 500;
                let len = self.state.consoleData.length;
                self.state.consoleData.split(len-overFlowLen,overFlowLen);
            }

            if(preFlag) {
                consoleList.push.apply(consoleList,self.state.consoleData);
                self.setState({
                    consoleData: consoleList,
                })
            }else {
                self.state.consoleData.push.apply(self.state.consoleData, consoleList);
                self.setState({
                    consoleData: self.state.consoleData,
                })
            }

        })
    }



    onSearchHistoryConsole = () => {
        let toTime = this.state.historyTimeYears+'-'+this.state.historyTimeMonths+'-'+this.state.historyTimeDays+ " " +this.state.historyTimeHours+":"+this.state.historyTimeMinutes+":"+"00.000";
        this.state.consoleData = [];
        let param = {
            appid:this.props.appid,
            searchValue: ReactDom.findDOMNode(this.refs.searchValue).value,
            to_time:toTime
        }
        this.setState({searchHistoryFlag:true});
        this.searchLog(param);
    }

    monthCal = (month) => {
        if(month>12) {
            this.setState({
                historyTimeYears: this.state.historyTimeYears+1,
                historyTimeMonths: month+1,
            })
        }else if(month <= 0) {
            this.setState({
                historyTimeYears: this.state.historyTimeYears-1,
                historyTimeMonths: month+12,
            })
        }else {
            this.setState({
                historyTimeMonths: month,
            })
        }
    }

    dayCal = (day) => {

        //day==31的情况
        if(day == 31) {
            //大月处理
            if(this.state.historyTimeMonths == 1 || this.state.historyTimeMonths == 3 || this.state.historyTimeMonths == 5 || this.state.historyTimeMonths == 7 || this.state.historyTimeMonths == 8 || this.state.historyTimeMonths == 10) {
                this.setState({
                    historyTimeDays: 31,
                })
            }else {
                this.setState({
                    historyTimeDays: 1,
                })
                let tempMonth = this.state.historyTimeMonths + 1;
                this.monthCal(tempMonth);
            }
            return;
        }
        if(day <= 0) {
            //大月处理
            if(this.state.historyTimeMonths == 3) {
                this.setState({
                    historyTimeDays: day+28,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
                return;
            }
            if(this.state.historyTimeMonths == 1 || this.state.historyTimeMonths == 5 || this.state.historyTimeMonths == 7 || this.state.historyTimeMonths == 8 || this.state.historyTimeMonths == 10 || this.state.historyTimeMonths == 12) {
                this.setState({
                    historyTimeDays: day+31,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
            }else {
                this.setState({
                    historyTimeDays: day+30,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
            }
            return;
        }

        if(day > 31) {
            this.setState({
                historyTimeDays: day - 31,
            })
            let tempMoth = this.state.historyTimeMonths + 1;
            this.monthCal(tempMoth);
            return;
        }else if(day <= 28 && day>0) {
            this.setState({
                historyTimeDays: day,
            })
            return;
        }else {
            if(this.state.historyTimeMonths != 2){
                this.setState({
                    historyTimeDays: day,
                })
                return;
            }else {
                this.setState({
                    historyTimeDays: day-28,
                })
                let tempMonth = this.state.historyTimeMonths + 1;
                this.monthCal(tempMonth);
                return;
            }
        }

    }

    hourCal = (hour) => {
        if(hour>24) {
            this.setState({
                historyTimeHours: hour-24,
            })
            let tempDay = this.state.historyTimeDays + 1;
            this.dayCal(tempDay);
        }else if(hour<0) {
            this.setState({
                historyTimeHours: hour+24,
            })
            let tempDay = this.state.historyTimeDays - 1;
            this.dayCal(tempDay);
        }else {
            this.setState({
                historyTimeHours: hour,
            })
        }
    }

    minuteCal = (minute) => {
        if(minute>60) {
            this.setState({
                historyTimeMinutes: minute-60,
            })
            let tempHour = this.state.historyTimeHours + 1;
            this.hourCal(tempHour);
        }else if(minute<0) {
            this.setState({
                historyTimeMinutes: minute+60,
            })
            let tempHour = this.state.historyTimeHours - 1;
            this.hourCal(tempHour);
        }else {
            this.setState({
                historyTimeMinutes: minute,
            })
        }
    }

    setSearchTime = (value,unit) => {
        let self = this;
        return function() {
            switch(unit) {
                case "months": {
                    let newMonth = self.state.historyTimeMonths+value;
                    self.monthCal(newMonth);
                    break;
                }
                case "days": {
                    let newDays = self.state.historyTimeDays+value;
                    self.dayCal(newDays);
                    break;
                }
                case "hours": {
                    let newHours = self.state.historyTimeHours+value;
                    self.hourCal(newHours);
                    break;
                }
                case "minutes": {
                    let newMinutes = self.state.historyTimeMinutes+value;
                    self.minuteCal(newMinutes);
                    break;
                }
            }

        }
    }



    render () {
        let self = this;

        let popHistoryTime = (
            <div>
                <h4>跳转至  <span className="time-place year">{this.state.historyTimeYears}</span>年 <span className="time-place">{this.state.historyTimeMonths}</span>月 <span className="time-place">{this.state.historyTimeDays}</span>日 <span className="time-place">{this.state.historyTimeHours}</span>点 <span className="time-place">{this.state.historyTimeMinutes}</span>分 </h4>
                <ButtonGroup>
                    <Button shape='border' onClick={this.setSearchTime(-1,'days')}>昨天</Button>
                    <Button shape='border' onClick={this.setSearchTime(-2,'days')}>前天</Button>
                    <Button shape='border' onClick={this.setSearchTime(-7,'days')}>一周前</Button>
                    <Button shape='border' onClick={this.setSearchTime(-1,'months')}>上个月</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button shape='border' onClick={this.setSearchTime(5,'minutes')}>+ 5 分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(30,'minutes')}>+ 30分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(6,'hours')}>+ 6小时</Button>
                    <Button shape='border' onClick={this.setSearchTime(1,'days')}>+ 1天</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button shape='border' onClick={this.setSearchTime(-5,'minutes')}>- 5 分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(-30,'minutes')}>- 30分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(-6,'hours')}>- 6小时</Button>
                    <Button shape='border' onClick={this.setSearchTime(-1,'days')}>- 1天</Button>
                </ButtonGroup>
            </div>
         );
        // <textarea onScroll={this.handleScroll} spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" style={outerClass} ref="view" value={this.state.consoleData}>
        //</textarea>
        //<p onScroll={this.handleScroll} style={outerClass} ref="view" dangerouslySetInnerHTML={{__html:this.state.consoleData}}></p>
        let currentConsoleData = this.state.consoleData;
        return (
            <div>
                <Col md={12} >
                <div style={{ padding: 10, border: "1px solid #e1e1e1", background: "#f5f5f5"}}>
                    <div className="outer" ref='view' onScroll={this.handleScroll}>
                        <ul>
                            {
                                currentConsoleData && currentConsoleData.map(function (item, index) {

                                    return (
                                        <li className={self.state.searchFlag && 'liHightLight'} key={index} onClick={self.searchDetailInfo} timestamp={item.timestamp} offset={item.offset} dangerouslySetInnerHTML={{__html:item.message}} />
                                    )
                                })
                            }
                        </ul>
                        <PageLoading show={this.state.showLoading}/>
                    </div>
                    <div className="console-edit">
                        <Button className="edit-icon" size="sm" onClick={this.pauseConsole}>

                            {!this.state.togglePauseFlag && (<span><i className="cl cl-suspend" />暂停</span>)}
                          {this.state.togglePauseFlag && (<span><i className="cl cl-play-o"></i>滚动</span>)}
                        </Button>
                        <Popconfirm className="popover-history" trigger="click" placement="top" content={popHistoryTime} onClose={this.onSearchHistoryConsole}>
                            <Button className="edit-icon" size="sm"><i className="cl cl-find" />历史</Button>
                        </Popconfirm>
                        <InputGroup>
                            <FormControl placeholder="搜索关键字" ref="searchValue" style={{ borderRadius: 0, fontSize: 12,width:200 }}/>
                            <Button className="edit-icon" onClick={this.searchByKey} style={{marginTop:-3}}>搜索</Button>
                            <Button className="edit-icon" onClick={this.reback} style={{marginTop:-3}}>返回</Button>
                        </InputGroup>
                    </div>
                </div>
                </Col>

            </div>
        )
    }
}


export default PublishConsole;
