import React,{Component} from 'react';
import {Tile,Button} from 'tinper-bee';
import style from './index.css';
import errorPoolImg from '../../assets/img/error-pool.png';

class SuccessOne extends Component {
    constructor(props) {
        super(props);
        this.apply=this.apply.bind(this);
    }
    componentDidMount(){

    }

    apply(){
        window.location.hash='#/';
    }

    render() {
        let msg=this.props.params.msg||'请稍后再试';
        return (
            <Tile className="u-container pool-error" border={false}>
                <div className="left">
                    <img src={errorPoolImg} style={{width:130,height:130}}/>
                </div>
                <div className="right">
                    <h3>很抱歉，资源池申请失败</h3>
                    <h6>{msg}</h6>
                    <Button  onClick={this.apply}>重新创建</Button>
                </div>
            </Tile>
        )
    }
}

export default SuccessOne;
