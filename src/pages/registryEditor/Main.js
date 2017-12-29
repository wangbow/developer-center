import React, {Component, PropTypes} from 'react'
import {Table, Icon, Row, Col} from 'tinper-bee';
import {Link} from 'react-router';
import Title from '../../components/Title';

import {getPublicImage} from '../../serves/imageCata'
import {getList} from '../../serves/registryEditor'
import {lintAppListData} from '../../components/util'
import {formateDate} from '../../components/util';

import styles from './index.css';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '图标',
            dataIndex: 'dr',
            key: 'dr',
            render: function () {
                return (<Icon type="uf-box-2" style={{color: '#00bc9b', fontSize: 20}}/>)
            },
            width: '1%'
        }, {
            title: '镜像名称',
            dataIndex: 'pure_image_name',
            key: 'pure_image_name',
        }, {
            title: '创建时间',
            dataIndex: 'ts',
            key: 'ts',
            render: function (text, record, index) {
                return formateDate(text);
            },
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: this.renderCellTwo.bind(this),
        }];

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        const self = this;
        getList(function (res) {
            let data = lintAppListData(res);
            let list = data.data;
            if (list instanceof Array) {
                list.forEach(function (item, index) {
                    item.key = index;
                })
            }
            self.setState({
                data: list
            });
        })
    }

    renderCellTwo = (text, record, index) => {
        return (
            <Link to={`/editor/${ record.id }`}><Icon type="uf-rulerpen-o" style={{color: '#0084ff'}}/></Link>
        );
    }

    render() {

        return (
            <Row>
                <Title name="镜像编辑器" showBack={false}/>
                <Col md={10} mdOffset={1} style={{marginTop: 50}}>
                    <Table bordered data={this.state.data} columns={this.columns}/>
                </Col>
            </Row>
        )
    }
}

MainPage.contextTypes = {
    router: PropTypes.object
}

export default MainPage;
