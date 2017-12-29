import { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'tinper-bee';
import ChartBlock from './component/chartBlock';

// const
import userClickKeyWordColumns from './const/userClickKeyWordColumns';
import macarons from './macarons';
import optionMaker from './browser/optionMaker';
import Info from './info';
// temp
import ReactEcharts from 'echarts-for-react';
import { browser as browserApi } from './api';


export default class Browser extends Component {
  static propTypes = {
    timeId: PropTypes.string,
    appId: PropTypes.string,
  }

  static defaultProps = {
    timeId: '',
    appId: ''
  }

  state = {
    loading: true,
    empty: true,
    error_jsList: null,
    t_all: null,
    t_request: null,
    t_domready: null,
    t_white: null,
    t_dns: null,
    t_tcp: null,
    t_jserror: null,
  }

  componentDidMount() {
    this.getGraphData(this.props);
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.appId !== nextprops.appId ||
      this.props.timeId !== nextprops.timeId)
      this.getGraphData(nextprops)
  }

  handleShouldInjectCode=(data)=>{
    let keys = ['error_jsList','t_all','t_request','t_domready','t_white','t_dns','t_tcp','t_jserror']
    return keys.every(key=>{
      return data[key] == null || !data[key].graphDataList ||
      data[key].graphDataList.length === 0;
    })
  }

  getGraphData = ({ appId, timeId }) => {
    if (!appId || !timeId) {
      return;
    }
    this.setState({ loading: true })
    return browserApi({
      appId: appId,
      timeId: timeId,
    }).then(data => {
      let empty = this.handleShouldInjectCode(data);
      this.setState({
        ...data,
        empty,
        loading: false,
      });
      return data;
    })
  }

  render() {

    return(()=>{

      if (this.state.loading) {
        return (<div style={{ height: 200, textAlign: 'center', padding: 40 }}>
          <span className="cl cl-loading loading" style={{ fontSize: 35 }} />
        </div>)
      }

      return this.state.empty
        ? (<Info
          appId={this.props.appId}
        />)
        : (<div className="graph-area">
          <div className="graph-area--grp">
            <ChartBlock
              className="graph-area--blk"
              title="页面完全加载时间(ms)"
            >
              {
                this.state.t_all
                && this.state.t_all.graphDataList
                && this.state.t_all.graphDataList.length
                && (<ReactEcharts
                  showLoading={this.state.loading}
                  theme={'macarons'}
                  option={
                    optionMaker({
                      title: '页面完全加载时间(ms)',
                    }, this.state.t_all)
                  }
                />)
              }
            </ChartBlock>
            <ChartBlock
              className="graph-area--blk"
              title="页面白屏时间(ms)"
            >
              {
                this.state.t_white
                && this.state.t_white.graphDataList
                && this.state.t_white.graphDataList.length
                && (<ReactEcharts
                  showLoading={this.state.loading}
                  theme={'macarons'}
                  option={
                    optionMaker({
                      title: '页面白屏时间(ms)',
                    }, this.state.t_white)
                  }
                />)
              }

            </ChartBlock>
          </div>
          <div className="graph-area--grp">
            <ChartBlock
              className="graph-area--blk"
              title='DNS解析时间(ms)'
            >
              {
                this.state.t_dns
                && this.state.t_dns.graphDataList
                && this.state.t_dns.graphDataList.length
                && (<ReactEcharts
                  showLoading={this.state.loading}
                  theme={'macarons'}
                  option={
                    optionMaker({
                      title: 'DNS解析时间',
                    }, this.state.t_dns)
                  }
                />)
              }
            </ChartBlock>
            <ChartBlock
              className="graph-area--blk"
              title='服务器连接时间(ms)'
            >
              {
                this.state.t_tcp
                && this.state.t_tcp.graphDataList
                && this.state.t_tcp.graphDataList.length
                && (<ReactEcharts
                  showLoading={this.state.loading}
                  theme={'macarons'}
                  option={
                    optionMaker({
                      title: '服务器连接时间',
                    }, this.state.t_tcp)
                  }
                />)
              }
            </ChartBlock>
          </div>
          <div className="graph-area--grp">
            <ChartBlock
              className="graph-area--blk"
              title='服务器响应时间(ms)'
            >
              {this.state.t_request
                && this.state.t_all.graphDataList
                && this.state.t_request.graphDataList.length
                && (<ReactEcharts
                  showLoading={this.state.loading}
                  theme={'macarons'}
                  option={
                    optionMaker({
                      title: '服务器响应时间',
                    }, this.state.t_request)
                  }
                />)}
            </ChartBlock>
            <ChartBlock
              className="graph-area--blk"
              title='DOM Ready 时间(ms)'
            >
              {
                this.state.t_domready
                && this.state.t_domready.graphDataList
                && this.state.t_domready.graphDataList.length
                && (<ReactEcharts
                  showLoading={this.state.loading}
                  theme={'macarons'}
                  option={
                    optionMaker({
                      title: 'DOM Ready 时间',
                    }, this.state.t_domready)
                  }
                />)
              }
            </ChartBlock>
          </div>
          <div className="graph-area--grp">
            <ChartBlock
              className="graph-area--blk"
              title='JS脚本错误数量'
            >
              {
                this.state.jserror
                && this.state.jserror.graphDataList
                && this.state.jserror.graphDataList.length
                && (<ReactEcharts
                  showLoading={this.state.loading}
                  theme={'macarons'}
                  option={
                    optionMaker({
                      title: 'JS脚本错误',
                      unit: '次',
                      formatterName: '脚本错误'
                    }, this.state.jserror)
                  }
                />)
              }
            </ChartBlock>
            <ChartBlock
              className="graph-area--blk"
              title='JS脚本错误列表'
            >
              {
                this.state.error_jsList
                && this.state.error_jsList.length !== 0
                && (
                  <Table
                    columns={[{
                      title: '出错地址',
                      width: '50%',
                      dataIndex: 'js_url',
                      key: 'addresss',
                      render: function (rec) {
                        return <span title={rec}>{rec.slice(0, 40)}</span>
                      }
                    }, {
                      title: '出错信息',
                      width: '50%',
                      dataIndex: 'message',
                      render: (rec) => {
                        return <span title={rec}>{rec.slice(0, 30)}</span>
                      }
                    }]}
                    data={this.state.error_jsList.slice(0, 10)}
                  ></Table>)}
            </ChartBlock>
          </div>
        </div >
        )
    })()

  }
}