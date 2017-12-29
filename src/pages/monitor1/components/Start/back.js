import {
  Component
} from 'react';
import Node from '../Node';
import Line from '../Line';
import './index.less';
import developIcon from 'assets/img/monitor/developer-icon.png';
import developText from 'assets/img/monitor/develop-text.png';
import yycloudIcon from 'assets/img/monitor/yonyoucloud-icon.png';

class Starter extends Component {
  render() {
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
          <div className="top-part1">
            <Node shape="pull" state="success">
            Redis
            <p className="desc">xxx.redis.rds.aliyunncs.com</p>
            </Node>
            <Line className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" color = "#00A0E9" pathStr="M5,0 L5,28" startIconDirec="top" endIconDirec="bottom" >
            </Line>
          </div>
          <div className="top-part2">
            <Line color = "#00A0E9">
            </Line>
            <Node >
            <p>阿里DNS（域名解析）+ WAF</p>
            <p className="desc">aw*x7.yundunwaf.com</p>
            </Node>
            <Line color = "#00A0E9">
            </Line>
            <Node >
            <p>外网SLB</p>
            <p className="desc">59.10.*.*</p>
            </Node>
            <Line color = "#00A0E9">
            </Line>
            <Node>
             <p>统一接入服务</p>

            </Node>
            <Line color = "#00A0E9">
            </Line>
            <Node>
             <p>内网SLB</p>
            <p className="desc">10.*.1*.209</p>
            </Node>
            <Line color = "#00A0E9">
            </Line>
            <Node>
             <p>Nginx集群</p>
            <p className="desc">10.*.*.186/187</p>
            </Node>
          </div>
          <div className="top-part3">
            <div className="top-part3-1">
              <Node >
              <p>Mesos-Master集群</p>
              
              </Node>
              <Line color = "#9178FF" className="margin-top-0 clear-left diagonal" lineWidth="10" lineHeight="38" pathStr="M5,0 L20,15" startIconDirec="top" endIconDirec="bottom" >
              </Line>
              <Line color = "#9178FF" className="margin-top-0 clear-left" lineWidth="10" lineHeight="38" pathStr="M5,0 L5,38" startIconDirec="top" endIconDirec="bottom" >
              </Line>
              <Node shape="pull" state="success" className="clear-left">
              <p>ZK集群</p>
              
              </Node>
            </div>
            <div className="top-part3-2">
              <Node shape="pull">
              <p>Mesos-DNS集群</p>
              
              </Node>
              <Line color = "#9178FF" className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" pathStr="M5,0 L5,28"  endIconDirec="bottom" >
              </Line>
              <Node className="clear-left" >
              <p>Marathon-LB集群<br></br>haproxy</p>
              
              </Node>
               <Line color = "#9178FF" className="margin-top-0 clear-left" lineWidth="10" lineHeight="38" pathStr="M5,0 L5,38" startIconDirec="top" endIconDirec="bottom" >
              </Line>
               <Node shape="pull" state="success" className="clear-left">
                <p>Etcd集群</p>
                
                </Node>
            </div>
            <div className="top-part3-3">
              <div className="first">
                <p className="title">ECS with Docker engine</p>
                <Node >
                <p>Docker</p>
                <p class="title">Calico network</p>
                
                </Node>
                
                <Node >
                <p>Docker</p>
                <p class="title">Calico network</p>
                
                </Node>
                <Node >
                <p>Docker</p>
                <p class="title">Calico network</p>
                
                </Node>
              </div>
              <Line color = "#F57D00" className="margin-top-0 clear-left" lineWidth="10" lineHeight="28" pathStr="M5,0 L5,28"  endIconDirec="bottom" >
              </Line>
              <Node >
              <p>短信网关</p>
              <p class="title">http://222.73.117.156</p>
              
              </Node>
            </div>

          </div>

          
          
        </div>

      </div>
    )
  }
}

export default Starter;