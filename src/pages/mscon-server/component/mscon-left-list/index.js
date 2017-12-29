import React, { Component, PropTypes } from 'react';
import { Row, Col, Tooltip, Switch, Button, Select, Table, Message, Popconfirm, Icon, FormControl, InputGroup } from 'tinper-bee';
import classnames from 'classnames';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import './index.less';
import { searchLink } from 'serves/microServe';

class ServerLeftList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSource,
            addActive: this.props.addActive
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            dataSource: props.dataSource,
            addActive: props.addActive
        });
    }
    /**
     * 调用父组件的getFirst方法
     */
    getValue = (item, index, id) => {
        const { getFirst } = this.props;
        if (getFirst) {
            getFirst(item, index, id);
        }
    }
    /**
     * 点击接口名
     */
    leftHandleClick = (item, index, id) => (e) => {
        this.getValue(item, index, id)
    }
    /**
     * 只显示接口名称，隐藏包名
     * 或者是显示中文的部分名称，鼠标hover的时候显示全部
     */
    showIntefaceName=(data)=>{
        let name;
        let interfaceName;
        let desc = data.desc;
        if(desc!="null"&&desc!=null&&desc!=undefined&&desc.length>0){
            name = desc;
        }else{
            name = data.name;
        }
        let arr = name.split(".");
        if(arr&&Array.isArray(arr)){
            interfaceName = arr[arr.length-1];
        }
        return interfaceName;
    }

    /**
     * 鼠标hover接口的时候，显示完整的包名和接口名
     */
    toolTipData = (data) =>{
        let desc = data.desc;
        let name;
        if(desc!="null"&&desc!=null&&desc!=undefined&&desc.length>0){
            name = desc;
        }else{
            name = data.name;
        }
        return  (<Tooltip inverse id="toolTipId">
                    <span>{name}</span>
                </Tooltip>
                )
    }
    /**
     * 显示名称
     */

    showName = (data) =>{
        let desc = data.desc;
        let note = data.note;
        let name = data.name;
        if(desc!="null"&&desc!=null&&desc!=undefined&&desc.length>0){
            name = desc;
        }else if(note!="null"&&desc!=null&&note!=undefined&&note.length>0){
            name = note;
        }
        return name;
    }


    render() {
        let { dataSource, addActive } = this.state;
        let self = this;
       
        return (
            <Row className="tableListWrap">
                <Col md={12} sm={12} className={classnames({
                    'bgColorSyle': true,
                    'padding-hor': true
                })} >
                    {
                        self.props.children ? (<div>{self.props.children}</div>) : ""
                    }

                    {

                        dataSource ? (dataSource.map(function (item, index) {
                            return (
                                parseInt(addActive) == index ? (
                                    <div className="margin-top-10 clearfix activeColor curpoint padding-vertical-3" onClick={self.leftHandleClick(item.name, index, item.id)} >
                                        <Col md={3} sm={3} xs={4}> <i className="cl cl-file-o"></i> </Col>
                                        <Col md={9} sm={9} xs={8}>
                                            {self.props.children ? <span className="font-style">{self.showName(item)}</span> : (<OverlayTrigger overlay={self.toolTipData(item)} placement="bottom">
                                                <div className="font-style">{self.showIntefaceName(item)}</div>
                                            </OverlayTrigger>)}
                                        </Col>
                                    </div>
                                ) : (
                                        <div className="margin-top-10 clearfix curpoint padding-vertical-3" onClick={self.leftHandleClick(item.name, index, item.id)} >
                                            <Col md={3} sm={3} xs={4}> <i className="cl cl-file-o"></i> </Col>
                                            <Col md={9} sm={9} xs={8}>
                                                {self.props.children ? <span className="font-style">{self.showName(item)}</span> : (<OverlayTrigger overlay={self.toolTipData(item)} placement="bottom">
                                                    <div className="font-style">{self.showIntefaceName(item)}</div>
                                                </OverlayTrigger>)}
                                            </Col>
                                        </div>
                                    )

                            )
                        })) : <h3 className="text-center">no data</h3>

                    }

                </Col>
            </Row>
        )
    }
}

export default ServerLeftList;
