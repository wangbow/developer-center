import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'tinper-bee';
import classnames from 'classnames'

// static
import './index.less';

// const
import TIME_INFO from '../timeInfo';

export default class TimePicker extends PureComponent {
  static propTypes = {
    onChangeTime: PropTypes.func,
    splitIndex: PropTypes.number,
    timeData: PropTypes.array,
  }
  static defaultProps = {
    onChangeTime: () => { },
    splitIndex: 4,
    timeData: TIME_INFO,
  }

  constructor(props, context) {
    super(props, context);
    let index = findTimeIndex(props.timeData, props.defaultValue)
    this.state = {
      activeTimeIndex: index || 0,
      activeTimeName: index > props.splitIndex ? props.timeData[index].name : '其他时间段',
      showPanel: false,
    }
  }



  onShowPanel = () => {
    this.setState({
      showPanel: true,
    })
  }

  onHidePanel = () => {
    this.setState({
      showPanel: false,
    })
  }

  handleChangeTime = (e) => {
    const index = e.target.dataset.index;
    const id = e.target.dataset.id;
    this.setState({
      activeTimeIndex: index,
      showPanel: false,
    });

    const splitIndex = this.props.splitIndex;

    if (index > splitIndex) {
      this.setState({
        activeTimeName: this.props.timeData[index].name,
      })
    } else {
      this.setState({
        activeTimeName: '其他时间段',
      })
    }

    this.props.onChangeTime(id, e);
  }

  render() {
    const si = this.props.splitIndex;
    const timeDataFt = this.props.timeData.slice(0, si + 1);
    const timeDataEd = this.props.timeData.slice(si + 1);

    return (
      <div className="times-show-info">
        {
          timeDataFt.map((item, index) => {
            const cls = classnames({
              "b__btn": true,
              "b__btn--active": this.state.activeTimeIndex == index
            });
            return (
              <Button
                onClick={this.handleChangeTime}
                className={cls}
                key={index}
                data-id={item.id}
                data-index={index}
              >
                {item.name}
              </Button>
            )
          })
        }

        <div className="b__panel">
          <div>
            <Button
              onClick={this.onShowPanel}
              className={classnames({
                "b__btn b__btn--big b__btn--float": true,
                "b__btn--active": this.state.activeTimeIndex > this.props.splitIndex
              })}
            >
              {this.state.activeTimeName}
            </Button>
            <Button
              onClick={this.onShowPanel}
              className="b__icon b__btn"
            >
              <i className="uf uf-triangle-down"> </i>
            </Button>
          </div>
          {
            this.state.showPanel && (
              <ul className="b__list">
                {
                  timeDataEd.map((item, index) => {
                    const ind = index + si + 1;
                    const cls = classnames({
                      "b__item": true,
                      "b__item--active": this.state.activeTimeIndex == ind
                    });

                    return (
                      <li
                        className={cls}
                        key={ind}
                      >
                        <div
                          className="b__data"
                          data-index={ind}
                          data-id={item.id}
                          onClick={this.handleChangeTime}
                        >
                          {item.name}
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            )
          }
        </div>
      </div>
    )
  }
}

function findTimeIndex(data, id) {

  if (!id || !data || data.length == 0) {
    return 0;
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      return i;
    }
  }
}