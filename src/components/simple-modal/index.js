import React,{Component, PropTypes} from 'react';
import {Modal,Button} from 'tinper-bee';

import './index.less';

class SimpleModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    onEnsure: PropTypes.func,
    title: PropTypes.string
  }
  static defaultProps = {
    show: false,
    onClose: () => {},
    onEnsure: () => {},
    title: ''
  }

  render () {
    const {title,onClose,show, onEnsure} = this.props;


    return (
      <Modal
        show = { show }
        className="simple-modal"
        onHide = { onClose } >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={ onClose } shape="squared" style={{marginRight: 50}}>取消</Button>
          <Button onClick={ onEnsure } colors="primary" shape="squared">确认</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default SimpleModal;
