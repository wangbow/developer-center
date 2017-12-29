import { Component } from 'react';
import PropTypes from 'prop-types';
import noDataImg from '../../../../assets/img/no-data.png';
import './index.css';

export default class ChartBlock extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
  }
  static defaultProps = {
    title: '',
    style: {},
    className: '',
  }

  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        <div style={{ height: '100%', background: 'white', padding: '15px' }}>
          <div
            style={{ height: 30, fontWeight: 'bold', textAlign: 'center' }}
          >
            {this.props.title}
          </div>
          {
            (() => {
              if (!this.props.children) {
                return (
                  <div style={{ height: 'calc(100% - 30px)', background: '#f6f6f6' }}>
                    <img className="chartBlock-mid" src={noDataImg} height="110px" />
                  </div>
                )
              }

              return this.props.children;
            })()
          }
        </div>
      </div >
    )
  }
}