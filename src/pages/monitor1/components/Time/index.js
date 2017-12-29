import {
  Component
} from 'react';

import './index.less';

class Time extends Component {

  formateDate() {
    let timeStr, date, dateStr, month;
    date = new Date();
    timeStr = date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    month = date.getMonth() + 1;

    dateStr = date.getFullYear() + "-" + month + "-" + date.getDate();
    this.setState({
      dateStr: dateStr,
      timeStr: timeStr
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
    this.formateDate = this.formateDate.bind(this);
  }
  componentWillMount() {

    this.timeId = setInterval(() => this.formateDate(),
      1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  render() {
    return (
      <div className="monitor-time">
        <div className="time-content">
          <div className="date">
            {this.state.dateStr}
          </div>
          <div className="time">
            {this.state.timeStr}
          </div>
        </div>
      </div>
    )
  }
}

export default Time;