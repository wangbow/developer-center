import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Button } from 'tinper-bee';

// variables
const Option = Select.Option;

export default class Selection extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array,
    defaultValue: PropTypes.string,

  }
  static defaultProps = {
    onChange: () => { },
    options: [],
    defaultValue: '',
  }

  constructor(props) {
    super(props);
    let value = (props.options[0] && props.options[0]['app_id']);
    this.state = {
      value
    }
  }

  componentWillReceiveProps(props) {
    if (props.options !== this.props.options) {
      this.setState({
        value: getName(props.options, props.defaultValue) || props.options[0] && props.options[0]['app_id'],
      })
    }

  }

  handleChange = (value) => {
    this.setState({
      value
    });
    this.props.onChange(value);
  }

  handleClick = () => {
    ReactDOM.findDOMNode(this.refs.select).click();
  }
  render() {
    return (
      <div>
        <Select
          ref="select"
          onChange={this.handleChange}
          value={this.state.value}
        >
          {
            this.props.options.map(item => {
              return (
                <Option
                  key={item.app_id}
                  value={item.app_id}
                >{item.app_name}
                </Option>
              )
            })
          }
        </Select>
        
      </div>
    )
  }
}

function getName(opts = [], id) {
  for (let i = 0; i < opts.length; i++) {
    if (opts[i].app_id == id) {
      return opts[i].app_name;
    }
  }
}