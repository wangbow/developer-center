import React, {Component} from 'react';
import {
  Row,
  Col,
  Form,
  Breadcrumb,
  FormGroup,
  Icon,
  FormControl,
  Label,
  Modal,
  Button,
  Tabs,
  TabPanel,
  Checkbox,
  Select,
  InputGroup,
  Radio,
  Message
} from 'tinper-bee';
import {UpdateConfig, GetConfigInfo, GetHost} from 'serves/appTile';
import {getTags} from 'serves/imageCata';
import {onlyNumber} from 'lib/verification';
import {clone, lintAppListData} from 'components/util';

import { err, warn, success } from 'components/message-util';


import './configuration.css';

const Option = Select.Option;



let portObj = {
  "containerPort": 8080,
  "hostPort": 0,
  "servicePort": null,
  "protocol": "tcp",
  "access_mode": "TCP",
  "access_range": "OUTER",
};

const healthObj = {
  type: 'TCP',
  HTTP: {
    "path": "/machinehealth",
    "gracePeriodSeconds": 300,
    "intervalSeconds": 10,
    "port": 3333,
    "timeoutSeconds": 10,
    "maxConsecutiveFailures": 3
  },
  TCP: {
    "gracePeriodSeconds": 300,
    "intervalSeconds": 5,
    "portIndex": 0,
    "timeoutSeconds": 5,
    "maxConsecutiveFailures": 3
  },
  COMMAND: {
    "command": "curl -f -X GET http://$HOST:$PORT0/health",
    "maxConsecutiveFailures": 3
  },
  port: 'portIndex',
};

class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cpu: "",
      cpuMin: null,
      name: "",
      cpuLeft: '',
      memLeft: '',
      diskLeft: '',
      mem: "",
      memMin: null,
      instances: "",
      disk: "",
      cmd: "",
      image_version: "",
      image: "",
      portMappings: [{
        "containerPort": 8080,
        "hostPort": 0,
        "servicePort": null,
        "protocol": "tcp",
        "access_mode": "TCP",
        "access_range": "OUTER",
      }
      ],
      env: [{
        "key": "",
        "value": ""
      }],

      healthChecks: [
        {
          type: 'TCP',
          HTTP: {
            "path": "/machinehealth",
            "gracePeriodSeconds": 300,
            "intervalSeconds": 10,
            "port": 3333,
            "timeoutSeconds": 10,
            "maxConsecutiveFailures": 3,
            "protocol": "HTTP",
          },
          TCP: {
            "gracePeriodSeconds": 300,
            "intervalSeconds": 5,
            "portIndex": 0,
            "timeoutSeconds": 5,
            "maxConsecutiveFailures": 3,
            "protocol": "TCP",
          },
          COMMAND: {
            "command": "curl -f -X GET http://$HOST:$PORT0/health",
            "maxConsecutiveFailures": 3,
            "protocol": "COMMAND",
          },
          port: 'portIndex',
        }
      ],
      volumes: [
        {
          "containerPath": "",
          "hostPath": "",
          "mode": "RO"
        },
      ],
      versionList: [],
    }
    this.isMesos = false;
    this.isJar = false;
  }

  componentDidMount() {
    const self = this;
    this.getConfig();

    //获取资源池信息
    GetHost(function (res) {
      let data = lintAppListData(res);

      let memLeft = 0, cpuLeft = 0, diskLeft = 0;
      if (data instanceof Array) {
        data.forEach(function (item, index) {
          if (memLeft < item.memLeft) {
            memLeft = item.memLeft;
          }
          if (cpuLeft < item.cpuLeft) {
            cpuLeft = item.cpuLeft;
          }
          if (diskLeft < item.diskLeft) {
            diskLeft = item.diskLeft;
          }
        })
      }
      if (data.length === 0) {

      } else {
        self.setState({
          memLeft: memLeft,
          cpuLeft: cpuLeft,
          diskLeft: diskLeft
        })
      }
    })
  }

  /**
   * 获取镜像版本信息
   * @param imageName 镜像名
   */
  getImageTagInfo = (imageName) => {
    const self = this;
    getTags(`?imageName=${imageName}`, function (res) {
      let data = lintAppListData(res);
      let list = [];
      if (data.data instanceof Array && data.data.length !== 0) {
        data.data.forEach(function (item, index) {
          list.push(item.image_tag);
        })
      }

      if (!data.error_code) {
        self.setState({
          versionList: list
        })
      }
    })
  }

  /**
   * 获取配置信息
   */
  getConfig = () => {
    const {id} = this.props;
    let self = this;

    //获取配置信息
    GetConfigInfo(id, (res) => {
      if (res.data.error_code) {
        err(`${res.data.error_code}:${res.data.error_message}`);
      } else {
        let data = res.data;
        if (data && data.container) {
          let env = data.env;
          let envAry = [];
          for (var key in env) {
            let envObj = {};
            envObj.key = key;
            envObj.value = env[key];
            envAry.push(envObj);
          }
          if (envAry.length !== 0) {
            self.setState({
              env: envAry
            })
          }
          if (data.container.volumes.length !== 0) {
            self.setState({
              volumes: data.container.volumes
            })
          }
          let portMapping = data.container.docker.portMappings;
          if (portMapping.length !== 0) {
            self.setState({
              portMappings: portMapping,
            })
          }

          //j2se cmd截取
          let cmd = data.cmd ? data.cmd : '';
          if(/runJarAppWithConf\.sh/.test(data.cmd)){
            let cmdAry = cmd.split('&&');
            this.isJar = true;
            cmdAry.shift();
            if(cmdAry.length > 1){
              cmd = cmdAry.join('&&');
            }else if(cmdAry.length === 1){
              cmd = cmdAry[0];
            }else{
              cmd = ''
            }
          }

          let healths = data.healthChecks;
          let healthChecks = [];
          if (healths.length !== 0) {
            healths.forEach((item, index) => {
              let obj = clone(healthObj);
              if (/MESOS_/.test(item.protocol)) {
                item.protocol = item.protocol.split('_')[1];
                this.isMesos = true;
              }

              obj.type = item.protocol;
              for (let key in item) {
                if (key === 'command') {
                  if (item.command) {
                    obj[item.protocol][key] = item[key].value;
                  }
                }
                obj[item.protocol][key] = item[key];
              }

              if(item.hasOwnProperty('port')){
                obj.port = 'port';
              }else if(item.hasOwnProperty('portIndex')){
                obj.port = 'portIndex';
              }
              healthChecks.push(obj);
            });
            self.setState({
              healthChecks: healthChecks
            });
          }
          let image = data.container.docker.image;
          let array = image.split(':');
          let version = array[array.length - 1];
          array.pop();
          let image_name = array.join(":");
          self.setState({
            data: res.data,
            cpu: res.data.cpu,
            cpuMin: res.data.min_cpu,
            name: res.data.name,
            mem: res.data.mem,
            memMin: res.data.min_mem,
            instances: res.data.instances,
            disk: res.data.disk,
            cmd: cmd,
            image_version: version,
            image: image_name,
          });
          self.getImageTagInfo(image_name);
        }

      }
    })
  }

  /**
   * 增加健康检查
   */
  addHealthCheck = () => {
    let health = this.state.healthChecks;
    health.push(clone(health[0]));
    this.setState({
      healthChecks: health
    });
  }

  /**
   * 选取器选取元素
   * @param state
   * @returns {Function}
   */
  handleSelect = (state) => {
    return (value) => {

      this.setState({
        [state]: value
      });
    }

  }

  /**
   * 对于数组state存储input输入的值
   * @param state 要改变的state
   * @param key 改变的input对应的属性值
   * @param index input值所在对象的index
   */
  storeKeyValue = (state, key, index) => {

    return (e) => {
      let store = clone(this.state[state]);
      let value = e.target.value;

      store[index][key] = value;

      this.setState({
        [state]: store
      })
    }
  }

  /**
   * input值改变
   * @param state
   * @returns {Function}
   */
  handleInputChange = (state) => {
    return (e) => {
      this.setState({
        [state]: e.target.value
      })
    }
  }

  /**
   * 添加一行
   * @param state state值
   * @param obj 要增加的对象
   * @returns {Function}
   */
  handlePlus = (state, obj) => {

    return () => {
      let oldState = this.state[state];
      if (state === 'portMappings') {
        if (oldState.length >= 3)
          return;
      }
      oldState.push(obj);
      this.setState({
        [state]: oldState
      })
    }
  }

  /**
   * 减少一行
   * @param state state值
   * @param index 减少的index值
   * @returns {Function}
   */
  handleReduce = (state, index) => {

    return () => {
      let oldState = this.state[state];

      oldState.splice(index, 1);

      this.setState({
        [state]: oldState
      })
    }
  }

  /**
   * 选择器对应的数组state的值得改变
   * @param state 要改变的state值
   * @param key select对应的属性值
   * @param index select所在对象的index值
   * @returns {Function}
   */
  handleStoreSelect = (state, key, index) => {
    return (value) => {
      let store = clone(this.state[state]);

      store[index][key] = value;
      if (state === 'portMappings') {
        this.controlPortSelect(store[index], index, store);
      }
      this.setState({
        [state]: store
      })
    }
  }

  /**
   * 健康检查select值改变
   * @param state 要改变state值
   * @param key1 属性值1
   * @param key2 属性值2
   * @param index 在数组的state
   * @returns {Function}
   */
  handleHealthStoreSelect = (state, key1, key2, index) => {

    return (value) => {
      let store = clone(this.state[state]);
      store[index][key1][key2] = value;
      this.setState({
        [state]: store
      })
    }
  }

  /**
   * 健康检查input值改变
   * @param state 要改变state值
   * @param key1 属性值1
   * @param key2 属性值2
   * @param index 在数组的state
   * @returns {Function}
   */
  handleHealthStoreChange = (state, key1, key2, index) => {
    return (e) => {
      let store = clone(this.state[state]);
      store[index][key1][key2] = e.target.value;
      this.setState({
        [state]: store
      })
    }
  }

  /**
   * 端口选择逻辑控制
   * @param item 当前操作的对象
   * @param index 当前操作对象的索引
   * @param array 当前操作对象所属的数组
   */
  controlPortSelect = (item, index, array) => {
    if (item.access_mode === 'HTTP') {
      array.forEach(function (item2, index2) {
        if (index2 !== index) {
          item2.access_mode = 'NA';
          item2.access_range = 'OUTER';
        }
      })
    }
    this.setState({
      portMappings: array,
    })
  }

  /**
   * 提交保存
   */
  handleSubmit = () => {
    let env = {}, healthChecks = [], volumes = [];
    let flag = false;
    let portMap = {};
    let portMapping = this.state.portMappings;
    const cpuMin = Number(this.state.cpuMin);
    const memMin = Number(this.state.memMin);

    portMapping.forEach((item, index) => {
      if (item.containerPort === "") {
        warn('请填写容器端口。');
        flag = true;
      }
      if (portMap.hasOwnProperty(item.containerPort)) {
        warn('请填写不同容器端口。');
        flag = true;
      } else {
        portMap[item.containerPort] = item.containerPort;
      }
      item.containerPort = Number(item.containerPort);

    });

    if (this.state.cpu > this.state.cpuLeft) {
      warn('cpu超过资源池剩余上限。');
      return;
    }
    if (this.state.mem > this.state.memLeft) {
      warn('内存超过资源池剩余上限。');
      return;
    }
    if (this.state.cpu < cpuMin) {
      return warn('CPU 最小值应该小于最大值');
    }
    if (this.state.mem < memMin) {
      return warn('内存 最小值应该小于最大值');
    }
    if (this.state.disk > this.state.diskLeft) {
      warn('磁盘超过资源池剩余上限。');
      return;
    }

    this.state.env.forEach((item, index) => {
      if (item.key === "")
        return;
      item.key = item.key.replace(/(^\s+)|(\s+$)/g, "");
      if (/\s/g.test(item.key)) {
        flag = true;
        return warn('变量名不能包含空格。');
      }
      env[item.key] = item.value;
    });
    this.state.volumes.forEach((item, index) => {
      if (item.containerPath !== "" && item.hostPath !== "") {
        volumes.push(item);
      }
    });
    this.state.healthChecks.forEach((item, index) => {
      let healthCheck = {};
      let checkObj = item[item.type];
      if (this.isMesos) {
        if (item.type === 'HTTP' || item.type === 'TCP') {
          healthCheck.protocol = `MESOS_${item.type}`;
        }
      } else {
        healthCheck.protocol = item.type;
      }
      healthCheck.protocol = item.type;
      for (let key in checkObj) {

        if (key === 'command') {
          healthCheck.command = {};
          healthCheck.command.value = checkObj[key];
        } else {
          healthCheck[key] = checkObj[key];
        }
      }
      if(item.port === 'port'){
        delete healthCheck.portIndex;
        healthCheck.port = Number(healthCheck.port);
      }else{
        delete healthCheck.port;
        healthCheck.portIndex = Number(healthCheck.portIndex);
      }

      healthChecks.push(healthCheck);
    });

    let cpus = this.state.cpu;
    if (cpus < 0.01) {
      cpus = 0.01;
    } else {
      cpus = Number(Number(this.state.cpu).toFixed(2));
    }
    let cmd = this.state.cmd;
    if(this.isJar){
      if(cmd && cmd !== ''){
        cmd = `/usr/local/src/confdownload/runJarAppWithConf.sh && ${cmd}`;
      }else{
        cmd = `/usr/local/src/confdownload/runJarAppWithConf.sh`;
      }

    }

    //如果校验有错，返回
    if (flag)return;

    let data = {
      "id": this.state.data.app_id,
      "app_name": this.state.name,
      "cmd": cmd,
      'disk': this.state.disk,
      "cpus": cpus,
      "mem": this.state.mem,
      "instances": this.state.instances,
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": `${this.state.image}:${this.state.image_version}`,
          "portMappings": portMapping,
          "network": this.state.data.container.docker.network,
          "privileged": false,
          "parameters": []
        },
        "volumes": volumes,
      },
      "env": env,
      "constraints": [
        ["attribute", "OPERATOR", "value"]
      ],
      "fetch": [
        {"uri": "https://raw.github.com/mesosphere/marathon/master/README.md"},
        {"uri": "https://foo.com/archive.zip", "executable": false, "extract": true, "cache": true}
      ],
      "healthChecks": healthChecks,
      "backoffSeconds": 1,
      "backoffFactor": 1.15,
      "maxLaunchDelaySeconds": 3600,
      "taskKillGracePeriodSeconds": 2,
      "upgradeStrategy": {
        "minimumHealthCapacity": 0.5,
        "maximumOverCapacity": 0.2
      },
      "ipAddress": {
        "groups": [
          "backend"
        ],
        "labels": {
          "color": "purple",
          "flavor": "grape",
          "org": "product",
          "service": "myApp",
          "tier": "backend"
        },
        "networkName": "dev-network"
      }
    };

    if (this.props.publish_type === 3) {
      data = Object.assign({}, data, {
        min_cpus: cpuMin,
        min_mem: memMin,
      });
    }

    const {id} = this.props;
    UpdateConfig(data, id, (res) => {
      if (res.status === 200) {
        if (res.data.error_code) {
          Message.create({content: res.data.error_message, color: 'danger', duration: 4.5});
        } else {
          Message.create({content: '修改配置成功', color: 'success', duration: 1.5});
          this.getConfig();
        }
      } else {
        Message.create({content: res.data.error_message, color: 'danger', duration: 4.5});
      }
    });

  }

  render() {
    const self = this;
    const publish_type = this.props.publish_type;

    return (
      <div className="configuration">
        <Col md={4}>
          <Button colors="primary" shape="squared" style={{margin: "5px 0"}}
                  onClick={this.handleSubmit.bind(this)}>保存并重启</Button>
        </Col>
        <Col md={12}>
          <Form horizontal>
            <Row className="classify">
              <Col sm={12}>
                <div className="title">基本配置</div>
              </Col>
              <Col sm={12}>
                <Col sm={3} className="formZindex">
                  <FormGroup>
                    <Label>实例</Label>
                    <FormControl
                      style={{imeMode: 'Disabled'}}
                      onKeyDown={ onlyNumber }
                      onChange={this.handleInputChange('instances')}
                      value={this.state.instances}
                    />
                  </FormGroup>
                </Col>
                <Col sm={3} className="formZindex">
                  <FormGroup>
                    <Label>CPU 最大值</Label>
                    <FormControl
                      style={{imeMode: 'Disabled'}}
                      onKeyDown={ onlyNumber }
                      onChange={this.handleInputChange('cpu')}
                      value={this.state.cpu}
                    />
                    </FormGroup>
                </Col>
                {
                  publish_type === 3 ? (
                    <Col sm={3} className="formZindex">
                      <FormGroup>
                        <Label>CPU 最小值</Label>
                        <FormControl
                          style={{imeMode: 'Disabled'}}
                          onKeyDown={ onlyNumber }
                          onChange={this.handleInputChange('cpuMin')}
                          value={this.state.cpuMin}
                        />
                      </FormGroup>
                    </Col>
                  ) : (
                    <div></div>
                  )
                }
                <Col sm={3} className="formZindex">
                  <FormGroup>
                    <Label>内存 最大值</Label>
                    <InputGroup>
                      <FormControl
                        style={{imeMode: 'Disabled'}}
                        onKeyDown={ onlyNumber }
                        onChange={this.handleInputChange('mem')}
                        value={this.state.mem}
                      />
                      <InputGroup.Addon>MB</InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                </Col>
                {
                  publish_type === 3 ? (
                    <Col sm={3} className="formZindex">
                      <FormGroup>
                        <Label>内存 最小值</Label>
                        <InputGroup>
                          <FormControl
                            style={{imeMode: 'Disabled'}}
                            onKeyDown={ onlyNumber }
                            onChange={this.handleInputChange('memMin')}
                            value={this.state.memMin}
                          />
                          <InputGroup.Addon>MB</InputGroup.Addon>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  ) : (
                    <div></div>
                  )
                }
                <Col md={12}>
                  <FormGroup>
                    <Label>命令</Label>
                    <textarea
                      value={this.state.cmd}
                      onChange={this.handleInputChange('cmd')}
                      rows="3"
                      style={{width: '100%'}}/>
                  </FormGroup>
                </Col>
              </Col>
            </Row>
            <Row className="classify">
              <Col sm={12}>
                <div className="title">Docker镜像</div>
              </Col>
              <Col sm={9}>

                <Col md={8}>
                  <FormGroup>
                    <Label>镜像</Label>
                    <FormControl
                      placeholder={this.state.image}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>版本</Label>

                    <Select
                      value={this.state.image_version}
                      onChange={this.handleSelect('image_version')}>
                      {
                        this.state.versionList.map(function (item, index) {
                          return (<Option key={item} value={item}>{item}</Option>)
                        })
                      }
                    </Select>

                  </FormGroup>
                </Col>

              </Col>
            </Row>
            <Row className="classify">
              <Col sm={12}>
                <div className="title">端口</div>
              </Col>
              <Col sm={9}>

                {
                  this.state.portMappings.map(function (item, index, array) {
                    return (
                      <div key={index}>
                        <Col md={2}>
                          <FormGroup>
                            <Label>容器端口</Label>
                            <FormControl
                              value={item.containerPort}
                              onChange={self.storeKeyValue('portMappings', 'containerPort', index)}/>
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>协议</Label>
                            <Select
                              defaultValue="tcp"
                              onChange={self.handleStoreSelect('portMappings', 'protocol', index)}>
                              <Option value="tcp">tcp</Option>
                              <Option value="udp">udp</Option>
                            </Select>
                          </FormGroup>
                        </Col>

                        <Col md={2}>
                          <FormGroup>
                            <Label>访问方式</Label>
                            <Select
                              defaultValue="HTTP"
                              value={ item.access_mode }
                              onChange={self.handleStoreSelect('portMappings', 'access_mode', index)}>
                              <Option value="HTTP">HTTP</Option>
                              <Option value="TCP">TCP</Option>
                              <Option value="NA">不可访问</Option>
                            </Select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>访问范围</Label>
                            <Select
                              defaultValue="OUTER"
                              value={ item.access_range }
                              onChange={self.handleStoreSelect('portMappings', 'access_range', index)}
                              disabled={item.access_mode === 'NA'}>
                              <Option value="INNER">内部服务</Option>
                              <Option value="OUTER">外部服务</Option>
                              <Option value="ALL">全部</Option>
                            </Select>
                          </FormGroup>
                        </Col>
                        <FormGroup>
                                                <span className="control">
                                                    <Icon type="uf-add-c-o" style={{color: "#0084ff"}}
                                                          onClick={ self.handlePlus('portMappings', clone(portObj))}/>
                                                  {
                                                    array.length === 1 ? "" : (
                                                      <Icon type="uf-reduce-c-o" style={{color: "#0084ff"}}
                                                            onClick={self.handleReduce('portMappings', index)}/>
                                                    )
                                                  }
                                                </span>
                        </FormGroup>

                      </div>
                    )
                  })
                }

              </Col>
            </Row>
            <Row className="classify">
              <Col sm={12}>
                <div className="title">环境变量</div>
              </Col>
              <Col sm={9}>
                {
                  this.state.env.map(function (item, index, array) {
                    return (
                      <div key={index}>
                        <Col md={5}>
                          <FormGroup>
                            <Label>键</Label>
                            <FormControl
                              value={item.key}
                              onChange={self.storeKeyValue('env', 'key', index)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>值</Label>
                            <FormControl
                              value={item.value}
                              onChange={self.storeKeyValue('env', 'value', index)}
                            />
                          </FormGroup>
                        </Col>
                        <FormGroup>
                                                <span className="control">
                                                <Icon type="uf-add-c-o" style={{color: "#0084ff"}}
                                                      onClick={ self.handlePlus('env', {key: "", value: ""})}/>
                                                  {
                                                    array.length === 1 ? "" : (
                                                      <Icon type="uf-reduce-c-o" style={{color: "#0084ff"}}
                                                            onClick={self.handleReduce('env', index)}/>
                                                    )
                                                  }
                                                </span>
                        </FormGroup>
                      </div>
                    )
                  })
                }
              </Col>
            </Row>
            <Row className="classify">
              <Col sm={12}>
                <div className="title">Volumes</div>
              </Col>
              <Col sm={9}>

                {
                  this.state.volumes.map(function (item, index, array) {
                    return (
                      <div key={index} className="add-row">
                        <Col md={4}>
                          <FormGroup>
                            <Label>容器路径</Label>
                            <FormControl
                              value={item.containerPath}
                              onChange={self.storeKeyValue('volumes', 'containerPath', index)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>本地路径</Label>
                            <FormControl
                              value={item.hostPath}
                              onChange={self.storeKeyValue('volumes', 'hostPath', index)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>模式</Label>
                            <Select
                              defaultValue={item.mode}
                              onChange={self.handleStoreSelect('volumes', 'mode', index)}>
                              <Option value="RW">读写</Option>
                              <Option value="RO">只读</Option>
                            </Select>
                          </FormGroup>
                        </Col>
                        <span className="control">
                                                    <Icon type="uf-add-c-o" style={{color: "#0084ff"}}
                                                          onClick={ self.handlePlus('volumes', {
                                                            "containerPath": "",
                                                            "hostPath": "",
                                                            "mode": "RO"
                                                          })}/>
                          {
                            array.length === 1 ? "" : (
                              <Icon type="uf-reduce-c-o" style={{color: "#0084ff"}}
                                    onClick={self.handleReduce('volumes', index)}/>
                            )
                          }

                                                </span>
                      </div>
                    )
                  })
                }

              </Col>
            </Row>
            <Row className="classify">
              <Col sm={12}>
                <div className="title">健康检查</div>
              </Col>
              <Col sm={9}>
                {
                  this.state.healthChecks.map(function (item, index, array) {
                    return (
                      <div key={index}>
                        {
                          array.length === 1 ? "" : (
                            <Col md={12}>
                              <Icon
                                style={{fontSize: 30, color: 'gray', cursor: 'pointer'}}
                                type="uf-reduce-s"
                                onClick={self.handleReduce('healthChecks', index)}
                              />
                            </Col>
                          )
                        }
                        <Col md={12}>
                          <FormGroup>
                            <Label>协议</Label>
                            <Select
                              defaultValue={item.type}
                              value={item.type}
                              onChange={self.handleStoreSelect('healthChecks', 'type', index)}>
                              <Option value="HTTP">HTTP</Option>
                              <Option value="TCP">TCP</Option>
                              <Option value="COMMAND">COMMAND</Option>
                            </Select>
                          </FormGroup>
                        </Col>
                        { item.type === 'HTTP' ? (
                          <Col md={12}>
                            <FormGroup>
                              <Label>路径</Label>
                              <FormControl
                                value={item.HTTP.path}
                                onChange={self.handleHealthStoreChange('healthChecks', 'HTTP', 'path', index)}
                              />
                              <span>例如：“/path/to/health”</span>
                            </FormGroup>
                          </Col>
                        ) : ""
                        }
                        { (item.type === 'COMMAND') ?
                          (
                            <Col md={12}>
                              <FormGroup>
                                <Label>命令</Label>
                                <FormControl
                                  value={item[item.type].command}
                                  onChange={self.handleHealthStoreChange('healthChecks', 'COMMAND', 'command', index)}
                                />
                              </FormGroup>

                            </Col>
                          ) : ""

                        }
                        <Col md={4}>
                          <FormGroup>
                            <Label>开始检查时间</Label>
                            <InputGroup>
                              <FormControl
                                style={{imeMode: 'Disabled'}}
                                onKeyDown={ onlyNumber }
                                value={item[item.type].gracePeriodSeconds}
                                onChange={self.handleHealthStoreChange('healthChecks', item.type, 'gracePeriodSeconds', index)}
                              />
                              <InputGroup.Addon>秒</InputGroup.Addon>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>检查周期</Label>
                            <InputGroup>
                              <FormControl
                                style={{imeMode: 'Disabled'}}
                                onKeyDown={ onlyNumber }
                                value={item[item.type].intervalSeconds}
                                onChange={self.handleHealthStoreChange('healthChecks', item.type, 'intervalSeconds', index)}
                              />
                              <InputGroup.Addon>秒</InputGroup.Addon>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>超时</Label>
                            <InputGroup>
                              <FormControl
                                style={{imeMode: 'Disabled'}}
                                onKeyDown={ onlyNumber }
                                value={item[item.type].timeoutSeconds}
                                onChange={self.handleHealthStoreChange('healthChecks', item.type, 'timeoutSeconds', index)}
                              />
                              <InputGroup.Addon>秒</InputGroup.Addon>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>最多失败次数</Label>
                            <FormControl
                              style={{imeMode: 'Disabled'}}
                              onKeyDown={ onlyNumber }
                              value={item[item.type].maxConsecutiveFailures}
                              onChange={self.handleHealthStoreChange('healthChecks', item.type, 'maxConsecutiveFailures', index)}
                            />
                          </FormGroup>
                        </Col>
                        { (item.type === 'COMMAND') ? "" :
                          (
                            <div>
                              <Col md={4}>
                                <FormGroup>
                                  <Label>{item.port === "portIndex" ? "端口索引" : "端口号"}</Label>
                                  <FormControl
                                    style={{imeMode: 'Disabled'}}
                                    onKeyDown={ onlyNumber }
                                    value={item[item.type][item.port]}
                                    onChange={self.handleHealthStoreChange('healthChecks', item.type, item.port, index)}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label>端口类型</Label>
                                  <Select
                                    value={item.port}
                                    onChange={self.handleStoreSelect('healthChecks', 'port', index)}>
                                    <Option value="portIndex">端口索引</Option>
                                    <Option value="port">端口号</Option>
                                  </Select>
                                </FormGroup>
                              </Col>
                            </div>
                          )
                        }

                      </div>
                    )
                  })
                }
                <Col md={12}>
                  <Button style={{margin: "40px 0"}} colors="primary" shape="squared" bordered
                          onClick={this.addHealthCheck}>再添加一条健康检查</Button>
                </Col>
              </Col>
            </Row>
          </Form>
        </Col>

      </div>
    )
  }
}

export default Configuration;
