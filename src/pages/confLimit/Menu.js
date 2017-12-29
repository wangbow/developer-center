import React, {Component} from 'react'

import {Panel, Table} from 'tinper-bee'



class ListMenu extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            current: '1',
            openKeys: []
        };
        this.columns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }];
    }

    /**
     * 渲染头部
     * @returns {XML}
     */
    renderHeader = () => {
        return (
            <div>
                <span>应用</span>
            </div>
        )
    }


    render() {
        const {data, onSelect, children} = this.props;
        return (
            <Panel className='menuTree-list' header={this.renderHeader()}>
                <Table
                    data={ data }
                    columns={ this.columns}
                    onRowClick={ onSelect }
                />
                {
                    children
                }
            </Panel>

        )
    }
}
export default ListMenu;
