import React,{Component} from 'react';
import {Modal,Button,Checkbox} from 'tinper-bee';
import '../pages/continuous/index.less';
class DelUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: this.props.show
    };
  }
  componentWillReceiveProps(){
    var self = this;
    setTimeout(()=>{
      self.setState({showModal:self.props.show});
    });
  }

  close = () => {
    const {onCancleSelect} = this.props;
    if(onCancleSelect instanceof Function){
      onCancleSelect();
      this.setState({
        showModal: false
      });
    }
  }

  onConfirm =()=> {
    const {onConfirmDelete} = this.props;

    if(onConfirmDelete instanceof Function){
      this.setState({
        showModal: false
      });
      onConfirmDelete();
    }
  }

  onChange = () =>{
    const {onchangeDelImage} = this.props;
    if(onchangeDelImage instanceof Function) {
      onchangeDelImage();
    }
  }

  open = () => {
    this.setState({
      showModal: true
    });
  }


  render () {

    let {IsDelImage, onchangeDelImage, isMicroService} = this.props;

    return (
              <Modal
                show = { this.state.showModal }
                onHide = { this.close }
                className="continuous-delete-modal">
                  <Modal.Header>
                      <Modal.Title>
                          {
                            isMicroService?(
                                <div className="text-Desc" >删除微服务</div>
                              ):
                              (
                                IsDelImage ? (
                                  <div className="text-Desc">删除应用及其镜像</div>
                                ):(
                                  <div  className="text-Desc">删除应用</div>
                                )
                              )
                          }
                      </Modal.Title>

                  </Modal.Header>

                  <Modal.Body>
                      <div className="text-Desc">
                        {
                          isMicroService ? (
                            <div  className="text-Desc">确定删除该微服务？</div>
                          ): (
                            <div>
                              <input  type="checkbox" ref="test"  checked={IsDelImage} onChange={onchangeDelImage} />
                              删除应用镜像
                              {
                                IsDelImage ? (
                                  <div  className="text-Desc " style={{marginTop: 10,color:'red'}}>确认删除该应用及其镜像？</div>
                                ):(
                                  <div  className="text-Desc" style={{marginTop: 10}}>确定删除该应用？</div>
                                )
                              }
                            </div>
                          )
                        }
                      </div>
                  </Modal.Body>

                  <Modal.Footer className="delete-confirm">
                      <Button onClick={ this.close } shape="border" style={{marginRight: 50}}>关闭</Button>
                      <Button onClick={ this.onConfirm } colors="primary">确认</Button>
                  </Modal.Footer>
             </Modal>

    )
  }
}

export default DelUpload;
