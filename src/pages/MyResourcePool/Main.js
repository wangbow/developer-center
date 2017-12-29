import React,{Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Col,Row,Button,Table,Message,InputGroup,FormControl} from 'tinper-bee';
import {loadShow,loadHide,dataPart} from '../../components/util';
import Title from '../../components/Title';
import style from './index.css';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DomainList: []
        };
        this.onFreshData = this.onFreshData.bind(this);
        this.handleReFresh = this.handleReFresh.bind(this);
        this.search = this.search.bind(this);
        this.create = this.create.bind(this);
        this.enter = this.enter.bind(this);
    }

    search(){
        this.onFreshData();
    }

    enter(e){
        e.keyCode === 13 && this.search()
    }

    onFreshData() {
        const self = this;
        loadShow.call(self);
        let key=ReactDOM.findDOMNode(self.refs.key).value;
        axios.get('/invitecode/web/v1/poolcode/getResourcePools?resourcePoolName='+key)
            .then(function (res) {
                loadHide.call(self);
                if(res.data && res.data.error_code) {
                    return Message.create({content: res.data.error_message||'请求出错', color: 'danger',duration:null});
                }else{
                    let myPools=res.data.detailMsg.data;
                    if(myPools){
                        myPools.forEach(function (item, index) {
                            item.createTime=dataPart(new Date(item.createTime),'yyyy/MM/dd hh:mm:ss');
                            item.updateTime=dataPart(new Date(item.updateTime),'yyyy/MM/dd hh:mm:ss');
                            item.key = index;
                        });

                    }else{
                        myPools=[];
                        Message.create({content: '资源池已失效，3秒后自动刷新页面，请稍后', color: 'danger',duration:3});
                        window.setTimeout(()=>{
                            window.parent.location.hash='';
                            window.parent.location.reload();
                        },3000);
                    }
                    self.setState({DomainList: myPools});
                }
            })
            .catch(function (err) {
                loadHide.call(self);
                Message.create({content: '请求出错', color: 'danger',duration: null});
                console.log(err);
            });
    }

    componentDidMount() {
        this.onFreshData();
    }

    handleReFresh() {
        this.onFreshData();
    }

    create(){
        window.parent.location.hash='#/ifr/%252Ffe%252FcreatePool%252Findex.html';
    }

    render() {
        const columns = [
            {title: '资源池名称', dataIndex: 'name', key: 'name'},
            {title: '资源池描述', dataIndex: 'description', key: 'description'},
            {title: '创建时间', dataIndex: 'createTime', key: 'createTime'},
            {title: '最后修改时间', dataIndex: 'updateTime', key: 'updateTime'}
        ];
        return (
            <Row className="my-r-p"><span ref="pageloading"> </span>
                <Title showBack={false} name="我的资源池" />
                    <Col md={12} className="key-table-operate">
                        <Button colors="primary"  onClick={this.create}>创建</Button>
                        <Button shape="border" id="refresh" onClick={this.handleReFresh}>刷新</Button>
                        <div className="search">
                            <InputGroup>
                                <FormControl type="text" placeholder="请输入资源池名称" ref="key" onKeyUp={this.enter}/>
                                <InputGroup.Addon onClick={this.search}>
                                    <i className="cl cl-search-light"></i>
                                </InputGroup.Addon>
                            </InputGroup>
                        </div>
                    </Col>
                    <Col md={12} className="key-table-list">
                        <Table columns={columns} data={this.state.DomainList} emptyText={() => '当前暂时还没有数据'}/>
                    </Col>
            </Row>

        )
    }
}

export default MainPage;
