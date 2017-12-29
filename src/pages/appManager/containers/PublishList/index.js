import React, {Component} from 'react';
import {GetPublishList, GetStatus, GetResPool, GetResPoolInfo} from '../../../../serves/appTile';
import PublishTile from '../../components/publish-tile';
import {Select, Col, Row, Label, Button, InputGroup, FormControl, Icon} from 'tinper-bee';
import {lintAppListData} from '../../../../components/util';
import PageLoading from '../../../../components/loading';
import NoData from '../../../../components/noData';
import {Link} from 'react-router';
import Title from '../../../../components/Title';

import './index.css';

const Option = Select.Option;

class PublishList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            getPublishAppParam: '',
            appPublishList: [],
            filterResList: [],
            hostList: [],
            filterHost: 'all',
            filterRes: 'all',
            filterHostList: [],
            showLoading: true,
            searchValue: ''
        }
        this.publishTimer = null;
    }

    componentDidMount() {
        this.getPublishList();
        this.getRes();
    }

    componentWillUnmount() {
        window.clearInterval(this.publishTimer);
    }

    /**
     * 搜索
     **/
    handleSearch = (e) => {
        let name = e.target.value;
        this.setState({
            searchValue: name
        })
    }

    /**
     * 循环更新状态
     */
    loopGetPublishList = () => {

        this.publishTimer = setInterval(() => {
            let {getPublishAppParam} = this.state;
            this.getPublishList(getPublishAppParam);
        }, 5000)
    }

    /**
     * 获取部署列表
     * @param param
     */
    getPublishList = (param) => {
        if (!param) {
            param = ''
        }
        let appList = {};

        GetPublishList(param).then((response) => {

            appList = lintAppListData(response);
            let ids = '';
            let sessionObj = {};
            if (!appList || appList.error_code) {
                this.setState({
                    showLoading: false
                })
                return false;
            }

            appList.forEach(function (item, index) {
                item.key = index;
                ids += ',' + item.app_id;
                sessionObj[item.id] = item;
            })
            ids = ids.substring(1);

            this.setState({
                appPublishList: appList,
                showLoading: false

            });
            let param = {appids: ids};
            sessionStorage.setItem("publishList", JSON.stringify(sessionObj));

            return GetStatus(splitParam(param));

        }).then((response) => {

            let sessionObj = {};
            let stateList = lintAppListData(response, null, null);

            if (!stateList || stateList.error_code) return;

            stateList.forEach((item, index) => {
                sessionObj[item.appId] = item;
            })

            appList.forEach((item, index) => {
                item.runState = sessionObj[item.app_id].status;
                item.runStateMessage = sessionObj[item.app_id].message;
            })


            this.setState({
                appPublishList: appList
            });

            this.getGroundList();
        }).catch((e) => {
            this.setState({
                showLoading: false
            })
        });
    }

    /**
     * 获取部署列表上部署的资源池及主机信息
     */
    getRes = () => {
        GetResPool((res) => {

            if (!res.data.error_code) {
                let resData = [];
                for (let key in res.data) {
                    let resObj = {};
                    resObj.name = res.data[key].resourcepool_name;
                    resObj.id = res.data[key].resourcepool_id;
                    resData.push(resObj);
                }
                GetResPoolInfo((response) => {
                    if (!response.data.error_code) {
                        this.setState({
                            filterResList: resData,
                            hostList: response.data
                        })
                    }
                })
            }
        });

    }

    /**
     * 过滤部署列表
     **/
    filterPublishData = (res, host) => {
        let param = '';
        if (host === '') {
            if (res === 'all') {
                this.getPublishList(param);
            } else {
                param = `?filter=resource&res_id=${res}`;
                this.getPublishList(param)
            }

        } else {
            if (host === 'all' && this.state.filterRes !== 'all') {
                param = `?filter=resource&res_id=${this.state.filterRes}`;
                this.getPublishList(param)
            } else {
                param = `?filter=hostname&hostname=${host}`;
                this.getPublishList(param)
            }

        }
        this.setState({
            getPublishAppParam: param
        })

    }

    /**
     * 捕获下拉选择事件
     * @param state 要改变的state
     * @returns {function(*=)}
     */
    handleSelectChange = (state) => {
        let {hostList} = this.state;
        return (value) => {
            if (state === 'filterRes') {
                this.setState({
                    filterHostList: hostList.hasOwnProperty(value) ? hostList[value] : [],
                    filterHost: 'all'
                })
                this.filterPublishData(value, '');
            } else {
                this.filterPublishData('', value);
            }
            this.setState({
                [state]: value
            })
        }
    }

    /**
     * 渲染部署列表
     * @returns {Array}
     */
    renderPublishList = () => {
        let {searchValue} = this.state;
        let appList = this.state.appPublishList;
        let len = appList.length;
        if (!appList || len == 0) return <NoData />;
        if (searchValue !== '') {
            let reg = new RegExp(searchValue, 'ig');
            appList = appList.filter((item, index) => {
                return reg.test(item.name)
            })
        }
        return appList.map((item, index) => (
            <PublishTile key={index} index={index} AppData={item}/>
        )).reverse()

    }

    render() {
        return (
            <div>
                <Title showBack={false} name="应用管理"/>
                <div className="header-button">
                    <Link to="/publish" style={{color: "#fff"}}>
                        <Button shape="squared" colors="primary" style={{marginRight: 8}}>
                            <i className="cl cl-clouddeploy create-icon"/>
                            部署列表
                        </Button>
                    </Link>

                    <a href="/fe/continuous/index.html#createApp" style={{color: "#fff"}}>
                        <Button colors="primary" shape="squared">
                            <i className="cl cl-add-c-o create-icon"/>
                            创建新应用
                        </Button>
                    </a>
                    <InputGroup simple style={{float: 'right', marginRight: 40}}>
                        <FormControl
                            style={{width: 251}}
                            value={ this.state.searchValue }
                            onChange={ this.handleSearch }
                            type="text"
                        />
                        <InputGroup.Button shape="border">
                            <Icon type="uf-search"/>
                        </InputGroup.Button>
                    </InputGroup>

                </div>
                <div className="applist">
                    <Row className="width-full">

                        <Col md={12}>
                            <Label style={{marginLeft: 30}}>资源池</Label>
                            <Select
                                value={ this.state.filterRes}
                                size="lg"
                                className="select-res"
                                onChange={this.handleSelectChange('filterRes')}>
                                {
                                    this.state.filterResList.map(function (item, index) {
                                        return (
                                            <Option value={item.id} key={ index }>{ item.name }</Option>
                                        )
                                    })
                                }
                                <Option value="all" key="all">全部</Option>
                            </Select>
                            <Label style={{marginLeft: 30}}>主机</Label>
                            <Select
                                value={ this.state.filterHost}
                                size="lg"
                                className="select-res"
                                onChange={this.handleSelectChange('filterHost')}>
                                {
                                    this.state.filterHostList.map(function (item, index) {
                                        return (
                                            <Option value={item.Hostname} key={ index }>{ item.Hostname }</Option>
                                        )
                                    })
                                }
                                <Option value="all" key="all">全部</Option>
                            </Select>
                        </Col>
                        <Col md={12}>
                            {
                                this.renderPublishList()
                            }
                        </Col>

                        <PageLoading show={ this.state.showLoading }/>
                    </Row>
                </div>
            </div>
        )
    }
}

export default PublishList;
