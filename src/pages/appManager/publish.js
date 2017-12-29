/**
 * Created by Administrator on 2017/2/17.
 */
import React,{Component} from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {Row, Col, Table,Button} from 'tinper-bee';
import {splitParam} from '../../components/util';
import style from'./index.css';
import imgempty from '../../assets/img/taskEmpty.png';
import Title from '../../components/Title';

class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pubList: []
        };
        this.back = this.back.bind(this);
        this.load = this.load.bind(this);
    }

    back(msg, index) {
        const self = this;
        let params = {
            id: self.state.pubList[index].id,
            app_id: self.state.pubList[index].app_id,
            force: msg
        };
        axios.post('/app-manage/v1/deployments/stop', splitParam(params))
            .then(function () {
                self.load();
            })
            .catch(function () {

            })
    }

    load() {
        const self = this;
        axios.get('/app-manage/v1/deployments')
            .then(function (res) {
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].schedule = res.data[i].current_step + "/" + res.data[i].total_step;
                }
                self.setState({pubList: res.data});
            })
            .catch(function (err) {

            })
    }

    componentDidMount() {
        this.load();
    }

    render() {
        let self = this;
        let data = this.state.pubList;
        if (data instanceof Array) {
            data.forEach(function (item, index) {
                item.key = index;
            })
        }
        let empty = (<div className="pu-empty">
            <a href="/fe/continuous/index.html#createApp" style={{ color: "#fff"}}>
            <img src={imgempty} width="160" height="160"/> <br/>
            <span>
                没有正在部署的应用，去创建一个吧
            </span>
            </a>
        </div>);

        const columns = [
            {title: '部署ID', dataIndex: 'app_id', key: 'app_id'},
            {title: '应用名称', dataIndex: 'app_name', key: 'app_name'},
            {title: '当前操作', dataIndex: 'current_action', key: 'current_action'},
            {title: '进度', dataIndex: 'schedule', key: 'schedule'},
            {
                title: '操作', dataIndex: 'state', key: 'state', className: 'text-center', render(text, record, index){
                return (
                    <div style={{ textCenter: 'center'}}>
                        <Button className="pub-btn bg-red-A200" onClick={function(){self.back(true,index)}}>停止</Button>
                        <Button className="pub-btn-back bg-cyan-500"
                                onClick={function(){self.back(false,index)}}>回滚</Button>
                    </div>
                )
            }
            }
        ];
        return (
            <div className="pu">
                <Title name="部署列表">
                    <div style={{ display: 'inline-block', float: 'right'}}>

                        {/*<Link to="/publishLog" style={{ color: "#fff"}}><Button shape="border">发布日志</Button></Link>*/}
                        <a href="/fe/continuous/index.html#createApp" style={{ color: "#fff"}}>
                            <Button colors="primary" shape="squared">
                                <i className="cl cl-add-c-o" style={{ marginRight: 5, color: "#fff", fontSize: 14}}></i>
                                创建新应用
                            </Button>
                        </a>
                    </div>
                </Title>
                <Col md={12} style={{ marginTop: 20}} className="pu-row">
                    {
                        this.state.pubList && this.state.pubList.length != 0 ? (
                            <Table className="pub-table" columns={columns} data={data}></Table>) : empty
                    }
                </Col>
            </div>
        )
    }


}

export default Publish;
