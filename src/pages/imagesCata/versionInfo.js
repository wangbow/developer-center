import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom';
import {Row, Col, Breadcrumb, Icon, Button, Clipboard} from 'tinper-bee'
import {formateDate, copyToClipboard, lintAppListData} from '../../components/util'
import {getImageInfo, getPubImageInfo} from '../../serves/imageCata'


function checkEmpty(data) {
    if (typeof data == undefined || !data || data === "") {
        return "暂无数据";
    }
    return data;
}

class VensionInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            cata: "",
            image: "",
            version: ""
        };
    }

    componentDidMount() {
        const self = this;
        const {cata} = this.props;
        let id = this.props.params.id;
        if (cata === 'publiccata') {
            getPubImageInfo(`?id=${id}`, function (res) {
                let data = lintAppListData(res);
                if (!data.error_code) {
                    let newData = data.data;
                    if (newData instanceof Array && newData.length !== 0) {
                        self.setState({
                            data: newData[0]
                        })
                    }
                }
            });
        } else {
            getImageInfo(`?id=${id}`, function (res) {
                let data = lintAppListData(res);
                if (!data.error_code) {
                    let newData = data.data;
                    if (newData instanceof Array && newData.length !== 0) {
                        self.setState({
                            data: newData[0]
                        })
                    }
                }

            });
        }
    }


    /**
     * 复制事件
     */
    handleCopy = () => {
        let text = findDOMNode(this.refs.cmd).innerHTML;

        copyToClipboard(text);
    }

    /**
     * 部署事件
     */
    handlePublish = () => {
        let id = this.props.params.id;
        const {cata} = this.props;
        this.context.router.push(`/${cata}/publish/${id}`);
    }

    /**
     * 返回按钮事件
     */
    handleBack = () => {
        let {cata, params, location} = this.props;
        let { data } = this.state;
        if(cata === 'publiccata'){
            this.context.router.push(`/publiccata/versionlist?id=${location.query.listId}&imagename=${data.pure_image_name}`);
        }else{
            this.context.router.push(`/ownercata/versionlist?id=${location.query.listId}`);
        }

    }

    render() {
        let data = this.state.data;
        let name = data.image_name;


        return (
            <Row className="version-info">
                <Col xs={10} xsOffset={1} style={{ background: '#fff', marginTop: 20, boxShadow: '0 0 5px #d3d3d3', marginBottom: 20 }}>
                    <Col xs={10} xsOffset={1}>
                        <p className="info-title">镜像拉取命令</p>
                    </Col>
                    <Col xs={10} xsOffset={1} className="pull-cmd">
                        <div className="text-break">
                            <span ref="cmd">{`docker pull ${name}`}</span>
                            <Clipboard text={ `docker pull ${data.image_name}` } action="copy">
                                <i className="cl cl-copy-c"/>
                            </Clipboard>

                        </div>
                    </Col>
                    <Col xs={10} xsOffset={1}>
                        <p className="info-title">镜像详情</p>
                    </Col>
                    <Col xs={10} xsOffset={1} className="info">
                        <Row>
                            <Col sm={6}>
                                <div
                                    className="version-info-label">
                                    创建者
                                </div>
                                <div
                                    className="version-text"
                                    title={ data.creator }>
                                    { checkEmpty(data.creator) }
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div
                                    className="version-info-label">
                                    创建时间
                                </div>
                                <div
                                    className="version-text"
                                    title={ formateDate(data.ts) }>
                                    { data.ts ? formateDate(data.ts) : "暂无数据" }
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <div
                                    className="version-info-label">
                                    Docker版本
                                </div>
                                <div
                                    className="version-text"
                                    title={ data.docker_version }>
                                    { checkEmpty(data.docker_version) }
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div
                                    className="version-info-label">
                                    系统
                                </div>
                                <div
                                    className="version-text"
                                    title={ data.system_infomation }>
                                    { checkEmpty(data.system_infomation) }
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <div
                                    className="version-info-label">
                                    镜像ID
                                </div>
                                <div
                                    className="version-text"
                                    title={ data.image_id }>
                                    { checkEmpty(data.image_id) }
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <div
                                    className="version-info-label">
                                    父镜像ID
                                </div>
                                <div
                                    className="version-text"
                                    title={ data.parent_image_id }>
                                    { checkEmpty(data.parent_image_id) }
                                </div>
                            </Col>
                        </Row>

                    </Col>
                    <Col xs={10} xsOffset={1}>
                        <Button
                            colors="danger"
                            onClick={ this.handlePublish }
                            shape="squared"
                            className="btn-ensure">
                            部署
                        </Button>
                        <Button
                            shape="squared"
                            onClick={ this.handleBack }
                            className="btn-cancel">
                            返回
                        </Button>
                    </Col>


                </Col>

            </Row>
        )
    }
}

VensionInfo.contextTypes = {
    router: PropTypes.object
};

export default VensionInfo;
