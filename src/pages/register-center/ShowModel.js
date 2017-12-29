import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Modal,Button,Switch} from 'tinper-bee';

class ShowModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalState: this.props.showModalState
        };
     
    }
   
    componentWillReceiveProps(props) {
        this.setState({
            showModalState: this.props.showModalState
        })
    }
    render () {
        return (
            <span>
              <Modal
                  show = { this.state.showModalState }>
                  <Modal.Header>
                      <Modal.Title>等待下载</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      等待下载!!!
                  </Modal.Body>
                  <Modal.Footer>
                     
                  </Modal.Footer>
             </Modal>
          </span>
        )
    }
}

export default ShowModel;
