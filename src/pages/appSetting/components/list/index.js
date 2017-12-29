import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {
  Row,
  Col,
  Button,
  Table,
  InputGroup,
  FormGroup,
  FormControl,
  Icon,
  Popconfirm
} from 'tinper-bee';

import {deleteApp, deleteAll}from 'serves/confCenter';
import verifyAuth from 'components/authPage/check';
import SimpleModal from 'components/simple-modal';

import {success, err} from 'components/message-util';

class List extends Component {

  static contextTypes = {
    router: PropTypes.object
  };
  static propTypes = {
    data: PropTypes.array,
    refresh: PropTypes.func
  };
  static defaultProps = {
    data: [],
    refresh: () => {
    },
  };

  state = {
    deleteId: '',
    showDeleteModal: false,
  }

  columns = [{
    title: '应用名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '说明',
    dataIndex: 'desc',
    key: 'desc',
    render: (text) => {
      return <p style={{ width: 400, wordWrap: "break-word" }}>{text}</p>
    }
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '邮箱',
    dataIndex: 'emails',
    key: 'emails'
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record, index) => {

      return (
        <div className="cursor-pointer">
          <i
            className="cl cl-Administrators"
            style={{cursor: 'pointer', color: '#666'}}
            title="权限管理"
            onClick={ this.showAuth(record) }/>
          <Popconfirm content="确认删除?" placement="bottom" onClose={ this.handleDelete(record, index) }>
            <Icon title="删除" type="uf-del"/>
          </Popconfirm>
        </div>
      )
    },
  }];


  /**
   * 校验权限
   */
  showAuth = (record) => {

    return () => {
      verifyAuth('conf', record,
        () => {
          this.context.router.push(`/auth/${record.name}?id=${record.id}&userId=${record.userId}&providerId=${record.providerId}&backUrl=appSetting&busiCode=confCenter`)
        }
      )
    }
  }

  /**
   * 表格删除
   */
  handleDelete = (record, index) => {
    return () => {
      let {refresh} = this.props;
      verifyAuth('conf', record,
        () => {
          deleteApp(record.id).then((res) => {

            console.log(res.data.error_code);
            if (res.data.error_code) {
              if(res.data.error_code == 20003){
                this.controlModal(true)();
                return this.setState({
                  deleteId: record.id
                })
              }
              err(res.data.error_message);
            } else {
              success('删除成功。');
              refresh();
            }
          }).catch((e) => {
            //err(e.response.data.error_message);
          })
        }
      )

    }
  }

  /**
   * 模态框控制
   * @param state
   */
  controlModal = (state) => () => {
    this.setState({
      showDeleteModal: state
    })
  }

  /**
   *
   */
  deleteAllFile = () => {
    let { deleteId } = this.state;
    let {refresh} = this.props;
    this.controlModal(false)();
    deleteAll(deleteId).then((res) => {
      let data = res.data;
      if(data.error_code){
        return err(`${data.error_code}: ${data.error_message}`)
      }
      success('删除成功');
      refresh && refresh();
    })
  }

  render() {
    let {data, showLoading} = this.props;
    return (
      <Col md={12} className="data-tabel">
        <Table data={ data } columns={ this.columns }/>
        <SimpleModal
          onClose={ this.controlModal(false) }
          onEnsure={ this.deleteAllFile }
          show={ this.state.showDeleteModal}
          title="删除确认">
          该应用存在配置文件或配置项，是否删除应用及配置数据？
        </SimpleModal>
      </Col>
    )
  }
}


export default List;
