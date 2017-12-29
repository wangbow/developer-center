import React,{Component} from 'react';
import {Tile,Button} from 'tinper-bee';
import style from './index.css';
import errorInviteImg from '../../assets/img/error-invite.png';

class SuccessOne extends Component {
    constructor(props) {
        super(props);
        this.apply=this.apply.bind(this);
    }
    componentDidMount(){

    }

    apply(){
        window.open('/fe/Invite/index.html#/');
        window.location.hash='#/';
    }
    render() {
        let msg=(this.props.params.msg||'')+' ';
        return (
            <Tile className="u-container invite-error" border={false}>
                <div className="left">
                    <img src={errorInviteImg} style={{width:130,height:130}}/>
                </div>
                <div className="right">
                    <h3>很抱歉，您的邀请码验证失败</h3>
                    <h6>{msg}请重新申请邀请码</h6>
                    <Button onClick={this.apply}>重新申请</Button>
                </div>
            </Tile>
        )
    }
}

export default SuccessOne;
