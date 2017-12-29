import React, {Component, PropTypes} from 'react'
import {Panel, Icon, Popconfirm} from 'tinper-bee'

const propTypes = {
    title: PropTypes.string,
    control: PropTypes.bool
}

const defaultProps = {
    control: true
}

class ControlHeader extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
    }

    /**
     * 编辑事件
     */
    handleEdit() {
        const {onEdit, id} = this.props;
        onEdit && onEdit(id);
    }

    /**
     * 删除事件
     */
    handleDelete() {
        const {onDelete, id} = this.props;
        onDelete && onDelete(id);
    }

    /**
     * 渲染头部
     * @returns {XML}
     */
    renderHeader() {
        const {title, control} = this.props;
        let newTitle;
        if (title === 1) {
            newTitle = "创建菜单"
        } else if (title === 2) {
            newTitle = "编辑菜单"
        } else {
            newTitle = title;
        }

        return (
            <span>
                { typeof(newTitle) === "undefined" ? "暂时还没有数据" : newTitle}
                {control && (
                    <div style={{position: "absolute", right: 20, top: 10, fontSize: 20}}>
                        <Icon type='uf-pencil' onClick={this.handleEdit} style={{cursor: "pointer"}}/>
                        <Popconfirm content="确认删除?" placement="bottom" id='aa' onClose={this.handleDelete}>
                            <Icon type="uf-del" style={{cursor: "pointer"}}/>
                        </Popconfirm>
                    </div>
                )}
            </span>
        )
    }

    render() {
        const {children} = this.props;
        return (
            <Panel header={this.renderHeader()}>
                { children }
            </Panel>
        )
    }
}

ControlHeader.propTypes = propTypes;
ControlHeader.defaultProps = defaultProps;

export default ControlHeader;
