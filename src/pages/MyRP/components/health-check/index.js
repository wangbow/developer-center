import React, {Component} from 'react';
import { Icon, Message, Modal, Button} from 'tinper-bee';
import Step from 'bee-step';
import 'bee-step/build/Step.css';
import {agentcheck, mesoscheck, tunnelcheck, terminalcheck, daemoncheck, dataclear, hostrecover} from 'serves/resPool'
import './index.less';
import ErrorModal from 'components/ErrorModal';

class EnginhealthCheck extends Component {
  state = {
    isHealthy1:0,//0还没检查 1通过 2未通过
    isHealthy2:0,
    isHealthy3:0,
    isHealthy4:0,
    isHealthy5:0,
    status1:'process',
    status2:'wait',
    status3:'wait',
    status4:'wait',
    status5:'wait',
    currentOrder: 0,
    isShowEnsureModal:false
  }

 componentWillReceiveProps(nextProps) {
   if (nextProps.isShowCheckHealth) {
     this.healthCheck(nextProps.hostIp)
   }
 }

 healthCheck =(param)=>{

     agentcheck(param).then((res)=>{//第1项检查
       if(res.data === 'OK'){
         this.setState({
           status1:'finish',
           isHealthy1: 1,
           currentOrder: 1
         })
       }else{
         //第1项检查不通过
         this.setState({
           status1:'error',
           isHealthy1: 2,
           currentOrder: 1
         })
       }
         mesoscheck(param).then((res)=>{//第2项检查

           if(res.data === 'OK'){
             this.setState({
               status2: 'finish',
               isHealthy2: 1,
               currentOrder: 2,
             })
           }else{
             //第2项检查不通过
             this.setState({
               status2:'error',
               isHealthy2: 2,
               currentOrder: 2
             })
           }
             tunnelcheck(param).then((res)=>{//第3项检查
               if(res.data === 'OK'){
                 this.setState({
                   status3: 'finish',
                   isHealthy3: 1,
                   currentOrder: 3,
                 })
               }else{
                 //第2项检查不通过
                 this.setState({
                   status3:'error',
                   isHealthy3: 2,
                   currentOrder: 3
                 })
               }
                 terminalcheck(param).then((res)=>{//第4项检查

                   if(res.data === 'OK'){
                     this.setState({
                       status4: 'finish',
                       isHealthy4: 1,
                       currentOrder: 4,
                     })
                   }else{
                     //第2项检查不通过
                     this.setState({
                       status4:'error',
                       isHealthy4: 2,
                       currentOrder: 4
                     })
                   }
                       daemoncheck(param).then((res)=>{//第5项检查
                         if(res.data === 'OK'){
                           this.setState({
                             status5: 'finish',
                             isHealthy5: 1,
                             currentOrder: 5,
                           })
                         }else{
                           //第2项检查不通过
                           this.setState({
                             status5:'error',
                             isHealthy5: 2,
                             currentOrder: 5
                           })
                         }
                   })
                 })
               })
             })
           })
         }
/*
问题修复
 */
  restore =(param) => ()=>{
    let { hostIp } = this.props;
    hostrecover(hostIp,param).then((res)=>{
      if(param === 'agent'){
          if(res.data.error_code ==='-1' ){
              document.getElementById("errMsg1").innerHTML = res.data.error_message;
          }else{
              this.setState({
                isHealthy1: 1,
              })
          }
      }else if(param === 'mesos'){
          if(res.data.error_code === '-1'){
            document.getElementById("errMsg2").innerHTML = res.data.error_message;
          }else{
            this.setState({
              isHealthy2: 1,
            })
          }
      }else if(param === 'tunnel'){
          if(res.data.error_code === '-1'){
            document.getElementById("errMsg3").innerHTML = res.data.error_message;
          }else{
            this.setState({
              isHealthy3: 1,
            })
          }
      }else if(param === 'terminal'){
        if(res.data.error_code === '-1'){
          document.getElementById("errMsg4").innerHTML = res.data.error_message;
        }else{
          this.setState({
            isHealthy4: 1,
          })
        }
      }else if(param === 'daemon'){
        if(res.data.error_code === '-1'){
          document.getElementById("errMsg5").innerHTML = res.data.error_message;
        }else{
          this.setState({
            isHealthy5: 1,
          })
        }
      }else{//一键修复
        let hostIp  = this.props.hostIp;
        // this.setState({
        //   isHealthy1:0,//0还没检查 1通过 2未通过
        //   isHealthy2:0,
        //   isHealthy3:0,
        //   isHealthy4:0,
        //   isHealthy5:0,
        //   status1:'process',
        //   status2:'wait',
        //   status3:'wait',
        //   status4:'wait',
        //   status5:'wait',
        //   currentOrder: 0,
        //   isShowEnsureModal:false
        // })

        this.healthCheck(hostIp);
        document.getElementById("errMsg1").innerHTML ='';
        document.getElementById("errMsg2").innerHTML ='';
        document.getElementById("errMsg3").innerHTML ='';
        document.getElementById("errMsg4").innerHTML ='';
        document.getElementById("errMsg5").innerHTML ='';
      }
    })
  }

  /*
    清理文件确认弹窗
     */
  handleClear = () =>{
    this.setState({
      isShowEnsureModal:true
    })
  }

  /*
   取消清理文件
    */
  handleCloseModal = () =>{
    this.setState({
      isShowEnsureModal:false
    })
  }

/*
  确认清理文件
*/
  handleEnsure = () =>{
    this.handleCloseModal();
    let { hostIp } = this.props;
    dataclear(hostIp).then((res)=>{
      console.log(res)
      if(res.data.error_code === '-1'){
        Message.create({
          content:'文件清理失败！',
          color:'danger',
          duration:'1.5'
        })
      }else{
        Message.create({
          content:'文件清理完成',
          color:'success',
          duration:'1.5'
        })
      }
    })
  }

  handleClose = () =>{
    this.setState({
      isHealthy1:0,//0还没检查 1通过 2未通过
      isHealthy2:0,
      isHealthy3:0,
      isHealthy4:0,
      isHealthy5:0,
      status1:'process',
      status2:'wait',
      status3:'wait',
      status4:'wait',
      status5:'wait',
      currentOrder: 0,
      isShowEnsureModal:false
    })

    this.props.onClose();
  }

render(){
  let {isShowCheckHealth} = this.props;
  let {isHealthy1, isHealthy2, isHealthy3, isHealthy4, isHealthy5, currentOrder, status1, status2, status3, status4, status5,} = this.state;

  let elem1 = <i className="cl cl-right green-tip"/>;
  let elem2 = <i className="cl cl-notice-p red-tip"/>;

  return (
    <Modal
      show={ isShowCheckHealth }
      className="min-set health-check"
      size="lg"
      onHide={ this.handleClose }>
      <Modal.Header closeBtn>
        <Modal.Title className="title">
          {
            <span>接入主机健康检查</span>
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <div className="check-step">
          <Step.Steps current={currentOrder}>
            <Step title="节点连通性检查" status = {status1}/>
            <Step title="容器运行环境检查"  status = {status2}/>
            <Step title="云隧道检查"  status = {status3}/>
            <Step title="容器控制台检查"  status = {status4}/>
            <Step title="守护进程检查"  status = {status5}/>
          </Step.Steps>
          <div className="steps-content">
            <div className="check-item">
                {isHealthy1 === 2 ? (<span className="restore-button"  onClick={ this.restore('agent') }>修复</span>):''}
              <span>{isHealthy1 === 0 && '1 节点连通性检查'}</span>
              <span>{isHealthy1 === 1 ? (elem1):''}{ isHealthy1 === 1  && '1 节点连通性检查'}</span>
              <span>{isHealthy1 === 2 ? (elem2):''}{ isHealthy1 === 2 && '1 节点连通性检查'}</span>
            </div>
            <div className="error-desc" id="errMsg1"></div>

            <div className="check-item">
              {isHealthy2 === 2 ? (<span className="restore-button" onClick={ this.restore('mesos') }>修复</span>):''}
              <span>{isHealthy2 === 0 && '2 检查docker环境是否正常，agent容器是否正常'}</span>
              <span>{isHealthy2 === 1 ? (elem1):''}{isHealthy2 === 1  && '2 检查docker环境是否正常，agent容器是否正常'}</span>
              <span>{isHealthy2 === 2 ? (elem2):''}{isHealthy2 === 2 && '2 检查docker环境是否正常，agent容器是否正常'}</span>
            </div>
            <div className="error-desc" id="errMsg2"></div>

            <div className="check-item">
              {isHealthy3 === 2 ? (<span className="restore-button" onClick={ this.restore('tunnel') }>修复</span>):''}
              <span>{isHealthy3 === 0 && '3 检查mesos-slave是否与master正常连接'}</span>
              <span>{isHealthy3 === 1 ? (elem1):''}{isHealthy3 === 1 && '3 检查mesos-slave是否与master正常连接'}</span>
              <span>{isHealthy3 === 2 ? (elem2):''}{isHealthy3 === 2 && '3 检查mesos-slave是否与master正常连接'}</span>
            </div>
            <div className="error-desc" id="errMsg3"></div>

            <div className="check-item">
              {isHealthy4 === 2 ? (<span className="restore-button"  onClick={ this.restore('terminal') }>修复</span>):''}
              <span>{isHealthy4 === 0 && '4 检查terminal是否正常'}</span>
              <span>{isHealthy4 === 1 ? (elem1):''}{isHealthy4 === 1  && '4 检查terminal是否正常'}</span>
              <span>{isHealthy4 === 2 ? (elem2):''}{isHealthy4 === 2  && '4 检查terminal是否正常'}</span>
            </div>
            <div className="error-desc" id="errMsg4"></div>

            <div className="check-item">
              {isHealthy5 === 2 ? (<span className="restore-button" onClick={ this.restore('daemon') }>修复</span>):''}
              <span>{isHealthy5 === 0  && '5 检查daemon进程是否正常'}</span>
              <span>{isHealthy5 === 1 ? (elem1):''}{isHealthy5 === 1 && '5 检查daemon进程是否正常'}</span>
              <span>{isHealthy5 === 2 ? (elem2):''}{isHealthy5 === 2 && '5 检查daemon进程是否正常'}</span>
            </div>
            <div className="error-desc" id="errMsg5"></div>
          </div>

          <ErrorModal
            message = "确定要清理主机内的所有日志文件吗？"
            show = { this.state.isShowEnsureModal }
            onEnsure = {this.handleEnsure}
            onClose = {this.handleCloseModal}
            title = "清理日志文件"
            buttonTitle = "确定"
          />

        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="modal-footer">
          <Button colors="default" shape="border" onClick={this.handleClose} className="cancle-button">取消</Button>

          <Button colors="primary" shape="border" onClick={this.handleClear} className="clear-logs">清理文件</Button>

         {/*{(isHealthy1 === 2 || isHealthy2 === 2 || isHealthy3 ===2  || isHealthy4 === 2 || isHealthy5 === 2) ?*/}
            {/*():''}*/}
          <Button colors="primary" shape="border" onClick={this.restore('all')} className="quick-restore">一键修复</Button>

        </div>

      </Modal.Footer>
    </Modal>
    )
  }
}
export default EnginhealthCheck;
