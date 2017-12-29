import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Modal, Button, Switch } from 'tinper-bee';

class SwitchConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            userPriviledge: "",
            checked: props.checked
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked
        })

    }

    /**
     * 关闭模态框
     */
    close() {
        this.setState({
            showModal: false
        });
    }

 
    onConfirm() {
        const { onChangeHandler, metaId, resId, defaultIndex } = this.props;
        let { userPriviledge } = this.state;
        if (userPriviledge == "private") {
            userPriviledge = "public";
        } else {
            userPriviledge = "private";
        }
        if (onChangeHandler) {
            onChangeHandler(metaId, resId, userPriviledge, defaultIndex);
        }
        this.setState({
            showModal: false
        });
    }
    
    open = (checked) => (e) => {
        let userPriviledge;
        if (checked) {
            userPriviledge = "private";
        } else {
            userPriviledge = "public";
        }
        this.setState({
            showModal: true,
            userPriviledge: userPriviledge
        });
    }
    render() {
        let { userPriviledge, checked } = this.state;
        return (
            <span className="delete-key-modal">
                <span className="switch">
                    <span className="delete-key-modal">
                        <div>
                            <span
                                onClick={this.open(checked)}
                                className={classnames({ 'u-switch': true, 'is-checked': checked })}
                                tabIndex="0">

                            </span>
                        </div>
                    </span>
                </span>
                <Modal
                    show={this.state.showModal}
                    onHide={this.close} className="mrp-add">
                    <Modal.Header>
                        <Modal.Title>修改权限</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                          userPriviledge == "public" ? <span> 私有权限接口调用需要主动授权，确认将接口设置为私有权限？ </span>
                          :<span> 公有权限接口调用需要主动授权，确认将接口设置为公有权限？ </span>
                        }
                  </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close} shape="border" className="margin-right-30">取消</Button>
                        <Button onClick={this.onConfirm} colors="primary">确认</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        )
    }
}

export default SwitchConfirm;
