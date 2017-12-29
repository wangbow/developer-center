import React,{Component} from 'react';
import axios from 'axios';
import {Upload,Col,Con,Row,Button,Icon,Table,Alert,Message} from 'tinper-bee';
import Bind from './Bind';
import Edit from './Edit';
import Unbind from './Unbind';
import {loadHide,loadShow,dataPart} from '../../components/util';
import style from './index.css';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DomainList: []
        };
        this.rpDelete = this.rpDelete.bind(this);
        this.onFreshData = this.onFreshData.bind(this);
        this.handleReFresh = this.handleReFresh.bind(this);
    }

    onFreshData() {
        const self = this;
        //loadShow.call(self);
        axios.get('/res-pool-api/v1/resource_pools?limit=999999')
            .then(function (res) {
                //loadHide.call(self);
               if(res.flag){
                   Message.create({content: '请求出错', color: 'danger',duration: null});
               }else{
                   res.data.forEach(function (item, index) {
                       item.createTime=dataPart(new Date(item.createTime),'yyyy/MM/dd hh:mm:ss');
                       item.updateTime=dataPart(new Date(item.updateTime),'yyyy/MM/dd hh:mm:ss');
                       item.key = index;
                   });
                   self.setState({DomainList: res.data});
               }
            })
            .catch(function (err) {
                //loadHide.call(self);
                Message.create({content: '请求出错', color: 'danger',duration: null});
                console.log(err);
            });
    }

    componentDidMount() {
        this.onFreshData();
    }

    rpDelete(index) {
        const self = this;
        //loadShow.call(self);
        const domainList = self.state.DomainList;
        let param = self.state.DomainList[index].id;
        axios.delete('/res-pool-api/v1/resource_pools/' + param)
            .then(function (res) {
                //loadHide.call(self);
                if(res.data.flag=='success'){
                    domainList.splice(index, 1);
                    self.setState({DomainList: domainList});
                    Message.create({content: '操作成功', color: 'success'});
                }else{
                    if(res.data.error_code==-1||res.data.error_code=='-1'){
                        return Message.create({content: '禁止删除', color: 'danger',duration: null});
                    }else{
                        return Message.create({content: res.data.error_message||'操作失败', color: 'danger',duration: null});

                    }
                }
            })
            .catch(function (err) {
                //loadHide.call(self);
                Message.create({content: '请求出错', color: 'danger',duration: null});
                console.log(err);
            });

    }

    handleReFresh() {
        this.onFreshData();
    }

    render() {
        const self = this;
        const columns = [
            {title: '资源池名称', dataIndex: 'name', key: 'name'},
            {title: '资源池描述', dataIndex: 'description', key: 'description'},
            {title: '创建时间', dataIndex: 'createTime', key: 'createTime'},
            {title: '最后修改时间', dataIndex: 'updateTime', key: 'updateTime'},
            {title: '操作',  dataIndex: '', key:'e',render(text, record, index) {
                return (<div>
                    <Edit className="operate-button" text={text} title={'编辑'}/>
                    <Unbind className="operate-button delete" title={ '删除' } onConfirmDelete={function(){self.rpDelete(index)}} ></Unbind>
                </div>);
            }}
        ];
        return (
            <Row className="rp margin-right-0"><span ref="pageloading"> </span>
                <Col md={12} className="key-table-operate">
                    <Button shape="border" id="refresh" onClick={this.handleReFresh}>刷新</Button>
                    {/*<Bind title={ '创建资源池' }/> */}
                </Col>
                <Col md={12} className="key-table-list">
                    <Table columns={columns} data={this.state.DomainList} emptyText={() => '当前暂时还没有数据'}/>
                </Col>
            </Row>
        )
    }
}

export default MainPage;
