import React,{Component} from 'react';
import {Tile,Button} from 'tinper-bee';
import style from './index.css';
import inviteSuccessImg from '../../assets/img/invite-success.png';

class SuccessOne extends Component {
    constructor(props) {
        super(props);
        this.backWhere=this.backWhere.bind(this);
    }

    componentDidMount(){

    }

    backWhere(){
        window.opener = null;
        window.open('','_self');
        window.close();
    }

    render() {
        return (
            <Tile className="u-container invite-success" border={false}>
                <div className="left">
                    <img src={inviteSuccessImg} style={{width:150,height:150}}/>
                </div>
                <div className="right">
                    <h3>恭喜您！您的邀请码申请已经提交</h3>
                    <h6>请您知晓</h6>
                    <ul className="content">
                        <li> 邀请码申请提交后，我们将在2个工作日内通过您预留的邮箱发送邀请码</li>
                        <li>您收到邀请码后，请在<span className="red">24小时内使用</span>，过期无效</li>
                    </ul>
                    <Button className="back" onClick={this.backWhere}>关闭</Button>
                </div>
            </Tile>
        )
    }
}

export default SuccessOne;
