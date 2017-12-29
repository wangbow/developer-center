import React, { Component } from 'react'
import {
  Modal,
  Button,
  Table,
  Message,
  FormControl,
  Label,
  Col,
  Pagination,
  InputGroup,
  Icon,
  Popconfirm
} from 'tinper-bee';
import { findDOMNode } from 'react-dom';
import { assignAuth, searchUsers } from 'serves/confLimit';
import { searchAppByName } from 'serves/appTile';
import classnames from 'classnames';

import { err, warn, success } from 'components/message-util';
import LoadingTable from 'components/loading-table';

import './index.less';


class MiroAuthModal extends Component {
  constructor(...args) {
    super(...args);

    this.searchColumns = [
      {
        title: '选择',
        dataIndex: 'app_id',
        key: 'app_id',
        render: (text, record, index) => {
          let checked = this.state.authorizedUsers.some(item => {
            return item.app_id === text;
          })
          return <input
            type="checkbox"
            checked={checked}
            onChange={this.onSearchItemChange(record)}
            onClick={(e) => e.stopPropagation()}
          />
        }
      }, {
        title: '应用名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '应用编码',
        dataIndex: 'app_code',
        key: 'app_code',
        className: 'text-left'
      }];
    this.state = {
      searchInfo: '',
      searchResult: [],
      role: 'user',
      authorizedUsers: [],
      searchPage: 1,
      activePage: 1,
      activeKey: '1',
      showLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    let { data, show } = nextProps;

  }


  /**
   * 添加事件
   */
  handleAdd = () => {
    let { data, onEnsure, envType } = this.props;
    let idAry = [], nameAry = [], extUproviderId = [];
    let { authorizedUsers } = this.state;
    if (authorizedUsers.length === 0)
      return warn('请选择应用。');

    authorizedUsers.forEach((item) => {
      idAry.push(item.app_code);
      nameAry.push(item.name);
      extUproviderId.push(item.provider_id);

    })
    let param = {
      userId: idAry.join(','),
      userName: nameAry.join(','),
      providerId: data.providerId,
      extUproviderid: extUproviderId.join(','),
      daRole: 'user',
      resId: data.id,
      busiCode: data.busiCode,
      isGroup: "N",
      createUserId: '',
      envType: envType
    };


    //邀请用户
    assignAuth(param).then((res) => {
      if (!res.data.error_code) {
        success('授权成功。');

        onEnsure && onEnsure();
        this.handleClose();
      } else {
        err(res.data.error_message);

        this.handleClose();
      }
    })
  }

  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  /**
   * 表格checkbox点选
   * @param record
   * @returns {function(*)}
   */
  onSearchItemChange = (record) => {
    return (e) => {
      e.stopPropagation();

      let { authorizedUsers } = this.state;
      if (e.target.checked) {
        authorizedUsers.push(record);
      } else {
        authorizedUsers = authorizedUsers.filter(item => item.app_id !== record.app_id)
      }
      this.setState({
        authorizedUsers
      })
    }
  }


  /**
   * 搜索按钮触发
   */
  handleSearch = () => {
    let { envType } = this.props;
    let value = findDOMNode(this.refs.search).value;
    let chineseAry = value.match(/[\u4e00-\u9fa5]/g);
    let byteLen = 0;
    if (chineseAry instanceof Array) {
      byteLen = chineseAry.length * 2 + value.length - chineseAry.length;
    } else {
      byteLen = value.length;
    }

    /*if (byteLen < 4) {
      return this.setState({
        searchResult: [],
        searchPage: 0
      });
    }*/
    this.setState({
      showLoading: true
    })
    searchAppByName(value, envType)
      .then((res) => {
        let data = res.data;
        this.setState({
          showLoading: false
        })
        if (data.error_code)
          return err(data.error_message)

        data.forEach((item) => {
          item.key = item.app_id;
        });
        this.setState({
          searchResult: data
        })

      })
      .catch(() => {
        this.setState({
          showLoading: false
        })
      })

  }

  /**
   * 分页点选
   * @param eventKey
   */
  handleSelect = (eventKey) => {
    this.setState({
      activePage: eventKey
    });

    let param = {
      key: 'invitation',
      val: findDOMNode(this.refs.search).value,
      pageIndex: eventKey,
      pageSize: 5
    };

  }


  /**
   * 模态框关闭事件
   */
  handleClose = () => {
    let { onClose } = this.props;
    this.setState({
      searchResult: [],
      role: 'user',
      searchPage: 1,
      authorizedUsers: [],
      activePage: 1,
      activeKey: '1'
    });
    onClose && onClose();
  }

  /**
   * 表格行点击
   * @param record
   */
  handleRowClick = (record) => {
    let { authorizedUsers } = this.state;
    let findRow = authorizedUsers.some(item => item.userId === record.userId)
    if (!findRow) {
      authorizedUsers.push(record);
    } else {
      authorizedUsers = authorizedUsers.filter(item => item.userId !== record.userId)
    }
    this.setState({
      authorizedUsers
    })
  }
  /**
   * 对name属性进行[]截取
   */
  spliceArray = (obj) => {
    let { envType } = this.props;
    let env = "";
    switch (envType) {
      case 'dev':
        env = "[开发]";
        break;
      case 'test':
        env = "[测试]";
        break;
      case 'AB':
        env = "[开发]";
        break;
      case 'pro':
        env = "[生产]";
        break;
    }


    if (obj.name.indexOf("]")) {
      let count = obj.name.indexOf("]");
      obj.name = obj.name.substring(count + 1);
      obj.name = env + obj.name;
    }
    return obj;

  }

  getName = (obj) => {
    let { envType } = this.props;
    let env = "";
    switch (envType) {
      case 'dev':
        env = "[开发]";
        break;
      case 'test':
        env = "[测试]";
        break;
      case 'AB':
        env = "[开发]";
        break;
      case 'pro':
        env = "[生产]";
        break;
    }
    if (obj.name.indexOf(env) != -1){
       return true;
    }
  }
 

/**
 * 数组去重的同时，满足环境匹配
 */
  setArray = (dataResult) => {
    var res = [];
    var json = {};
    for (var i = 0; i < dataResult.length; i++) {
      if (!json[dataResult[i].app_code] &&this.getName(dataResult[i])) {
        res.push(dataResult[i]);
        json[dataResult[i].app_code] = 1;
      }
    }
    return res;
  }

  render() {

    let { show } = this.props;
    let { searchResult } = this.state;
    let arr = this.setArray(searchResult) || [];

    return (
      <Modal
        show={show}
        size="lg"
        className="auth-modal"
        onHide={this.handleClose}>
        <Modal.Header>
          <Modal.Title>添加新应用</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-search">
            <div className="modal-search-user">
              <InputGroup className="search" simple>
                <FormControl
                  ref="search"
                  placeholder="请输入应用名称,支持模糊匹配"
                  onKeyDown={this.handleSearchKeyDown}
                />
                <InputGroup.Button>
                  <i className="cl cl-search" onClick={this.handleSearch} />
                </InputGroup.Button>
              </InputGroup>
            </div>

          </div>
          <div>
            <LoadingTable showLoading={this.state.showLoading} data={arr}
              onRowClick={this.handleRowClick} columns={this.searchColumns} />
            {
              this.state.searchPage > 1 ? (
                <Pagination
                  first
                  last
                  prev
                  next
                  items={this.state.searchPage}
                  maxButtons={5}
                  activePage={this.state.activePage}
                  onSelect={this.handleSelect} />
              ) : ''
            }
          </div>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            onClick={this.handleClose}
            style={{ margin: "0 20px 40px 0" }}>
            取消
          </Button>
          <Button
            onClick={this.handleAdd}
            colors="primary"
            style={{ marginBottom: "40px" }}>
            授权
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default MiroAuthModal;
