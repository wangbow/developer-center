// publics
import { Component, PropTypes } from 'react'
import { dateFormat } from '../util'
import { Modal, Table ,Button, Label, FormControl} from 'tinper-bee'

// self components
import withStyle from './withStyle.hoc'

// static
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
  'Suspend': '停止',
  'Restarting': '重启中',
  'Unkown': '未知',
  'Checking': '检测中',
};

class PopupModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    hideModal: PropTypes.func,
    serviceType: PropTypes.string.isRequired,
    operation: PropTypes.func,
    optType: PropTypes.string,
    payLoad:PropTypes.array,
  }

  submit = () => {
    let date = ReactDOM.findDOMNode(this.refs.dueDate).value;
    this.props.operation(date);
  }

  static defaultProps = {
    show: false,
    hideModal: () => { },
    serviceType: '',
    operation: () => { },
    optType: '',
    apyLoad: [],
  }

  // renders
  renderTalbeColumns = () => {
    const { serviceType } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: PROPS[serviceType]['insName'],
      key: PROPS[serviceType]['insName'],
    }, {
      title: '运行状态',
      dataIndex: 'insStatus',
      key: 'insStatus',
      render: (text) => {
        return STATE[text];
      },
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
        const hour = parseInt((left - day) * 24);

        return `${day}天${hour} 小时`;
      }
    }];

    return columns;
  }
  defaultDueDate = () => {
    let payLoad = this.props.payLoad[0];
    if(payLoad){
      let deathtime = payLoad.deathtime;
      let now = new Date(deathtime);
      let dueDate = now.setDate(now.getDate() + 15);
      return dateFormat(new Date(dueDate), 'yyyy-MM-dd');
    }
    return "";
  }
  render() {
    const { show, hideModal, payLoad, optType ,style} = this.props;

    return (
      <Modal
        show={show}
        onHide={hideModal}
        optType={optType}
        payLoad={payLoad}
      >
        <Modal.Header>
          <span style={{letterSpacing: 2}}>
            确定对存储实例做
            <span style={{ color: 'red', padding: '5px 5px' }}>{optType}</span>
            操作吗？
          </span>
          <span className="cl cl-bigclose-o"
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={hideModal}
          />
        </Modal.Header>

        <Modal.Body>
          <div>
            <div>
            <div className="dueDate">
              <Label >续期时间</Label>
              <FormControl  ref="dueDate" defaultValue={this.defaultDueDate()}/>
            </div>
              { /*额外复杂的提示*/}
            </div>
            <Table
              style={{ textAlign: "center" }}
              data={payLoad}
              columns={this.renderTalbeColumns()}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.submit} style={style.btn}>确定</Button>
          <Button onClick={hideModal}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}


export default withStyle(() => ({
  btn:{
    marginRight: 10,
  }
}))(PopupModal)
