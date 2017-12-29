import React, {
  Component
} from 'react';
import {
  Row,
  Col,
  Tile,
  Button,
  Message
} from 'tinper-bee';

import InfoModal from '../config-file-info';

import {
  GetConfigFileFromCenterByCode,
} from '../../../../serves/confCenter';

import './index.less';
import '../../../../lib/codemirror.css';
import '../../../../lib/codemirror/theme/blackboard.css';

import imgempty from '../../../../assets/img/taskEmpty.png';

const envObj = {
  dev: {
    num: 1,
    name: '开发环境'
  },
  test: {
    num: 2,
    name: '测试环境'
  },
  stage: {
    num: 3,
    name: '灰度环境'
  },
  online: {
    num: 4,
    name: '发布环境'
  }
};


class ConfigFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      file: {},
      showDetailModal: false
    }

  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    let {
      env,
      appCode
    } = this.props;
    if (appCode && env.cf_disconf_env != null) {
      GetConfigFileFromCenterByCode(`?appCode=${ appCode }&envId=${ envObj[env.cf_disconf_env].num }&version=${ env.cf_disconf_version }`)
        .then((res) => {
          if (res.data.error_code) {
            Message.create({
              content: res.data.error_message,
              color: 'danger',
              duration: null
            })
          } else {
            this.setState({
              fileList: res.data.page.result,
            });
          }
        });
    }


  }
  handleClick = (index) => {
    let {
      fileList
    } = this.state;
    return () => {
      this.setState({
        showDetailModal: true,
        file: fileList[index]
      })
    }

  }

  hideModal = () => {
    this.setState({
      showDetailModal: false
    })
  }


  render() {
    let {
      env
    } = this.props;
    return (
      <Col md={12} className="config-file">
        {
          env.cf_disconf_version ? (
            <Row>
              <Col md={12}>
                                <span className="config-version">
                                    版本{ env.cf_disconf_version }
                                </span>
                <span className="config-env">
                                    { envObj[env.cf_disconf_env].name }
                                </span>

                  <a className="u-button u-button-squared u-button-primary control-btn" href="/confcenter/index.html#confMgr/page">
                    管理配置文件
                  </a>
              </Col>
              <Col md={12} className="divier"/>
              {
                this.state.fileList.map((item, index) => {
                  let name = item.key, iconClass = '';
                  let suffix = name.split('.')[1];
                  if (/xml/.test(suffix)) {
                    iconClass = 'cl-xml1';
                  } else {
                    iconClass = 'cl-properties';
                  }
                  return (
                    <Col md={2} sm={3} xs={4} key={ index } className="text-center"
                         onClick={ this.handleClick(index) }>
                      <Tile className="configfile">
                        <i className={`config-icon cl ${iconClass}`}/>
                        <p>
                          { item.key }
                        </p>
                      </Tile>
                    </Col>
                  )
                })
              }
            </Row>
          ) : (
            <div className="empty-task">
              <img src={imgempty} width="200"/> <br/>
              <span>当前应用没有配置文件</span>
            </div>
          )
        }
        <InfoModal show={ this.state.showDetailModal } data={ this.state.file } onClose={ this.hideModal }/>
      </Col>
    );
  }
}


export default ConfigFile;