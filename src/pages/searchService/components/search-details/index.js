import React, { Component, PropTypes } from 'react';
import { Row, Col, Tabs, TabPanel, Button, Breadcrumb, Tooltip, Select, Table, Message, PanelGroup, Panel, Popconfirm, Icon, FormControl } from 'tinper-bee';
import { Link } from 'react-router';
import classnames from 'classnames';
import './index.less';
import { getDetail, showAppList } from 'serves/microServe';
import TabContent from 'bee-tabs/build/TabContent';
import ScrollableInkTabBar from 'bee-tabs/build/ScrollableInkTabBar';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { getQueryString, validataString } from 'components/util';
import { err, warn, success } from 'components/message-util';
import AuthDialog from '../dialog';
import Loading from 'bee-loading';
import "bee-loading/build/Loading.css";

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            activeKey: '1',
            dataService: null,
            dataRequestParaList: [],
            dataResponseParaList: [],
            dataRelateServiceList: [],
            clickIndex: null,
            show: false,
            saveDataArray: [],
            showLine: false
        };
    }

    componentWillMount() {
        if (this.props.params.name && this.props.params.id) {
            this.getServer(this.props.params.name, this.props.params.id);
        }
    }

    /**
     * 显示的请求参数的table列
     */
    renderTableRequest = () => {
        let columnsRequest = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: function (text, rec, index) {
                let showFlag = rec.subParamList;
                let content = <span className="exfalse"> {rec.name}</span>;
                return (
                    <span>
                        {showFlag ? rec.name : content}
                    </span>
                )
            }

        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type'

        },
        {
            title: '是否必须',
            dataIndex: 'required',
            key: 'required',
            render: function (text, rec) {
                if (!text) {
                    return <span> 否 </span>
                } else {
                    return <span> {text} </span>
                }
            }
        },
        {
            title: '示例值',
            dataIndex: 'egValue',
            key: 'egValue'
        },
        {
            title: '更多限制',
            dataIndex: 'limited',
            key: 'limited'
        },
        {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc'
        }];
        return columnsRequest;

    }

    /**
    * 显示的响应参数的table列
    */
    renderTableResp = () => {
        let columnsResponse = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: function (text, rec, index) {
                let showFlag = rec.subParamList;
                let content = <span className="exfalse"> {rec.name}</span>;
                return (
                    <span>
                        {showFlag ? rec.name : content}
                    </span>
                )
            }

        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type'

        },
        {
            title: '示例值',
            dataIndex: 'egValue',
            key: 'egValue'
        },
        {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc'
        }];
        return columnsResponse;

    }

    /**
     * 调后端搜索接口
     */

    getServer(name, id) {
        let params = {
            serviceName: name,
            serviceId: id
        }
        getDetail(params)
            .then(data => {
                if (data && data.data.error_code) {
                    return Message.create({
                        content: "接口异常，请重试",
                        color: 'danger',
                        duration: null
                    })
                } else if (data) {
                    this.setState({
                        dataService: data.data.service,
                        dataRequestParaList: data.data.requestParaList,
                        dataResponseParaList: data.data.responseParaList,
                        dataRelateServiceList: data.data.relateServiceList
                    })
                }

            })
            .catch((error) => {
                return Message.create({
                    content: error.message,
                    color: 'danger',
                    duration: null
                })
            })

    }
    /**
     * 获取icon组件
     */
    getIcon = (parm) => {
        return (
            <div>
                <Icon type="uf uf-triangle-down" />
                <span>{parm} </span>
            </div>
        )
    }

    /**
    * 
    */
    handleChose = (activeKey) => {
        this.setState({ activeKey });
    }



    /**
      * 点击每行图标切换
      */
    handleRownClick = (rec, index) => {
        let self = this;
        let params = self.props.params.name;
        if (this.state.clickIndex === rec['name']) {
            this.setState({ clickIndex: null })
        } else {
            this.setState({ clickIndex: rec['name'], dataRequestParaListSub: rec.subParamList })
        }


    }
    /**
     * 点击每行的时候，请求列表展示字数据
     */
    handleExpand = (rec, index) => {
        let self = this;
        let dataRequestParaListSub = rec.subParamList; //这个可以拿到是个数组，包含6个元素
        console.log(dataRequestParaListSub);
        if (dataRequestParaListSub) {
            return (
                <div className="padding-horizontal-20">
                    {
                        dataRequestParaListSub ? (
                            <Table
                                data={dataRequestParaListSub}
                                columns={this.renderTableRequest()}
                            />) : ""

                    }

                </div>
            );
        } else {
            return (
                <div className="text-center">
                    no data
                </div>
            );
        }

    }
    /**
     * 点击每行的时候，响应列表展示字数据
     */
    handleExpandRes = (rec, index) => {
        let self = this;
        let dataResponseParaListSub = rec.subParamList;
        console.log(dataResponseParaListSub);
        if (dataResponseParaListSub) {
            return (
                <div className="padding-horizontal-20">
                    {
                        dataResponseParaListSub ? (
                            <Table
                                data={dataResponseParaListSub}
                                columns={this.renderTableResp()}
                            />) : ""

                    }

                </div>
            );
        } else {
            return (
                <div className="text-center">
                    no data
                </div>
            );
        }

    }

    /**
     * 监听table图标的显示与否
     */
    componentDidUpdate(nextProps) {
        let icon = document.getElementsByClassName("u-table-row-expand-icon");
        for (var i = 0; i < icon.length; i++) {
            if (icon[i].nextSibling.children.length == 0) {
                icon[i].style.display = "inline-block";
            } else {
                icon[i].style.display = "none";
            }
        }
    }


    /**
 * 鼠标hover接口的时候，显示完整的包名和接口名
 * @param {*} data 
 */
    toolTipData = (data) => {
        return (<Tooltip inverse id="toolTipId">
            <span>{data}</span>
        </Tooltip>
        )
    }

    /**
     * 监听table图标的显示与否
     */
    componentDidUpdate(nextProps) {
        let arr
        let exfalseDom = document.getElementsByClassName("exfalse");
        if (exfalseDom.length > 0) {
            arr = exfalseDom;
        }

        if (arr && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].parentNode.parentNode.querySelector('.u-table-row-collapsed')) {
                    arr[i].parentNode.parentNode.querySelector('.u-table-row-collapsed').style.display = "none";
                }
            }
        }
    }

    /**
     * 申请授权
     */
    handleAuth = (e) => {
        this.showApp();
    }

    getElement = () => {
        return document.getElementById('search-detail');
    }


    /**
     * 显示应用app列表
     */

    showApp = () => {
        this.setState({
            showLine: true
        })
        showAppList()
            .then(data => {
                if (data && data.data.error_code) {
                    this.setState({
                        showLine: false
                    })
                    return err("接口异常，请重试 " + data.data.error_message);
                } else if (data) {
                    let arrayData = data.data.detailMsg.data;
                    let saveData = [];
                    if (arrayData.length > 0) {
                        arrayData.map(function (item, index) {
                            let obj = {
                                app_name: item.app_name,
                                app_code: item.app_code
                            };
                            saveData.push(obj);
                        })
                        this.setState({
                            saveDataArray: saveData,
                            show: true,
                            showLine: false
                        })
                    } else {
                        this.setState({
                            showLine: false
                        })
                        return warn("查询的应用列表为空 ");
                    }

                }

            })
            .catch((error) => {
                this.setState({
                    showLine: false
                })
                return err("接口异常 ");
            })

    }

    goList = () => {
        let { dataService } = this.state;
        let searchName = dataService.serviceName;
        let str = this.props.location.search;
        let arr = str.split("=");
        let searchValue = arr[1];
        this.context.router.push(`/searchList?searchName=${searchValue}`);
    }
    /**
     * 关闭弹出框
     */

    close = () => {
        this.setState({
            show: false
        });
    }
    render() {
        let { dataService, saveDataArray, dataRequestParaList, showLine, dataResponseParaList, dataRelateServiceList, show } = this.state;
        let interface_Name = "";
        if (dataService) {
            interface_Name = dataService.interfaceName;
        }
        return (
            <Row className="search-detail clearfix" id="search-detail">
                <div className="clearfix">
                    <Col md={12} sm={12} className="padding-horizontal-0">
                        <Breadcrumb>
                            <span className="curpoint" onClick={this.goList} >
                                <Icon type="uf-anglepointingtoleft" > 返回</Icon>
                            </span>
                            <Breadcrumb.Item className="margin-left-20">
                                {<OverlayTrigger overlay={this.toolTipData(interface_Name)} placement="bottom">
                                    <div className="font-style">{interface_Name}</div>
                                </OverlayTrigger>}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <div className="clearfix">
                        <Col md={8} sm={8} className="">
                            <div className="info clearfix">
                                <div className="title clearfix">
                                    <Col md={10} sm={10} className="font-style">
                                        <div>
                                            <span className="serviceName" >{dataService ? dataService.serviceName : ""}</span>
                                            {dataService && dataService.auth == "public" ? <span className="public"> 公有</span> :
                                                <span className="private"> 私有</span>}
                                        </div>

                                    </Col>
                                    <Col md={2} sm={2} className="padding-right-0">
                                        <div className="title-auth" onClick={this.handleAuth}>申请授权</div>
                                    </Col>
                                </div>
                                <Col md={12} sm={12}>
                                    <div className="title-info">
                                        <span className="cl  cl-shop curpoint"> </span>
                                        <span>提供商:{dataService ? validataString(dataService.provider) : ""}</span>
                                    </div>
                                </Col>
                                <Col ms={12} sm={12}>
                                    <p>  {dataService ? dataService.note : ""}</p>
                                </Col>
                            </div>
                            <div>
                                <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleChose} accordion>
                                    <Panel header={this.getIcon("请求参数")} eventKey="1">
                                        {
                                            dataRequestParaList ? (
                                                <Table
                                                    data={this.state.dataRequestParaList}
                                                    columns={this.renderTableRequest()}
                                                    rowKey={(rec, index) => { return rec.name }}
                                                    expandedRowRender={this.handleExpand}
                                                    expandedRowKeys={[this.state.clickIndex]}
                                                    onRowClick={this.handleRownClick}
                                                />) : ""

                                        }
                                    </Panel>
                                    <Panel header={this.getIcon("响应参数")} eventKey="2">
                                        {
                                            dataResponseParaList ? (<Table
                                                data={this.state.dataResponseParaList}
                                                columns={this.renderTableResp()}
                                                rowKey={(rec, index) => { return rec.name }}
                                                expandedRowRender={this.handleExpandRes}
                                                expandedRowKeys={[this.state.clickIndex]}
                                                onRowClick={this.handleRownClick}
                                            />) : ""

                                        }
                                    </Panel>

                                </PanelGroup>

                            </div>

                        </Col>

                        <Col md={4} sm={4} className="padding-vertical-10">
                            <h3 className="tuijian clearfix">
                                <span className="pull-left tujian-content-border"> </span>
                                <span className="pull-left margin-left-20">相关服务</span>
                            </h3>
                        </Col>


                    </div>
                    <AuthDialog showModal={show} data={dataService} saveDataArray={saveDataArray} close={this.close} />
                    <Loading
                        fullScreen
                        loadingType="line"
                        showBackDrop={true}
                        show={this.state.showLine}
                    />
                </div>
            </Row>
        )
    }
}

List.contextTypes = {
    router: PropTypes.object
}
export default List;
