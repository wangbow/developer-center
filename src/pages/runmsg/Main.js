import React,{Component} from 'react';
import {Row, Col, Tile,i} from 'tinper-bee';
import axios from 'axios';
import styles from './index.css';
import {splitParam,map} from '../../components/util';


class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mainList: {
                "detailMsg": {
                    "data": []
                }
            },
            appID: [],
            noData: "none"
        }

    }
    componentDidMount() {
        const self = this;
        axios.post('/ycm-yco/web/v1/queryoperdata/query')
            .then(function (res) {
                if (res.data == "" || res.data.error_code) {
                    self.setState({noData: "block"});
                }else{
                    self.setState({mainList: res.data});
                }

            })
            .catch(function (err) {
                self.setState({noData: "block"})
            });
    }

    render() {
        let self = this;
        let list = this.state.mainList.detailMsg.data;
        let appcol = 3;
        return (
            <div className="msg-row">
                <div className="no-data" style={{display:self.state.noData}}>
                    <img className="no-data-png" src={require('../../assets/img/taskEmpty.png')}/>

                    <div>没有已上架的应用哦</div>
                </div>
                <Row>
                    <Col md={11} className="msg-11">
                        {
                            list.map(function (status) {
                                let backColor = function () {
                                    let msg = [
                                        "rgba(62,187,197, 0.8)",
                                        "rgba(78, 191, 255, 0.8)",
                                        "rgba(241, 144, 75, 0.8)",
                                        "rgba(41,166,85, 0.8)"
                                    ];
                                    appcol = (appcol + 1) % 4;
                                    return msg[appcol];
                                };
                                let border = {border: "0px"};
                                let pic = require('../../assets/img/runmsg.png');
                                let back = {
                                    backgroundImage: 'url(' + pic + ')',
                                    backgroundColor: backColor()
                                };
                                return (
                                    <Col key={status.appId} md={4} className="msg-col">
                                        <Tile className="msg-tile">
                                            <Col md={12} className="msg-back" style={back}>
                                                <Col md={4}><i className="cl cl-cloudapp-o tile-icon"></i></Col>
                                                <Col md={8} className="msg-appId"><h3>{status.appName}</h3></Col>
                                            </Col>
                                            <Col>
                                                <Col md={4} className="msg-data">

                                                    <h3>订单金额</h3>

                                                    <h2 className="msg-num-blue">{status.appDatas[0].value}</h2>
                                                </Col>
                                                <Col md={4} className="msg-data">

                                                    <h3>订单数量</h3>

                                                    <h2 className="msg-num-red">{status.appDatas[1].value}</h2>
                                                </Col>
                                                <Col md={4} className="msg-data" style={border}>

                                                    <h3>续费金额</h3>

                                                    <h2 className="msg-num-green">{status.appDatas[2].value}</h2>
                                                </Col>
                                            </Col>
                                        </Tile>
                                    </Col>
                                )
                            })
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}


export default MainPage;
