import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Row, Col, Button, Select, Table, Message, Popconfirm, Icon, Pagination, FormControl, InputGroup } from 'tinper-bee';
import { Link } from 'react-router';
import classnames from 'classnames';
import './index.less';
import ScrollableInkTabBar from 'bee-tabs/build/ScrollableInkTabBar';
import { searchLink } from 'serves/microServe';
import TabContent from 'bee-tabs/build/TabContent';
import { getQueryString, validataString } from 'components/util';
import NoData from 'components/noData';
import { err, warn, success } from 'components/message-util';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { toolTipData } from '../../util';
import Loading from 'bee-loading';
import "bee-loading/build/Loading.css";

class SearchList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            close_flag: false,
            data: [],
            activePage: 1,
            page: 1,
            searchValue: "",
            placeHode: props.location.query.searchName,
            showLoading: false//loading进度条的显示与否
        }

    }

    /**
    * 搜索框的输入事件
    */
    handleChange = (e) => {
        let inputValue = e.target.value;
        if (inputValue != "") {
            this.setState({
                searchValue: inputValue,
                close_flag: true,
                showLoading: false
            })
        } else {
            this.setState({
                searchValue: "",
                close_flag: false,
                showLoading: false
            })
        }
    }
    /**
     * 搜索框的搜索事件
     */
    handleClick = (e) => {
        let { searchValue } = this.state;
        if (searchValue) {
            let arr = location.hash.split("=");
            arr[1] = "=" + searchValue;
            location.hash = arr[0] + arr[1];
            this.getServer(searchValue);
        } else {
            this.gotoMain();
        }


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
     * 搜索框的清除关键字
     */
    handleClickClose = (e) => {
        this.setState({
            searchValue: "",
            close_flag: false
        })
    }


    componentWillMount() {
        if (this.state.placeHode) {
            this.getServer(this.state.placeHode);
        }
    }


    /**
     * 调后端搜索接口
     */

    getServer = (searchValue) => {
        let { activePage } = this.state;
        let params = {
            size: '10',
            index: activePage - 1,
            keyName: searchValue
        }
        this.setState({
            showLoading: true
        })
        searchLink(params)
            .then(data => {
                if (data && data.data.error_code) {
                    this.setState({
                        showLoading: false
                    })
                    return err("接口异常，请重试 " + data.data.error_message);
                } else if (data.data.content && Array.isArray(data.data.content)) {
                    this.setState({
                        data: data.data.content,
                        searchValue: searchValue,
                        page: data.data.totalPages,
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
    /**
     * 选中第几页
     */
    handleSelect = (key) => {
        let { searchValue } = this.state;
        this.setState({
            activePage: key
        }, () => {
            this.getServer(searchValue);
        });
    }

    /**
     * 去往详情页
     */
    goDetails = (name, id, searchValue) => (e) => {
        this.context.router.push(`/details/${name}/${id}?searchValue=${searchValue}`);
    }

    /**
     * 去往首页 
     */
    gotoMain = () => {
        this.context.router.push(`/`);
    }
    /**
     * 高亮显示匹配搜索关键字的内容
     */
    changeText = (e) => {
        if (e.indexOf(this.state.searchValue) != -1) {
            let newStr = e.replace(this.state.searchValue, "<span class='inner-color'>" + this.state.searchValue + "</span>");
            let index = e.indexOf(this.state.searchValue);
            let searchValue_length = this.state.searchValue.length;
            var html = { __html: newStr };
            return <span className="hover-span" dangerouslySetInnerHTML={html}></span>
        } else {
            return <span>{e}</span>
        }
    }


    render() {
        let { data, placeHode, searchValue, close_flag, showLoading } = this.state;
        return (
            <Row className="search-list-wraper">
                <Col md={8} sm={8} className="">
                    <div className="clearfix hearder">
                        <span className="pull-left title"> 服务发现</span>
                        <div className="search-wraper pull-left">
                            <InputGroup simple className="input-wraper">
                                <FormControl className="input-search" value={searchValue} placeholder="请输入搜索内容" type="text" onKeyDown={this.handleSearchKeyDown} onChange={this.handleChange} />
                                {
                                    close_flag ? <InputGroup.Button shape="border" className="border-close-wraper" onClick={this.handleClickClose}>
                                        <span className="cl cl-close-c curpoint"> </span>
                                    </InputGroup.Button> : ""
                                }

                                <InputGroup.Button shape="border" onClick={this.handleClick}>
                                    <span className="uf uf-search curpoint"> </span>
                                </InputGroup.Button>
                            </InputGroup>
                        </div>
                    </div>
                    {
                        data.length > 0 ? (
                            data.map((item, index) => {
                                return (
                                    <div className="info clearfix">
                                        <div className="title clearfix">
                                            <Col md={3} className="font-style">
                                                <div>
                                                    <div className="serviceName">
                                                        <OverlayTrigger overlay={toolTipData(item.name)} placement="bottom">
                                                            <span onClick={this.goDetails(item.serviceName, item.id, searchValue)}>{this.changeText(item.name)}</span>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={1} className="font-style">
                                                <div>
                                                    {item.auth == "public" ? <span className="public"> 公有</span> :
                                                        <span className="private"> 私有</span>}
                                                </div>
                                            </Col>

                                            <Col md={3} className="font-style">
                                                <div>
                                                    {item.serviceName}
                                                </div>
                                            </Col>
                                            <Col md={5} className="font-style provider">
                                                <div> 提供者: {validataString(item.provider)} </div>
                                            </Col>
                                        </div>
                                        <Col md={12} className="info-detail">
                                            <div>
                                                {item.note ? item.note : ""}
                                            </div>
                                        </Col>
                                    </div>

                                )
                            })

                        ) : <NoData />
                    }

                </Col>

                <Col md={4} sm={4}>
                    <h3 className="tuijian clearfix">
                        <span className="pull-left tujian-content-border"> </span>
                        <span className="pull-left margin-left-20">推荐查询</span>
                    </h3>
                </Col>

                <Col md={12}>
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
                    loadingType="line"
                    showBackDrop={true}
                    show={this.state.showLoading}
                />
            </Row>
        )
    }
}

SearchList.contextTypes = {
    router: PropTypes.object
}

export default SearchList;
