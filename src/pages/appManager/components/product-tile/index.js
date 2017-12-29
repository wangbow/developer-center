import {Component} from 'react';
import {Tile, Icon, Tooltip, Clipboard} from 'tinper-bee';
import {Link} from 'react-router';
import classnames from 'classnames';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';

import { getCookie } from 'components/util';

import {checkEmpty} from 'components/util';

import './index.less';

import {ENV_NAME} from '../../contants';


class ProductTile extends Component {

  state = {
    activeEnv: 'develop'
  }

  /**
   * 点击选择环境
   * @param value
   */
  changeEnv = (value) => (e) => {
    e.stopPropagation();
    this.setState({
      activeEnv: value
    })
  }

  renderTitle = (title, type) => {
    switch (type){
      case 'product':
        title += '-[产品]';
        break;
      case 'business':
        title += '-[产品线]';
        break;
      case 'service':
        title += '-[服务]';
        break;
    }
    return (
      <Tooltip inverse>
        { title }
      </Tooltip>
    )
  }

  /**
   * 复制点击不跳转
   * @param e
   */
  handleClick = (e) => {
    e.stopPropagation();
  }

  render() {
    let {data, onEdit, onDelete, onClick, index} = this.props;
    let {activeEnv} = this.state;

    let code = data.app_code ? data.app_code : '';

    return (
      <div className="tile-container">
        <Tile className="product-tile">
          <div onClick={ onClick(data.group_id, data.name)} style={{cursor: 'pointer'}}>

            <div className={classnames("tile-header", `tile-${data.type}`)}>
              <OverlayTrigger overlay={this.renderTitle(data.name, data.type)} placement="bottom">
                <h4 className="tile-header-title">
                  {data.name}
                </h4>
              </OverlayTrigger>
              <div className="desc">
                <span>
                  <i className="cl cl-person-l"/>
                  { checkEmpty(decodeURIComponent(data.create_username)) }
                </span>
                <span className="time">
                  <i className="cl cl-time-02"/>
                        {checkEmpty(data.update_time)}
                </span>
              </div>
            </div>

            <ul className="env-list">
              {
                ENV_NAME.map((item) => {

                  return (
                    <li
                      key={ item.key }
                      className={classnames("env-item", {'active': activeEnv === item.key, 'disable': data[`${item.key}_url`] === ''})}
                      onClick={ this.changeEnv(item.key) }>
                      { item.name }
                      <span className={classnames("env-item-status", {"disable": data[`${item.key}_url`] === ''})}/>
                    </li>
                  )
                })
              }
            </ul>
            <div className="tile-body">
              <div className="info-row">
                <div className="info-col-2">
                  <div className="label">应用数</div>
                  <div className="value">{`${checkEmpty(data.app_count)}`}</div>
                </div>
                {
                  data.type === 'service' ? (
                    <div className="info-col-2">
                      <div className="label">标识</div>
                      <OverlayTrigger overlay={<Tooltip inverse>{`${code}@${getCookie('u_providerid')}`}</Tooltip>} placement="bottom">
                        <div className="value">{`${code}@${getCookie('u_providerid')}`}</div>
                      </OverlayTrigger>
                      <div className="clip" onClick={this.handleClick}>
                        <Clipboard
                          action="copy"
                          text={`${code}@${getCookie('u_providerid')}`}
                        />
                      </div>

                    </div>
                  ) : (
                    <div className="info-col-2">
                      <div className="label">最后操作</div>
                      <div className="value">{checkEmpty(data.latest_action)}</div>
                    </div>
                  )
                }

              </div>
              <div className="info-row">
                {
                  data.type === 'service' ? (
                    <div>
                      <div className="label">最后操作</div>
                      {
                        `${checkEmpty(data.action_time)} ${checkEmpty(data.latest_action)}`
                      }
                    </div>
                  ) : (
                    <div>
                      <div className="label">访问地址</div>
                      {
                        checkEmpty(data[`${activeEnv}_url`])
                      }
                    </div>
                  )
                }

              </div>
            </div>
          </div>
          <ul className="group-control">
            <li onClick={onEdit(data, index)}>
              <Icon type="uf-pencil-s"/>
              编辑
            </li>
            <li onClick={onDelete(data.group_id, index, data.type)}>
              <Icon type="uf-del"/>
              删除
            </li>
          </ul>
        </Tile>
      </div>
    )
  }
}

export default ProductTile;
