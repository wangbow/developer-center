import React, {Component} from 'react';
import {Icon, PanelGroup, Panel, Table, Button, Popover, Modal} from 'tinper-bee';
import {lintAppListData, splitParam, dataPart} from '../../../components/util';
import {GetPublishDetailTask, AppDelete, StartUp, GetContainerId} from '../../../serves/appTile';
import Checkbox from 'rc-checkbox';

import 'rc-checkbox/assets/index.css';
import imgempty from '../../../assets/img/taskEmpty.png';

class TaskInstance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentId: this.props.id,
            appId: this.props.appId,
            taskList: [],
            checked: false,
            checkedAllTaskFlag: false,
            activeKey: this.props.activeKey,
            currentKey: "1",
            dataLoadingText: '正在加载实例...'
        }

        this.getPublishDetailTask = this.getPublishDetailTask.bind(this);
        this.selectAllTask = this.selectAllTask.bind(this);
        this.selectTask = this.selectTask.bind(this);
        this.onAppScale = this.onAppScale.bind(this);
        this.onAppDelete = this.onAppDelete.bind(this);
        this.openOut = this.openOut.bind(this);
        this.openContainerControler = this.openContainerControler.bind(this);
    }

    componentDidMount() {
        if (this.state.activeKey !== this.state.currentKey) return;
        this.getPublishDetailTask();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeKey !== this.state.currentKey) {
            return;
        }
        if (!nextProps.forbidTaskUploadFlag) {
            this.getPublishDetailTask();
        }
    }

    componentWillUnMount() {
    }

    /**
     * 查询实例方法
     */
    getPublishDetailTask() {
        let id = this.state.currentId;
        let self = this;

        GetPublishDetailTask(id).then(function (response) {
            let taskList = lintAppListData(response);
            if (!taskList || taskList.error_code) {
                return;
            }
            if (taskList instanceof Array && taskList.length === 0 || !taskList) {
                self.setState({dataLoadingText: '暂无实例'});
            }
            let taskids = []
            taskList.forEach((item, index) => {
                self.state.taskList.forEach(function (taskItem, taskIndex) {
                    if (taskItem.id === item.id) {
                        item.checked = taskItem.checked;
                    }
                })
                item.key = index;
                taskids.push(item.id);
            })

            self.setState({taskList: taskList});
            sessionStorage.setItem("taskList&" + id, JSON.stringify(taskList));
        })
    }

    /**
     * 全选实例
     */
    selectAllTask() {
        if (!this.state.checkedAllTaskFlag) {
            this.state.taskList.forEach(function (item, index) {
                item.checked = true;
            })
        } else {
            this.state.taskList.forEach(function (item, index) {
                item.checked = false;
            })
        }

        this.setState({checkedAllTaskFlag: !this.state.checkedAllTaskFlag});
    }

    /**
     * 单选实例
     */
    selectTask(e) {
        let self = this;
        let index = e.target.index;
        let checkedAllFlag = true;

        self.state.taskList[index].checked = !self.state.taskList[index].checked;
        self.setState({taskList: self.state.taskList});
        if (e.target.checked) {
            self.setState({taskList: self.state.taskList, checkedAllTaskFlag: false});
        } else {
            self.state.taskList.forEach(function (item, i) {
                if (i !== index && !item.checked) {
                    return checkedAllFlag = false;
                }
            })
            if (checkedAllFlag) {
                self.setState({checkedAllTaskFlag: true});
            }
        }
    }

    /**
     * 销毁实例
     */
    onAppDelete() {
        let ids = [];
        let tempTaskList = this.state.taskList;
        tempTaskList.forEach(function (item) {
            if (item.checked) {
                ids.push(item.id);
            }
        })

        if (!ids.length) return;

        let param = {
            app_id: this.state.currentId,
            ids: JSON.stringify(ids),
            scale: true
        };

        let self = this;
        AppDelete(splitParam(param), function (response) {
            lintAppListData(response, null, '销毁成功');
            tempTaskList.forEach(function (item, index) {
                if (item.checked) {
                    tempTaskList.splice(index, 1);
                }
            })

            self.setState({taskList: tempTaskList});
        })
    }

    /**
     * 扩缩实例
     */
    onAppScale() {
        let ids = [];

        this.state.taskList.forEach(function (item) {
            if (item.checked) {
                ids.push(item.id);
            }
        })

        if (!ids.length) return;

        let param = {app_id: this.state.currentId, ids: JSON.stringify(ids), scale: false};

        AppDelete(splitParam(param), function (response) {
            lintAppListData(response, null, '缩容成功');
        })
    }

    /**
     * 为日志弹出新窗口
     */
    openOut(record) {
        let self = this;
        let app_index = this.props.appId;
        let app_id = this.props.id;
        if (!record) return;
        let task_id = record.id;
        let slaveId = record.slaveId;

        return function () {
            GetContainerId({app_id, task_id}, function (response) {
                let res = lintAppListData(response, null, null);
                if (!res || res.error_code) return;
                let container_name = `${slaveId}.${res.container_id}`;
                window.open(`/fe/appManager/index.html#/publishConsole?appid=${app_index}&container_name=${container_name}`, "console", "_blank");
            })
        }
    }

    /**
     * 容器控制台
     */
    openContainerControler(record) {
        let app_id = this.props.id;
        let host = record.host;
        let task_id = record.id;
        let slaveId = record.slaveId;

        return function () {
            GetContainerId({app_id, task_id}, function (response) {
                let res = lintAppListData(response, null, null);
                if (!res || res.error_code) return;
                //Todo 日后从后台查询，暂时前端定义
                const hostMap = {
                    '10.3.15.200': 33001,
                    '10.3.15.197': 33002,
                    '10.3.15.199': 33003,
                    '10.3.15.202': 33004,
                    '10.3.15.201': 33005,
                }
                let container_id = `mesos-${slaveId}.${res.container_id}`;

                //let url = `/web-terminal/${hostMap[host]}/startup/10.3.15.189:${hostMap[host]}:${container_id}`;
                const headers = {"Content-Type": 'Access-Control-Allow-Origin:*'};

                let validateUrl = `/res-pool-manager/v1/resource_pool/getsubdomain?host_ip=${host}`;

                axios({
                    method: 'GET',
                    headers: headers,
                    url: validateUrl,
                })
                    .then(function (response) {
                        let res = lintAppListData(response, null, null);
                        if (!res || res.error_code) return;
                        //res. = {"Id":2,"ProviderId":"","AuthId":"A64k3n1jk71Jy5aA","HostIp":"10.3.15.199","SubDomain":"","Ts":"2017-04-14T01:36:08+08:00","Dr":0};
                        //let startupUrl = `http://term.${res.AuthId}.tunnel.yonyoucloud.com/startup/${container_id}`;
                        let startupUrl = `/res-pool-manager/v1/resource_nodes/startterminal/${res.AuthId}?container=${container_id}`;

                        axios({
                            method: 'GET',
                            headers: headers,
                            url: startupUrl,
                        })
                            .then(function (response) {
                                let resTerminal = lintAppListData(response, null, null);
                                if (!resTerminal || resTerminal.error_code) return;
                                let terminalUrl = `http://console.${res.AuthId}.tunnel.yonyoucloud.com`;
                                window.open(`${terminalUrl}`,`终端-only`, "height=1000, width=600, top=0, left=0,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");

                            })
                    })

                // axios({
                //     method: 'GET',
                //     headers: headers,
                //     url: url,
                // })
                // .then(function (response) {
                //     let res = lintAppListData(response,null,null);
                //     if(!res || res.error_code) return;
                //     window.open(`/app-approve/api/v1/approve/urlconverter/${res.url}`,"control", "height=1000, width=600, top=0, left=0,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");


                // })
                // .catch(function (err) {
                //     console.log(err);
                // });

            })
        }

    }

    //   { title: '系统日志', dataIndex: 'id', className: "text-center", key: 'errorlogs',render(taskId) {

    //       return <div className="log-icon" onClick={self.openOut(taskId,'stderr')}><i className="cl cl-mislog-o red-500"></i></div>
    // }},
    // { title: '业务日志', dataIndex: 'id', className: "text-center", key: 'errorout',render(taskId) {

    //       return <div className="log-icon" onClick={self.openOut(taskId,'stdout')}><i className="cl cl-log-o" style={{ color: "#0084ff"}}></i></div>

    // }},
    render() {
        let self = this;
        let type = this.props.type;
        const columns = [
            {
                title: (<Checkbox ref="checkedAllTask" checked={self.state.checkedAllTaskFlag}
                                  onChange={self.selectAllTask}/>),
                dataIndex: 'checked',
                key: 'checked',
                render(flag, record, index){
                    return <Checkbox index={index} ref={index} checked={flag} onChange={self.selectTask}/>
                }
            },
            {
                title: '序号', dataIndex: 'index', key: 'index', render(text, record, index) {
                return index + 1;
            }
            },
            {
                title: 'ID', dataIndex: 'id', key: 'id', render(text) {
                if (!text) return '';
                if(type === 3) return text;
                let arrayText = text.split(".")[1].split("-");
                return arrayText[0] + "-" + arrayText[1] + "-" + arrayText[2];
            }
            },
            {title: '主机', dataIndex: 'host', key: 'host'},
            {
                title: '健康状况', dataIndex: 'healthCheckResults', key: 'healthCheckResults', render(healthCheckResults) {
                let healthyText = '';
                if (!healthCheckResults) {
                    healthyText = "检测中...";
                } else {
                    let flag = true;
                    healthCheckResults.map(function(item) {
                        flag = flag && item.alive;
                    })
                    healthyText = flag ? "健康" : "异常";
                }

                return healthyText;
            }
            },
            {
                title: '状态', dataIndex: 'state', key: 'state', render(text) {
                if (text === "TASK_RUNNING") {
                    return <span className="green">运行中</span>

                } else if (text === "TASK_STAGING") {
                    return "初始化"
                } else {
                    return text;
                }
            }
            },
            {
                title: '启动时间', dataIndex: 'version', key: 'version', render(text) {
                return dataPart(new Date(text), 'yyyy-MM-dd hh:mm:ss')
            }
            },
            {
                title: '运行日志', dataIndex: 'id', className: "text-center", key: 'errorlogs', render(id, record) {

                return (
                    <div className="log-icon" onClick={self.openOut(record)}><i className="cl cl-log-o" /></div>
                )
            }
            },
            {
                title: '容器控制台', dataIndex: 'oper', className: "text-center", key: 'oper', render(flag, record, index) {
                return (
                    <div className="log-icon" onClick={self.openContainerControler(record, index)}>
                        <i className="cl cl-terminal" style={{color: "#0084ff"}}/>
                    </div>
                )
            }
            },
        ];
        return (
            <div>
                {
                    this.state.taskList
                    && this.state.taskList.length !== 0
                    && (
                        <div>
                            <div className="instance-btn-group">

                                <Button onClick={this.onAppScale} className="instance-btn" size="sm" shape="squared"
                                        bordered>重启实例</Button>
                                <Button onClick={this.onAppDelete} className="instance-btn" size="sm" shape="squared"
                                        bordered>销毁实例</Button>
                            </div>
                            <Table columns={columns} data={this.state.taskList}/>
                        </div>
                    )
                }
                {!this.state.taskList || this.state.taskList.length === 0 && (
                    <div className="empty-task">
                        <img src={imgempty} width="200"/> <br/>
                        <span>{this.state.dataLoadingText}</span>
                </div>
                )}

            </div>
        )
    }

}

export default TaskInstance;
