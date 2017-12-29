import React, {
  Component
} from 'react';
import {
  Modal,
  Button,
  Message
} from 'tinper-bee';
import CodeMirror from 'codemirror';
import {
  findDOMNode
} from 'react-dom';

import './index.less'
class InfoModal extends Component {
  constructor(props) {
    super(props);
    this.flag = '';
    this.state = {
      value: ''
    }
  }


  // componentDidUpdate() {
  componentWillReceiveProps(nextProps) {
    const {
      show,
      data
    } = nextProps;
    let flag = false;
    let modeStr = 'xml';
    if (show) {
      if (this.props.data.path && this.props.data.path.indexOf('properties') > -1) {
        modeStr = 'properties';
      }
      if (this.flag !== data.key) {
        // var editor = CodeMirror.fromTextArea(findDOMNode(this.refs.content), {
        //   value: data.value,
        //   lineNumbers: true,
        //   mode: modeStr,
        //   keyMap: "sublime",
        //   autoCloseBrackets: true,
        //   matchBrackets: true,
        //   showCursorWhenSelecting: true,
        //   theme: "blackboard",
        //   tabSize: 2
        // });
        this.flag = data.key;
      }
    }
  }


  render() {
    const {
      show,
      onClose,
      data
    } = this.props;

    return (
      <Modal show={ show } size="lg" onHide={onClose}>
        <Modal.Header>
          <Modal.Title>{ data.key }</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <textarea className="configfile-info" disabled ref="content" value={data.value} />
          </div>
        </Modal.Body>

        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    )
  }
}


export default InfoModal;
