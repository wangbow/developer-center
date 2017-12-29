import {
  Component
} from 'react';
import Node from '../Node';
import Line from '../Line';
import ErrorMessage from '../ErrorMessage';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import './index.less';
import developIcon from 'assets/img/monitor/developer-icon.png';
import developText from 'assets/img/monitor/develop-text.png';
import yycloudIcon from 'assets/img/monitor/yonyoucloud-icon.png';


import {
  getNodeState
} from 'serves/monitor-server';

class Starter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataList: {}
    };
    this.getNodeInfo = this.getNodeInfo.bind(this);
  }

  getNodeInfo() {
    getNodeState().then((res) => {
      // res = {
      //   "desc": "success",
      //   "status": 0,
      //   "data": [{
      //     "errormessage": "",
      //     "time": "2017-09-25T19:51:22+08:00",
      //     "type": 0,
      //     "ip": "10.3.15.202",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "gmond process is down.",
      //     "time": "2017-09-27T15:01:00+08:00",
      //     "type": 1,
      //     "ip": "10.3.15.199",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "cpu load too high",
      //     "time": "2017-09-27T15:34:00+08:00",
      //     "type": 0,
      //     "ip": "10.3.15.216",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "memory used high.",
      //     "time": "2017-09-26T19:17:49+08:00",
      //     "type": 0,
      //     "ip": "10.3.15.200",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "gmond process is down.",
      //     "time": "2017-09-27T15:00:00+08:00",
      //     "type": 1,
      //     "ip": "10.3.15.201",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "cpu load too high",
      //     "time": "2017-09-27T15:34:00+08:00",
      //     "type": 0,
      //     "ip": "10.3.15.216",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "disk used high.",
      //     "time": "2017-09-25T21:01:05+08:00",
      //     "type": 0,
      //     "ip": "10.3.15.196",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "memory used high.",
      //     "time": "2017-09-27T14:56:00+08:00",
      //     "type": 0,
      //     "ip": "10.3.15.202",
      //     "descript": "docker"
      //   }, {
      //     "errormessage": "gmond process is down.",
      //     "time": "2017-09-27T15:00:00+08:00",
      //     "type": 1,
      //     "ip": "10.3.15.190",
      //     "descript": "marathon-lb, mesos-dns, mesos-master,etcd,zk"
      //   }],
      //   "page": null
      // };
      let data = res.data.data,
        dataList, desc;
      dataList = {};
      for (var i = 0; i < data.length; i++) {
        desc = data[i].descript;
        //判断这个节点是否已存在，存在的话追加，不存在则创建
        if (!dataList[desc]) {
          dataList[desc] = {
            ip: [],
            error: 0,
            warning: 0,
            message: [],
            type: [],
            time: []
          };
        }

        dataList[desc].ip.push(data[i].ip);
        dataList[desc].message.push(data[i].errormessage);
        dataList[desc].time.push(data[i].time);
        dataList[desc].type.push(data[i].type);
        //type为1说明异常
        if (data[i].type == '1') {
          dataList[desc].error = dataList[desc].error + 1;
        } else {
          dataList[desc].warning = dataList[desc].warning + 1;
        }

        if (dataList[desc].warning > 0) {
          dataList[desc].state = 'warning';
        }

        if (dataList[desc].error > 0) {
          dataList[desc].state = 'error';
        }


      }
      this.setState({
        "dataList": dataList
      });



    });
  }

  // componentWillMount() {
  //   this.getNodeInfo();
  // }

  componentWillMount() {
    this.getNodeInfo();
    this.timeId = setInterval(() => this.getNodeInfo(),
      30000);
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }


  render() {

    let dockerWarning, dockerError, alidnsState, aliInfoList, dockerErrorList, dockerWarningList; //docker的警告，异常；阿里dns的state标记量    debugger;
    if (this.state.dataList['docker'] && this.state.dataList['docker'].error > 0) {
      dockerError = "error";
    }
    if (this.state.dataList['docker'] && this.state.dataList['docker'].warning > 0) {
      dockerWarning = "warning";
    }

    if (this.state.dataList['docker'] && this.state.dataList['docker'].ip.length > 0) {
      dockerErrorList = {
        ip: [],
        message: []
      };
      dockerWarningList = {
        ip: [],
        message: []
      };
      for (let i = 0; i < this.state.dataList['docker'].ip.length; i++) {
        if (this.state.dataList['docker'].type[i] == '1') {
          dockerErrorList.ip.push(this.state.dataList['docker'].ip[i]);
          dockerErrorList.message.push(this.state.dataList['docker'].message[i]);
        } else {

          dockerWarningList.ip.push(this.state.dataList['docker'].ip[i]);
          dockerWarningList.message.push(this.state.dataList['docker'].message[i]);
        }

      }
    }


    let rdsState, redisState;

    rdsState = this.state.dataList['RDS'] ? this.state.dataList['RDS'].state : "";
    redisState = this.state.dataList['Redis'] ? this.state.dataList['Redis'].state : "";

    //只要rds或者redis有一个是error，aliDns就是error状态,都不是error的话有一个是warning状态则aliDns就是warning状态
    if (rdsState === 'error' || redisState === 'error') {
      alidnsState = 'error';
    } else if (rdsState === 'error' || redisState === 'error') { //
      alidnsState = 'warning';
    }
    aliInfoList = {
      ip: [],
      message: []
    }


    if (this.state.dataList['RDS']) {
      for (var i = 0; i < this.state.dataList['RDS'].ip.length; i++) {
        aliInfoList.ip.push(this.state.dataList['RDS'].ip[i]);
        aliInfoList.message.push(this.state.dataList['RDS'].message[i]);
      }
    }

    if (this.state.dataList['redis']) {
      for (var i = 0; i < this.state.dataList['redis'].ip.length; i++) {
        aliInfoList.ip.push(this.state.dataList['redis'].ip[i]);
        aliInfoList.message.push(this.state.dataList['redis'].message[i]);
      }
    }


    // let fivetate; //marathon-lb, mesos-dns, mesos-master,etcd,zk这五个的状态
    // fivetate = this.state.dataList['marathon-lb, mesos-dns, mesos-master,etcd,zk'] ? this.state.dataList['marathon-lb, mesos-dns, mesos-master,etcd,zk'].state : "";
    return (
      <div className="node-content">
        <div className="monitor-starter">
          <div className="monitor-ring">
            <div className="monitor-ring-two">
              <div className="ring-one">
                <div className="ring-two">
                  
                  <img className="yyc-icon" src={developIcon}/>
                  <img className="develop-text" src={developText}/>

                   <div className="develop-url">
                    developer.yonyoucloud.com
                  </div>
                  <img className="yycloud-icon" src={yycloudIcon}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-node">
    <div className="node-content">
          <div className="top-part1">
            

            
            <OverlayTrigger overlay={<ErrorMessage infoList={this.state.dataList["redis"]}/>} placement="right">
              
              <Node shape="pull" state={this.state.dataList["redis"]?this.state.dataList["redis"].state:""} infoList={this.state.dataList["redis"]}>
                redis
                <p className="desc">xxx.redis.rds.aliyunncs.com</p>

              </Node>
            </OverlayTrigger>
            <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" color = "#00A0E9" pathStr="M5,0 L5,28" arrowId="part1-1" startId="part1-1-s" >
            </Line>
          </div>
          <div className="top-part2">
            <Line color = "#00A0E9" arrowId="part2-1" endOrient="270">
            </Line>
            <Node state={this.state.dataList["阿里DNS(域名解析)+WAF"]?this.state.dataList["阿里DNS(域名解析)+WAF"].state:""} infoList={this.state.dataList["阿里DNS(域名解析)+WAF"]}> 
            <p>阿里DNS(域名解析)+WAF</p>
            <p className="desc">59.110.247.93</p>
            </Node>
            <Line color = "#00A0E9" arrowId="part2-2" endOrient="270">
            </Line>
            <Node state={this.state.dataList["外网SLB"]?this.state.dataList["外网SLB"].state:""} infoList={this.state.dataList["外网SLB"]}>
            <p>外网SLB</p>
            <p className="desc">59.110.145.204</p>
            </Node>
            <Line color = "#00A0E9" arrowId="part2-3" endOrient="270">
            </Line>
            <Node state={this.state.dataList["统一接入服务"]?this.state.dataList["统一接入服务"].state:""} infoList={this.state.dataList["统一接入服务"]}>
             <p>统一接入服务</p>

            </Node>
            <Line color = "#00A0E9" arrowId="part2-4" endOrient="270" >
            </Line>
            <Node state={this.state.dataList["内网SLB"]?this.state.dataList["内网SLB"].state:""}  infoList={this.state.dataList["内网SLB"]}>
             <p>内网SLB</p>
             
            <p className="desc">10.3.15.209</p>
            </Node>
            <Line color = "#00A0E9"  arrowId="part2-5" endOrient="270">
            </Line>
            <Node state={this.state.dataList['nginx集群']?this.state.dataList['nginx集群'].state:""} infoList={this.state.dataList["nginx集群"]}>
             <p>nginx集群</p>
            <p className="desc">10.3.15.*</p>
            </Node>
            <Line className="broken-1 margin-top-0 clear-left"  color = "#00A0E9" lineWidth="650" lineHeight="80" arrowId="part3-4-4"   pathStr="M640,0 L640,35 L5,35 L5,75 " > 

            </Line>
          </div>
           <div className="top-part3">
            <div className="top-part3-1">
              <Node  state={this.state.dataList['mesos-master']?this.state.dataList['mesos-master'].state:""} infoList={this.state.dataList['mesos-master']}>
              <p>Mesos-Master集群</p>
              
              </Node>
             
             
              <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" color = "#00A0E9" pathStr="M5,0 L5,28" arrowId="part3-1-1" startId="part3-1-1-s" >
              </Line>
               <Line className="margin-top-0 clear-left oblique-1" lineWidth="60" lineHeight="40" color = "#00A0E9" pathStr="M5,0 L50,40" arrowId="part3-1-2" startId="part3-1-2-s"  startOrient="315" endOrient="315">
              </Line>
              <Node shape="pull" state={this.state.dataList['zookeeper']?this.state.dataList['zookeeper'].state:""} className="clear-left" infoList={this.state.dataList['zookeeper']}>
              <p>ZK集群</p>
              
              </Node>
               <Line className="margin-top-0 clear-left oblique-2" lineWidth="60" lineHeight="40" color = "#00A0E9" pathStr="M5,40 L55,0" arrowId="part3-1-3" startId="part3-1-3-s"  startOrient="225" endOrient="225">
              </Line>
               <Line className="margin-top-0 clear-left broken-1" lineWidth="350" lineHeight="250" color = "#00A0E9" pathStr="M5,0 L5,200 A20,20 0 0,0 20,215 L325,215 A20,20 0 0,0 340,200 L340,110" arrowId="part3-1-4" startId="part3-1-4-s"   endOrient="180">
              </Line>

            </div>
            <div className="top-part3-2">
              <Node shape="pull" state={this.state.dataList['mesos-dns']?this.state.dataList['mesos-dns'].state:""} infoList={this.state.dataList['mesos-dns']}>
              <p>Mesos-DNS集群</p>
              
              </Node>
              
              <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" color = "#00A0E9" pathStr="M5,0 L5,28" arrowId="part3-2-1" >
              </Line>
              <Node className="clear-left" state={this.state.dataList['marathon-lb']?this.state.dataList['marathon-lb'].state:""} infoList={this.state.dataList['marathon-lb']}>
              <p>Marathon-LB集群<br></br>haproxy</p>
              
              </Node>
               
              <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" color = "#00A0E9" pathStr="M5,0 L5,28" arrowId="part3-2-2" startId="part3-2-2-s" >
              </Line>
    <Line className="direct-1 margin-top-0 clear-left" color = "#00A0E9 " arrowId="part3-2-2-2" endOrient="270"  pathStr="M0,5 L38,5">
              </Line>
               <Node shape="pull" state={this.state.dataList['etcd']?this.state.dataList['etcd'].state:""} className="clear-left" infoList={this.state.dataList['etcd']}>
                <p>Etcd集群</p>
                
                </Node>
    <Line className="margin-top-0 clear-left oblique-1" lineWidth="60" lineHeight="40" color = "#00A0E9" pathStr="M5,40 L55,0" arrowId="part3-1-3" startId="part3-1-3-s"  startOrient="225" endOrient="225">
                </Line>

            </div>
            <div className="top-part3-3">
              <div className="first">
                <p className="title">ECS with Docker engine</p>
                <Node state={dockerError} infoList={dockerErrorList}>
                <p>docker</p>
                <p className="desc">Calico network</p>
                
                </Node>

    
                <Line  className="direct-1 margin-top-0 clear-left"  color = "#00A0E9" arrowId="part3-2-2-2" endOrient="270">
                </Line>
                <Node state={dockerWarning} infoList={dockerWarningList}>
                <p>docker</p>
                <p className="desc">Calico network</p>
                
                </Node>
                <Node >
                <p>docker</p>
                <p className="desc">Calico network</p>
                
                </Node>
              </div>
              
               <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" color = "#00A0E9" pathStr="M5,0 L5,28" arrowId="part3-3-1" >
              </Line>
              <Node state={this.state.dataList['短信网关']?this.state.dataList['短信网关'].state:""} infoList={this.state.dataList['短信网关']}>
              <p>短信网关</p>
              <p className="desc">http://222.73.117.156</p>
              
              </Node>
            </div>
            <div className="top-part3-4">
              <Node shape="pull" state={this.state.dataList['内部DNS']?this.state.dataList['内部DNS'].state:""}  infoList={this.state.dataList['内部DNS']}>
              <p>内部DNS</p>
              
              </Node>
               <Line  className="direct-1 margin-top-0 clear-left"  color = "#00A0E9" arrowId="part3-4-2" endOrient="270">
              </Line>
              <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="140" color = "#00A0E9" pathStr="M5,0 L5,140" arrowId="part3-4-1" >
              </Line>
              <Line className="broken-1 margin-top-0 clear-left"  color = "#00A0E9" lineWidth="60" lineHeight="90" arrowId="part3-4-3" endOrient="270"  pathStr="M5,70 L20,70 L20,5 L55,5" > 

              </Line>
              
             
              <Node className="clear-left" shape="pull" state={alidnsState} infoList={aliInfoList}>
              <p>阿里-DNS</p>
              
              </Node>
               
               <Line className="broken-2 margin-top-0 clear-left"  color = "#00A0E9" lineWidth="60" lineHeight="90" arrowId="part3-4-3" endOrient="270"  pathStr="M5,70 L20,70 L20,5 L55,5" > 

              </Line>
               <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" color = "#00A0E9" pathStr="M5,0 L5,28" arrowId="part3-4-1" >
              </Line>
              <Line  className="direct-2 margin-top-0 clear-left"  color = "#00A0E9" arrowId="part3-4-2-2" endOrient="270">
              </Line>
    <Line className="broken-3 margin-top-0 clear-left"  color = "#00A0E9" lineWidth="60" lineHeight="90" arrowId="part3-4-2-3" endOrient="270"  pathStr="M5,0 L20,0 L20,70 L55,70" >

              </Line>
               <Node  className="clear-left" state={this.state.dataList['邮箱网关']?this.state.dataList['邮箱网关'].state:""}  infoList={this.state.dataList['邮箱网关']}>
                <p>邮箱网关</p>
                <p className="desc">mail.yonyou.com</p>
                </Node>
            </div>
            <div className="top-part3-5">
              <div className="top-part3-5-1">

                <Node >
                <p>云市场</p>
                <p className="desc">market.yonyoucloud.com</p>
                
                </Node>
                
                <Node >
                <p>友户通</p>
                <p className="desc">euc.yonyoucloud.com</p>
                
                </Node>
                
               
              </div>
              <div className="top-part3-5-2">
               <Node >
                <p>OSS</p>
                <p className="desc">xxx.oss-*.aliyuncs.com</p>
                
                </Node>
               <Node state={this.state.dataList['RDS']?this.state.dataList['RDS'].state:""}   infoList={this.state.dataList['RDS']}>
                <p>RDS</p>
                <p className="desc">xxx.mysql.rds.aliyunncs.com</p>
                
                </Node>
                <Node state={this.state.dataList['redis']?this.state.dataList['redis'].state:""}  infoList={this.state.dataList['redis']}>
                <p>Redis</p>
                <p className="desc">xxx.redis.rds.aliyunncs.com</p>
                
                </Node>
              </div>
            </div>

          </div>
          </div>
          
        </div>

      </div>
    )
  }
}

export default Starter;