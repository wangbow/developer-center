import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'tinper-bee';


class PublicModal extends Component {

  static propTypes = {
    flag: PropTypes.bool,
    show: PropTypes.bool,
    onClose: PropTypes.func,
    onEnsure: PropTypes.func
  }

  static defaultProps = {
    flag: false,
    show: false,
    onClose: () => {},
    onEnsure: () => {}
  }

  render() {
    const {show, onClose, flag, onEnsure} = this.props;

    return (
      <Modal
        show={ show }
        onHide={ onClose }
      >
        <Modal.Header>
          <Modal.Title>公开配置文件</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            `是否要${flag ? "隐藏" : "公开"}当前配置文件？`
          }
        </Modal.Body>

        <Modal.Footer>

          <Button onClick={ onClose } shape="squared" style={{marginBottom: 15}}>取消</Button>
          <Button onClick={ onEnsure } colors="primary" shape="squared"
                  style={{marginLeft: 20, marginRight: 20, marginBottom: 15}}>确认</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}


export default PublicModal;
