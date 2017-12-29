import React, {Component} from 'react';
import ListMenu from './Menu'
import {Row, Col, FormControl, InputGroup, Button, Icon, Message, Pagination} from 'tinper-bee'
import DisplayCard from './DisplayCard'
import Title from '../../components/Title';

import {GetUser, InviteUser, DelteUser, GetMenuList} from '../../serves/limitManager';

import styles from './index.css';


class MainPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
            userData: [],
            menucode: '',
            activePage: 1,
            page: 1,
            key: 0
        };

    }

    componentDidMount() {
        const self = this;

        //获取菜单列表
        GetMenuList(function (response) {
            if (!response.data.error_code) {
                self.setState({
                    data: response.data.data
                });
                if (!response.data.data) return;
                let menucode = response.data.data[0] ? response.data.data[0].code : "";

                //获取列表后，获取第一个菜单的用户作为默认显示
                GetUser({
                    "key": "",
                    "pageIndex": 0,
                    "pageSize": 10,
                    "rescode": "test",
                    "category": menucode
                }, function (res) {
                    if (res.data.status !== 0) {
                        self.setState({
                            userData: res.data.data.content,
                            menucode: menucode,
                            page: res.data.data.totalPages,
                        });
                    } else {
                        Message.create({content: res.data.error_message, color: 'danger', duration: null});
                    }
                })

            } else {
              if(/Subject does not have/.test(response.data.error_message)){
                Message.create({content: '没有访问权限', color: 'danger', duration: null})
              }else{
                Message.create({content: response.data.error_message, color: 'danger', duration: null})
              }

            }


        });


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
    handleItemClick = (key) => {

        const self = this;
        let code = this.state.data[key].code;

        //获取用户
        GetUser({"key": "", "pageIndex": 0, "pageSize": 10, "rescode": code, "category": "menu"}, function (res) {
            if (res.data.status !== 0) {
                self.setState({
                    userData: res.data.data.content,
                    menucode: code,
                    key: key,
                    page: res.data.data.totalPages,
                });
            } else {
                Message.create({content: res.data.error_message, color: 'danger', duration: null});
            }
        })

    }

    /**
     * 添加事件
     * @param info 信息
     * @param ids 用户id集合
     */
    handleAdd = (info, ids) => {
        const self = this;

        let param = {
            users: ids,
            menucodes: [this.state.menucode],
            invitation: info
        };

        //邀请用户
        InviteUser(param, function (res) {
            if (res.data.status !== "0") {
                self.handleItemClick(self.state.key);

            } else {
                Message.create({content: res.data.error_message, color: 'danger', duration: null});
            }
        })
    }

    /**
     * 删除用户
     * @param index 删除用户的索引
     */
    handleDelete = (index) => {
        let data = this.state.userData, usercode;
        const self = this;

        if (data[index]) {
            usercode = data[index].userCode;
        }

        //删除用户
        DelteUser(`?usercode=${usercode}&rescode=${this.state.menucode}`, function (res) {
            if (res.data.status !== 0) {
                data.splice(index, 1);
                self.setState({
                    userData: data
                });
            } else {
                Message.create({content: res.data.error_message, color: 'danger', duration: null});
            }
        });
    }

    /**
     * 菜单点击事件，渲染右侧用户表
     * @param eventKey
     */
    handleSelect = (eventKey) => {
        const self = this;
        this.setState({
            activePage: eventKey
        });
        GetUser({
            "key": "",
            "pageIndex": eventKey - 1,
            "pageSize": 10,
            "rescode": this.state.menucode,
            "category": 'menu'
        }, function (res) {
            if (res.data.status !== 0) {
                self.setState({
                    userData: res.data.data.content
                });
            } else {
                Message.create({content: res.data.error_message, color: 'danger', duration: null});
            }
        })
    }

    /**
     * 搜索事件
     * @param e
     */
    handleSearch = (e) => {
        const self = this;
        let searchValue = ReactDOM.findDOMNode(this.refs.searchKey).value;

        //获取用户
        GetUser({
            "key": searchValue,
            "pageIndex": 0,
            "pageSize": 10,
            "rescode": this.state.menucode,
            "category": 'menu'
        }, function (res) {
            if (res.data.status !== 0) {
                self.setState({
                    userData: res.data.data.content,
                    page: res.data.data.totalPages,
                });
            } else {
                Message.create({content: res.data.error_message, color: 'danger', duration: null});
            }
        })
    }


    render() {

        return (
            <Row>
                <Title name="权限管理" showBack={false}/>
                <Col md={12}>
                    <Col md={12}>
                        <InputGroup simple style={{margin: "10px 0", float: 'right'}}>
                            <FormControl ref="searchKey" placeholder="请输入用户名称" style={{width: 290}} type="text"/>
                            <InputGroup.Button shape="border" onClick={this.handleSearch}>
                                <span className="uf uf-search" style={{cursor: "pointer"}}> </span>
                            </InputGroup.Button>
                        </InputGroup>
                    </Col>

                    <Col md={4} className="media-margin-top-50">
                        <ListMenu onSelect={this.handleItemClick} data={this.state.data}/>
                    </Col>
                    <Col md={8}>
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
                                        onSelect={this.handleSelect.bind(this)}/>
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
