import {Component} from 'react';
import {Badge, Tooltip, Icon} from 'tinper-bee';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';

import {ImageIcon} from 'components/ImageIcon';
import {checkEmpty} from 'components/util';

import classnames from 'classnames';

import './index.less';

class TileHeader extends Component {

  renderTitle = (title) => {
    title += '-[应用]';
    return (
      <Tooltip inverse>
        { title }
      </Tooltip>
    )
  }

  renderStatus = (AppData) => {
    if (AppData.type === 'product')
      return null;

    if (AppData.running > 0 && AppData.staged <= 0 && AppData.wait <= 0 && AppData.deployments <= 0) {
      return (
        <span className="bg-green-500">运行中</span>
      )
    }
    if (AppData.deployments > 0 && AppData.wait <= 0 && AppData.staged <= 0) {
      return (
        <span className="bg-blue-600">部署中</span>
      )
    }
    if (AppData.staged > 0 && AppData.wait <= 0) {
      return (
        <span className="bg-grey-600">初始化</span>
      )
    }
    if (AppData.wait > 0) {
      return (
        <span className="bg-grey-600">等待中</span>
      )
    }

    if (AppData.running == 0 && AppData.staged == 0 && AppData.wait == 0 && AppData.deployments <= 0 && AppData.wait == 0) {
      return (
        <span
          className={AppData.status ? "bg-red-500" : "bg-grey-300"}>
          {AppData.status ? AppData.status : "未知"}
        </span>
      )
    }
  }

  render() {
    let {AppData} = this.props;
    let type = AppData.type ? AppData.type : 'app';

    return (
      <div className={classnames("tile-header", `tile-${type}`)}>
        <div className="tile-header-cage">
          {
            ImageIcon(AppData.iconPath, classnames('tile-header-cage-img',{'product': AppData.type === 'product' || AppData.type === 'business'}), AppData.type)
          }
        </div>
        <OverlayTrigger overlay={this.renderTitle(AppData.name)} placement="bottom">
          <h4 className="tile-header-title">
            {AppData.name}
          </h4>
        </OverlayTrigger>
        <span className="states">
          { this.renderStatus(AppData) }
        </span>
        {AppData.runState == 3 && (<Badge colors="primary">已上架</Badge>)}
        <div className="desc">
          <span>
            <i className="cl cl-person-l"/>
            { checkEmpty(AppData.user_name) }
          </span>
          <span className="time">
            <i className="cl cl-time-02"/>
            {AppData.updateTime}
          </span>
        </div>
      </div>
    )
  }
}

export default TileHeader;
