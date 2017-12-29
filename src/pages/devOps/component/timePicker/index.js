import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import classnames from 'classnames';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import moment from 'moment';

//variable
const ButtonGroup = Button.Group;

// static
import './index.css';

const TIME = [5*60*1000, 10*60*1000,30*60*1000];

export default class TimePicker extends Component {
  static propTypes = {
    onTimeSelected: PropTypes.func,
    timeData: PropTypes.array,
  }
  static defaultProps = {
    onTimeSelected: () => { },
    timeData: ['5分钟', '10分钟', '30分钟'],//[],
  }

  state = {
    activeTimeIndex: 0,
    selectedTime: moment(),
    timepoint: (new Date()).toString()
  }


  handleTimeSelected = (index) => {
    if(index >= this.props.timeData.length){
      return (date,datestring)=>{
        this.setState({
          activeTimeIndex: index,
          timepoint: datestring,
        });
      }
    }
    

    let interval = TIME[index];
    return (e)=>{
       this.setState({
         activeTimeIndex: index,
       });
       let now = new Date();
       let time= {
         startDate: now.getTime() - interval,
         endDate: now.getTime(),
       }

       this.props.onTimeSelected(time);
    }
  }

  handleDisabledDate = (currentDate) => {
    if (!currentDate) {
      return;
    }
    const now = moment();
    now.milliseconds()
    if (currentDate.isAfter(now) ||
      currentDate.toDate().getTime() > now.toDate().getTime()) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div class="b"

      >
        {
          this.props.timeData.map((item, index) => {
            const cls = classnames({
              "b__btn": true,
              "b__btn--active": this.state.activeTimeIndex == index
            });
            return (
              <Button
                onClick={this.handleTimeSelected(index)}
                className={cls}
                key={index}
                data-index={index}
              >
                {item}
              </Button>
            )
          })
        }

        <div className="b__panel">
          <DatePicker
            defaultValue={moment()}
            onChange={this.handleTimeSelected(this.props.timeData.length)}
            onOk={()=>{
              this.props.onTimeSelected({
                startDate: null,
                endDate: (new Date(this.state.timepoint)).getTime()
              })
            }}
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={this.handleDisabledDate}
            showTime
          />
        </div>
      </div>
    )
  }
}