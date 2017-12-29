import {Component, cloneElement} from 'react';
import {Row, Message} from 'tinper-bee';
import Title from '../../../../components/Title';

import {
  GetConfigVersionFromCenter,
  GetConfigEnvFromCenter,
  GetConfigAppFromCenter,
}from '../../../../serves/confCenter';

import {err, success} from 'components/message-util';

class MainPage extends Component {
  state = {
    envList: [],
    appList: [],
  }

  componentDidMount() {

    GetConfigEnvFromCenter()
      .then((res) => {
        if (res.data.success === 'true') {
          if (res.data.page.result instanceof Array) {

            this.setState({
              envList: res.data.page.result
            })
          }

        } else {
          err(res.data.error_message);
        }
      }).catch((e) => {
        err(e.response.data.error_message);
      });


    GetConfigAppFromCenter().then((res) => {
      if (res.data.success === 'true') {
        this.setState({
          appList: res.data.page.result,
        })
      } else {
        err(res.data.error_message);
      }
    }).catch((e) => {
      err(e.response.data.error_message);
    })
  }





  render() {
    let { envList, appList} = this.state;

    let name = "配置列表", showBack = false;
    let {pathname} = this.props.location;
    if (pathname === '/create') {
      name = "创建配置文件";
      showBack = true;
    } else if (pathname === '/createitem') {
      name = "创建配置项";
      showBack = true;
    }

    return (
      <Row className="conf-center">
        <Title name={ name } showBack={ showBack }/>
        {
          cloneElement(this.props.children, {
            envList: envList,
            appList: appList
          })
        }
      </Row>
    )
  }
}

export default MainPage;
