import React, {Component} from 'react'

import {Navbar, Panel, Icon} from 'tinper-bee'

const Menu = Navbar.Menu;
const SubMenu = Menu.SubMenu;


class ListMenu extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            current: '1',
            openKeys: []
        };
    }

    /**
     * 子菜单点击事件
     * @param e
     */
    handleClick = (e) => {
        const {onSelect} = this.props;
        this.setState({current: e.key});
        onSelect(e.key);
    }

    /**
     * 处理手风琴效果及点击虚菜单的右侧显示内容
     */
    onOpenChange = (openKeys) => {
        const state = this.state;
        const {onSelect} = this.props;

        const latestOpenKey = this.myfilter(openKeys, state.openKeys);
        const latestCloseKey = this.myfilter(state.openKeys, openKeys);

        let key = latestOpenKey;
        if (this.state.openKeys.length > openKeys.length) {
            key = latestCloseKey;
        }

        onSelect(key);
        this.setState({
            current: key,
            openKeys: openKeys
        });
    }

    /**
     * 对菜单的数据进行过滤
     * @param arr1
     * @param arr2
     * @returns {*}
     */
    myfilter = (arr1, arr2) => {
        if (arr2.length === 0 || !arr2) {
            return arr1[0];
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i].toString()) === -1) {
                return arr1[i];
            }
        }
        return false;
    }

    /**
     * 获取多层嵌套层级关系
     * @param key
     * @returns {*|Array}
     */
    getAncestorKeys = (key) => {
        let map = {};
        const {data} = this.props;
        data.forEach(function (item, index, array) {
            if (item.parent && item.isvirmenu) {
                let parentIndex = "";
                array.forEach(function (item1, index1) {
                    if (item1.code === item.parent) {
                        parentIndex = index1;
                    }
                });
                map[index] = [parentIndex.toString()];
            }
        });
        for (let key in map) {
            for (let key2 in map) {
                if (map[key][0] === key2) {
                    map[key] = map[key].concat(map[key2]);
                }
            }
        }
        return map[key] || [];
    }

    /**
     * 渲染头部
     * @returns {XML}
     */
    renderHeader = () => {
        const {onAdd} = this.props;
        return (
            <div>
                <span>菜单</span>
                <Icon style={{position: 'absolute', right: 10, cursor: "pointer"}} onClick={ onAdd } type='uf-plus'/>
            </div>
        )
    }

    /**
     * 虚菜单添加子菜单事件
     * @param parent
     * @returns {Function}
     */
    handleSubMenuAdd = (parent) => {
        const {onSubMenuAdd} = this.props;

        return function (event) {
            event.stopPropagation();
            onSubMenuAdd(parent);
        }
    }

    /**
     * 渲染多级菜单
     * @param array
     * @param parentName
     * @param mapIndex
     */
    renderSubItem = (array, parentName, mapIndex) => {
        const self = this;

        const itemArray = array.map(function (item, index, array) {
            if (item.parent === parentName) {
                if (item.isvirmenu) {
                    return (
                        <SubMenu key={index} title={<span>{item.name}<Icon
                            style={{position: 'absolute', right: 30, cursor: "pointer"}}
                            onClick={ self.handleSubMenuAdd(item.code) } type='uf-plus'
                            className={ self.state.current === index ? "submenu-selected" : "" }/></span>}>
                            {
                                self.renderSubItem(array, item.code)
                            }
                        </SubMenu>
                    )
                }
                return (
                    <Menu.Item key={ index }>{ item.name }</Menu.Item>
                )
            }
        }).filter(function (item, index) {
            return item !== undefined;
        });
        return itemArray;
    }

    /**
     * 渲染一级菜单
     * @param data
     */
    renderItem = (data) => {
        const self = this;
        if (data && data !== []) {
            return data.map(function (item, index, array) {
                if (!item.parent) {
                    if (item.isvirmenu) {
                        return (
                            <SubMenu key={index} title={<span>{item.name}<Icon
                                style={{position: 'absolute', right: 30, cursor: "pointer"}}
                                onClick={ self.handleSubMenuAdd(item.code) } type='uf-plus'
                                className={ self.state.current === index ? "submenu-selected" : "" }/></span>}>
                                {
                                    self.renderSubItem(array, item.code, index)
                                }
                            </SubMenu>
                        );
                    } else {
                        return (
                            <Menu.Item key={ index }>{ item.name }</Menu.Item>
                        )
                    }
                }
            })
        }
    }

    render() {
        const { data } = this.props;
        return (
            <Panel className='menuTree-list' header={this.renderHeader()}>
                <Menu mode="inline" selectedKeys={[this.state.current]} style={{width: '100%'}}
                      onOpenChange={this.onOpenChange.bind(this)} onClick={this.handleClick} className="menu-control">
                    {
                        this.renderItem(data)
                    }
                </Menu>
            </Panel>

        )
    }
}
export default ListMenu;
