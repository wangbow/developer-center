import { Component } from 'react';
import PropTypes from 'prop-types';
import { Table ,Button} from 'tinper-bee';
import ChartBlock from './component/chartBlock';

// const
import macarons from './macarons';
import optionMaker from './service/optionMaker';

// temp
import ReactEcharts from 'echarts-for-react';

import './service.less';
import emptyImg from '../../assets/img/taskEmpty.png';

export default class Service extends Component {
  static propTypes = {
    timeId: PropTypes.string,
    appId: PropTypes.string,
    appIdInNum: PropTypes.string,
  }

  static defaultProps = {
    timeId: '',
    appId: '',
    appIdInNum:'',
  }

  state = {
    loading: true,
    list: [],
  }

  componentDidMount() {
    this.getGraphData(this.props);
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
      loading: true,
    })
    return axios.post(`/iuapInsight/custom/select?app_id=${appId}&time_code=${timeId}`)
      .then(res => res.data.dataList)
      .then(res => {
        this.setState({
          list: optionMaker(res),
          loading: false,
        })

        return res;
      })
  }

  handleAddRule=()=>{
    location.href =`/fe/appManager/index.html#/publish_detail/${this.props.appIdInNum}?runState=-1&envType=`
  }


  render() {
    return (
      <div>
        {
          (() => {
            if (this.state.loading) {
              return (<div style={{ height: 200, textAlign: 'center', padding: 40 }}>
                <span className="cl cl-loading loading" style={{ fontSize: 35 }} />
              </div>)
            }
            if (this.state.list.length === 0) {
              return (
                <div className="rule-empty">
                  <img src={emptyImg} width={200} height={200} />
                  <span className="rule-empty--banner">
                    您目前还没有添加监控规则，请点击下方按钮进行添加吧～
                  </span>
                  <Button
                    className="rule-empty--redirect"
                    onClick={this.handleAddRule}
                  >添加监控规则</Button>
                </div>
              )
            }
          })()
        }
        {this.state.list.length !== 0
          && this.state.loading !== true
          && (<div className="graph-area">
            {
              this.state.list.map(item => {
                return (
                  <ChartBlock
                    className="graph-area--blk"
                    title={item.origin.description}
                  >
                    {
                      item.origin.graphDataList
                      && item.origin.graphDataList.length !== 0
                      && (<ReactEcharts
                        className="graph-area-canvas"
                        theme={"macarons"}
                        option={item.option}
                      >
                      </ReactEcharts>)
                    }
                  </ChartBlock>
                )
              })
            }
          </div >)}
      </div>
    )
  }
}