import React, {Component} from 'react';
import ListMenu from './Menu'
import {Row, Col, FormControl, InputGroup, Button, Icon, Message} from 'tinper-bee'
import DisplayCard from './DisplayCard'
import EditMenu from './EditMenu'
import ControlHeader from './ControlHeader'
import {GetMenuList, AddMenu, EditMenuInfo, DeleteMenu, SearchMenu} from '../../serves/menuTreeServe'

import styles from './index.css';
import NoData from './noData';
import Title from '../../components/Title';

class MainPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            DisplayCardData: {},
            data: [],
            edit: false,
            add: false,
            parent: null,
            title: 0,
            showNoData: false
        };
    }

    componentDidMount() {
        const self = this;
        //获取菜单列表
        GetMenuList(function (response) {
            if (!response.data.error_code) {
                self.setState({
                    data: response.data.data,
                    DisplayCardData: response.data.data[0]
                })
            } else {
              if(/Subject does not have/.test(response.data.error_message)){
                Message.create({content: '没有访问权限', color: 'danger', duration: null})
              }else{
                Message.create({content: response.data.error_message, color: 'danger', duration: null})
              }
                self.setState({
                    showNoData: true
                })
            }
        });
    }

    /**
     * 返回按钮事件
     */
    handleBack = () => {
        history.go(-1);
    }

    /**
     * 菜单子项点击事件，切换右侧面板数据
     * @param key 菜单的key值
     */
    handleItemClick = (key) => {
        this.setState({
            DisplayCardData: this.state.data[key],
            edit: false
        })
    }

    /**
     * 编辑按钮点击事件
     * @param id
     */
    handleEdit = (id) => {
        this.setState({
            edit: true,
            title: 2
        })
    }

    /**
     * 编辑确认保存
     * @param data 保存的数据
     */
    handleEditEnsure = (data) => {
        const self = this;
        const oldData = this.state.data;
        const newData = JSON.stringify(data);
        EditMenuInfo(newData, function (response) {

            if (response.data.status !== 0) {
                oldData.forEach(function (item, index) {
                    if (item.id === data.id) {
                        oldData[index] = data;
                    }
                })
                self.setState({
                    data: oldData,
                    edit: false,
                    DisplayCardData: data
                })

            } else {
                Message.create({content: '编辑失败', color: 'danger', duration: null})
            }
        })
        this.handleCancel();
    }

    /**
     * 菜单的添加事件
     */
    handleAdd = () => {
        this.setState({
            edit: true,
            add: true,
            DisplayCardData: {},
            parent: null,
            title: 1
        })
    }

    /**
     * 虚菜单添加事件
     * @param parent
     */
    handleSubMenuAdd = (parent) => {
        this.setState({
            edit: true,
            add: true,
            parent: parent,
            title: 1
        })
    }

    /**
     * 添加确认事件
     * @param data 添加的数据
     */
    handleAddEnsure = (data) => {
        const self = this;
        const oldData = this.state.data;
        delete data.id;


        AddMenu(JSON.stringify(data), function (response) {
            if (response.data.status !== 0) {
                oldData.push(data);
                self.setState({
                    data: oldData,
                    edit: false,
                    add: false,
                    parent: null,
                    DisplayCardData: data
                })
            } else {
                Message.create({content: '添加失败', color: 'danger', duration: 1})
            }
        })
        this.handleCancel();
    }

    /**
     * 取消按钮事件
     */
    handleCancel = () => {
        this.setState({
            edit: false,
            add: false,
            parent: null,
            title: 0
        })
    }

    /**
     * 删除事件
     * @param id 删除菜单的id
     */
    handleDelete = (id) => {

        const cotroldata = this.state.data;
        const self = this;
        let flag = false;
        cotroldata.forEach(function (item, index) {
            if (item.parent === id) {
                flag = true;
            }
        })
        if (flag) {
            Message.create({content: '请先删除子项', color: 'warning', duration: 1})
        } else {
            DeleteMenu(`?code=${id}`, function (response) {
                if (response.data.status !== 0) {
                    let newData = cotroldata.filter(function (item) {
                        return item.code !== id;
                    });

                    self.setState({
                        data: newData,
                        DisplayCardData: newData[0]
                    });
                } else {
                    if (response.data.status === 0) {
                        Message.create({content: response.data.message, color: 'danger', duration: 1})
                    } else {
                        Message.create({content: '删除失败', color: 'danger', duration: 1})
                    }


                }
            })
        }

    }

    /**
     * 搜索事件
     * @param e
     */
    handleSearch = (e) => {
        const self = this;
        let searchValue = ReactDOM.findDOMNode(this.refs.searchKey).value;
        SearchMenu(searchValue, function (response) {
            if (response.data.status === 0) {
                self.setState({
                    DisplayCardData: "",
                    data: ""
                })
            } else {
                self.setState({
                    DisplayCardData: response.data.data[0],
                    data: response.data.data
                })
            }
        });
        this.handleCancel();
    }

    render() {
        return (
            <Row>
                <Title name="菜单管理" showBack={false}/>
                <Col md={12}>
                    <Col md={12}>
                        <InputGroup simple style={{margin: "10px 0", float: 'right'}}>
                            <FormControl ref="searchKey" placeholder="请输入菜单名称" style={{width: 290}} type="text"/>
                            <InputGroup.Button shape="border" onClick={ this.handleSearch }>
                                <span className="uf uf-search" style={{cursor: "pointer"}}> </span>
                            </InputGroup.Button>
                        </InputGroup>
                    </Col>
                    {
                        this.state.showNoData
                            ? (
                            NoData()
                        ) : (
                            <Row>
                                <Col md={4} className="media-margin-top-50">
                                    <ListMenu onSelect={ this.handleItemClick } data={this.state.data}
                                              onAdd={ this.handleAdd } onSubMenuAdd={ this.handleSubMenuAdd }/>
                                </Col>
                                <Col md={8}>
                                    <ControlHeader
                                        title={this.state.title === 1 || this.state.title === 2 ? this.state.title : this.state.DisplayCardData.name}
                                        onEdit={ this.handleEdit} control={ !this.state.edit }
                                        onDelete={this.handleDelete} id={this.state.DisplayCardData.code}>
                                        {this.state.edit
                                            ? (<EditMenu
                                                data={ this.state.add ? {} : this.state.DisplayCardData }
                                                onEnsure={ this.state.add ? this.handleAddEnsure : this.handleEditEnsure }
                                                parent={ this.state.parent }
                                                isAdd={ this.state.add }
                                                onCancel={ this.handleCancel }/>)
                                            : DisplayCard(this.state.DisplayCardData)}
                                    </ControlHeader>
                                </Col>
                            </Row>
                        )
                    }

                </Col>
            </Row>
        )
    }
}
export default MainPage;
