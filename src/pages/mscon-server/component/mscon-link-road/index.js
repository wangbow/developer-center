import React, { Component, PropTypes } from 'react';
import { Row, Col, Tooltip, Label, ProgressBar, Breadcrumb, Button, Select, Table, Message, Popconfirm, FormControl, InputGroup, Icon } from 'tinper-bee';
import classnames from 'classnames';
import './index.less';
import { traceDetail } from 'serves/microServe';
import { getQueryString, splitParam } from 'components/util';
import { err, warn, success } from 'components/message-util';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import PageLoading from 'components/loading';
import { getInterfaceName, toolTipData, toolTipDataText, showRowColor } from '../../mscon-utils/util';

let addIndex = 1;
let all_times ;
class LinkRoad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading:true,
            data: [], //render要渲染的数据
            oldData: [] //保存后端返回数据,进行tree结构的改造
        };
    }

    /**
     * 获取链路下钻的数据
     */
    componentDidMount() {
        let { traceId } = this.props;
        this.getServer(traceId);
    }

    componentDidUpdate(nextProps) {
        let arr
        let exfalseDom = document.getElementsByClassName("exfalse");
        if (exfalseDom.length > 0) {
            arr = exfalseDom;
        }

        if (arr && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].parentNode.parentNode.parentNode.querySelector('.u-table-row-collapsed').style.display = "none";
            }
        }
    }

    /**
     * 调用后台接口
     * @param {*} traceId 
     */
    getServer = (traceId) => {
        let params = {
            traceId: traceId
        }
        traceDetail(params)
            .then(data => {
                this.setState({
                    showLoading: false
                })
                if (data && data.data.error_code) {
                    return err("接口异常，请重试 " + data.data.error_message);
                } else if (data.data && data.data.length > 0) {
                    this.setState({
                        oldData: data.data
                    }, () => {
                        let node = null;
                        let cc = this.createTree(node, null);
                        addIndex = 1;
                        let arr = [];
                        arr.push(cc)
                        console.log(arr);
                        this.setState({
                            data: arr
                        })
                    });

                }

            })
            .catch((error) => {
                return err(error.message);
            })

    }

    /**
    * 解析并组装数据结构
    */
    createTree = (node, parentId) => {
        if (this.state.oldData.length == 0) return node;//跳出递归条件
        let curp = [];

        this.state.oldData = this.state.oldData.filter((vaule) => {
            if (parentId == vaule.parentId || parentId + "" == vaule.parentId) {
                curp.push(vaule);
                return false;
            }
            return true;
        })

        if (node == null) {
            node = {
                id: curp[0].id,
                serviceName: curp[0].serviceName || "",
                statusCode: curp[0].statusCode || "",
                duration: curp[0].duration || "",
                ipv4: curp[0].binaryAnnotations[0].endpoint.ipv4 || "",
                port: curp[0].binaryAnnotations[0].endpoint.port || "",
                serviceInterface: curp[0].serviceInterface || "",
                methodName: curp[0].methodName || "",
                parentId: parentId,
                hasIndex: 0,
                children: []
            }
            this.createTree(node, curp[0].id);
        }
        else {

            curp.forEach((value, index) => {
                node.children[index] = {
                    id: value.id,
                    serviceName: value.serviceName || "",
                    name: curp[0].name || "",
                    statusCode: value.statusCode || "",
                    duration: value.duration || "",
                    ipv4: value.binaryAnnotations[0].endpoint.ipv4 || "",
                    port: value.binaryAnnotations[0].endpoint.port || "",
                    serviceInterface: value.serviceInterface || "",
                    methodName: value.methodName || "",
                    parentId: parentId,
                    hasIndex: addIndex++,
                    children: []
                };

                this.createTree(node.children[index], value.id);
            })
        }
        return node;
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


    // table列要展示的字段
    renderTableColumns = () => {
        const columns = [{
            title: '应用名',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: function (text, rec,index) {
                let hasRowChild = rec.children.length;
                let hasIndexNum = rec.hasIndex;
                let rowColorClass = showRowColor(hasIndexNum);
                let content = <span className="exfalse"> {rec.serviceName}</span>;
                return (
                    <span>
                        {hasRowChild <= 0 ? <span className="padding-left-15">{content}</span> : rec.serviceName}
                    </span>
                )

            }

        }, {
            title: '状态',
            dataIndex: 'statusCode',
            key: 'statusCode',
            render:function(text,rec){
                if(text&&text==200){
                    return <span> 成功</span>    
                }else{
                     return <span>失败</span>    
                }
            }
        },
        {
            title: '服务/方法',
            dataIndex: 'serviceInterface',
            key: 'serviceInterface',
            width: '40%',
            render: function (text, rec) {
                let serviceInterface = rec.serviceInterface;
                let methodName = rec.methodName;
                let serName = serviceInterface + "#" + methodName;
                return (
                    <span> {serName}</span>
                )
            }
        },
        {
            title: '时间(ms)',
            dataIndex: 'duration',
            key: 'duration',
            render: (text, rec) => {
                let showTimeLine;
                if(rec.hasIndex ==0){
                    all_times =text; 
                    showTimeLine = "100%";
                }else{
                    showTimeLine = text/all_times*100+"%";
                }
                let hover_text = rec.serviceName + "耗时为" + Math.ceil(parseInt(text)/1000) + "ms";
                let distance = (rec.hasIndex * 8) + "px";
                let times_style = {
                    position: "relative",
                    marginLeft: distance,
                    width:showTimeLine
                }
                return (
                    <div>
                        <div className="time-style">
                            <Col md={9} sm={9} className="time-releative">
                                <div style={times_style}>
                                    <ProgressBar className="duration-times" srOnly={false} />
                                    <OverlayTrigger overlay={toolTipDataText("")} placement="bottom">
                                        <ProgressBar className="duration-times" srOnly={false} />
                                    </OverlayTrigger>
                                </div>
                            </Col>
                            <Col md={3} sm={3} className="padding-left-0">
                                <div>
                                    {Math.ceil(parseInt(text)/1000)}ms
                                </div>
                            </Col>

                        </div>

                    </div>
                )
            }
        }
        ];

        return columns;

    }

    render() {

        let { interface_name, service_name, traceId } = this.props;
        let { data } = this.state;
        let interfaceName = getInterfaceName(interface_name);
        return (
            <div className="link-road-wraper">
                <Col md={12} sm={12}>
                    <Breadcrumb>
                        <span className="curpoint" onClick={this.gotoServerPage}>
                            <Icon type="uf-anglepointingtoleft" > 返回</Icon>
                        </span>
                        <Breadcrumb.Item className="margin-left-20">
                            <OverlayTrigger overlay={toolTipData(interface_name)} placement="bottom">
                                <div className="font-style">{interfaceName}</div>
                            </OverlayTrigger>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {service_name}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {traceId}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col md={12} sm={12}>
                    {data.length > 0 ? <Table
                        columns={this.renderTableColumns()}
                        data={data}
                        rowKey={(rec, index) => { return rec.id }}
                    />
                        : ""}
                    <PageLoading show={this.state.showLoading} />
                </Col>
            </div>
        )
    }
}

export default LinkRoad;
