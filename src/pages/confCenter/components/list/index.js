import {Component} from 'react';
import {Col, Table, Pagination, Message, Icon, Popconfirm} from 'tinper-bee';

import EditModal from '../edit-modal';
import PublicModal from '../public-modal';
import { success, err } from 'components/message-util';

import {
  deleteConfigFile,
  editConfigFile,
  publicConfig
}from '../../../../serves/confCenter';

import './index.less';

class List extends Component {
  static propTypes = {};
  static defaultProps = {};

  state = {
    activePage: 1,
    showModal: false,
    editData: {},
    edit: false,
    showPublicModal: false
  }
  columns = [{
    title: '序号',
    dataIndex: 'appId',
    key: 'appId',
    render: (text, record, index) => {
      return index + 1;
    }
  }, {
    title: '所属应用',
    dataIndex: 'appName',
    key: 'appName'
  }, {
    title: '名称',
    dataIndex: 'path',
    key: 'path',
    render: (text, rec) => {
      return !text || text === '' ? rec.name : text
    }
  }, {
    title: '是否开放',
    dataIndex: 'public_flag',
    key: 'public_flag',
    render: (text, rec) => {
      return <div className="public-btn" onClick={ this.openPublicModal(rec)}>{text ? "开放" : "不开放"}</div>
    }
  }, {
    title: '配置内容',
    dataIndex: 'value',
    key: 'value',
    render: (text, record, index) => {
      return <span className="public-btn" onClick={ this.showContent(record) }>获取内容</span>
    }
  }, {
    title: '实例列表',
    dataIndex: 'machineSize',
    key: 'machineSize',
    render: (text, record, index) => {
      return <span>{ text }台OK</span>
    }
  }, {
    title: '修改时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime'
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record, index) => {
      return (
        <div className="cursor-pointer">
          <Icon type="uf-pencil-s" onClick={ this.handleEdit(record, index) }/>

          <Icon type="uf-download" onClick={ this.handleDownLoad(record, index) }/>
          <Popconfirm content="确认删除?" placement="bottom" onClose={ this.handleDelete(record, index) }>
            <Icon type="uf-del"/>
          </Popconfirm>
        </div>
      )
    }
  }];

  /**
   * 表格下载
   */
  handleDownLoad = (record, index) => {
    return () => {
      window.location.href = `${window.location.origin}/confcenter/api/web/config/download/${record.configId}`;
    }
  }

  /**
   * 分页点选
   * @param key
   */
  handleSelect = (key) => {
    let {refresh} = this.props;
    this.setState({
      activePage: key
    });
    refresh(key);
  }

  /**
   * 内容展示模态框
   * @param record
   * @returns {function()}
   */
  showContent = (record) => {
    return () => {
      this.setState({
        showModal: true,
        editData: record,
        edit: false
      })
    }
  }

  /**
   * 表格编辑
   */
  handleEdit = (record, index) => {
    return () => {
      this.setState({
        showModal: true,
        editData: record,
        edit: true
      })
    }

  }

  /**
   * 关闭模态框
   */
  close = () => {
    this.setState({
      showModal: false
    })
  }

  /**
   * 编辑保存
   */
  handleEditSave = (data, id) => {
    let {refresh} = this.props;
    this.close();
    editConfigFile(data, id)
      .then((res) => {
        if (res.data.error_code) {
          Message.create({
            content: '未能修改成功。',
            color: 'danger',
            duration: null
          })
        } else {
          refresh();
          Message.create({
            content: '修改成功。',
            color: 'success',
            duration: 1.5
          })

        }
      })
  }

  /**
   * 表格删除
   */
  handleDelete = (record, index) => {
    let {refresh} = this.props;
    return () => {
      deleteConfigFile(record.configId)
        .then((res) => {
          if (res.data.error_code) {
            Message.create({
              content: res.data.error_message,
              color: 'danger',
              duration: null
            })
          } else {
            refresh();
            Message.create({
              content: '删除成功',
              color: 'success',
              duration: 1.5
            })
          }
        })
    }
  }

  /**
   * 打开公开模态
   * @param value
   */
  openPublicModal = (rec) => () => {
    this.setState({
      showPublicModal: true,
      editData: rec
    })
  }

  /**
   * 关闭公开模态框
   */
  closePublicModal = () => {
    this.setState({
      showPublicModal: false
    })
  }

  /**
   * 打开或关闭公开状态
   */
  handlePublic = () => {
    let { editData } = this.state;
    let {refresh} = this.props;

    publicConfig(`${editData.configId}?public_flag=${Number(!editData.public_flag)}`).then((res) => {
      if(res.data.error_code){
        err(res.data.error_message)
      }else{
        refresh();
        success("设置成功。");
      }
    })

    this.closePublicModal();
  }

  render() {
    let { activePage} = this.state;
    let {data, page} = this.props;


    return (
      <Col md={12} className="conf-list">
        <Table data={ data } columns={ this.columns }/>
        {
          page > 1 ? (
            <Pagination
              first
              last
              prev
              next
              boundaryLinks
              items={page}
              maxButtons={5}
              activePage={activePage}
              onSelect={this.handleSelect}/>
          ) : null
        }
        <EditModal
          show={ this.state.showModal }
          onEnsure={ this.handleEditSave }
          data={ this.state.editData }
          isEdit={ this.state.edit }
          onClose={ this.close }
        />
        <PublicModal
          show={ this.state.showPublicModal }
          onEnsure = { this.handlePublic }
          onClose = { this.closePublicModal }
          flag = { this.state.editData.public_flag }
        />
      </Col>
    )
  }
}

export default List;
