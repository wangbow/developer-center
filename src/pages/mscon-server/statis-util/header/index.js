import { Component } from 'react';
import PropTypes from 'prop-types';

// self component
import DropDown from '../dropdown';
import TimePicker from '../timePicker';

// static
import './index.less';


export default class Header extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array,
    onChangeTime: PropTypes.func,
  }
  static defaultProps = {
    onChange: () => { },
    onChangeTime: () => { },
    options: [],
  }

  state = {}

  render() {

    return (
      <div className="panel-h-show">
        <div className="panel-h__app">
          <h3 className="margin-top-0">应用选择</h3>
          <DropDown
            onChange={this.props.onChange}
            options={this.props.options}
            defaultValue = {this.props.defaultAppId}
          />
        </div>
        <div className="panel-h__picker">
          <h3 className="margin-left-10">时间选择</h3>
          <TimePicker
          defaultValue={this.props.defaultTimeId}
            onChangeTime={this.props.onChangeTime}
          />
        </div>
      </div>
    )
  }
}