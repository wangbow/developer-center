import React, {Component, PropTypes} from 'react';
import {ReactDom}from 'react-dom';
import {Switch, Row, Col, InputGroup, FormControl, FormGroup, Label, Button, Message, Form} from 'tinper-bee';
import {OpenAutoScale, CloseAutoScale, GetAutoScale}from 'serves/appTile';
import { err, warn, success } from 'components/message-util';
import ErrorModal from 'components/ErrorModal';
import {clone, lintAppListData} from 'components/util';
import {onlyNumber} from 'lib/verification';
import classnames from 'classnames';

import '../index.css';

export default class AutoScale  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            max_instances: '',
            min_instances: 1,
            interval: 60,
            target_rps: 1000,
            checked: true,
            isShowDelAutoScale:false,
            hasData: false
        }
    }
    componentDidMount() {
        this.getAutoScale();
    }

    handleInputChange = (state) => (e) => {
        let num = e.target.value;
        this.setState({
            [state]: num
        });
    }

    changeHandle = () => {
        let self = this;
        if(self.state.checked){
            if(self.state.hasData) {
                self.setState({
                    checked: false,
                    isShowDelAutoScale: true
                })
            }else{
                self.setState({
                    checked: false
                })
            }
        }else{
            self.setState({
                checked:true
            })
        }
    }

    /**
     * 保存自动扩缩设置
     */
    handleSaveClick = () => {
        let self = this;
        let app_id = self.props.appId;
        let max_instance = self.state.max_instances;
        if (max_instance === "") {
           warn("请输入最大实例数！");
            return;
        }
            //let data = {
            //    'max_instances': Number(max_instance),
            //    'min_instances': self.state.min_instances,
            //    'interval': self.state.interval,
            //    'target_rps': self.state.target_rps
            //}
            let formData = new FormData();
            formData.append('max_instances', Number(max_instance));
            formData.append('min_instances', self.state.min_instances);
            formData.append('interval', self.state.interval);
            formData.append('target_rps', self.state.target_rps);

            OpenAutoScale(app_id, formData, (res) => {
                if (res.status === 200) {
                    if (res.data.error_code) {
                        Message.create({content: res.data.error_message, color: 'danger', duration: 4.5});
                    } else {
                        Message.create({content: '自动扩缩设置成功', color: 'success', duration: 1.5});
                       // this.getAutoScale();
                        self.setState({
                            hasData:true
                        })
                    }
                } else {
                    Message.create({content: res.statusText, color: 'danger', duration: 4.5});
                }
            })

        }


    handleClose = () => {
        this.setState({
            isShowDelAutoScale: false,
            checked:true
        });
    }
    /**
     * 确认删除自动扩缩
     */
    deleteConfirm  = () => {
        let self = this;
        let app_id = this.props.appId;
        self.setState({
            isShowDelAutoScale: false,
        })
        CloseAutoScale(app_id,function(res){
            if (res.status === 200) {
                if (res.data.error_code) {
                    Message.create({content: res.data.error_message, color: 'danger', duration: 4.5});
                } else {
                    Message.create({content: '自动扩缩删除成功', color: 'success', duration: 1.5});
                    self.setState({
                        hasData: false
                    })
                }
            } else {
                Message.create({content: "请求不成功", color: 'danger', duration: 4.5});
                self.setState({
                    checked:true
                })
            }
        })
    }
    /**
     * 获取自动扩缩数据
     */
    getAutoScale = () =>{
        let self = this;
        let app_id = self.props.appId;
        GetAutoScale(app_id, function(res){
            let data = lintAppListData(res);
            if(data === null){
               return;
            }else if (!data.error_code) {
                self.setState({
                    hasData: true,
                    max_instances: data.max_instances,
                    min_instances: data.min_instances,
                    interval: data.interval,
                    target_rps: data.target_rps,
                })
            }else{
                Message.create({content: res.data.error_message, color: 'danger', duration: 4.5});
            }
        })
    }

    render() {
        return (
            <Form className="app-auto-scale">
                <Row className="switch">
                    <span
                        onClick={this.changeHandle}
                        className={classnames({'u-switch': true, 'is-checked': this.state.checked})}>
                      <span className="u-switch-inner" />
                    </span>

                </Row>

                    <Row>
                        <Col md={4}>
                            <FormGroup>
                            <Label>最大实例数</Label>
                                <FormControl
                                    style={{imeMode: 'Disabled'}}
                                    onKeyDown={ onlyNumber }
                                    onChange={this.handleInputChange('max_instances')}
                                    value={this.state.max_instances}
                                    placeholder="请输入大于1的数字！"
                                    disabled={!this.state.checked}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                            <Label>最小实例数</Label>
                                <FormControl
                                    style={{imeMode: 'Disabled'}}
                                    onKeyDown={ onlyNumber }
                                    onChange={this.handleInputChange('min_instances')}
                                    value={this.state.min_instances }
                                    disabled={!this.state.checked}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                            <Label>时间间隔</Label>
                            <InputGroup>
                                <FormControl
                                    style={{imeMode: 'Disabled'}}
                                    onKeyDown={ onlyNumber }
                                    onChange={this.handleInputChange('interval')}
                                    value={this.state.interval}
                                    disabled={!this.state.checked}/>
                                <InputGroup.Addon>S</InputGroup.Addon>
                            </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                            <Label>最大RPS</Label>
                            <InputGroup>
                                <FormControl
                                    style={{imeMode: 'Disabled'}}
                                    onKeyDown={ onlyNumber }
                                    onChange={this.handleInputChange('target_rps')}
                                    value={this.state.target_rps }
                                    disabled={!this.state.checked}/>
                                <InputGroup.Addon>次/S</InputGroup.Addon>
                            </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Button colors="primary" className="save" disabled={!this.state.checked} onClick={this.handleSaveClick}>保存并开启</Button>
                    </Row>
                <ErrorModal
                    message = "确定要删除自动扩缩？"
                    show = { this.state.isShowDelAutoScale }
                    onEnsure = {this.deleteConfirm}
                    onClose = {this.handleClose}
                    title = "删除"
                    buttonTitle = "确定"
                    />
            </Form>
        )
    }
}
