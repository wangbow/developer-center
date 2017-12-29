import {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Step from '../step';
import Coder from '../coder';

import './index.less';


export default class Process extends PureComponent{
  static propTypes = {
    appId: PropTypes.string,
  }
  render(){
    return (
      <div>
        <Step
          icon="cl-bushu"
          title="部署应用"
        >
          <div>在开发者中心部署应用，系统会为您分配好应用ID (此应用ID就是埋点时的入参siteID)。 </div>
        </Step>
        <Step
          icon="cl-code-edit"
          title="添加埋点代码"
        >
          <p>请将如下代码粘贴到您的需要采集的HMTL页面的&lt;/body&gt;前面，成功后，平台将统计到用户在网页上的点击行为信息：
</p>
          <Coder
            code={[
              '<script type= "text/javascript" src= "https://developer.yonyoucloud.com/iuap-insight.min.js"></script>',
              '<script>',
              '  uis.start({',
              '    trackerUrl: \'https://collect.yonyoucloud.com/iuapInsight/collect\',',
              "    userId:'user',",
              `    siteId:'${this.props.appId}',`,
              "  });",
              "</script>"
            ]}
          />
          <div className="params">
              <div className="params--item">
              <span className="params--item-mark">*</span>
                <span className="params--item-name">trackerUrl</span>
                <span className="params--item-cont">数据收集接口</span>
              </div>
              <div className="params--item">
                <span className="params--item-mark">*</span>
                <span className="params--item-name">userId</span>
                <span className="params--item-cont">页面访问者的用户信息，可以是session或cookie中读取的信息,例如：getCookie('userName')[javascript]、$('userName')[jsp]</span>
              </div>
              <div className="params--item">
                <span className="params--item-mark">*</span>
                <span className="params--item-name">siteId</span>
                <span className="params--item-cont">应用id，#必填项，已加载您的appid，无需修改</span>
              </div>
          </div>
          <p>【进阶使用】平台也开放了用户采集自定义数据的API接口，用于集成到前端代码的业务逻辑中，采集定制的数据。使用方法如下:</p>
          <Coder
            code={[
              '<div id="app" style="background:#ccc;"> 点我发送 </div>',
              '<script>',
              "  $('#app').click(function(e){",
              "    uis.track(e, 'click_text', ‘abc’);",
              '  })',
              '</script>'
            ]}
          />
        </Step>
        <Step
          icon="cl-box-o"
          title="构建新版本"
        >
          <div>进入 [ 持续集成 ] 界面，找到对应的应用构建新版本，上传已经埋好点的应用包。</div>
        </Step>
        <Step
          icon="cl-update-p"
          title="升级应用"
        >
          <div>进入 [ 应用管理 ] 界面，找到对应的应用进行升级应用。 </div>
        </Step>
        <Step
          icon="cl-yes"
          title="埋点验证完成"
        >
          <div>访问升级后的应用，系统开始收集并统计用户对已埋点页面的访问数据。这时，您就可以在监控大盘中查看到相关的统计数据。 </div>
        </Step>
      </div>
    )
  }



}