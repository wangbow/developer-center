import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';

// self component
import Search from '../search';

// varibles
const Option = Select.Option;

// static
import "./index.css";

export default class Header extends PureComponent {
  static propTypes = {
    types: PropTypes.array,
    onSearch: PropTypes.func,
    onTypeChange: PropTypes.func,
  }
  static defaultProps = {
    types: [],
    onSearch: ()=>{},
    onTypeChange: () => { },
  }


  state = {
    type: ''
  }
  componentWillReceiveProps(props){
    if(this.props.types !== props.types){
    this.setState({
      type: props.types[props.types.length-1].index,
    })}
  }

  handleTypeChange = (value, label) => {
     this.setState({
       type: value,
     });
     this.props.onTypeChange(value);
  }
  
  handleSearch=(value)=>{
    this.props.onSearch(value,this.state.type)
  }

  render() {
    return (
      <div className="header">
        <Search onSearch={this.handleSearch}/>
        <div className="header__select">
          <span
            className="header__title"
          >类型</span>
          <Select style={{ width: 150 }}
            onChange={this.handleTypeChange}
            value={this.state.type}
          >
            {
              this.props.types.map((item,index)=>{
                return <Option key={item.index} value={item.index}>{item.desc}</Option>
              })
            }
          </Select>
        </div>
      </div>
    )
  }
}