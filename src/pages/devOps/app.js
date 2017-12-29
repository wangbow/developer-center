// publics
import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router';
import { Button } from 'tinper-bee';



// variables

// test
import Header from './component/header';
import TimePicker from './component/timePicker';
import PageHeader from './component/page_header';
import MyTabs from './component/tabs';



export default class App extends Component {
  static propTypes = {}
  static defaultProps = {}

  render() {
    return (
      <div>
        <PageHeader>
          <Link
            className="u-button tabs__btn tabs__btn--active"
            to="/creation"
          >
            新建变更
          </Link>
        </PageHeader>
        <MyTabs></MyTabs>
        {this.props.children}
      </div>

    )
  }
}