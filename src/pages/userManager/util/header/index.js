
import { Component, PropTypes } from 'react';
import { Row } from 'tinper-bee';
import "./index.less";


class Header extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * 返回上一页
   */
  handleReturnClick = () => {
    this.props.router.goBack();
  }

  render() {
    const { router, widthGoBack, children } = this.props;
    return (

      <div className="headWraper">

        {
          widthGoBack && (
            <span className="return" onClick={this.handleReturnClick}>
              <span className="cl cl-arrow-left"></span>
                返回
          </span>
          )
        }

        <span className="title">
          {children}
        </span>
      </div>
    )
  }

}

export default Header;













