import React, {Component} from 'react'

import {
    Panel, Icon, Table, Button, Animate, Popconfirm, FormControl,
    Checkbox, Pagination
} from 'tinper-bee'


// 接口函数
import {
    searchUsers
} from '../../serves/limitManager';


class DisplayCard extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '账号',
            dataIndex: 'userCode',
            key: 'userCode',
        },{
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
        },
            {
            title: '邀请时间',
            dataIndex: 'ctime',
            key: 'ctime',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: this.renderCellTwo.bind(this),
        }];

        const defUserInfo = {
            content: [],
            totalElement: 0,
            totalPages: 0,
            pageIndex: 0,
            pageSize: 0
        };
        this.state = {
            isAdd: false,
            userInfo: '',
            searchResult: defUserInfo,
            dispSearch: 'none',
            activePage: 1,
            authorizedUsers: []
        };

    }

    componentDidMount() {
        window.addEventListener('click', this.searchRemove)
    }

    componentWillUnMount() {
        window.removeEventListener('click', this.searchRemove)
    }

    /**
     * 渲染表格操作列
     * @param text
     * @param record
     * @param index
     * @returns {*}
     */
    renderCellTwo = (text, record, index) => {

        return (
            this.props.data.length >= 1 ?
                (
                    <Popconfirm content="确认删除?" placement="bottom" onClose={this.onDelete(index)}>
                        <Icon type="uf-del"/>
                    </Popconfirm>
                ) : null
        );
    }

    recentReq = null;

    /**
     * 捕获inputchange
     * @param state
     * @returns {function(*)}
     */
    handleInputChange = (state) => {
        return (e) => {

          let value = e.target.value;

          this.setState({[state]: value});

          let chineseAry = value.match(/[\u4e00-\u9fa5]/g);
          let byteLen = 0;
          if (chineseAry instanceof Array) {
            byteLen = chineseAry.length * 2 + value.length - chineseAry.length;
          } else {
            byteLen = value.length;
          }

          if (byteLen < 4) {
            return this.setState({
              searchResult: []
            });
          }
            let param = {
                value: e.target.value,
                index: 1,
                size: 5
            }



            //如果上一次请求没有返回，取消请求
            this.recentReq && this.recentReq();
            searchUsers(param, this.reqcentReq)
                .then(data => {

                  if(data.content instanceof Array){
                    data.content.forEach((item) => {
                      item.key = item.userId;
                    });
                    let dispSearch = data.content.length > 0 ? 'block' : 'none';
                    this.setState({
                      searchResult: data,
                      dispSearch
                    })
                  }else{
                    this.setState({
                      searchResult: [],
                      dispSearch: 'none'
                    })
                  }
                });

            return true;
        }
    }

    /**
     * 删除事件
     * @param index
     * @returns {Function}
     */
    onDelete = (index) => {
        const {onDelete} = this.props;

        return function () {
            onDelete(index);

        };
    }

    /**
     * 渲染表格体
     * @param body
     * @returns {XML}
     */
    getBodyWrapper = (body) => {
        return (
            <Animate transitionName="move" component="tbody" className={body.props.className}>
                {body.props.children}
            </Animate>
        );
    }

    /**
     * 添加事件
     */
    handleAdd = () => {
        this.setState({
            isAdd: true
        });
    }

    /**
     * 添加用户
     */
    addUser = () => {
        let ids = this.state.authorizedUsers;
        if (ids.length === 0) {
            return;
        }

        let info = this.state.userInfo;
        const {onAdd} = this.props;

        onAdd(info, ids);
        this.setState({authorizedUsers: []});
    }

    /**
     * 取消事件
     */
    cancel = () => {
        this.setState({
            isAdd: false
        })
    }

    /**
     * 取消搜索
     */
    searchRemove = () => {
        this.setState({
            dispSearch: 'none'
        })
    }

    /**
     * 获取搜索框变化
     * @param index
     * @returns {function(*)}
     */
    onSearchItemChange = (index) => {
        return (e) => {
            let checked = e.target.checked;
            // e.target.checked = checked;
            let user = this.state.searchResult.content[index];
            let userInfo = user['userId'];
            let usercode = user['userCode'];
            let username = user['userName'];

            // TODO 感觉这里效率好低啊
            if (checked) {
                let x = this.state.authorizedUsers;
                x.push({
                    userid: userInfo,
                    usercode: usercode,
                    username:username
                });
                this.setState({
                    authorizedUsers: x
                })
            } else {
                this.setState({

                    authorizedUsers: this.state.authorizedUsers.filter(data => {
                        const userId = data['userid'];
                        return !(userId === userInfo);
                    })
                });

            }
        }
    }

    /**
     * 用户选择事件
     * @param eventKey
     */
    handleSelect = (eventKey) => {
        let param = {
            value: this.state.userInfo,
            index: eventKey,
            size: 5
        }
        this.setState({
            activePage: eventKey
        });

        this.recentReq && this.recentReq();
        searchUsers(param, this.reqcentReq)
            .then(data => {
              if(data.content instanceof Array){
                data.content.forEach((item) => {
                  item.key = item.userId;
                });
                let dispSearch = data.content.length > 0 ? 'block' : 'none';
                this.setState({
                  searchResult: data,
                  dispSearch
                })

              }else{
                this.setState({
                  searchResult: [],
                  dispSearch: 'none'
                })
              }
            });
    }

    /**
     * 渲染头部
     * @returns {XML}
     */
    renderHeader = () => {

        return (
            <span>
				<span>用户</span>
                {this.state.isAdd ? (
                    <div style={{position: "absolute", right: 60, top: 10}}>
                        <div style={{display: "inline-block", width: 250}}>
                            <FormControl value={this.state.userInfo} onChange={this.handleInputChange('userInfo')}
                                         placeholder="请输入用户名，邮箱或者手机号"/>

                            <div
                                style={{
                                    display: this.state.dispSearch,
                                    zIndex: '1000',
                                    position: 'absolute',
                                    width: '100%',
                                    backgroundColor: 'lightgray'
                                }}
                                onClick={function (e) {
                                    e.stopPropagation();
                                }}>
                                <Table
                                    data={this.state.searchResult.content}
                                    columns={[{
                                        title: '用户名',
                                        dataIndex: 'userName',
                                        key: 'userName',
                                        render: (text, record, index) => {
                                            let len = text.length;
                                            if (len > 10) {
                                                return text.slice(0, 10) + '...';
                                            }
                                            return text;
                                        }
                                    }, {
                                        title: '登录账号',
                                        dataIndex: 'userCode',
                                        key: 'userCode',
                                        render: (text, record, index) => {
                                            let len = text.length;
                                            if (len > 10) {
                                                return text.slice(0, 10) + '...';
                                            }
                                            return text;
                                        }
                                    }, {
                                        title: '手机号',
                                        dataIndex: 'userMobile',
                                        key: 'userMobile',
                                    }, {
                                        title: '选择',
                                        dataIndex: 'userId',
                                        key: 'userid',
                                        render: (text, record, index) => {
                                            let checked = this.state.authorizedUsers.some(data => {
                                                return data['userid'] === this.state.searchResult.content[index]['userId'];
                                            })
                                            return <input type="checkbox" checked={checked}
                                                          onChange={this.onSearchItemChange(index)} />
                                        }
                                    }]}/>

                                <div style={{textAlign: 'center'}}>
                                    <Pagination style={{display: 'inline-block'}}
                                                first
                                                last
                                                prev
                                                next
                                                boundaryLinks
                                                items={this.state.searchResult.totalPages}
                                                maxButtons={3}
                                                activePage={this.state.activePage}
                                                onSelect={this.handleSelect.bind(this)}/>
                                </div>
                            </div>

                        </div>
                        <Button onClick={this.addUser} colors="danger" style={{margin: "0 10px"}}>授权</Button>
                        <Button onClick={this.cancel}>取消</Button>
                    </div>
                ) : ""
                }
                <div style={{position: "absolute", right: 20, top: 10, fontSize: 20}}>
                    <Icon type='uf-plus' onClick={this.handleAdd} style={{cursor: "pointer"}} />
                </div>

			</span>
        )
    }

    render() {
        const {data, children} = this.props;

        let dataArray = data;
        dataArray.forEach(function (item, index) {
            item.key = index;
        });
        const columns = this.columns;
        return (
            <Panel header={this.renderHeader()}>
                <Table bordered data={dataArray} columns={columns} getBodyWrapper={this.getBodyWrapper}/>
                {children}
            </Panel>
        );
    }
}
export default DisplayCard;
