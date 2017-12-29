import { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'tinper-bee';
import classnames from 'classnames';
import RuleMeta from './rule-meta';
import './index.less';

import ListInput from './listInput';

let keyValShape = PropTypes.shape({
  name: PropTypes.string,
  value: PropTypes.any,
})


export default class Box extends PureComponent {
  static propTypes = {
    popData: PropTypes.arrayOf(keyValShape),
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    placement: PropTypes.string,
    style: PropTypes.object,
    inputClass: PropTypes.string,
    errMsg: PropTypes.string,

    onChange: PropTypes.func,
    changeValidation: PropTypes.func
  }

  static defaultProps = {
    popData: undefined,
    placement: 'bottom',
    defaultValue: undefined,
    errMsg: '请输入正确信息',
    onChange: () => { console.warn('没有监听change事件') },
    changeValidation: () => { return true; }
  }

  constructor(props) {
    super(props);


    this.state = {
      value: this.getValStateFromPropVal(props),
      loading: false,
    }
  }

  inputValue = null;

  componentWillReceiveProps(nextProps) {
    let { value } = nextProps;
    if (value !== this.props.value) {
      this.setState({
        value: this.getValStateFromPropVal(nextProps),
      })
    }
  }

  getInputRef = (ele) => {
    this.inputRef = ele;
  }

  handleChange = () => {
    this.props.onChange();
  }

  handleConfirmClose = () => {
    let val = this.inputValue;
    let { value } = this.props;
    if (val) {
      if (!value) {
        this.setState({
          value: val,
        })
      }

      // 处理更新，并显示正在加载图表
      this.setState({
        loading: true,
      })
      let ret = this.props.onChange(val.value || val);
      if (!ret || !ret.then) {
        this.setState({
          loading: false,
        });
      } else {
        ret.then(finished => {
          this.setState({
            loading: false,
          })
        })
      }
    }
    this.inputValue = null;
    return false;
  }

  handleConfirmCancel = () => {
    this.inputValue = undefined;
  }
  getValStateFromPropVal = ({
    value, defaultValue, popData
  }) => {
    let stateValue = null;
    let val = value || defaultValue;
    if (popData) {
      popData.forEach(item => {
        if (item.value === val) {
          stateValue = item;
        }
      })
    } else {
      stateValue = val;
    }

    return stateValue;
  }

  clickOnlyWhenIconClicked = (evt) => {
    if (evt.target !== this.refs.editIcon) {
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
  }



  renderContent = () => {
    let content = this.props.popData || this.props.value || 11;
    if (Array.isArray(content)) {
      return (
        <ListInput
          dataSource={content}
          onChange={(val) => { this.inputValue = val; }}
          defaultValue={this.state.value}
        />
      )
    } else {
      return (
        <div className="box-pop">
          <input
            //type="text"
            className={this.props.inputClass}
            onChange={(e) => {
              let val = e.target.value || '';
              val = val.trim();
              // 校验
              var errEle = document.getElementById('box-input-err');
              errEle.style.display = "none";
              if (!this.props.changeValidation(val)) {
                errEle.style.display = "block";
                this.inputValue = null;
                return;
              }

              if (val) {
                this.inputValue = val;
              }
            }}
            defaultValue={this.state.value}
          />
          <div id="box-input-err" style={{ display: 'none' }}>
            <span className="cl cl-notice-p"></span>
            <span>{this.props.errMsg}</span>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <Popconfirm
        trigger="click"
        rootClose
        placement={this.props.placement}
        onClose={this.handleConfirmClose}
        onCancel={this.handleConfirmCancel}
        content={this.renderContent()}
      >
        <div
          className="box"
          style={this.props.style}
        >
          <div
            className="text-ellipsis"
            onClick={this.clickOnlyWhenIconClicked}
          >
            <span title={this.state.value && this.state.value.name || this.state.value}>
              {this.state.value && this.state.value.name || this.state.value}
            </span>
            {
              (() => {
                if (this.state.loading) {
                  return <span className="cl cl-loading loading" />
                }
                return <span
                  ref="editIcon"
                  className="cl cl-edit-c-o iconClass"
                />
              })()
            }

          </div>

        </div>
      </Popconfirm>
    )
  }
}