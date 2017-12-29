import React, {Component} from 'react';
import Title from 'components/Title';
import './index.less';
import { Row, Col, Button, Select, Table, Message, Popconfirm, Icon } from 'tinper-bee';
import {getRegisterPool} from 'serves/microServe'
import { Link } from 'react-router';
import classnames from 'classnames';


class MainPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: [],
            activePage: '1',
            page: '1'
        }

        this.columns = [ {
            title: '所属应用',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '实例数量',
            dataIndex: 'instCount',
            key: 'instCount'
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, rec, index) => {
                    return (
                    <span className="cursor-pointer">
                      <Button
                        className="btnStyle"
                        onClick={this.gotoPageList("lookInstance",rec.name,rec.providerId)}
                        >查看实例</Button>
                      <Button 
                        className="btnStyle"
                        onClick={this.gotoPageList("serverManager",rec.name)}
                        >服务列表</Button>      
                       <Button
                        className={classnames({ 'hidden': true})}
                        onClick={this.gotoPageList("powerManager")}
                        >权限</Button>

                        <Button
                        className={classnames({ 'hidden': true})}
                        onClick={this.gotoPageList("propertyConfig")}
                        >属性配置</Button>

                         <Button
                        className={classnames({ 'hidden': true})} 
                        onClick={this.gotoPageList("used")}
                        >调用</Button>  
                       
                    </span>
                    )
            }
        }];
    }

    componentDidMount() {
      this.getServer();
    }
    /**
     * 获取应用列表的数据
     */
    getServer(){
        getRegisterPool()
            .then(data => {
                if(data.data.detailMsg.data.objects&&Array.isArray(data.data.detailMsg.data.objects)){
                    this.setState({
                      data: data.data.detailMsg.data.objects
                    })
                }
            })
            .catch((error) => {
                  console.log('操作失败');
                  console.log(error.message);
                  console.log(error.stack);
                  return Message.create({
                    content: error.message,
                    color: 'danger',
                    duration: null
                })
            })

    }
     
  
    handleSelect = (key) => {
        this.setState({
            activePage: key
        });

        this.getServer();
    }
    /**
     * 跳转界面
     * parm:name是传的参数
     */
    gotoPageList = (type, name,providerId) => evt => {
        if(type=="lookInstance"){
            this.props.router.push(`/${type}/${name}?providerId=${providerId}`);
        }else if(type=="serverManager"){
            this.props.router.push(`/${type}/${name}`);
        }
      
     }

    render(){

        return (
            <Row className="conf-center">
                <Title name="应用列表" showBack={ false } />
                <Col md={12}>
                    <Table data={ this.state.data } columns={ this.columns } rowKey={(rec, index) => { return rec.name }}/>
                    {
                        this.state.page > 1 ? (
                            <Pagination
                                first
                                last
                                prev
                                next
                                boundaryLinks
                                items={this.state.page}
                                maxButtons={5}
                                activePage={this.state.activePage}
                                onSelect={this.handleSelect} />
                        ) : ""
                    }
                </Col>
            </Row>
        )
    }
}

export default MainPage;
