import React, { Component } from 'react';
import axios from 'axios';
import { Upload, Col, Con, Row, Button, Icon, Table, Alert, Message, Popconfirm, Switch } from 'tinper-bee';
import ShowKeyModal from '../../components/ShowKeyModal';
import ForbidModal from '../../components/ForbidModal';
import DeleteModal from '../../components/DeleteModal';
import EditModal from '../../components/EditModal';
import StartUseModal from '../../components/StartUseModal';
import ValidateModal from '../../components/ValidateModal';
import styles from './index.css';
import { lintAppListData, lintAccessListData, lintData, formateDate, splitParam } from '../../components/util';
import { DeleteAccessServe, ForbidAccessServe, AccessListServe, CreateAccessServe, GetSecret, EditAccessServe, ValidateUser, SendShortMsg, getPhoneNum } from '../../serves/accessServe';
import Title from '../../components/Title';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AccessList: [],
      ValidateAccessFlag: false,
      showValidateModalFlag: false,
      showDeleteModalFlag: false,
      showEditModalFlag: false,
      showForbidModalFlag: false,
      ShowKeyModalFlag: false,
      currentIndex: 0,
      messageCode: '',
      content: '',
      id: '',
      showType: '',  //'delete forbid create showkey'
      accesskeyName: "", //accesskey的名称
      description: "",//描述字段
      textareaInfo: ""
    };
    this.onDelete = this.onDelete.bind(this);
    this.onFreshData = this.onFreshData.bind(this);
    this.handleReFresh = this.handleReFresh.bind(this);
    this.createAccess = this.createAccess.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.showValidateModal = this.showValidateModal.bind(this);
    this.showTypeModal = this.showTypeModal.bind(this);
    this.onShowKey = this.onShowKey.bind(this);
    this.messageDelete = this.messageDelete.bind(this);
    this.getScretKey = this.getScretKey.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.showValidate = this.showValidate.bind(this);
    this.showVerMoal = this.showVerMoal.bind(this);
    this.choseMethod = this.choseMethod.bind(this);
  }

  componentDidMount() {
    const self = this;
    this.onFreshData();
  }
  showValidateModal(type, index) {
    var self = this;
    return function () {
      self.setState({ showValidateModalFlag: true, showType: type, showForbidModalFlag: false, showEditModalFlag: false,showDeleteModalFlag:false });
      if (index) {
        self.setState({ currentIndex: index });
      }
    }
  }

  showVerMoal() {
    let self = this;
    self.setState({ showValidateModalFlag: true, showForbidModalFlag: false, showEditModalFlag: false ,showDeleteModalFlag:false});
  }
  /**
   * 
   * 
   */
  showValidate(type, index) {
    var self = this;
    return function () {
      self.setState({ showType: type, showValidateModalFlag: false, showForbidModalFlag: false, showEditModalFlag: false,showDeleteModalFlag:false,currentIndex: index });
      setTimeout(function(){
          self.showTypeModal();
      },0)
    }
  }

  showTypeModal() {
    
    if (this.state.showType === 'forbid') {
      this.setState({ showForbidModalFlag: true,showDeleteModalFlag: false, id: this.state.AccessList[this.state.currentIndex].id })
    }
    if (this.state.showType === 'start') {

      this.onForbid(1)();
    }
    if (this.state.showType === 'showkey') {

      this.getScretKey();

    }
    if (this.state.showType === 'create') {
      this.createAccess();
    }
  }
  setFlag(flag) {
    this.setState({ ValidateAccessFlag: falg });
  }
  onFreshData(reFreshFlag) {
    let self = this;
    AccessListServe(function (response) {
      let accessList = lintAppListData(response, null, null, reFreshFlag);
      if (!accessList || accessList.error_code) return false;
      accessList.forEach(function (item, index) {
        item.key = index;
      })
      self.setState({ AccessList: accessList,showValidateModalFlag:false });
    });
  }
  onDelete(params,index) {
    const self = this;
    return function () {
      self.setState({ showDeleteModalFlag: false, showForbidModalFlag:false,showValidateModalFlag:false});
      const AccessList = self.state.AccessList;
      let index = self.state.currentIndex;

      let param = {
        accessKey: self.state.AccessList[index].accessKey,
        messageCode: params.messageCode
      }

      DeleteAccessServe(param, function (response) {
        let tempData = lintAppListData(response, "删除失败", "删除成功");
        if (!tempData || tempData.error_code) return false;
        AccessList.splice(index, 1);
        self.setState({ AccessList: AccessList })
      });

    };
  }

  /**
   * 
   * 添加描述，和编辑功能
   */
  onEdit(textareaInfo) {
    const self = this;
    self.setState({
      showEditModalFlag: false
    });

    let param = {
      accessKey: this.state.accesskeyName,
      description: textareaInfo
    }

    EditAccessServe(param, function (response) {
      let tempData = lintAppListData(response, "修改描述信息失败", "描述信息修改成功");
      if (!tempData || tempData.error_code) return false;
      self.onFreshData();
    });

  }

  /**
   * 
   * 编辑点击事件触发，修改state值
   */
  onEditClick(index, record) {
    this.setState({
      showEditModalFlag: true,
      accesskeyName: record.accessKey,
      description: record.description,
      showValidateModalFlag: false,
      showForbidModalFlag: false, 
      showDeleteModalFlag:false

    })
  }

  messageDelete(index) {
     this.showValidateModal('delete', index)();
    /*let self = this;
    this.setState({ showType: 'delete',currentIndex: index }); 
    setTimeout(function(){
      self.showTypeModal();
    },0)*/
    
  }

  onForbid(flag, params) {
    const self = this;
    return function () {
      self.setState({ showValidateModalFlag: false });
      const AccessList = self.state.AccessList;
      let index = self.state.currentIndex;
      let param = { enable: flag, accessKey: self.state.AccessList[index].accessKey, messageCode: params.messageCode || self.state.messageCode };
      ForbidAccessServe(splitParam(param), function (response) {
        let tempData = lintAppListData(response, null, "数据更新成功")
        if (!tempData || tempData.error_code) return false;
        AccessList[index].enabled = (AccessList[index].enabled == 0) ? 1 : 0;
        self.setState({ AccessList: AccessList });
      })
    }
  }

  getScretKey(params) {
    const self = this;
    const AccessList = self.state.AccessList;
    let index = self.state.currentIndex;
    let param = {
      accessKey: self.state.AccessList[index].accessKey,
      messageCode: params.messageCode
    }
    GetSecret(param, function (response) {
      let tempData = lintAppListData(response, null, null)
      if (!tempData || tempData.error_code) return false;
      self.setState({ ShowKeyModalFlag: true, content: tempData.message,showValidateModalFlag:false });
    })
  }
  onShowKey() {
    const self = this;
    return function () {
      self.setState({ ShowKeyModalFlag: false });

    }
  }
  /* handerChange(type,index){
     let self=this;
       document.getElementById('accessF5').setAttribute('switch','1');
     if(document.getElementById('accessF5').getAttribute('back')){
         document.getElementById('accessF5').removeAttribute('back');
     }else{
       
         self.showValidateModal(type,index)();
     }
 
   }*/
  handleReFresh() {
    let reFreshFlag = true;
    this.setState({ showValidateModalFlag: false });
    this.onFreshData(reFreshFlag);
  }
  createAccess(params) {
    let self = this;
    let param = { messageCode: params.messageCode };

    CreateAccessServe(splitParam(param), function (response) {

      let tempData = lintAppListData(response, null, "创建成功");
      if (!tempData || tempData.error_code) return false;
      self.onFreshData();
    });
    
     
  }
  //<ShowKeyModal title={ '显示' } content={text} />
  choseMethod(params) {
    let showType = this.state.showType;
    switch (showType) {
      case "forbid":
        this.onForbid(0,params)();
        break;
      case "delete":
        this.onDelete(params)();
        break;
      case "start":
        this.onForbid(1,params)();
        break;
      case "showkey":
        this.getScretKey(params);
        break;
      case "create":
        this.createAccess(params);
        break;      
      default:
        break;
    }
  }
  render() {
    const self = this;
    const columns = [
      { title: 'AccessKey', dataIndex: 'accessKey', key: 'accessKey' },
      {
        title: 'Access Secret', dataIndex: 'accessSecret', key: 'accessSecret', render(text, record, index) {
          return <span className="cl cl-find" title="查看" style={{ 'color': '#5BA8EA' }} onClick={self.showValidateModal('showkey', index)}> </span>;
        }
      },
      {
        title: '状态', dataIndex: 'enabled', key: 'enabled', render(text) {
          let value = "禁用";
          let className = 'access-status ban';
          if (text == "1") {
            value = '启用';
            className = 'access-status success';
          }
          return <span className={className}>{value}</span>;
        }
      },
      {
        title: '创建时间', dataIndex: 'ts', key: 'ts', render(time) {
          return formateDate(time);
        }
      },
      {
        title: '描述', dataIndex: 'description', key: 'description', render(description) {
          return <div className="descrip"> {description} </div>;
        }
      },

      {
        title: '启用-停用', dataIndex: 'enabled', key: 'operate', render(text, record, index) {
          if (text == 0) {

            return (<span className="operate-button start" onClick={self.showValidateModal('start', index)}>启动</span>);
          } else {
            return (<span className="operate-button forbid" onClick={self.showValidate('forbid', index)}>禁止</span>);
          }
        }
      },
      {
        title: '操作', dataIndex: 'e', key: 'e', render(text, record, index) {
          return (
            <div>

              <span onClick={function () { self.onEditClick(index, record) }}> <Icon type="uf-pencil-s" /> </span>

              <Popconfirm rootClose onClose={function () { self.messageDelete(index) }} trigger="click" placement="bottom" content="确认删除吗？" style={{ 'color': "red" }} >
                <span className="cl cl-delete" title="删除" style={{ 'color': '#5BA8EA' }} ></span>
              </Popconfirm>
            </div>
    
          );
        }
      }
    ];
    return (
      <Row>
        <Title name="Access key" showBack={false} />
        <Col md={12}>
          <Row style={{ padding: '0 25px' }}>
            <Col md={12} className="key-table-operate">
              <Button onClick={this.showValidateModal('create')} colors="info"  >创建</Button>
              <Button onClick={this.handleReFresh} shape="border" >刷新</Button>
            </Col>
            {/*<Col md={12} className="key-table-warning">
                      <Alert colors="warning">
                        <Icon type="uf-exc-t-o"></Icon>
                        <span className="alert-text">Access Key ID 和Access Key Secret 是您访问用友云API的密钥，具有该账户完全的权限，请您妥善管理。</span>
                      </Alert>
                    </Col>*/}
            <Col md={12} sm={12} className="key-table-list">
              <Table id="accessTable"
                columns={columns}
                data={this.state.AccessList}
              />
            </Col>
            <ValidateModal show={this.state.showValidateModalFlag} callback={(params) => self.choseMethod(params)}  index={this.state.currentIndex} />
            <DeleteModal onConfirmDelete={() => self.showVerMoal()} show={this.state.showDeleteModalFlag} title={ '删除' } id={this.state.id} />  
            <ForbidModal onConfirmForbid={() => self.showVerMoal()} show={this.state.showForbidModalFlag} title={'禁用'} id={this.state.id} />
            <ShowKeyModal onConfirmShowKey={self.onShowKey()} show={this.state.ShowKeyModalFlag} title={'显示'} content={this.state.content} />
            <EditModal onConfirmEdit={(textareaInfo) => { self.onEdit(textareaInfo) }} show={this.state.showEditModalFlag} title={'编辑'} id={this.state.id} accesskeyName={this.state.accesskeyName} description={this.state.description} />
          </Row>
        </Col>
      </Row>


    )
  }
}

export default MainPage;
