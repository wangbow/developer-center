import React, { Component, PropTypes } from 'react';
import { Row, Col, Switch, Tooltip, Button, Select, Table, Message, Popconfirm, Icon, FormControl } from 'tinper-bee';
import classnames from 'classnames';
import './index.less';
import MiroAuthPage from '../../../appManager/components/miro-auth-page';
import SwitchConfirm from '../switch-confirm';
import CurrentLimit from '../mscon-limit';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { err, warn, success } from 'components/message-util';
import { getQueryString, getHostId } from 'components/util';
import { getInterfaceName, toolTipData } from '../../mscon-utils/util';

class ServerCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: this.props.flag || "",
            data_service_list: this.props.data_service_list,
            showModal: false,
            service_name: "",
            num: false,
            verQps: false,
            verThreadCount: false,
            metaId: "",
            resId: "",
            userPriviledge: "",
            changeIndex: props.changeIndex || "",
            envType: props.envType,
            param: "",
            interface_name: props.interface_name
        };
    }

    /**
     *
     * 监听父组件props的变化，用来更新展示的卡片
     */
    componentWillReceiveProps(nextProps) {
        let { data_service_list } = nextProps;
        this.setState({
            data_service_list: data_service_list,
            interface_name: nextProps.interface_name
        })
    }

    /**
     * 调用父组件，更改状态的方法
     */
    changeState = (value) => () => {
        let { changeState } = this.props;
        if (changeState) {
            changeState();
        }
    }
    /**
     * 获取请求参数
     */
    getParam = (rec) => {
        if (rec.paramTypeList && rec.paramTypeList.length > 0) {
            let param = rec.paramTypeList.toString();
            return "(" + param + ")";
        } else {
            return ""
        }
    }
    /**
     * 点击卡片里面每个小选项,执行不同的操作
     */
    handleClick = (name, rec) => (e) => {
        e.stopPropagation();
        let { appCode, changeParentState } = this.props;
        let { flag, interface_name } = this.state;
        let resId;
        if (rec.paramTypeList) {
            resId = `${rec.interfaceName}.${rec.name}(${rec.paramTypeList.join(',')})`;
        }
        let authFlag = rec.auth;

        if (changeParentState) {

            switch (name) {
                case 'auth':
                    if (authFlag == "public") {
                        return warn('公有权限不能进行授权操作');
                    } else {
                        changeParentState("11", interface_name, rec.name, resId);
                    }
                    break;
                case 'link':
                    changeParentState("12", interface_name, rec.name);
                    break;
                case 'cardlimit':
                    this.setState({
                        showModal: true,
                        service_name: rec.name,
                        num: true,
                        param: this.getParam(rec)
                    })
                    break;
                case 'rely':
                    // return warn("正在开发ing");
                    changeParentState("14", interface_name, rec.name);
                    break;
                case 'statis':
                    //return warn("正在开发ing");
                    changeParentState("15", interface_name, rec.name);
                    break;
            }
        }


    }
    /**
     * 获取当前卡片的名称
     */
    handleClickParent = (value,interface_value) => (e) => {
        return this.getValue(value,interface_value)
    }
    /**
     * 调用父类的方法，吧当前卡片的名称当做参数
     */
    getValue = (value,interface_value) => {
        const { getSencond } = this.props;
        if (getSencond) {
            getSencond(value,interface_value);
        }

    }
    /**
     * 阻止swtich向父dom节点冒泡
     */
    onSwitchClick = (id, resId) => (e) => {
        e.stopPropagation();
    }

    /**
     * 模态框被点击确认，关闭模态框
     */
    handleConfirm = () => {
        this.setState({
            showModal: false,
            num: false,
            verQps: false,
            verThreadCount: false
        });
    }
    /**
   * 模态框被点击关闭，关闭模态框
   */
    close = () => {
        this.setState({
            showModal: false,
            num: false,
            verQps: false,
            verThreadCount: false
        });
    }
    changeNum = () => {
        this.setState({
            num: false
        });
    }
    changeNumVer = (flag, name) => (e) => {
        if (flag && name == "qps") {
            this.setState(function (prevState, props) {
                return { verQps: true }
            });
        }
        if (flag && name == "threadCount") {
            this.setState(function (prevState, props) {
                return { verThreadCount: true }
            });
        }
        if (flag == false && name == "qps") {
            this.setState(function (prevState, props) {
                return { verQps: false }
            });
        }
        if (flag == false && name == "threadCount") {
            this.setState(function (prevState, props) {
                return { verThreadCount: false }
            });
        }

    }
    /**
     * 获取当前卡片的resId
     */
    getResId = (rec) => (e) => {
        let serviceName = rec.name;
        let paramsString = rec.paramTypeList.toString();
        let resId = rec.interfaceName + "." + serviceName + `(${paramsString})`;
        return resId;
    }

    /**
   * 调用switch的父组件进行数据交互
   */
    changeHandle = (metaId, resId, userPriviledge, defaultIndex) => (e) => {
        let { switchonClick } = this.props;
        let { data_service_list } = this.state;
        if (switchonClick) {
            for (var i = 0; i < data_service_list.length; i++) {
                if (i == defaultIndex) {
                    data_service_list[i].auth == "public" ? data_service_list[i].auth = "private" : data_service_list[i].auth = "public";
                }
            }

            this.setState({
                data_service_list: data_service_list
            }, () => {
                switchonClick(metaId, resId, userPriviledge, defaultIndex);
            });

        }
    }

   

    render() {
        let { data_service_list, interface_name, showModal, service_name, num, verQps, verThreadCount, envType, param } = this.state;
        let { appCode } = this.props;
        let self = this;
        return (
            <Row className="serverCardWrap margin-horizontal-0">
                {
                    data_service_list.length > 0 ? (
                        data_service_list.map(function (item, index) {
                            return (
                                <Col md={4} sm={4} className="padding-horizontal-5">
                                    <div className="card-wrap margin-vertical-10 curpoint" onClick={self.handleClickParent(item.name,item.interfaceName)}>
                                        <div className="card-title clearfix">
                                            <OverlayTrigger overlay={toolTipData(item.name)} placement="bottom">
                                                <span className="pull-left serviceName"> {item.name} </span>
                                            </OverlayTrigger>
                                            <span className="pull-right private">私有</span>
                                            <span className="pull-right margin-right-15 switch-card" onClick={self.onSwitchClick()}>
                                                <SwitchConfirm
                                                    checked={item.auth == "public" ? false : true}
                                                    disabled={false}
                                                    resId={self.getResId(item)()}
                                                    metaId={item.id}
                                                    defaultIndex={index}
                                                    onChangeHandler={(metaId, resId, userPriviledge, index) => {
                                                        self.changeHandle(metaId, resId, userPriviledge, index)()
                                                    }}
                                                /></span>

                                        </div>

                                        <div className="card-body clearfix">
                                            <span className="pull-left">
                                                今日调用次数
                                    <span className="body-count"> {item.callHits ? item.callHits : ""} </span>
                                            </span>
                                            <span className="pull-right">正确率 <span className="successPercent">{item.successPercent ? parseInt(item.successPercent) + "%" : ""}</span> </span>
                                        </div>

                                        <div className="cards-foot clearfix">
                                            <ul className="clearfix">
                                                <li onClick={self.handleClick('auth', item)}>
                                                    <span className="li-icon">
                                                        <i className="cl cl-shield-o"></i>
                                                    </span>
                                                    <span> 权限</span>
                                                </li>
                                                <li onClick={self.handleClick('link', item)}>
                                                    <span className="li-icon">
                                                        <i className="cl cl-relationship-l"></i>
                                                    </span>
                                                    <span> 链路</span>
                                                </li>
                                                <li onClick={self.handleClick('cardlimit', item)}>
                                                    <span className="li-icon">
                                                        <i className="cl cl-limit-l"></i>
                                                    </span>
                                                    <span> 限流</span>
                                                </li>
                                                {/*    
                                                <li onClick={self.handleClick('rely', item)} >
                                                    <span className="li-icon">
                                                        <i className="cl cl-revlation"></i>
                                                    </span>
                                                    <span> 依赖</span>
                                                </li>
                                                <li onClick={self.handleClick('statis', item)}>
                                                    <span className="li-icon">
                                                        <i className="cl cl-barchart-up"></i>
                                                    </span>
                                                    <span> 统计</span>
                                                </li>
                                                */}


                                            </ul>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    ) : <h3 className="text-center margin-top-50"> no data</h3>
                }
                <CurrentLimit
                    showModal={showModal}
                    appCode={appCode}
                    param={param}
                    num={num}
                    verQps={verQps}
                    verThreadCount={verThreadCount}
                    envType={envType}
                    changeNum={this.changeNum}
                    changeNumVer={(flag, name) => this.changeNumVer(flag, name)()}
                    interface_name={interface_name}
                    service_name={service_name}
                    onConfirm={this.handleConfirm}
                    close={this.close}
                />
            </Row>
        )
    }
}


export default ServerCard;
