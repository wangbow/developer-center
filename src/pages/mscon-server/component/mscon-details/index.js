import React, { Component, PropTypes } from 'react';
import { Row, Col, Breadcrumb, Tooltip, Tabs, TabPanel, Button, Select, Table, Message, PanelGroup, Panel, InputGroup, Popconfirm, Icon, FormControl } from 'tinper-bee';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import './index.less';
import ScrollableInkTabBar from 'bee-tabs/build/ScrollableInkTabBar';
import { getDetail } from 'serves/microServe';
import TabContent from 'bee-tabs/build/TabContent';
import ServerLeftList from '../mscon-left-list';
import { getQueryString } from 'components/util';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { err, warn, success } from 'components/message-util';
import { getInterfaceName, toolTipData } from '../../mscon-utils/util';
import PageLoading from 'components/loading';

class ServerDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addActive: "",
            dataSource: JSON.parse(sessionStorage.getItem("data_service_list")),
            activeObj: [],
            activeKey: '1',
            dataService: null,
            dataRequestParaList: [],
            dataResponseParaList: [],
            dataRelateServiceList: [],
            clickIndex: null,
            sencondActive: 0,
            searchArr: [],
            searchFlag: false,
            changeData_source: [],
            showLoading: true
        };

        this.columnsRequest = [{
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
            render:function(text,rec){
                if(!text){
                    return <span> 否 </span>
                }else{
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

        this.columnsResponse = [{
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
        }
        ]
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
     * 去往控制台首页
     */
    gotoServerPage = (e) => {
        let { changeState } = this.props;
        if (changeState) {
            changeState("1");
        }
    }
    /**
     * 与后端交互，显示详情页信息
     */
    componentDidMount() {
        let { service_name, appCode, envType } = this.props;
        let { dataSource } = this.state;
        let self = this;
        if (dataSource && Array.isArray(dataSource)) {
            dataSource.map(function (item, index) {
                if (item.name == service_name) {
                    self.setState({
                        sencondActive: index
                    })
                    self.getServer(appCode, envType, item.id);
                }
            })
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

    /**`
    * 调后端搜索接口
    */

    getServer(appCode, envType, id) {
        let params = {
            serviceName: appCode,
            serviceId: id,
            envType: envType
        }
        this.setState({
            showLoading: true
        })
        getDetail(params)
            .then(data => {
                if (data && data.data.error_code) {
                    this.setState({
                        showLoading: false
                    })
                    return err("接口异常，请重试 " + data.data.error_message);
                } else if (data) {
                    this.setState({
                        dataService: data.data.service || [],
                        dataRequestParaList: data.data.requestParaList || [],
                        dataResponseParaList: data.data.responseParaList || [],
                        dataRelateServiceList: data.data.relateServiceList || [],
                        showLoading: false
                    })
                }

            })
            .catch((error) => {
                this.setState({
                    showLoading: false
                })
                return err(error.message);
            })

    }
    handleChose = (activeKey) => {
        this.setState({ activeKey });
    }
    /**
     * 服务进行搜索匹配，展示
     */
    handleSearch = () => {
        let { dataSource } = this.state;
        let searchArr = [];
        let { appCode, envType } = this.props;
        let searchValue = ReactDom.findDOMNode(this.refs.searchKey).value;
        if (searchValue) {
            dataSource.map(function (item, index) {
                if (item.name.indexOf(searchValue.replace(/(^\s*)|(\s*$)/g, "")) != -1) {
                    searchArr.push(item)
                }
            })
            this.setState({
                searchFlag: true,
                searchArr: searchArr,
                sencondActive: 0
            })
            if (searchArr.length > 0) {
                this.getServer(appCode, envType, searchArr[0].id);
            } else {
                this.getServer(appCode, envType, "123213");
            }

        }
    }
    /**
      * 点击每行图标切换
      */
    handleRownClick = (rec, index) => {
        let self = this;
        if (this.state.clickIndex === rec['name']) {
            this.setState({ clickIndex: null })
        } else {
            this.setState({ clickIndex: rec['name'] })
        }

    }
    /**
    * 点击每行的时候，请求列表展示字数据
    */
    handleExpand = (rec, index) => {
        let self = this;
        let dataRequestParaListSub = rec.subParamList; //这个可以拿到是个数组，包含6个元素

        if (dataRequestParaListSub) {
            return (
                <div className="padding-horizontal-20">
                    {
                        dataRequestParaListSub ? (
                            <Table
                                data={dataRequestParaListSub}
                                columns={this.columnsRequest}
                            />) : ""

                    }

                </div>
            );
        } else {
            return null;
        }

    }

    /**
     * 点击每行的时候，响应列表展示字数据
     */
    handleExpandRes = (rec, index) => {
        let self = this;
        let dataResponseParaListSub = rec.subParamList;

        if (dataResponseParaListSub) {
            return (
                <div className="padding-horizontal-20">
                    {
                        dataResponseParaListSub ? (
                            <Table
                                data={dataResponseParaListSub}
                                columns={this.columnsResponse}
                            />) : ""

                    }

                </div>
            );
        } else {
            return null;
        }

    }
    /**
     * 点击左边服务名称，请求后台数据
     */
    getLevelFirst = (value, addActive, id) => (e) => {
        let { appCode, envType } = this.props;
        this.setState({
            sencondActive: addActive
        })
        this.getServer(appCode, envType, id);
    }

    /**
     * 详情页的回车搜索事件
     */
    handleSearchKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.handleSearch();
        }
    }

    render() {
        let { dataSource, addActive, id, searchArr,
            searchFlag, data_interface_list,
            activeObj, sencondActive, dataService,
            dataRequestParaList, dataResponseParaList,
            dataRelateServiceList, activeKey } = this.state;
        let { interface_name, service_name, envType } = this.props;

        if (searchFlag) {
            dataSource = searchArr;
            searchFlag = false;
        }
        let interfaceName = getInterfaceName(interface_name);
        return (
            <div className="container">
                <Row className="serverDetailWrap">
                    <Col md={12} sm={12}>
                        <Breadcrumb>
                            <span className="curpoint tool-color" onClick={this.gotoServerPage}>
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

                    <Col md={3} sm={3}>
                        <div className="margin-style">
                            <ServerLeftList
                                addActive={sencondActive}
                                envType={envType}
                                dataSource={dataSource}
                                getFirst={(value, index, id) => {
                                    this.getLevelFirst(value, index, id)()
                                }}>
                                <div className="search-form margin-bottom-10">
                                    <InputGroup simple>
                                        <FormControl ref="searchKey" className="input-search" placeholder="请输入搜索内容" type="text" onKeyDown={this.handleSearchKeyDown} />
                                        <InputGroup.Button shape="border" onClick={this.handleSearch}>
                                            <span className="uf uf-search curpoint"> </span>
                                        </InputGroup.Button>
                                    </InputGroup>
                                </div>
                            </ServerLeftList>
                        </div>
                    </Col>
                    <Col md={9} sm={9}>
                        <h1 className="text-center">
                            {dataService ? dataService.name : ""}
                        </h1>
                        <h3 className="padding-horizontal-15">{dataService ? dataService.note : ""} </h3>
                        <Col md={12} className="padding-0">

                            <div>
                                <PanelGroup activeKey={activeKey} onSelect={this.handleChose} accordion>
                                    <Panel header={this.getIcon("请求参数")} eventKey="1">
                                        {

                                            <Table
                                                data={this.state.dataRequestParaList}
                                                columns={this.columnsRequest}
                                                rowKey={(rec, index) => { return rec.name }}
                                                expandedRowRender={this.handleExpand}
                                                expandedRowKeys={[this.state.clickIndex]}
                                                onRowClick={this.handleRownClick}
                                            />

                                        }
                                    </Panel>
                                    <Panel header={this.getIcon("响应参数")} eventKey="2">
                                        {
                                            <Table
                                                data={this.state.dataResponseParaList}
                                                columns={this.columnsResponse}
                                                rowKey={(rec, index) => { return rec.name }}
                                                expandedRowRender={this.handleExpandRes}
                                                expandedRowKeys={[this.state.clickIndex]}
                                                onRowClick={this.handleRownClick}
                                            />

                                        }
                                    </Panel>

                                </PanelGroup>

                            </div>

                        </Col>
                    </Col>
                    <PageLoading show={this.state.showLoading} />
                </Row>
            </div>
        )
    }
}

export default ServerDetails;
