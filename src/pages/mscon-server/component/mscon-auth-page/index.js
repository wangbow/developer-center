import React, { Component } from 'react';
import { Table, Button, Breadcrumb, Icon, Tooltip, Popconfirm, Row, Col, Message, InputGroup, FormControl } from 'tinper-bee';
import Title from 'components/Title';
import { formateDate } from 'components/util';
import MiroAuthModal from '../mscon-auth-modal';

import { err, success } from 'components/message-util';

import { getUsers, deleteAuth } from 'serves/confLimit';
import { findDOMNode } from 'react-dom';
import './index.less';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { getInterfaceName, toolTipData } from '../../mscon-utils/util';


const componentName = {
  confcenter: '应用列表'
};


class MiroAuthPage extends Component {
  constructor(...args) {
    super(...args);
    this.columns = [{
      title: '应用名',
      dataIndex: 'userId',
      key: 'userId',
    }, {
      title: '授权人',
      dataIndex: 'inviterName',
      key: 'inviterName',
      render: (text) => text ? text : ""
    },/*{
      title: '应用编码',
      dataIndex: 'busiCode',
      key: 'busiCode',
      render: (text) => {
        return text.substring(12);
      }
    }, */{
      title: '授权时间',
      dataIndex: 'ts',
      key: 'ts',
      render: (text, rec) => {
        return formateDate(text);
      }
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: this.renderCellTwo,
    }];

    this.state = {
      userData: [],
      showAddModal: false,
      searchValue: '',
      showModifyModal: false,
      selectedId: '',
      selectedRole: ''
    }
  }

  componentDidMount() {
    this.getUser();
  }

  /**
   * 获取用户列表
   */
  getUser = () => {
    let { location, resId, appCode, envType } = this.props;

    getUsers(`?resId=${resId}&busiCode=mic_service_${appCode}&envType=${envType}`).then((res) => {

      if (res.data.flag === 'success') {

        let userData = res.data.data.resources;
        if (userData instanceof Array) {
          userData.forEach((item, index) => {
            item.key = index;
          });

          this.setState({
            userData
          });
        }

      } else {
        err(res.data.message);
      }
    })


  }

  /**
   * 删除用户
   * @param record 删除用户的信息
   */
  handleDelete = (record) => {
    let { location, resId, appCode, envType } = this.props;
    return () => {
      //删除用户
      deleteAuth(`?userId=${record.userId}&resId=${resId}&busiCode=mic_service_${appCode}&envType=${envType}`).then((res) => {
        if (!res.data.error_code) {
          this.getUser();
          success('删除成功。');

        } else {
          err(res.data.error_message);
        }
      });
    }

  }

  /**
   * 渲染表格操作列
   * @param text
   * @param record
   * @param index
   * @returns {*}
   */
  renderCellTwo = (text, record, index) => {
    return (
      <span>
        <Popconfirm content="确认删除?" placement="bottom" onClose={this.handleDelete(record)}>
          <Icon type="uf-del" />
        </Popconfirm>
      </span>

    );
  }

  /**
   * 搜索按钮触发
   */
  handleSearch = () => {
    this.setState({
      searchValue: findDOMNode(this.refs.search).value
    })
  }

  /**
   * 捕获搜索回车时间
   * @param e
   */
  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }


  /**
   * 控制显示添加模态框
   * @param value
   * @returns {function()}
   */
  showAddModal = (value) => {
    return () => {
      this.setState({
        showAddModal: value
      })
    }

  }

  /**
   * 控制显示修改模态框
   * @param record
   * @returns {function()}
   */
  showModifyModal = (record) => {
    return () => {
      this.setState({
        showModifyModal: true,
        selectedId: record.id,
        selectedRole: record.daRole
      })
    }

  }

  /**
   * 隐藏模态
   */
  hideModifyModal = () => {
    this.setState({
      showModifyModal: false,
    })
  }

  /**
   * 去微服务的页面
   */
  gotoServerPage = (e) => {
    let { changeState } = this.props;
    if (changeState) {
      changeState("1");
    }
  }
  

  render() {
    let { params, location, id, interface_name, service_name, resId, appCode, envType } = this.props;
    let { userData, searchValue } = this.state;
    let data = {
      id: resId,
      busiCode: "mic_service_" + appCode
    }
    if (searchValue !== '') {
      let reg = new RegExp(searchValue, 'ig');
      userData = userData.filter((item) => {
        return reg.test(item.userName) || reg.test(item.userId)
      })
    }
    let interfaceName = getInterfaceName(interface_name);

    return (
      <div className="auth-page">
        {/*<Title></Title>
          name={id}
          backName={ componentName[location.query.busiCode] }
          path={`/fe/${location.query.backUrl}/index.html`}
          isRouter={ false }
        />*/}

        <Col md={12} sm={12}>

          {<Breadcrumb>
            
              <span className="curpoint" onClick={this.gotoServerPage} style={{ color: '#31c4dc' }}>
                <Icon type="uf-anglepointingtoleft" > 返回</Icon>
              </span>
           
            <Breadcrumb.Item className="margin-left-20">
              {<OverlayTrigger overlay={toolTipData(interface_name)} placement="bottom">
                <div className="font-style">{interfaceName}</div>
              </OverlayTrigger>}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {service_name}
            </Breadcrumb.Item>
          </Breadcrumb>}

        </Col>
        <div className="user-auth">
          <div>
            <Button shape="squared" colors="primary" onClick={this.showAddModal(true)}>
              授权
            </Button>
            <InputGroup className="user-search" simple>
              <FormControl
                ref="search"
                onKeyDown={this.handleSearchKeyDown}
              />
              <InputGroup.Button>
                <i className="cl cl-search" onClick={this.handleSearch} />
              </InputGroup.Button>
            </InputGroup>
          </div>
          <Table
            bordered
            className="user-table"
            data={userData}
            columns={this.columns}
          />
        </div>
        <MiroAuthModal
          show={this.state.showAddModal}
          onClose={this.showAddModal(false)}
          onEnsure={this.getUser}
          envType={envType}
          data={data}
        />
      </div>
    )
  }
}

export default MiroAuthPage;
