import React, {Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {
  Button,
  Clipboard,
  Col,
  FormControl,
  FormGroup,
  Label,
  Message,
  Modal,
  ProgressBar,
  Row,
  Switch,
  Tile
} from 'tinper-bee';
import {lintAppListData} from '../../components/util';

class AddPEngine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEngine: false,
      user_id: '',
      auth_id: '',
      messageAry: [],
      requireEngine: true,
      resourceType: this.props.location.query.type
    };
    this.interval = this.interval.bind(this);
    this.back = this.back.bind(this);
    this.reset = this.reset.bind(this);
    this.closeEngine = this.closeEngine.bind(this);
    this.onEngineAdd = this.onEngineAdd.bind(this);
    this.fresh = this.fresh.bind(this);
  }

  closeEngine() {
    this.setState({
      modalEngine: false
    })
  }

  fresh(name) {
    let self = this;
    let {location} = this.props;
    name = name || self.props.params.name;
    axios.get('/res-pool-manager/v1/resource_pool/generateid/' + location.query.id + '?hostname=' + name)
      .then(function (res) {
        let data = lintAppListData(res);
        if (data) {
          let authId = data.auth_id;
          let userId = data.user_id;
          self.setState({
            user_id: userId,
            auth_id: authId,
            modalEngine: false
          });
          window.addPeTimer = window.setInterval(() => {
            self.interval(authId);
          }, 3000);
          let param = {
            "userId": userId,
            "authId": authId,
            "dns": ["term." + authId, "console." + authId, "agent." + authId]
          };
          axios.post('/res-pool-manager/v1/resource_pool/setngrokuser', param)
            .then(function (res) {
              lintAppListData(res);
            })
            .catch(function (err) {
              console.log(err);
              return Message.create({content: '请求出错', color: 'danger', duration: null});
            })
        }
      }).catch(function (err) {
      console.log(err);
      return Message.create({content: '请求出错', color: 'danger', duration: null});
    });
  }

  componentDidMount() {
    this.fresh();
  }

  componentWillUnmount() {
    window.clearInterval(window.addPeTimer);
  }

  reset() {
    this.setState({
      messageAry: [],
      modalEngine: true,
      requireFlag: true
    });
  }

  interval(authId) {
    //authId = '03C1WWpXNpUZTW1k';//测试数据
    let self = this;
    axios.get('/res-pool-manager/v1/resource_message?query=AuthId:' + authId + '&sortby=Ts&order=asc')
      .then(function (res) {
        let data = lintAppListData(res);
        //let data=[{"Id":43,"userid":"158678b8-6099-427b-a3a3-f7f26e1bf7a0","authid":"UnmuIbIaTTubW9G8","hostname":"192.168.32.48","status":1,"message":"ngrok安装成功","Ts":"2017-04-06T01:19:45Z","Dr":0}];
        if (data) {
          self.setState({
            messageAry: data
          });
          for (let i = 0; i < data.length; i++) {
            if (data[i].status == 1) {
              //self.clear();
              window.clearInterval(window.addPeTimer);
              break;
            }
          }
          ReactDOM.findDOMNode(self.refs.code).scrollTop = 99999999999999;
        }

      })
      .catch(function (err) {
        console.log(err);
        return Message.create({content: '请求出错', color: 'danger', duration: null});
      })
  }

  back() {
    window.location.hash = '#/';
  }

  onEngineAdd() {
    let name = ReactDOM.findDOMNode(this.refs.nameEngine).value;
    if (name) {
      this.setState({
        requireEngine: true
      });
      this.fresh(name);
    } else {
      this.setState({
        requireEngine: false
      });
    }
  }

  buyEngine() {
    window.location.hash = '#/bs/';
  }

  render() {
    let InstallingType1, InstallingType2;

    console.log(this.props.location);

    let info = {
      production: [
        "curl " + process.env.ENV.domain + "/download/install-agent -o /tmp/install-agent && bash /tmp/install-agent " + this.state.user_id + " " + this.state.auth_id,
        "curl " + process.env.ENV.domain + "/download/external/install_agent.sh -o /tmp/install_agent.sh && bash /tmp/install_agent.sh " + this.state.user_id + " " + this.state.auth_id,
        "curl " + process.env.ENV.domain + "/download/k8s/install-agent -o /tmp/install_agent.sh && bash /tmp/install_agent.sh " + this.state.user_id + " " + this.state.auth_id + " " + this.props.location.query.id
      ],
      development: [
        "curl -sS -L " + process.env.ENV.domain + "/download/install_agent.sh -o /tmp/install_agent.sh && bash /tmp/install_agent.sh " + this.state.user_id + " " + this.state.auth_id,
        "curl -sS -L " + process.env.ENV.domain + "/download/external/install_agent.sh -o /tmp/install_agent.sh && bash /tmp/install_agent.sh " + this.state.user_id + " " + this.state.auth_id,
        "curl -sS -L " + process.env.ENV.domain + "/download/k8s/install-agent -o /tmp/install_agent.sh && bash /tmp/install_agent.sh " + this.state.user_id + " " + this.state.auth_id + " " + this.props.location.query.id
      ]
    };

    let mes = info[process.env.NODE_ENV][Number(this.state.resourceType) - 1]

    return (
      <div className="add-p">
        <Modal show={this.state.modalEngine} keyboard={false} onHide={this.closeEngine} backdrop={'static'}
               className="mrp-add">
          <div className="mrp-add">
            <Modal.Header>
              <Modal.Title>添加主机</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Label>主机名称：</Label>
                <FormControl ref="nameEngine" placeholder="请输入主机名称"/>
              </FormGroup>
              <FormGroup className={classnames({'error': true, 'hidden': this.state.requireEngine})}>
                <Label>
                                <span className="verify-warning show-warning">
                                    <i className="uf uf-exc-t-o"/>
                                    请输入主机名称
                                </span>
                </Label>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeEngine} shape="border" style={{marginRight: 50}}>取消</Button>
              <Button onClick={this.onEngineAdd} colors="primary">确认</Button>
            </Modal.Footer>
          </div>
        </Modal>
        <Row>
          <div className="head">
                    <span className="back" onClick={this.back}>
                        <i className="cl cl-arrow-left"> </i>
                        我的资源池
                    </span>
            <span className="head-title">
                        接入自有主机
                    </span>
            {/* <Button shape="squared" onClick={ this.buyEngine } colors="primary">
                         购买主机
                         </Button>*/}
          </div>
        </Row>
        <Row className="add-p-main">
          <ul>
            <li className="title">
              <i className="cl cl-resource"> </i>
              安装主机监控程序
            </li>
            <li className="little-title">
              Installing docker for Linux
            </li>
            <li className="code">
              <p><span>curl https://developer.yonyoucloud.com/download/docker|sh</span>
                <Clipboard text="curl https://developer.yonyoucloud.com/download/docker|sh" action="copy">
                  <i className="cl cl-copy-c"/>
                </Clipboard>
              </p>
            </li>
            <li className="little-title">
              for centos7
            </li>
            <li className="code">
              <p>
                <span>mkdir -p /etc/systemd/system/docker.service.d</span>
                <Clipboard text="mkdir -p /etc/systemd/system/docker.service.d">
                  <i className="cl cl-copy-c"/>
                </Clipboard>

              </p>
              <p>
                <span>curl https://developer.yonyoucloud.com/download/docker.conf -o /etc/systemd/system/docker.service.d/docker.conf</span>
                <Clipboard
                  text="curl https://developer.yonyoucloud.com/download/docker.conf -o /etc/systemd/system/docker.service.d/docker.conf">
                  <i className="cl cl-copy-c"/>
                </Clipboard>
              </p>
              <p>
                <span>systemctl daemon-reload</span>
                <Clipboard text="systemctl daemon-reload">
                  <i className="cl cl-copy-c"/>
                </Clipboard>
              </p>
              <p>
                <span>systemctl enable docker</span>
                <Clipboard text="systemctl enable docker">
                  <i className="cl cl-copy-c"/>
                </Clipboard>
              </p>
              <p>
                <span>systemctl start docker</span>
                <Clipboard text="systemctl start docker">
                  <i className="cl cl-copy-c"/>
                </Clipboard>
              </p>
            </li>
            <li className="little-title">
              Installing Agents
            </li>
            <li className="code">
              <p>


                <div>
                  <span>{mes}</span>
                  <Clipboard text={mes}>
                    <i className="cl cl-copy-c"/>
                  </Clipboard>
                </div>


              </p>
            </li>
            <li className="title">
              <i className="cl cl-set-c-o"> </i>
              安装状态
            </li>
            <li className="code-br" ref="code">
              <p>正在等待运行安装命令 loading
                <span className="loading">
                                ......
                                </span>
              </p>
              {this.state.messageAry.map((item, index) => {
                return (
                  <p className={classnames({
                    "success": item.status == 1,
                    'error': item.status == -1
                  })}>{item.message}</p>
                )
              })}
            </li>
          </ul>
          <div className="foot">
            <Button colors="danger" onClick={this.reset}>
              继续添加
            </Button>
            <Button onClick={this.back}>
              查看资源池
            </Button>
          </div>
        </Row>
      </div>
    )
  }
}

export default AddPEngine;
