import React,{Component} from 'react';
import {Tile,Button} from 'tinper-bee';
import style from './index.css';
import successImg from '../../assets/img/create-success.png';

class SuccessOne extends Component {
    constructor(props) {
        super(props);
        this.state={
            second:3
        }
    }
    componentDidMount(){
        let self=this;
        let timer=window.setInterval(()=>{
            let s=self.state.second-1;
            self.setState({
                second:s
            });
            if(s==0){
                window.clearInterval(timer);
                window.parent.location.reload();
                window.parent.location.hash='#/ifr/%252Ffe%252Fdashboard%252Findex.html';
            }
        },1000);
    }
    render() {
        return (
            <Tile className="u-container invite-success" border={false}>
                <div className="left">
                    <img src={successImg} style={{width:130,height:130}}/>
                </div>
                <div className="right">
                    <h3>恭喜您！您的邀请码已验证成功！</h3>
                    <h6>正在配置资源，<span className="second" ref='second'>{this.state.second}</span>秒后自动跳转到控制台，请您稍后...</h6>
                </div>
            </Tile>
        )
    }
}

export default SuccessOne;
