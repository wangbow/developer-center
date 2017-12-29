import {Component} from 'react';
import {Message} from 'tinper-bee';

import {List, ListControl} from '../../components';

import {
  GetConfigFileFromCenter,
  GetConfigVersionFromCenter,
}from 'serves/confCenter';

import {err, success} from 'components/message-util';

class ListPage extends Component {
  state = {
    data: [],
    env: '1',
    version: '',
    versionList: [],
    appName: '',
  }
  flag= true;
  componentDidMount() {


  }


  componentWillReceiveProps(nextProps) {
    let {appList} = nextProps;
    if(appList instanceof Array && appList.length !== 0 && this.flag){
      let appName = appList[0].value;
      if(appName && appName !== ''){
        this.flag = false;
        this.getVersion(appName, '1');
        this.setState({
          appName
        })
      }
    }

  }

  getVersion = (appId, env) => {
    //获取版本列表
    GetConfigVersionFromCenter(`?appId=${ appId }&envId=${ env }&needDefine=false`)
      .then((res) => {
        if (res.data.success === 'true') {
          let version = '', versionList = res.data.page.result;

          if (versionList && versionList.length !== 0) {
            version = versionList[0].value;
          }

          this.setState({
            versionList,
            version
          });
          if(version !== ''){
            this.getConfigFile(appId, this.state.env, version);
          }else{
            this.setState({
              data: []
            })
          }

        } else {
          this.setState({
            error: true,
          });
          err(res.data.error_message);
        }

      }).catch((e) => {
      err(e.response.data.error_message);
    });

  };

  /**
   * 获取配置文件列表
   * @param appId
   * @param env 环境
   * @param version 版本
   * @param activePage

   */
  getConfigFile = (appId, env, version, activePage = 1) => {
    if (version === '') {
      this.setState({
        data: [],
        page: 0,
      })
    } else {
      GetConfigFileFromCenter(`?appId=${ appId }&envId=${ env }&version=${ version }&pgSize=10&pgNo=${ activePage }`)
        .then((res) => {
          if (res.data.error_code) {
            err(res.data.error_message);
          } else {
            let totalpage = Math.ceil(res.data.page.totalCount / 10);
            if (res.data.page.result instanceof Array) {
              res.data.page.result.forEach((item, index) => {
                item.name = item.key;
                item.key = index;
              });
              this.setState({
                data: res.data.page.result,
                page: totalpage,
              })
            }

          }

        }).catch((e) => {
        err(e.response.data.error_message);
      });
    }
  }


  /**
   * 下拉框选择
   * @param state
   * @returns {function(*=)}
   */
  handleSelectChange = (state) => {
    let { appName } = this.state;

    return (value) => {
      switch (state) {
        case 'appName':
         this.getVersion(value, this.state.env);
          break;
        case 'env':
          this.getVersion(appName, value);
          break;
        case 'version':
          this.getConfigFile(appName, this.state.env, value);
          break;
      }
      this.setState({
        [state]: value
      })
    }
  }

  refresh = (key) => {
    let {env, version, appName} = this.state;

    this.getConfigFile(appName, env, version, key);
  }

  render() {
    let {version, env, data, versionList, appName} = this.state;
    let { envList, appList } = this.props;

    let selectData = [{
      stateName: 'appName',
      value: appName,
      children: appList
    }, {
      stateName: 'env',
      value: env,
      children: envList
    }, {
      stateName: 'version',
      value: version,
      children: versionList
    }];

    return (
      <div>
        <ListControl
          data={ selectData }
          onSelect={ this.handleSelectChange }
        />
        <List
          data={ data }
          refresh={ this.refresh }
          page={ this.state.page }
        />
      </div>
    )
  }
}

export default ListPage;
