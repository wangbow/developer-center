import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';

// static
import "./index.css";

export default class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
  }
  static defaultProps = {
    onSearch: () => { },
  }

  state = {
    value: '',
  }

  handleSearch = () => {
    const value = this.state.value;
    this.props.onSearch(value);
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    return (
      <div className="search">
        <div className="search__input">
          <Input.Search
            placeholder="标题"
            onSearch={this.handleSearch}
            onChange={this.handleChange}
          />
        </div>
      </div>
    )
  }
}