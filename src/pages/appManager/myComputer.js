import React,{Component} from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {Row, Col, Table,Button} from 'tinper-bee';
import style from'./index.css';
import imgempty from '../../assets/img/taskEmpty.png';
import Title from '../../components/Title';

class myComputer extends Component {
    constructor(props) {
        super(props)
        this.state={
            myComList:[]
        }
    }

    componentDidMount() {

        const self = this;
        axios.get('/app-manage/v1/hosts')
            .then(function (res) {
                for(let n=0;n<res.data.length;n++){
                    if(res.data[n].mem>=1024){
                        res.data[n].mem = (res.data[n].mem / 1024).toFixed(2);
                        if(res.data[n].mem>=1024){
                            res.data[n].mem=(res.data[n].mem / 1024).toFixed(2)+"T";
                        }
                        else{
                            res.data[n].mem=res.data[n].mem+"G";
                        }
                    }
                }
                self.setState({myComList:res.data});
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    render() {
        let self=this;
        let data = this.state.myComList;
        let empty = (<div className="pu-empty">
            <img src={imgempty} width="160" height="160"/> <br/>
            <span>没有正在运行的主机哦</span>
        </div>);
        if(data instanceof Array){
            data.forEach(function (item, index) {
                item.key = index;
            })
        }

            const columns = [
                {title: 'IP地址', dataIndex: 'ip', key: 'IP'},
                {title: 'CPU', dataIndex: 'cpu', key: 'CPU'},
                {title: '内存', dataIndex: 'mem', key: 'memory'},
                {title: '创建时间', dataIndex: 'createTime', key: 'registerTime'},
                {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime'},
                {title: '', dataIndex: '', key: ''}
            ];
            return (
                <div>
                <Title name="主机列表">
                    <div style={{ display: 'inline-block', padding: "0 20px", float: 'right'}}>
                        <Link to="/publish" style={{ color: "#fff"}}>
                        <Button shape="squared" bordered style={{ marginRight: 8 }}>
                        <i className="cl cl-clouddeploy" style={{ marginRight: 5, color: "#0084ff", fontSize: 14}}></i>
                        部署列表
                        </Button>
                        </Link>
                        <a to="/fe/continuous/index.html#createApp" style={{ color: "#fff"}}>
                        <Button colors="primary" shape="squared">
                        <i className="cl cl-add-c-o" style={{ marginRight: 5, color: "#fff", fontSize: 14}}></i>
                        创建新应用
                        </Button>
                        </a>
                    </div>
                </Title>
                    <Col md={12} className="pu-row">
                        <Col md={12} style={{ marginTop: 20 }}>
                        {
                            this.state.myComList && this.state.myComList.length != 0 ? (<Table className="pub-table" columns={columns} data={data}></Table>) : empty
                        }
                        </Col>
                    </Col>
                </div>
            )
        }

}

export default myComputer;
