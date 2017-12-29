import React, {Component} from 'react'
import {Row, Col, Breadcrumb, Tile, Message} from 'tinper-bee'
import Image from './components/image/image';
import {getPublicImage} from '../../serves/imageCata'
import NoData from './components/noData/noData'
import {lintAppListData} from '../../components/util'
import PageLoading from '../../components/loading/index';

class PublicCata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showLoading: true
        }
    }

    componentDidMount() {
        const self = this;

        //获取公有镜像列表信息
        getPublicImage(function (res) {
            let data = lintAppListData(res);
            if (data.error_code) {
                Message.create({content: '镜像仓库服务出错，请联系管理员', color: 'danger', duration: null})
            } else {
                window.setTimeout(()=>{
                    self.setState({
                        data: data.data,
                        showLoading: false
                    })
                },600);
            }

        })
    }

    componentWillReceiveProps(nextProps) {
        const {searchValue} = nextProps;
        const {data} = this.state.data;
        if (searchValue !== "") {
            data.filter(function (item) {
                let nameReg = new RegExp(searchValue);
                return nameReg.test(item.pure_image_name);
            });
            this.setState({
                data: data
            })
        }

    }

    render() {

        return (
            <Col sm={12} className="public-registry">
                <Row style={{ marginBottom: 40 }}>
                    {
                        this.state.data.length === 0 ? (<NoData />) : this.state.data.map(function (item, index) {
                            return (<div className="image-card">
                                <Image data={item} key={index}
                                       path={`/publiccata/versionlist?id=${item.id}&imagename=${item.pure_image_name}`}/>
                            </div>);
                        })
                    }
                </Row>
                <PageLoading show={ this.state.showLoading } />
            </Col>
        )

    }
}
export default PublicCata;
