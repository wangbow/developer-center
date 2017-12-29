import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Row, Col, Button, Select, Table, Message, Popconfirm, Icon, FormControl, InputGroup } from 'tinper-bee';
import { Link } from 'react-router';
import classnames from 'classnames';
import './index.less';
import ScrollableInkTabBar from 'bee-tabs/build/ScrollableInkTabBar';
import { searchLink } from 'serves/microServe';
import TabContent from 'bee-tabs/build/TabContent';



class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            searchValue : "",
            close_flag:false
        }
    }
    /**
     * 搜索框的输入事件
     */
    handleChange = (e) =>{
        let inputValue = e.target.value;
        console.log(inputValue);
        if(inputValue!=""){
            this.setState({
                searchValue:inputValue,
                close_flag:true
            })
        }else{
            this.setState({
                searchValue:"",
                close_flag:false
            })
        }
    }
    /**
     * 搜索框的搜索事件
     */
    handleClick = (e) => {
        let {searchValue} = this.state; 
        this.goList(searchValue);
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
    handleClickClose =(e) => {
        this.setState({
            searchValue:"",
            close_flag:false
        })
    } 

    /**
     * 通过路由跳到搜索列表页
     */
    goList = (searchName) => {
        this.context.router.push(`/searchList?searchName=${searchName}`);
    }

    render() {
        let {searchValue,close_flag} = this.state;
        return (
            <Row>
                <div className="search-form">
                    <div className="search-hearder">
                        <h1 className="text-center"> 服务发现 </h1>
                        <h3 className="text-center"> 在这里,尝试发现开发者中心更多的便捷服务</h3>

                        <div className="search-wraper">
                            <InputGroup simple className="input-wraper">
                                <FormControl  className="input-search" value={searchValue} placeholder="请输入搜索内容" type="text" onKeyDown={this.handleSearchKeyDown} onChange ={this.handleChange}/>
                                {
                                    close_flag ?  <InputGroup.Button shape="border" className="border-close-wraper" onClick={this.handleClickClose}>
                                                    <span className="cl cl-close-c curpoint"> </span>
                                                </InputGroup.Button>:""
                                }
                               
                                 <InputGroup.Button shape="border" onClick={this.handleClick}>
                                    <span className="uf uf-search curpoint"> </span>
                                </InputGroup.Button>    
                            </InputGroup>
                        </div>
                    </div>

                </div>
            </Row>
        )
    }
}

MainPage.contextTypes = {
    router: PropTypes.object
}

export default MainPage;
