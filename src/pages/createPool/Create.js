import React,{Component} from 'react';
import {Tile,Button,Message,FormGroup,FormControl,Label} from 'tinper-bee';
import {loadHide,loadShow,splitParam} from '../../components/util';
import axios from 'axios';
import style from './index.css';
import mainImg from '../../assets/img/u392.png';

class CreatePool extends Component{
    constructor(props){
        super(props);
        this.state={
            showError:'none'
        };
        this.create=this.create.bind(this);
        this.apply=this.apply.bind(this);
    }

    apply(){
        window.open('/fe/Invite/index.html');
    }

    create(){
        let self = this;
        let invitecode=ReactDOM.findDOMNode(this.refs.invitecode).value;
        if(invitecode){
            this.setState({
                showError: 'none'
            });
        }else{
            this.setState({
                showError: 'inline-block'
            });
            return;
        }
        loadShow.call(self);
        let paramInvitecode={
            invitecode:invitecode,
        };

        axios.post('/invitecode/web/v1/poolcode/verifyCode',splitParam(paramInvitecode))
            .then(function(res){
                if(res&&res.data&&res.data.success=='success'){
                    loadHide.call(self);
                    window.location.hash='#/success';
                }else{
                    loadHide.call(self);
                    if(res.data&&res.data.error_code){
                        let errorCode=res.data.error_code;
                        switch (errorCode){
                            case '40050':
                                window.location.hash='#/errorInvite/'+res.data.error_message;
                                break;
                            default:
                                window.location.hash='#/errorPool/'+res.data.error_message;
                                break;
                        }
                    }
                }
            })
            .catch(function(err){
                loadHide.call(self);
                console.log(err);
                return Message.create({content: '请求出错', color: 'danger',duration: null});
            })
    }
    render(){
        let self=this;
        return(
                <Tile className="u-container create-pool" border={false}><span ref="pageloading"> </span>
                    <div className="tile-img"><img src={mainImg} style={{width:300}}/></div>
                    <FormGroup>
                        <Label>请您输入邀请码，创建资源池：</Label>
                        <FormControl ref="invitecode" placeholder="请输入您的邀请码"/>
                    </FormGroup>
                    <div></div>
                    <FormGroup style={{'display':self.state.showError}} className="error">
                        <Label style={{'color':'red'}}>邀请码为必填项</Label>
                    </FormGroup>
                    <div></div>
                    <span className="apply-invite">
                        还没有邀请码？<a onClick={self.apply}>去申请</a>
                    </span>
                    <p><Button onClick={self.create} colors="info">创建资源池</Button></p>
                </Tile>
            )
    }
}
export default CreatePool;