import React, { Component, PropTypes } from 'react';
import { Row, Col, Label, ProgressBar, Breadcrumb, Tooltip, Button, Select, Table, Message, Popconfirm, FormControl, InputGroup, Icon } from 'tinper-bee';
import classnames from 'classnames';
import './index.less';
import { getQueryString, splitParam } from 'components/util';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { getInterfaceName, toolTipData } from '../../mscon-utils/util';

class Rely extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    gotoServerPage = (e) => {
        let { changeState } = this.props;
        if (changeState) {
            changeState("1");
        }
    }
    
    render() {
        let { interface_name, service_name } = this.props;
        let interfaceName = getInterfaceName(interface_name);
        return (
            <div className="relyWrap">
                <Col md={12} sm={12} className="padding-horizontal-0">
                    <Breadcrumb>
                        <span className="curpoint" onClick={this.gotoServerPage} >
                            <Icon type="uf-anglepointingtoleft" > 返回</Icon>
                        </span>
                        <Breadcrumb.Item className="margin-left-20">
                            {<OverlayTrigger overlay={toolTipData(interface_name)} placement="bottom">
                                <div className="font-style">{interfaceName}</div>
                            </OverlayTrigger>}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {service_name}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <h3 className="text-center" >no Data </h3>
            </div>
        )
    }
}

export default Rely;
