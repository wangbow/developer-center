// publics
import { Component } from 'react'
import { Button, Table, Pagination, Message} from 'tinper-bee'
import { dateFormat } from '../util'
import PopupModal from './popupModal.component'
import { searchMiddlware, renew} from '../../../serves/mdServerManager'
import { splitParam } from '../../../components/util'

const MILLISECS_IN_A_DAY = 1000 * 60 * 60 * 24;
const PROPS = {
  redis: {
    insName: 'aliasName',
    id: 'id',
    createTime: 'createTime',
  },
  mysql: {
    insName: 'insName',
    id: "pkMiddlewareMysql",
    createTime: 'ts',
  },
  mq: {
    insName: 'aliasName',
    id: "id",
    createTime: 'createTime',
  },
  zk: {
    insName: 'insName',
    id: "pkMiddlewareZk",
    createTime: 'ts',
  },
  jenkins: {
    insName: 'insName',
    id: "pkMiddlewareJenkins",
    createTime: 'ts',
  },
  dclb: {
    insName: 'insName',
    id: "pkMiddlewareNginx",
    createTime: 'ts',
  }
};

const STATE = {
  'Deploying': '部署中',
  'Running': '运行中',
  'Suspend': '停止了',
  'Restarting': '重启中',
  'Unkown': '未知中',
  'Checking': '检测中',
  'Destroyed':'销毁了'
};

export default class ListPage extends Component {
  static propTypes = {}
  static defaultProps = {}
  constructor(props){
    super(props);
    this.state = {
      clickIndex: null,
      dataSource: [],
      activePage: 1,
      totalPages: 0,
      showModal: false
    }

    let __modalPayLoad = [];

    this.handleSelect = this.handleSelect.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  // lifeCyle hooks
  componentDidMount() {

    /**
    *默认加载页签被选中的数据
    */
    this.loadData(0);
  }

  componentWillReceiveProps(nextProps){
    /**
    *首次点击页签时加载对应页签下的表格数据
    */
    this.loadData(0, nextProps);
    if(this.state.dataSource.length == 0){

    }
  }

  loadData(pageIndex, nextProps){
    let props = nextProps || this.props;
    let _this = this;
    if(_this.props.type != props.active){
      return false;
    }
    let {providerId, insStatus, insName, providerName} = props.search;
    let name = 'search_' + PROPS[_this.props.type].insName;
    let param = {
      pageSize: 10,
      pageIndex: pageIndex,
      search_providerId: providerId,
      search_insStatus: insStatus,
      search_providerName: providerName,
      [name]: insName,
    }

    searchMiddlware(param, _this.props.type)
      .then(data => {
        if(data.success){
          _this.setState({
            dataSource: data.detailMsg.data.content,
            activePage: pageIndex + 1,
            totalPages: data.detailMsg.data.totalPages
          })
        }
      })
  }
  handleSelect(eventKey) {
      this.loadData(eventKey - 1);
	}
  handleRownClick = (rec, index) => {/*1*/
    let id = PROPS[this.props.type].id;
    this.setState({ clickIndex: rec[id] })
  }

  /* Modal handling methods */
  manageRowOperation = rec => evt => {
    /* use simple factory now.
    * if complicated,change to use factory method
    */
    const type = evt.target.dataset.label;
    this.__opType = type;
    this.setModalPayLoad([rec]);
    this.setState({ showModal: true });
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }

  setModalPayLoad = (payLoad) => {
    this.__modalPayLoad = payLoad;
  }

  getModalPayLoad = () => {
    return this.__modalPayLoad || [];
  }
  renewalSelectedInstance = (date) => {
    let _this = this;
    let checkFlag = true;
    let msg = "";

    if(!_this.RQcheck(date)){
      msg = '续期时间格式不正确！';
      checkFlag = false;
    }
    if(!date || date.trim().length == 0){
      msg = '请填写续期时间';
      checkFlag = false;
    }
    if(_this.compareDate(_this.__modalPayLoad[0].deathtime, date)){
      msg = '续期时间不能小于剩余时间！';
      checkFlag = false;
    }

    if(!checkFlag){
      return Message.create({ content: msg, color: 'danger', duration: 1 });
    }

    let id = PROPS[_this.props.type].id;
    renew(splitParam({
      id: _this.__modalPayLoad[0][id],
      dueDate: date
    }), _this.props.type)
      .then((data) => {
        _this.setState({ showModal: false });
        _this.loadData(_this.state.activePage - 1);
      })
  }

  /**
  *两时间比较
  */

   compareDate(newDate, oldDate){
     let lNewDate = new Date(oldDate).getTime();
     if(newDate > lNewDate){
       return true;
     }
     return false;
   }
    /**
    *校验日期格式
    */
    RQcheck(RQ){
       var date = RQ;
       var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

       if (result == null)
           return false;
       var d = new Date(result[1], result[3] - 1, result[4]);
       return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);

   }

  handleExpand = (rec, index) => {
    let createTime = PROPS[this.props.type].createTime;
    let insName = PROPS[this.props.type].insName;

    return (
      <div style={{ textAlign: 'left' }}>
        <div >
          {
            rec['serviceDomain']?(
                <div> 
                  <span>管理地址：</span>
                  <span>{rec['serviceDomain']}</span>
                </div>
              ):(
                <div>
                  <span>连接地址：</span>
                  <span>{rec['insHost']}</span> 
                </div>)
              }
        
        </div>
        <div>
          <span>端口号：</span>
          <span>{rec['insPort']}</span>
        </div>
        <div>
          <span>实例名：</span>
          <span>{rec[insName]}</span>
        </div>
        <div>
          <span>创建时间：</span>
          <span>
            {
              dateFormat(new Date(rec[createTime]), 'yyyy年MM月dd日 hh:mm:ss')
            }
          </span>
        </div>
      </div>
    );
  }

  // renders
  renderTableColumns = () => {
    let insName = PROPS[this.props.type].insName;

    const columns = [{
      title: '服务名称',
      dataIndex: insName,
      key: 'name',
    },{
      title: '租户名称',
      dataIndex: 'providerName',
      key: 'providerName',
    },{
      title: '运行状态',
      dataIndex: 'insStatus',
      key: 'insStatus',
      render: (text, rec) => {
        return (
          <div className={text}>
            {STATE[text]}
          </div>
        )
      }
    }, {
      title: '规格(MB)',
      dataIndex: 'memory',
      key: 'memory',
    }, {
      title: '剩余时间',
      dataIndex: 'deathtime',
      key: 'deathTime',
      render: (text) => {
        const time = parseInt(text);
        const now = Date.now();
        const left = (time - now) / MILLISECS_IN_A_DAY;
        const day = parseInt(left);
        const hour = Math.floor((left - day) * 24);

        return `${day}天${hour}小时`;
      }
    }, {
      title: '操作',
      dataIndex: 'address',
      key: 'operate',
      render: (text, rec, index) => {
        return (
          <div>
            {
                (<Button
                  className="tableBtn"
                  data-label='RENEWAL'
                  onClick={this.manageRowOperation(rec)}
                >
                  续期
                </Button>)
            }
          </div>
        )
      }
    }];

    return columns;

  }
  render() {
    let id = PROPS[this.props.type].id;
    return (
      <div className="list">
        <Table
          expandIconAsCell
          expandRowByClick
          expandedRowKeys={[this.state.clickIndex]}
          onRowClick={this.handleRownClick}
          expandedRowRender={this.handleExpand}
          data={this.state.dataSource}
          rowKey={(rec, index) => {return rec[id] }}
          columns={this.renderTableColumns()}
        />
        <div className="u-pagination-warp">
         <Pagination
           first
           last
           prev
           next
           boundaryLinks
           items={this.state.totalPages}
           maxButtons={5}
           activePage={this.state.activePage}
           onSelect={this.handleSelect} />
       </div>
       <PopupModal
         show={this.state.showModal}
         hideModal={this.hideModal}
         serviceType={this.props.type}
         payLoad={this.getModalPayLoad()}
         optType="续期"
         operation={this.renewalSelectedInstance}
       />
      </div>
    )
  }
}
