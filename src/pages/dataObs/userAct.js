import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'tinper-bee';
import ReactEcharts from 'echarts-for-react';
import macarons from './macarons'
import ChartBlock from './component/chartBlock';
import Info from './info';
// const
import userClickKeyWordColumns from './const/userClickKeyWordColumns';
import CloudTag from './component/cloudTag';
// api
import { userAct as userActApi } from './api';
import { parsers } from './userAct/parse';
import behaviorListOptionMaker from './userAct/optionMaker/behaviorList';
import fromListOptionMaker from './userAct/optionMaker/fromList';

const PAGE_SIZE = 7;

export default class UserAct extends PureComponent {
  static propTypes = {
    timeId: PropTypes.string,
    appId: PropTypes.string,
  }

  static defaultProps = {
    timeId: '',
    appId: ''
  }

  state = {
    showLoading: true,
    tagList: null,
    fromList: null,
    keyWordList: null,
    histogramData: null,
    totalPagi: 1,
    acitvePage: 1,
    startPoint: 0,
    empty: true,
  }

  componentDidMount() {
    this.getGraphData(this.props)
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.appId !== nextprops.appId ||
      this.props.timeId !== nextprops.timeId)
      this.getGraphData(nextprops)
  }

  getGraphData = ({ appId, timeId }) => {
    if (!appId || !timeId) {
      return;
    }
    this.setState({
      showLoading:true,
    })
    return userActApi({
      appId: appId,
      timeId: timeId,
    }).then(data => {
      if (!data.histogramData) {
        data.histogramData = {};
      }
      let empty = this.handleShouldInjectCode(data);
      this.setState({
        ...data,
        tagList: parsers.tagList(data.tagList),
        showLoading: false,
        empty,
      });
      return data;
    }).then(data => {
      // 计算分页信息
      let { keyWordList = [] } = data;
      keyWordList = keyWordList || [];
      let total = keyWordList.length;
      let totalPagi = total % PAGE_SIZE === 0
        ? total / PAGE_SIZE : ~~(total / PAGE_SIZE) + 1;
      this.setState({
        totalPagi,
      })
    })
  }
  handleSelect = (key) => {
    this.setState({
      acitvePage: key,
      startPoint: (key - 1) * PAGE_SIZE,
    });
  }
  handleShouldInjectCode = (data) => {
    let dataKey = [
      'tagList',
      'fromList',
      'keyWordList',
      'histogramData'
    ];

    let empty = dataKey.every(key=>{
      if (key === 'histogramData'){
        return data[key] == null || !data[key].graphDataList
          || data[key].graphDataList.length === 0;
      }
      return data[key] === null || data[key].length ==0
    });

    return empty;
  }

  render() {
    return  (()=>{

        if (this.state.showLoading) {
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
                title="用户点击行为标签云"
              >
                {
                  this.state.tagList
                  && this.state.tagList.length !== 0
                  &&
                  (< CloudTag
                    dataSource={this.state.tagList}
                  />)
                }

              </ChartBlock>
              <ChartBlock
                className="graph-area--blk"
                title="用户点击行为TOP50"
              >
                {
                  this.state.keyWordList
                  && this.state.keyWordList.length !== 0
                  && (
                    <div>
                      <Table
                        columns={userClickKeyWordColumns}
                        data={
                          parsers
                            .keyWordList(
                            this
                              .state
                              .keyWordList
                              .slice(this.state.startPoint, this.state.startPoint + 7)
                            )
                        }
                      ></Table>
                      {
                        this.state.totalPagi > 1 && (<Pagination
                          items={this.state.totalPagi}
                          activePage={this.state.acitvePage}
                          onSelect={this.handleSelect}
                        />)
                      }

                    </div>
                  )
                }
              </ChartBlock>
            </div>
            <div className="graph-area--grp">
              <ChartBlock
                className="graph-area--blk"
                title="用户点击行为趋势"
              >
                {
                  this.state.histogramData
                  && this.state.histogramData.graphDataList
                  && this.state.histogramData.graphDataList.length !== 0
                  && (<ReactEcharts
                    showLoading={this.state.loading}
                    className="graph-area-canvas"
                    theme={"macarons"}
                    option={behaviorListOptionMaker(
                      parsers.histogramData(this.state.histogramData)
                    )}
                  >
                  </ReactEcharts>)
                }
              </ChartBlock>
              <ChartBlock
                className="graph-area--blk"
                title="用户终端来源占比"
              >
                {
                  this.state.fromList
                  && this.state.fromList.length !== 0
                  && (<ReactEcharts
                    showLoading={this.state.loading}
                    className="graph-area-canvas"
                    theme={"macarons"}
                    option={fromListOptionMaker(
                      parsers.fromList(this.state.fromList)
                    )}
                  >
                  </ReactEcharts>)
                }
              </ChartBlock>
            </div>
          </div >
          )
      })()

  }
}