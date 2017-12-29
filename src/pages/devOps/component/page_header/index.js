import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import './index.css';

class PageHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    router: PropTypes.object.isRequired,
    showBack: PropTypes.bool,
  }
  static defaultProps = {
    title: "变更大盘",
    showBack: false,
  }

  handleGoBack = () => {
    this.props.router.goBack();
  }

  render() {
    return (
      <div className="page-header">
        {
          this.props.showBack ? (
            <div className="page-header__ret"
              onClick={this.handleGoBack}
            >
              <span className="cl cl-arrow-left"></span>
              <span>返回</span>
            </div>
          ) : null
        }

        <div className="page-header__title"
        >
          {this.props.title}
        </div>
        <div className="page-header__oper">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default withRouter(PageHeader)