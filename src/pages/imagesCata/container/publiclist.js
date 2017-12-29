import React, {Component, PropTypes} from 'react'
import {Row, Col, Breadcrumb, Tile, Table, Popconfirm, Icon, Button, Message, Clipboard} from 'tinper-bee'
import NoData from '../components/noData/noData';
import { getInfo } from '../../../serves/imageCata';
import imgUrl from '../../../assets/img/image_cata/docker.png';
import {ImageIcon} from '../../../components/ImageIcon';
import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';

import {formateDate} from '../../../components/util'

import 'rc-tabs/assets/index.css';
import './publiclist.css';

function checkEmpty(data) {
    if (typeof data == undefined || !data || data === "") {
        return "暂无数据";
    }
    return data;
}

class PublicList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cata: '',
            image: '',
            infoData: null,
        };
        this.columns = [{
            title: ' ',
            dataIndex: 'dr',
            key: 'dr',
            render: function () {
                return (<Icon type="uf-box-2" style={{color: '#00bc9b', fontSize: 20}}/>)
            },
            width: '1%'
        }, {
            title: '版本',
            dataIndex: 'image_tag',
            key: 'image_tag',
        }, {
            title: '最近更新时间',
            dataIndex: 'ts',
            key: 'ts',
        }, {
            title: '镜像ID',
            dataIndex: 'pure_image_name',
            key: 'pure_image_name',
        }, {
            title: '操作',
            className: 'text-center',
            dataIndex: 'operation',
            key: 'operation',
            render: this.renderCellTwo.bind(this),
        }];

    }
    componentDidMount () {
        const { location } = this.props;

        const self = this;
        getInfo(`?id=${ location.query.id }`, function (res) {
            if(res.data.error_code){
                Message.create({ content: '查询镜像信息详情出错', color: 'danger', duration: null });
            }else{
               self.setState({
                   infoData: res.data.data[0]
               })
            }
        });

    }

    componentDidUpate () {
        const { infoData } = this.state;
        if(infoData.image_detail){

        }
    }

    /**
     * 渲染表格操作列
     * @param text
     * @param record
     * @param index
     * @returns {XML}
     */
    renderCellTwo = (text, record, index) => {
        const {cata, onDelete} = this.props;
        return (
            <div className="operation-menu text-center">
                 <span className="operation" onClick={ this.handlePublic(record.id) }>
                  <Icon type="uf-send"/>
                  部署
                  </span>
                {
                    cata === 'publiccata' ? '' : (
                        <Popconfirm content="确认删除?" onClick={this.handleDeleteClick}
                                    onClose={onDelete(record.id, index)}>
                        <span className="del">
                        <Icon type="uf-del"/>
                        删除
                        </span>
                        </Popconfirm>
                    )
                }
            </div>

        );
    }

    /**
     * 部署按钮事件
     * @param id 镜像id
     */
    handlePublic = (id) => {
        const {cata} = this.props;
        const self = this;
        return function (e) {
            self.context.router.push(`/${cata}/publish/${id}`);
            e.stopPropagation();
        }

    }

    /**
     * tab页签点击回调函数
     */
    changePanelKey = () => {

    }

    /**
     * 删除图标点击事件
     * @param e
     */
    handleDeleteClick = (e) => {
        e.stopPropagation();
    }

    /**
     * 表格行点击事件
     * @param record
     * @param index
     */
    handleClick = (record, index) => {
        const {cata, location} = this.props;

        this.context.router.push(`/${cata}/versioninfo/${record.id}?listId=${ location.query.id }`)
    }

    /**
     * 左侧部署按钮，部署latest版本
     */
    pageToPublish = () => {
        const { data, cata } = this.props;
        let id;
        data.forEach(function (item){
            if(item.image_tag === 'latest'){
                id = item.id;
            }
        });
        if(!id){
            id = data[0].id;
        }

        this.context.router.push(`/${cata}/publish/${id}`)
    }

    render() {
        const {data, cata} = this.props;
        const self = this;
        let versionData = data;
        let latestName = "";
        if (versionData instanceof Array && versionData.length !== 0) {
            versionData.forEach(function (item, index) {
                item.key = index;
                if(item.image_tag === 'latest'){
                    latestName = item.image_name;

                }
            });
            if(latestName === ""){
                latestName = versionData[0].image_name;
            }
        }


        let img;
        if (cata === 'publiccata') {
            if (data instanceof Array && data.length !== 0) {
                img = `${data[0].pure_image_name.toLowerCase()}-png`;
            }
        } else {
            if (data instanceof Array && data.length !== 0 && data[0].icon_path) {
                img = `${data[0].icon_path}`
            } else {
                img = imgUrl;
            }

        }




        let tabTitle1 = (<span className="tab-title"><i className="cl cl-cloudmachine-o"/>详情</span>);
        let tabTitle2 = (<span className="tab-title"><i className="cl cl-history"/>版本</span>);
        const { infoData } = this.state;
        return (
            <Row className="public-list">
                <div className="public-content">
                    {
                        infoData ? (
                            <div className="list-nav">
                                <div className="img">
                                    {  ImageIcon(img, "default-png img-size") }
                                </div>
                                <h3 className="image-name">
                                    { infoData.pure_image_name }
                                </h3>
                                <p className="offical">Docker Offical</p>
                                <div className="count">
                                    <span><i className="cl cl-eye"/>{ infoData.view_count }</span>
                                    <span><i className="cl cl-cloud-download"/>{ infoData.pull_count }</span>
                                </div>
                                <Button colors="primary" shape="squared" className="publiclist-button" onClick={ this.pageToPublish }>部署</Button>
                                <ul className="publiclist-info">
                                    <li>
                                        <span>作者:</span>
                                        <span className="info">{checkEmpty(infoData.user_name)}</span>
                                    </li>
                                    <li>
                                        <span>最新版本:</span>
                                        <span className="info">{checkEmpty(infoData.latest_version)}</span>
                                    </li>
                                    <li>
                                        <span>最近更新:</span>
                                        <span className="info">{checkEmpty(formateDate(infoData.latest_ts))}</span>
                                    </li>
                                </ul>
                                <p className="publiclist-description">

                                </p>
                            </div>
                        ) : ""
                    }

                    <div className="publiclist-content">
                        {
                            infoData ? (
                                <Tabs
                                    defaultActiveKey={'1'}
                                    onChange={this.changePanelKey}
                                    destroyInactiveTabPane
                                    renderTabBar={() => <ScrollableInkTabBar />}
                                    renderTabContent={() => <TabContent />}
                                >
                                    <TabPane tab={tabTitle1} key="1">
                                        <p className="docker-path">
                                            <span className="text-break">
                                               { latestName }
                                             </span>  
                                            <Clipboard text={ latestName } action="copy">
                                                <i className="cl cl-copy-c" />
                                            </Clipboard>
                                        </p>
                                        <p>
                                            { infoData.image_info }
                                        </p>
                                        <div ref="detail" dangerouslySetInnerHTML={{ __html: infoData.image_detail }} />

                                    </TabPane>
                                    <TabPane tab={tabTitle2} key="2">
                                        <p className="docker-path">
                                            <span className="text-break">
                                                { latestName }
                                             </span>   
                                    
                                            <Clipboard text={ latestName } action="copy">
                                                <i className="cl cl-copy-c" />
                                            </Clipboard>
                                        </p>
                                        <Table style={{marginTop: 40}} data={versionData} columns={this.columns}
                                               onRowClick={this.handleClick } emptyText={function () {
                                            return (<NoData />)
                                        }}/>
                                    </TabPane>
                                </Tabs>
                            ) : (
                                <NoData />
                            )
                        }

                    </div>
                </div>

            </Row>
        )
    }
}

PublicList.contextTypes = {
    router: PropTypes.object
};

export default PublicList;
