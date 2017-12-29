import React,{Component} from 'react';
import {Row} from 'tinper-bee';


import './index.css';


class ApplicationContent extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <Row>
                {
                    this.props.children
                }
            </Row>
        )
    }

}

export default ApplicationContent;
