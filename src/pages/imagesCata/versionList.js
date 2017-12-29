import React, {Component, PropTypes} from 'react'
import {Row, Col, Breadcrumb, Tile, Table, Popconfirm, Icon} from 'tinper-bee'
import NoData from './components/noData/noData'
import imgUrl from '../../assets/img/image_cata/docker.png';
import {ImageIcon} from '../../components/ImageIcon';

class VensionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cata: '',
            image: ''
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
            width: '30%',
            className: 'max-length-200',
        }, {
            title: '镜像ID',
            dataIndex: 'pure_image_name',
            key: 'pure_image_name',
            width: '30%',
            className: 'max-length-200'
        }, {
            title: '操作',
            className: 'text-center',
            dataIndex: 'operation',
            key: 'operation',
            render: this.renderCellTwo.bind(this),
        }];
        this.renderCellTwo = this.renderCellTwo.bind(this);
        this.handlePublic = this.handlePublic.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);

    }

    /**
     * 渲染表格操作列
     * @param text 当前文本
     * @param record 当前行数据对象
     * @param index 当前行索引
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
                        <Popconfirm
                            content="确认删除?"
                            onClick={ this.handleDeleteClick }
                            onClose={onDelete(record.id, index)}>
                            <span style={{cursor: 'pointer'}} className="del">
                            <Icon type="uf-del" />
                            删除
                            </span>
                        </Popconfirm>
                    )
                }
            </div>

        );
    }

    /**
     * 发布按钮点击事件
     * @param id
     * @returns {Function}
     */
    handlePublic(id) {
        const {cata} = this.props;
        const self = this;
        return function (e) {
            self.context.router.push(`/${cata}/publish/${id}`);
            e.stopPropagation();
        }

    }

    /**
     * 删除图标点击事件
     * @param e
     */
    handleDeleteClick(e) {
        e.stopPropagation();
    }

    /**
     * 行点击事件
     * @param record 当前行数据对象
     * @param index 当前行索引
     */
    handleClick(record, index) {
        const {cata} = this.props;
        this.context.router.push(`/${cata}/versioninfo/${record.id}`)
    }

    render() {
        const {data, cata} = this.props;
        let versionData = data;
        if (versionData instanceof Array) {
            versionData.forEach(function (item, index) {
                item.key = index;
            });
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

        return (
            <Row
                className="version-list">
                <Col
                    md={3}>
                    <div
                        className="versionlist-img">
                        <div
                            className="img-container">
                            { cata === 'publiccata' ? ImageIcon(img, "default-png img-size") : ImageIcon(img, "img-size") }
                        </div>
                        <div
                            style={{padding: 5}}>
                            { data[0] ? data[0].pure_image_name : "" }
                        </div>
                    </div>

                </Col>
                <Col
                    md={9}>
                    <Table
                        style={{marginTop: 40}}
                        data={versionData}
                        columns={this.columns}
                        onRowClick={this.handleClick }
                        emptyText={function () {
                            return (<NoData />)
                        }}/>

                </Col>
            </Row>
        )
    }
}

VensionList.contextTypes = {
    router: PropTypes.object
};

export default VensionList;
