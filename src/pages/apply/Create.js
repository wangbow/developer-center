import React,{Component} from 'react';
import {Tile,Button,Message} from 'tinper-bee';
import axios from 'axios';
import style from './index.css';
import apply from '../../assets/img/apply.png';
import classnames from 'classnames';

class CreatePool extends Component{
    constructor(props){
        super(props);
        this.state={
            applyFlag:'inline-block',
            applyIng:'none',
            applyWarn:'none',
            detail:'',
            time:'',
            people:'',
            peopleShow:'none'
        };

        this.open=this.open.bind(this);
    }

    componentDidMount(){
        let self=this;
        axios.get('/portal/web/v1/isv/state')
            .then(function(res){
                if(res.data.status==1||res.data.status=='1'){
                    self.state={
                        applyFlag:'none'
                    };
                    let data=res.data.data;
                    let applyFlag='none';
                    let applyIng='none';
                    let applyWarn='none';
                    if(data.certificationStatus){
                        switch (data.certificationStatus){
                            case "0":applyFlag='inline-block';
                                break;
                            case "1":applyFlag='inline-block';
                                break;
                            case "2":applyIng='inline-block';
                                break;
                            case "4":applyWarn='inline-block';
                                break
                        }
                    }
                    if(data.approveOperator){
                        self.setState({
                            peopleShow:'list-item'
                        })
                    }else{
                        self.setState({
                            peopleShow:'none'
                        })
                    }
                    self.setState({
                        applyFlag:applyFlag,
                        applyIng:applyIng,
                        applyWarn:applyWarn,
                        detail:data.approveComment,
                        time:data.commitTime,
                        people:data.approveOperator
                    });
                }else{
                    Message.create({content:res.data.message||'请求出错', color: 'danger',duration: null});
                }
            })
            .catch(function(err){
                Message.create({content: '请求出错', color: 'danger',duration: null});
            })
    }

    open(){
        if(ENV&&ENV.operations)window.open(ENV.operations);
    }
    render(){
        return(
                <Tile className="u-container apply" border={false}>
                    <div className="tile-img"><img src={apply} style={{width:300}}/></div>
                    <h6  className={classnames({'hidden':this.state.applyFlag=='none'})}>您目前还不是用友云市场的服务商，请先申请入驻</h6>
                    <Button colors="info" onClick={this.open} style={{'display':this.state.applyFlag}}>入驻申请</Button>
                    <div className="apply-ing" style={{'display':this.state.applyIng}}>
                        <h2 className="title">正在审核中</h2>
                        <ul className="detail">
                            <li>申请时间：{this.state.time}</li>
                            <li style={{'display':this.state.peopleShow}}>审批人&nbsp;&nbsp;&nbsp;：{this.state.people}</li>
                            <li>审批信息：{this.state.detail}</li>
                        </ul>
                    </div>
                    <div className="apply-warn" style={{'display':this.state.applyWarn}}>
                        <h2 className="title">审核未通过</h2>
                        <ul className="detail">
                            <li>申请时间：{this.state.time}</li>
                            <li style={{'display':this.state.peopleShow}}>审批人&nbsp;&nbsp;&nbsp;：{this.state.people}</li>
                            <li>审批信息：{this.state.detail}</li>
                        </ul>
                        <Button colors="info" onClick={this.open}>重新申请入驻合作</Button>
                    </div>
                </Tile>
            )
    }
}
export default CreatePool;