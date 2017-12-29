// publics
import { Component, PropTypes } from 'react'
import { dateFormat } from '../util'
import { Modal, Table ,Button, Label, Select, Option} from 'tinper-bee'

// self components
import withStyle from './withStyle.hoc'

const expiretimes = new Map([
  ['1296000', '15天'],
  ['2592000', '1个月'],
  ['7776000', '3个月'],
  ['15552000', '6个月'],
  ['31104000', '12个月']
])
const MILLISECS_IN_A_DAY =  60 * 60 * 24;

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
    this.props.operation(this.state.expiretime);
  }

  static defaultProps = {
    show: false,
    hideModal: () => { },
    serviceType: '',
    operation: () => { },
    optType: '',
    apyLoad: [],
  }

  constructor(props){
    super(props);
    this.state = {
      expiretime: '1296000'
    }
  }

  expiretimeHandleChange = (value) => {
  		this.setState({
        expiretime: value
      });
	}

  // renders
  renderTalbeColumns = () => {
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
    }];

    return columns;
  }

  render() {
    const { show, hideModal, payLoad, optType ,style} = this.props;
    let selectOption = [];
    for(let [key, value] of  expiretimes.entries()){
      selectOption.push(<Option value={key}>{value}</Option>);
    }

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
              <Select  defaultValue="1296000" onChange={this.expiretimeHandleChange}>
    			       {selectOption}
    			    </Select>
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
