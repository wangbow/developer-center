import React, {Component} from 'react';
import Title from '../../components/Title';
import marked from 'marked';
import { Row, Col, Form, Button, Message} from 'tinper-bee';
import {lintAppListData} from '../../components/util';
import {getEdit, upDate} from '../../serves/registryEditor';

class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            md: "# 这是MARKDOWN",
            data: marked("# 这是MARKDOWN"),
            info: '',
            allData: {}
        };
    }

    componentDidMount() {
        const {params} = this.props;
        const self = this;

        getEdit(`?id=${ params.id }`, function (res) {
            let data = lintAppListData(res);

            if(data.data.image_detail_md){
                self.setState({
                    md: data.data.image_detail_md,
                    data: marked(data.data.image_detail_md),
                    info: data.data.image_info,
                    allData: data.data
                })
            }else{
                self.setState({
                    info: data.data.image_info,
                    allData: data.data
                })
            }

        })


        // var testEditor = editormd("editormd", {
        //     width   : "90%",
        //     height  : 640,
        //     syncScrolling : "single",
        //     path    : "../../lib/"
        // });


    }

    update = () => {
        let data = this.state.allData;

        data.image_detail_md = this.state.md;
        data.image_detail = this.state.data;
        data.image_info = this.state.info;

        upDate(data, function (res) {
            if(res.data.success === 'true'){
                Message.create({ content: '更新成功', color: 'success'});
            }
        })
    }
    handleDetailChange = (e) => {
        this.setState({
            data: marked(e.target.value),
            md: e.target.value
        })

    }

    handleInputChage = (e) => {
        this.setState({
            info: e.target.value
        })
    }

    render() {
        return (
            <Row>
                <Title name="镜像编辑器" />
                <Col md={10} mdOffset={1}>
                    <Row>
                        <Col md={12}>
                            <h1 style={{ textAlign: 'center' }}>{ this.state.allData.pure_image_name }</h1>
                        </Col>
                        <Col md={12}>
                                <Col md={12} style={{ padding: 15, fontSize: 20 }}>镜像概述</Col>

                                <Col md={12}>
                                <textarea className="md-info"
                                          onChange={ this.handleInputChage }
                                          value={ this.state.info }
                                          row="3"
                                />

                                </Col>
                        </Col>
                        <Col md={12}>
                            <Col md={12} style={{ padding: 15, fontSize: 20 }}>镜像描述</Col>

                            <Col md={6}>
                                <textarea className="md-detail"
                                          onChange={ this.handleDetailChange }
                                          value={ this.state.md }
                                />

                            </Col>
                            <Col md={6}>
                                <div className="md-effect"
                                     dangerouslySetInnerHTML={{__html: this.state.data}}
                                />
                            </Col>
                        </Col>
                        <Col md={12} style={{ margin: 15 }}>

                            <Button colors="primary" shape="squared" onClick={ this.update }>保存</Button>
                        </Col>
                    </Row>



                </Col>
            </Row>
        )
    }
}

export default Editor;
