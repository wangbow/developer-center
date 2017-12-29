import React, {Component} from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import {Col, Con, Row, Button, Icon, Table, Alert, Message, FormGroup, Label, FormControl, InputGroup} from 'tinper-bee';
import {loadHide, loadShow, getCookie, splitParam} from '../../components/util';
import VerifyInput from '../../components/verifyInput/index';
import service from '../../assets/img/service.png';
import phone from '../../assets/img/phone.png';
import style from './index.css';
import inviteTopImg from '../../assets/img/invite-top.jpg';
import userIcon from '../../assets/img/userIcon.png';
import classnames from 'classnames'

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: window.decodeURI(getCookie('userName')) || '',
            captchakey: '',
            src: '',
            showError: 'none',
            errorMsg: '请输入必填项',
            menuShow: true,
            phoneNumber:""
        };
        this.validateReload = this.validateReload.bind(this);
        this.add = this.add.bind(this);
        this.focus = this.focus.bind(this);
        this.menuClick = this.menuClick.bind(this);
        this.goRp = this.goRp.bind(this);
        this.goAK = this.goAK.bind(this);
        this.logoOut = this.logoOut.bind(this);
        this.verfilyNumer = this.verfilyNumer.bind(this);
        this.isNumber = this.isNumber.bind(this);
        this.insert_flg = this.insert_flg.bind(this);

    }

    componentDidMount() {
        this.validateReload();
    }

    menuClick() {
        this.setState({
            menuShow: !this.state.menuShow
        })
    }

    goRp() {
        window.location.href = window.location.protocol + '//' + window.location.host + '/portal/index.html#/ifr/%252Ffe%252FMyRP%252Findex.html';
    }

    goAK() {
        window.location.href = window.location.protocol + '//' + window.location.host + '/portal/index.html#/ifr/%252Ffe%252Faccess%252Findex.html';
    }

    logoOut() {
        window.location.href = window.location.protocol + '//' + window.location.host + '/portal/account/logout';
    }

    /**
     * 只能输入数字，增加了光标插入数字的功能
     * @param event
     * @returns {boolean}
     */
    verfilyNumer(event) {
        var keyCode = event.keyCode;
        if(!this.isNumber(keyCode)){
            return false;
        }else{
            let domInput=ReactDom.findDOMNode(this.refs.tel);
            let tel = ReactDom.findDOMNode(this.refs.tel).value;
            let evKey;
            if(parseInt(event.key)||parseInt(event.key)==0){
                evKey=event.key;
            }else{
                evKey=String.fromCharCode( event.keyCode);
            }
            let cursurPosition=0;
            let telString="";
            if(domInput.selectionStart){
                cursurPosition= domInput.selectionStart;
            }
            if(tel!=""){
                telString= this.insert_flg(tel,evKey,cursurPosition);
            }else {
                telString=evKey;
            }
            this.setState({
                phoneNumber:telString
            });
        }
    }
    insert_flg(str,flg,sn){
        let newstr="";
        let s1=str.substr(0,sn);
        let s2=str.substr(sn,str.length);
        newstr=s1+flg+s2;
        return newstr;
    }
    isNumber(keyCode) {
        let tel = ReactDom.findDOMNode(this.refs.tel).value;
        if(tel==undefined){
            return false;
        }else {
            // 数字
            if (keyCode >= 48 && keyCode <= 57) {
                return true;
            }
            // 小数字键盘
            if (keyCode >= 96 && keyCode <= 105) {
                return true;
            } else if (keyCode == 8) {
                //删除键操作
                this.setState({
                    phoneNumber: tel.substring(0, tel.length - 1)
                });
            } else {
                return false;
            }
        }

    }

    validateReload() {
        let self = this;
        let captchakey = getCookie('userCode') + '_' + new Date().getTime();
        self.setState({
            src: window.parent.location.protocol + '//' + window.parent.location.host + '/invitecode/captcha/generateCaptcha?captchakey=' + captchakey,
            captchakey: captchakey
        });
        /*axios.get('/invitecode/captcha/generateCaptcha?captchakey=' + captchakey)
         .then(function (res) {
         loadHide.call(self);
         if (res) {
         self.setState({
         src: window.parent.location.protocol + '//' + window.parent.location.host + '/invitecode/captcha/generateCaptcha?captchakey=' + captchakey,
         captchakey: captchakey
         })
         }
         })
         .catch(function () {
         loadHide.call(self);
         Message.create({content: '验证码请求失败', color: 'danger'});
         })*/

    }

    focus(ele) {
        let self = this;
        let value = ReactDom.findDOMNode(ele).value;
        if (value) {
            self.setState({
                showError: 'none'
            });
            return false;
        } else {
            self.setState({
                showError: 'block'
            });
            ReactDom.findDOMNode(ele).focus();
            return true;
        }

    }

    add() {
        let self = this;
        let mail = ReactDom.findDOMNode(self.refs.mail).value;
        let realname = ReactDom.findDOMNode(self.refs.realname).value;
        let tel = ReactDom.findDOMNode(self.refs.tel).value;
        let company = ReactDom.findDOMNode(self.refs.company).value;
        let captcha = ReactDom.findDOMNode(self.refs.captcha).value;
        if (document.getElementsByClassName('show-warning').length)return;
        if (self.focus(self.refs.realname))return;
        if (self.focus(self.refs.tel))return;
        if (self.focus(self.refs.mail))return;
        if (self.focus(self.refs.captcha))return;
        let param = {
            mail: mail,
            realname: realname,
            tel: tel,
            company: company,
            remark: ReactDom.findDOMNode(self.refs.remark).value,
            captcha: captcha,
            captchakey: self.state.captchakey
        };
        //loadShow.call(self);
        axios.post('/invitecode/web/v1/poolcode/apply', splitParam(param))
            .then(function (res) {
                //loadHide.call(self);
                if (res.data.error_code) {
                    Message.create({content: res.data.error_message || '操作失败', color: 'danger', duration: 4.5});
                    self.validateReload();
                } else {
                    window.location.hash = '#/success';
                }
            })
            .catch(function () {
                //loadHide.call(self);
                Message.create({content: '请求失败', color: 'danger', duration: null});
            })
    }

    render() {
        let self = this;

        return (
            <div className="invite"><span ref="pageloading"> </span>
                <Row className="head">
                    <Col md={2} xs={2} sm={2} className="head-logo">
                        <a href="//www.yonyoucloud.com">
                            <i className="cl cl-yongyouyun-r"/>
                        </a>
                    </Col>
                    <Col md={9} xs={9} sm={9} className="head-title">
                        <span>开发者中心</span>
                    </Col>
                    <Col md={1} xs={1} sm={1} className="head-name" onClick={this.menuClick}>
                            <span >
                                <img src={userIcon}/>
                            </span>
                        <span >{self.state.userName}</span>
                        <span className="uf uf-triangle-down"/>
                        <ul className={classnames({'menu':true,'hidden':this.state.menuShow})}>
                            <li>
                               <span onClick={this.goRp}>
                                   <i className="cl cl-resource"/>
                                   <p>
                                       资源池
                                   </p>
                               </span>
                               <span onClick={this.goAK}>
                                   <i className="cl cl-access"/>
                                   <p>
                                       Assess Key
                                   </p>
                               </span>
                            </li>
                            <li>
                                <a target="_blank" href="http://59.110.149.236:8081/usercenter">个人信息</a>
                            </li>
                            <li>
                                <a onClick={this.logoOut}>注销</a>
                            </li>
                            <li>
                                <a href="//www.yonyoucloud.com">返回用友云</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} xs={12} sm={12} className="img-div">
                        <img src={inviteTopImg}/>
                    </Col>
                </Row>
                <Row className="from">
                    <Col md={2} xs={2} sm={2}>

                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <div className="left">
                            <FormGroup>
                                <Label>用户名</Label>
                                <FormControl ref="userName" disabled placeholder={self.state.userName}/>
                            </FormGroup>
                            <FormGroup>

                                <Label>姓名</Label>
                                <VerifyInput message="请输入姓名" isRequire>
                                    <InputGroup>
                                        <InputGroup.Addon className="mast">*</InputGroup.Addon>
                                        <FormControl ref="realname" placeholder="您的真实姓名" maxLength="18" />
                                    </InputGroup>
                                </VerifyInput>
                            </FormGroup>
                            <FormGroup>
                                <Label>所在公司</Label>
                                <FormControl ref="company" placeholder="您所在的公司"  maxLength="18"/>
                            </FormGroup>
                            <FormGroup>
                                <Label>手机号码</Label>
                                <VerifyInput message="手机号码格式不正确" isRequire verify={/^1\d{10}$/}>
                                    <InputGroup>
                                        <InputGroup.Addon className="mast">*</InputGroup.Addon>
                                        <FormControl id="phone" min="0" ref="tel" value={this.state.phoneNumber}
                                                     onKeyDown={self.verfilyNumer} placeholder="请输入您可以接收邀请码的手机号码"/>
                                    </InputGroup>
                                </VerifyInput>
                            </FormGroup>
                            <FormGroup>
                                <Label>邮箱</Label>
                                <VerifyInput message="邮箱格式不正确" isRequire
                                             verify={/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/}>
                                    <InputGroup>
                                        <InputGroup.Addon className="mast">*</InputGroup.Addon>
                                        <FormControl ref="mail" placeholder="请输入您可以接收邀请码的邮箱"/>
                                    </InputGroup>
                                </VerifyInput>
                            </FormGroup>
                            <FormGroup>
                                <Label>备注</Label>
                                <textarea ref="remark" className="u-form-control "/>
                            </FormGroup>
                            <FormGroup className="validate">
                                <Label>验证码</Label>
                                <VerifyInput message="请输入验证码" isRequire>
                                    <InputGroup>
                                        <InputGroup.Addon className="mast">*</InputGroup.Addon>
                                        <FormControl ref="captcha"/>
                                        <img src={self.state.src} title="点击刷新" onClick={self.validateReload}/>
                                    </InputGroup>
                                </VerifyInput>
                            </FormGroup>
                            <FormGroup style={{'display': self.state.showError}}>
                                <Label style={{'color': 'red'}}>{this.state.errorMsg}</Label>
                            </FormGroup>
                            <FormGroup className="apply-button">
                                <Button onClick={ self.add } colors="danger">申请邀请码</Button>
                            </FormGroup>
                        </div>
                    </Col>
                    <Col md={5} xs={5} sm={5}>
                        <div className="right">
                            <h3 className="title"><span>用友云开发者中心</span>邀请码须知</h3>
                            <ul>
                                <li><i className="point"> </i>邀请码可以免费试用用友云开发者中心24小时</li>
                                <li><i className="point"> </i>不可重复申请，限24小时内试用，过期无效</li>
                                <li><i className="point"> </i>邀请码仅可使用1次，重复使用无效</li>
                            </ul>
                        </div>
                    </Col>
                    <Col md={1} xs={1} sm={1}>

                    </Col>
                </Row>
                <Row className="footer">
                    <ul>
                        <li className="link"><a target="_blank" href="//www.yonyoucloud.com/">用友云官网</a></li>
                        <li className="link"><a target="_blank" href="//developer.yonyoucloud.com/">开发者中心</a></li>
                        <li className="link"><a target="_blank" href="//www.yonyoucloud.com/market/">云市场</a></li>
                        <li className="link"><a target="_blank" href="//www.yonyoucloud.com/aboutus.html">关于我们</a>
                        </li>
                        <li className="split"></li>
                        <li className="service">
                            <img src={service}/>
                                <span>
                                    <span className="title">
                                       售前客服
                                    </span>
                                    <p>
                                        <span className="click">
                                            <a target="_blank"
                                               href="//a1.7x24cc.com/phone_webChat.html?accountId=N000000003641&chatId=yyyp-6e016880-c00e-11e6-b7e7-7f9c74923216">点击与客服对话</a></span>
                                    </p>
                                </span>
                        </li>
                        <li className="service">
                            <img src={phone}/>
                                <span>
                                    <span className="title">400-6815-456</span>
                                    <p>
                                        <span className="click">
                                            <a target="_blank"
                                               href="//a1.7x24cc.com/phone_webChat.html?accountId=N000000003641&chatId=yyyp-6e016880-c00e-11e6-b7e7-7f9c74923216">官方售前电话</a></span>
                                    </p>
                                </span>
                        </li>
                    </ul>
                    <div className="copyRight">
                        <span>©2017</span>
                        <span>用友网络科技股份有限公司版权所有</span>
                        <span>京ICP证100714号</span>
                    </div>
                </Row>
            </div>
        )
    }
}

export default MainPage;
