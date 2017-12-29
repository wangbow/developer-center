// publics
import { Component } from 'react'
import { Button, Table, Pagination, Message} from 'tinper-bee'
import { dateFormat } from '../util'
import PopupModal from './popupModal.component'
import { searchResourcePool, renew} from '../../../serves/poolRenewal'

const MILLISECS_IN_A_DAY =  60 * 60 * 24;

export default class ListPage extends Component {
  static propTypes = {}
  static defaultProps = {}
  constructor(props){
    super(props);
    this.state = {
      clickIndex: null,
      dataSource: [],
      showModal: false
    }

    let __modalPayLoad = [];
    this.loadData = this.loadData.bind(this);
  }

  // lifeCyle hooks
  componentDidMount() {

    /**
    *默认加载页签被选中的数据
    */
    this.loadData();
  }

  loadData(){
    let _this = this;
    searchResourcePool((data) => {
      if(data.data){
          _this.setState({
              dataSource: data.data
          })
      }
    });
  }

  handleRownClick = (rec, index) => {/*1*/
    this.setState({ clickIndex: rec['ResPool_id'] })
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

    renew({
      expiretime: date,
      providerid: _this.__modalPayLoad[0].ProviderId
    }, (data) => {
        _this.setState({ showModal: false });
        this.loadData();
        Message.create({ content: '续期成功！', color: 'success', duration: null });
    });
  }


  handleExpand = (rec, index) => {
    return (
      <div style={{ textAlign: 'left' }}>
        <div >
          <span>总cup数(核)：</span>
          <span>{rec['total_cpu']}</span>
        </div>
        <div >
          <span>剩余cup数(核)：</span>
          <span>{rec['left_cpu']}</span>
        </div>
        <div>
          <span>总内存(G)：</span>
          <span>{(rec['total_memory'] / 1024).toFixed(2)}</span>
        </div>
        <div>
          <span>剩余内存(G)：</span>
          <span>{(rec['left_memory'] / 1024).toFixed(2)}</span>
        </div>
        <div>
          <span>总存储(G)：</span>
          <span>{(rec['total_storage'] / 1024).toFixed(2)}</span>
        </div>
        <div>
          <span>剩余存储(G)：</span>
          <span>{(rec['left_storage'] / 1024).toFixed(2)}</span>
        </div>
        <div>
          <span>创建时间：</span>
          <span>
            {
              dateFormat(new Date(rec['resourcepool_createtime']), 'yyyy年MM月dd日 hh:mm:ss')
            }
          </span>
        </div>
      </div>
    );
  }

  // renders
  renderTableColumns = () => {
    const columns = [{
      title: '资源池名称',
      dataIndex: 'ResPool_name',
      key: 'ResPool_name',
    }, {
      title: '主机IP',
      dataIndex: 'host',
      key: 'host'
    }, {
      title: '租户id',
      dataIndex: 'ProviderId',
      key: 'ProviderId',
    }, {
      title: '剩余租期',
      dataIndex: 'time_left',
      key: 'time_left',
      render: (text) => {
        const time = parseInt(text);
        const left = time / MILLISECS_IN_A_DAY;
        const day = parseInt(left);
        const hour = parseInt((left - day) * 24);
        const minute = parseInt(((left - day) * 24 - hour) *60);

        if(day == 0){
          if(hour == 0){
            return `${minute}分`;
          }
          else{
            return `${hour}小时${minute}分`;
          }
        }
        else{
          return `${day}天${hour}小时`;
        }
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
    return (
      <div className="list">
        <Table
          expandIconAsCell
          expandRowByClick
          expandedRowKeys={[this.state.clickIndex]}
          onRowClick={this.handleRownClick}
          expandedRowRender={this.handleExpand}
          data={this.state.dataSource}
          rowKey={(rec, index) => {return rec['ResPool_id'] }}
          columns={this.renderTableColumns()}
        />
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
