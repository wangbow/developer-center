import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Row, Col, Button, Select, Table, Message, Tooltip, Popconfirm, Pagination, Icon, FormControl, InputGroup } from 'tinper-bee';
import { Link } from 'react-router';
import classnames from 'classnames';
import { selectSearch, userDelete } from 'serves/microServe';
import './index.less';
import Loading from 'bee-loading';
import NoData from 'components/noData';
import { err, warn, success } from 'components/message-util';
import { DeleteUserData, formateDate } from 'components/util';
import "bee-loading/build/Loading.css";
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import config from '../const';
import Hearder from '../util/header';


class SearchList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            close_flag_id: false, // 用户id后面的删除图标
            close_flag_tel: false, //用户电话后面的删除图标
            data: [],//查询接口返回的数据
            activePage: 1,//用户选中页面，默认是第一页
            page: 1,//总页数
            searchValue_id: "",//用户id搜索框的值
            searchValue_tel: "",//用户tel搜索框的值
            showRotate: false
        }

    }

    componentDidMount() {
        this.getServer();
    }

    /**
     *
     */

    toolTipData = (data) => {
        return <Tooltip inverse id="toolTipId">
            <span>{data}</span>
        </Tooltip>

    }

    /**
     * 显示table的列表
     */
    showColumn = () => {
        const columnsRequest = [
            {
                title: '用户ID',
                dataIndex: 'userid',
                key: 'userid',
            },

            {
                title: '用户编码',
                dataIndex: 'usercode',
                key: 'usercode',
                render: (text, rec) => {
                    return <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
                        <div className="font-style">{text}</div>
                    </OverlayTrigger>
                }

            },

            {
                title: '租户ID',
                dataIndex: 'creator',
                key: 'creator',
                render: (text, rec) => {
                    return <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
                        <div className="font-style">{text}</div>
                    </OverlayTrigger>

                }
            },
            {
                title: '用户名称',
                dataIndex: 'username',
                key: 'username',
                render: (text, rec) => {
                    return <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
                        <div className="font-style">{text}</div>
                    </OverlayTrigger>
                }
            },
            {
                title: '电话',
                dataIndex: 'tel',
                key: 'tel'
            },
            {
                title: '邮箱',
                dataIndex: 'mail',
                key: 'mail'

            },
            {
                title: '创建时间',
                dataIndex: 'ctime',
                key: 'ctime',
                render: (text, rec) => {
                    let time = formateDate(rec.ctime);
                    return <span> {time} </span>
                }
            },
            {
                title: '操作',
                dataIndex: 'delete',
                key: 'delete',
                render: (text, rec) => {
                    let id = rec.id;
                    return <Popconfirm rootClose onClose={() => { this.handleClickDelete(id) }} trigger="click" placement="left" content="确认删除吗？" style={{ 'color': "red" }} >
                        <span className="cl cl-delete" title="删除" style={{ 'color': '#5BA8EA' }} ></span>
                    </Popconfirm>

                }
            }];

        return columnsRequest;
    }


    /**
    * 触发删除事件
    */
    handleClickDelete = (id) => {
        this.deleteData(id)();
    }

    /**
    *  删除事件执行
    */
    deleteData = (id) => (e) => {
        let params = {
            id: id
        }
        this.setState({
            showRotate: true
        })
        userDelete(params, (response) => {
            this.setState({ showRotate: false });
            let tempData = DeleteUserData(response, "删除失败", "删除成功");
            this.getServer();
        }, (err) => {
            this.setState({ showRotate: false });
        });
    }
    /**
    * 搜索框的输入事件
    */
    handleChange = (val) => (e) => {
        let inputValue = e.target.value;
        if (val == "id") {
            if (inputValue != "") {
                this.setState({
                    searchValue_id: inputValue,
                    close_flag_id: true,
                    showRotate: false
                })
            } else {
                this.setState({
                    searchValue_id: "",
                    close_flag_id: false,
                    showRotate: false
                })
            }
        } else {
            if (inputValue != "") {
                this.setState({
                    searchValue_tel: inputValue,
                    close_flag_tel: true,
                    showRotate: false
                })
            } else {
                this.setState({
                    searchValue_tel: "",
                    close_flag_tel: false,
                    showRotate: false
                })
            }
        }

    }

    /**
     * 搜索框的清除关键字
    */
    handleClickClose = (val) => (e) => {
        if (val == "id") {
            this.setState({
                searchValue_id: "",
                close_flag_id: false
            })
        } else {
            this.setState({
                searchValue_tel: "",
                close_flag_tel: false
            })
        }

    }


    /**
     * 搜索框的搜索事件
     */
    handleClick = (e) => {
        this.getServer();
    }

    /**
     *搜索框的回车事件
    */
    handleSearchKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.handleClick();
        }
    }

    /**
     * 调后端搜索接口
     */

    getServer = () => {
        let { activePage, searchValue_id, searchValue_tel } = this.state;
        let params = {
            size: '10',
            index: activePage - 1,
            userId: searchValue_id || "",
            telOrMail: searchValue_tel || "",
        }
        this.setState({
            showRotate: true
        })
        selectSearch(params)
            .then(data => {
                if (data && data.data.error_code) {
                    this.setState({
                        showRotate: false
                    })
                    return err("接口异常，请重试 " + data.data.error_message);
                } else if (data.data.data.content && Array.isArray(data.data.data.content)) {
                    this.setState({
                        data: data.data.data.content,
                        page: data.data.data.totalPages,
                        showRotate: false
                    })
                }

            })
            .catch((error) => {
                this.setState({
                    showRotate: false
                })
                return err(error.message);
            })

    }
    /**
     * 选中第几页
     */
    handleSelect = (key) => {
        this.setState({
            activePage: key
        }, () => {
            this.getServer();
        });
    }

    render() {
        let { data, placeHode, searchValue_id, searchValue_tel, close_flag_id, close_flag_tel, showRotate } = this.state;
        let tel_placeHold = config.placeholder_tel;
        let id_placeHold = config.placeholder_id;

        return (
            <div>
                <div className="header-margin">
                    <Hearder>用户管理界面</Hearder>
                </div>
                <div className="search-list-wraper">
                    <Row className="search-list">
                        <div className="hear-wraper clearfix">
                            <Col md={5} sm={5} className="">
                                <div className="clearfix hearder">
                                    <span className="pull-left title">手机/邮箱:</span>
                                    <div className=" pull-left  search-wraper">
                                        <InputGroup simple className="input-wraper">
                                            <FormControl className="input-search" value={searchValue_tel} placeholder={tel_placeHold} type="text" onChange={this.handleChange()} />
                                            {
                                                close_flag_tel ? <InputGroup.Button shape="border" className="border-close-wraper" onClick={this.handleClickClose()}>
                                                    <span className="cl cl-close-c curpoint"> </span>
                                                </InputGroup.Button> : ""
                                            }
                                        </InputGroup>
                                    </div>
                                </div>
                            </Col>

                            <Col md={5} sm={5} className="">
                                <div className="clearfix hearder">
                                    <span className="pull-left title">用户id:</span>
                                    <div className=" pull-left search-wraper">
                                        <InputGroup simple className="input-wraper">
                                            <FormControl className="input-search" value={searchValue_id} placeholder={id_placeHold} type="text" onChange={this.handleChange("id")} />
                                            {
                                                close_flag_id ? <InputGroup.Button shape="border" className="border-close-wraper" onClick={this.handleClickClose("id")}>
                                                    <span className="cl cl-close-c curpoint"> </span>
                                                </InputGroup.Button> : ""
                                            }
                                        </InputGroup>
                                    </div>
                                </div>
                            </Col>

                            <Col md={2} sm={2}>
                                <div className="clearfix margin-style">
                                    <Button onClick={this.handleClick} onKeyDown={this.handleSearchKeyDown} colors="info">
                                        查询
                                    </Button>
                                </div>
                            </Col>
                        </div>
                        <div className="clearfix">
                            <Col md={12} sm={12}>
                                <Table
                                    data={data}
                                    columns={this.showColumn()}
                                    rowKey={(rec, index) => { return rec.id }}
                                />

                            </Col>
                        </div>
                        <Col md={12} sm={12}>
                            <div className="pagination-wrap">
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
                            </div>

                        </Col>

                        <Loading
                            fullScreen
                            showBackDrop={true}
                            show={this.state.showRotate}
                        />

                    </Row>
                </div>
            </div>
        )
    }

}

SearchList.contextTypes = {
    router: PropTypes.object
}

export default SearchList;
