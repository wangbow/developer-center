/**
 * Created by Administrator on 2017/2/17.
 */
import React,{Component} from 'react';
import {Row, Col, Table,Pagination} from 'tinper-bee';
import style from'./index.css';


class publishLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1
        }
    }

    handleSelect(eventKey) {
        this.setState({
            activePage: eventKey
        });
    }

    render() {
        const columns = [
            {title: 'ID', dataIndex: 'myComID', key: 'myComID'},
            {title: '应用名称', dataIndex: 'appName', key: 'appName'},
            {title: '状态', dataIndex: 'state', key: 'state'},
            {title: '开始时间', dataIndex: 'startTime', key: 'startTime'},
            {title: '停止时间', dataIndex: 'stopTime', key: 'stopTime'},
            {title: '主机IP', dataIndex: 'myIP', key: 'myIP'}
        ];

        return (
            <div className="pu">
                <Row className="pu-row">
                    <Col>发布日志</Col>
                    <Col>
                        <Table columns={columns}></Table>
                    </Col>
                    <Col>
                        <div>
                            <Pagination
                                first
                                last
                                prev
                                next
                                boundaryLinks
                                items={20}
                                maxButtons={5}
                                activePage={this.state.activePage}
                                onSelect={this.handleSelect.bind(this)}/>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default publishLog;
