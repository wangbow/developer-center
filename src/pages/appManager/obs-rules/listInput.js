import { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'tinper-bee';
import classnames from 'classnames';
import RuleMeta from './rule-meta';
import './index.less';

let keyValShape = PropTypes.shape({
  name: PropTypes.string,
  value: PropTypes.any,
})

export default class ListInput extends PureComponent {
  static propTypes = {
    defaultValue: PropTypes.string,
    dataSource: PropTypes.arrayOf(keyValShape),
    onChange: PropTypes.func,
  }

  static defaultProps = {
    dataSource: [],
    onChange: () => { },
  }

  constructor(props) {
    super(props);

    this.state = {
      valueIndex: this.getArrayIndex(props.defaultValue)
    }
  }

  get value() {
    return this.props.dataSource[this.state.valueIndex];
  }
  getArrayIndex = value => {
    return this.props.dataSource.indexOf(value)
  }

  handleValueChange = (index) => {
    return (e) => {
      this.setState({
        valueIndex: index,
      });
      this.props.onChange(this.props.dataSource[index]);
    }
  }
  render() {
    return (
      <ul className="opt-list">
        {
          this.props.dataSource.map((data, index) => (
            <li
              title={data.name}
              key={index}
              onClick={this.handleValueChange(index)}
              className={classnames({
                'opt-list-active': index === this.state.valueIndex,

              })}
            >
              {data.name}
            </li>
          ))
        }
      </ul>
    );
  }
}