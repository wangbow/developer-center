import {
  Component
} from 'react';

import './index.less';

class Header extends Component {
  render() {
    return (
      <div className="monitor-header">
        <div className="cross" />
        <div className="title">
          用友云开发者中心-全链路监控
        </div>
        <div className="cross-footer" >
          <ul className="state">
            <li className="state-item">
              正常状态
              <div className="state-one" />
            </li>
            <li className="state-item">
              警告状态
              <div className="state-two" />
            </li>
            <li className="state-item">
              错误状态
              <div className="state-third" />
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header;