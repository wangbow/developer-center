import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'tinper-bee';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import Header from '../header';
import './index.css';



class Tabs extends Component {
  static propTypes = {
    info: PropTypes.array,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    info: [{
      name: '变更详情',
      path: '/detail'
    }, {
      name: '变更大盘',
      path: '/change'
    }],
  }


  constructor(props, ctx) {
    super(props, ctx);
    let index = 0;
    if (location.hash.indexOf('change') >= 0) {
      index = 1;
    }
    this.state = {
      activeIndex: index,
    }
  }

  handleNav = ({ path }, index) => {
    return () => {
      this.setState({
        activeIndex: index,
      })
      this.props.router.replace(path);
    }
  }

  render() {
    return (
      <div className="tabs">
        {
          this.props.info.map((item, index) => {
            const cls = classnames({
              "tabs__btn": true,
              "tabs__btn--active": index == this.state.activeIndex,
            })
            return (
              <Button
                className={cls}
                onClick={this.handleNav(item, index)}
              >
                {item.name}
              </Button>
            )
          })
        }
        {/*<div>
          <Header
            types={[]}
            onTypeChange={this.onTypeChange}
            onSearch={this.onSearch}
          />
        </div>*/}
      </div>
    )
  }
}

export default withRouter(Tabs)