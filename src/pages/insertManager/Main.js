import React,{Component} from 'react';
import axios from 'axios';
import {Col,Con,Row,Button,Icon,Table,Alert,Message,InputGroup,FormControl,Pagination } from 'tinper-bee';
import Bind from './Bind';
import Edit from './Edit';
import Unbind from './Unbind';
import {loadHide,loadShow} from '../../components/util';
import style from './index.css';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DomainList: [],
            childDoMain:this.props.domain,
            pageItem:1,
            pageActive:1
        };
        this.onDelete = this.onDelete.bind(this);
        this.onFreshData = this.onFreshData.bind(this);
        this.handleReFresh = this.handleReFresh.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.enter = this.enter.bind(this);
        this.search = this.search.bind(this);
    }

    pageChange(pageIndex){
        this.setState({
            pageActive: pageIndex
        });
        this.onFreshData(false,pageIndex);
    }

    onFreshData(reFreshFlag,pageIndex) {
        const self = this;
        //loadHide.call(self);
        pageIndex=pageIndex||self.state.pageActive||0;
        pageIndex=pageIndex>0?pageIndex-1:0;
        let key=ReactDOM.findDOMNode(self.refs.key).value;
        axios.get('/domain-edna/web/v1/domain/page_link?pageSize=10&pageIndex='+pageIndex+'&search_domain='+key)
            .then(function (res) {
                //loadHide.call(self);
                if(res.data && res.data.error_code) {
                    return Message.create({content: res.data.error_message||'请求出错', color: 'danger',duration:null});
                }else{
                    let data=res.data.detailMsg.data;
                    let domainList = data.content;
                    if(domainList&&domainList.length){
                        domainList.forEach(function (item, index) {
                            item.key = index;
                            item.userName='';
                            if(item.userinfo&&item.userinfo.userName){
                                item.userName=item.userinfo.userName;
                            }
                            item.port='';
                            if(item.haproxy&&item.haproxy.port){
                                item.port=item.haproxy.port;
                            }
                            item.host='';
                            if(item.haproxy&&item.haproxy.host){
                                item.host=item.haproxy.host;
                            }
                        });

                    }
                    self.setState({
                        DomainList: domainList,
                        pageActive:Number(data.number)+1,
                        pageItem:Number(data.totalPages)
                    });
                    if(reFreshFlag){
                        return Message.create({content: '操作成功', color: 'success'});
                    }
                }

            })
            .catch(function (err) {
                //loadHide.call(self);
                console.log(err);
                return Message.create({content: '请求出错', color: 'danger',duration:null});
            });
    }

    componentDidMount() {
        this.onFreshData();
    }
    enter(e){
        e.keyCode === 13 && this.search()
    }
    search(){
        this.onFreshData();
    }
    onDelete(index) {
        const self = this;
        return function () {
            const domainList = self.state.DomainList;
            let param = self.state.DomainList[index].id;
            //loadHide.call(self);
            axios.delete('/domain-edna/web/v1/domain/delById_link?id=' + param)
                .then(function (res) {
                    //loadHide.call(self);
                    if(res.data && res.data.error_code) {
                        return Message.create({content: res.data.error_message||'请求出错', color: 'danger',duration:null});
                    }else{
                        domainList.splice(index, 1);
                        self.setState({DomainList: domainList});
                        return Message.create({content: '操作成功', color: 'success',duration:null});
                    }
                })
                .catch(function (err) {
                    //loadHide.call(self);
                    Message.create({content: '请求错误', color: 'danger',duration: null});
                    console.log("error");
                });
            self.setState({DomainList: domainList});
        };
    }

    handleReFresh() {
        this.onFreshData(true);
    }

    render() {
        const self = this;
        const columns = [
            {title: '已绑定域名', dataIndex: 'domain', key: 'domain'},
            {title: '解析状态', dataIndex: 'resolveStatus', key: 'resolveStatus'},
            {title: '所属用户', dataIndex: 'userName', key: 'userName'},
            {title: 'ip', dataIndex: 'host', key: 'host'},
            {title: '端口号', dataIndex: 'port', key: 'port'},
            {title: '备案状态', dataIndex: 'ts', key: 'ts', render(){return (<span>已备案</span>);}},
            {
                title: '操作',  key: 'e', render(text, record, index) {
                return (<span>
                     <Edit  text={text} title={'编辑'} />
                        <Unbind onConfirmDelete={self.onDelete(index)} title={ '删除' }/>
                    </span>);
            }
            }
        ];
        return (
            <Row className="insert-manager"><span ref="pageloading"> </span>
                <Col md={12} className="table-title">
                   <span>
                       接入管理
                   </span>
                </Col>
                <Col md={6} className="key-table-operate">
                    <Bind  title={ '创建' }/>
                    <Button shape="border" id="refresh" onClick={this.handleReFresh}>刷新</Button>
                    <div className="search">
                        <InputGroup>
                            <FormControl type="text" placeholder="请输入域名" ref="key" onKeyUp={this.enter}/>
                            <InputGroup.Addon onClick={this.search}>
                                <i className="cl cl-search-light"></i>
                            </InputGroup.Addon>
                        </InputGroup>
                    </div>
                </Col>
                <Col md={12} className="key-table-list">
                    <Table columns={columns} data={this.state.DomainList} emptyText={() => '当前暂时还没有数据'}/>
                </Col>
                <Col md={12} >
                    <Pagination  prev next boundaryLinks items={this.state.pageItem} maxButtons={5} activePage={this.state.pageActive}
                        onSelect={this.pageChange} />
                </Col>
            </Row>
        )
    }
}

export default MainPage;
