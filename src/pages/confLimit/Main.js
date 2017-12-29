import React, {Component} from 'react';
import ListMenu from './Menu'
import {Row, Col, FormControl, InputGroup, Button, Icon, Message, Pagination} from 'tinper-bee'
import DisplayCard from './DisplayCard'
import Title from '../../components/Title';

import { getApp, getUsers, deleteAuth, assignAuth, searchUsers } from '../../serves/confLimit';

import './index.css';


class MainPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            appList: [],
            selectedApp: {},
            appPage: 1,
            appActivePage: 1,
            userData: [],
            activePage: 1,
            page: 1,
            res: {}
        };

    }

    componentDidMount() {
        this.getApps();
    }

    getApps = (param = '') => {
        getApp(`?pageIndex=0&pageSize=10${param}`).then((res) => {
            if(res.data.success == 'true'){
                let data = res.data.page.result;
                data.forEach((item, index) => {
                    item.key = index;
                })
                this.setState({
                    appList: data,
                    selectedApp: data[0]
                });
                if(data[0]){
                    this.getUser(data[0].id);
                }

            }else{
                Message.create({
                    content: res.data.message,
                    color: 'danger',
                    duration: null
                })
            }
        })
    }

    getUser = (resId = '') => {

        //获取用户
        getUsers(`?resId=${resId}&busiCode=confCenter`).then((res) => {

            if (res.data.flag === 'success') {

                this.setState({
                    res: res.data.data.groups[0],
                    userData: res.data.data.resources,
                });
            } else {
                Message.create({
                    content: res.data.message,
                    color: 'danger',
                    duration: null
                });
            }
        })
    }

    /**
     * 返回
     */
    handleBack = () => {
        history.go(-1);
    }

    /**
     * 菜单子项点击事件
     * @param key
     */
    handleItemClick = (record, index) => {
       this.getUser(record.id);
        this.setState({
            selectedApp: record
        })
    }

    /**
     * 添加事件
     * @param info 信息
     * @param ids 用户id集合
     * @param role
     */
    handleAdd = (info, ids, role) => {
        let { selectedApp, res } = this.state;
        let idAry = [], nameAry = [];
        ids.forEach((item) => {
            idAry.push(item.userid);
            nameAry.push(item.username)
        })
        let param = {
            userId: idAry.join(','),
            userName: nameAry.join(','),
            providerId: selectedApp.providerId,
            daRole: role,
            resId: selectedApp.resId,
            busiCode: 'confCenter',
            isGroup: "N",
            createUserId: selectedApp.userId
        };


        //邀请用户
        assignAuth(param,(res) => {
            if (!res.data.error_code) {
                this.getUser(selectedApp.id);
                //this.handleItemClick(self.state.key);
                Message.create({
                    content: '授权成功',
                    color: 'success',
                    duration: 1.5
                });
            } else {
                Message.create({
                    content: res.data.error_message,
                    color: 'danger',
                    duration: null
                });
            }
        })
    }

    /**
     * 删除用户
     * @param index 删除用户的索引
     */
    handleDelete = (record) => {
        let { selectedApp } = this.state;
        return () => {
            //删除用户
            deleteAuth(`?userId=${record.id}&resId=${selectedApp.id}`).then((res) => {
                if (!res.data.error_code) {
                    this.getUser(selectedApp.id);
                    Message.create({
                        content: '删除成功',
                        color: 'success',
                        duration: 1.5
                    });
                } else {
                    Message.create({
                        content: res.data.error_message,
                        color: 'danger',
                        duration: null
                    });
                }
            });
        }

    }

    handleAppSearch = (e) => {
        this.getApps(`&name=${e.target.value}`);
    }

    /**
     * 搜索事件
     * @param e
     */
    handleSearch = (e) => {
        //获取用户
        // searchUsers({
        //     "key": 'invitation',
        //     "pageIndex": 0,
        //     "pageSize": 10,
        //     "rescode": this.state.menucode,
        //     "category": 'menu'
        // }, (res) => {
        //     if (res.data.status !== 0) {
        //         this.setState({
        //             userData: res.data.data.content,
        //             page: res.data.data.totalPages,
        //         });
        //     } else {
        //         Message.create({
        //             content: res.data.error_message,
        //             color: 'danger',
        //             duration: null
        //         });
        //     }
        // })
    }

    handleSelect = (eventKey) => {
        this.setState({
            activePage: eventKey
        });

    }

    render() {

        return (
            <Row>
                <Title name="配置中心权限管理" showBack={false}/>
                <Col md={12}>
                    <Col md={12}>
                        <InputGroup simple style={{margin: "10px 0", float: 'left'}}>
                            <FormControl onChange={ this.handleAppSearch } placeholder="请输入应用名称" style={{width: 290}} type="text"/>
                            <InputGroup.Button shape="border">
                                <span className="uf uf-search" style={{cursor: "pointer"}}> </span>
                            </InputGroup.Button>
                        </InputGroup>
                        <InputGroup simple style={{margin: "10px 0", float: 'right'}}>
                            <FormControl
                                ref="searchKey"
                                placeholder="请输入用户名称"
                                style={{width: 290}}
                                type="text"
                            />
                            <InputGroup.Button shape="border" onClick={this.handleSearch}>
                                <span className="uf uf-search" style={{cursor: "pointer"}}> </span>
                            </InputGroup.Button>
                        </InputGroup>
                    </Col>

                    <Col md={5}>
                        <ListMenu onSelect={this.handleItemClick} data={this.state.appList}>
                            {
                                this.state.appPage <= 1 ? "" : (
                                    <Pagination
                                        first
                                        last
                                        prev
                                        next
                                        items={this.state.appPage}
                                        maxButtons={5}
                                        activePage={this.state.appActivePage}
                                        onSelect={this.handleSelect}/>
                                )
                            }
                        </ListMenu>
                    </Col>
                    <Col md={7}>

                        <DisplayCard data={this.state.userData} onDelete={this.handleDelete} onAdd={this.handleAdd}>
                            {
                                this.state.page <= 1 ? "" : (
                                    <Pagination
                                        first
                                        last
                                        prev
                                        next
                                        items={this.state.page}
                                        maxButtons={5}
                                        activePage={this.state.activePage}
                                        onSelect={this.handleSelect}/>
                                )
                            }
                        </DisplayCard>
                    </Col>
                </Col>
            </Row>
        )
    }
}
export default MainPage;
