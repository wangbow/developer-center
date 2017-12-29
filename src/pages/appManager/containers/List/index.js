//公共
import React, {Component} from 'react';
import {Select, Col, Row, Label, Button, InputGroup, FormControl, Icon, Message, Breadcrumb} from 'tinper-bee';
import {Link} from 'react-router';
import classnames from 'classnames';
import {findDOMNode} from 'react-dom';

//组件

import {lintAppListData, splitParam} from 'components/util';
import PageLoading from 'components/loading';
import NoData from 'components/noData';
import Waiting from 'components/waiting';
import Title from 'components/Title';
import SimpleModal from 'components/simple-modal';
import ShowDialog from '../../../MyRP/components/dialog/ShowDialog';
import {CreateProduct, GroupTile, ProductTile, PublishTile} from '../../components';
import { success, warn, err } from 'components/message-util';

//api
import {
  GetPublishList,
  GetStatus,
  GetResPool,
  GetResPoolInfo,
  getGroup,
  updateGroup,
  deleteGroup,
  AppDestory
} from '../../../../serves/appTile';
import {getAppAlarm, addAppAlarm, deleteAppAlarm} from '../../../../serves/alarm-center';

import { TYPE_NAME } from '../../contants';


//资源
import './index.less';

const Option = Select.Option;

class List extends Component {
  state = {
    getPublishAppParam: '',
    appPublishList: [],
    filterResList: [],
    hostList: [],
    filterHost: 'all',
    filterRes: 'all',
    filterHostList: [],
    showLoading: true,
    searchValue: '',
    groupList: [],
    breadcrumbList: [],
    showModalFlag: false, //显示模态
    modalTitle: '',
    groupName: '',
    modalType: 'deleteApp', //分为deleteApp, deleteGroup, editGroup
    modalData: {}, //正在显示的modal对应的数据
    groupFirst: true, //显示顺序是否是分组优先
    showAlarmModal: false, //报警模态框
    empty: false, //搜索框显示清空按钮
    showCreateProductModal: false, //创建产品线模态框
    editData: {}, //编辑的数据
    edit: false, //是否是修改
    isFirst: true, //第一次进入，为获取数据
  }
  publishTimer = null;
  deleteType = '';



  componentDidMount() {
    var url = location.search; //获取url中"?"字符及以后的字串
    if (url.indexOf("?") !== -1) {
      this.getPublishList(`?unhealthy=true`);
    } else {
      this.getGroupList();
    }
    this.getRes();
  }

  componentWillUnmount() {
    window.clearInterval(this.publishTimer);
  }


  /**
   * 获取开启了报警的应用
   */
  getAlarm = (appPublishList) => {
    getAppAlarm()
      .then((res) => {
        let data = res.data;
        if (data.error_code) {
          return err(data.error_message);
        }
        appPublishList.forEach((item, index) => {
          item.isOpenAlarm = data.some((item1) => item.app_id === item1.AppId);

        });
        this.setState({
          appPublishList
        })
      })
  }


  /**
   * 搜索
   **/
  handleSearch = () => {
    let {searchValue} = this.state;
    this.setState({
      empty: true,
      appPublishList: [],
      showLoading: true
    });
    this.getPublishList(`?search_app=${searchValue}`);
  }

  /**
   * 回车搜索
   * @param e
   */
  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  handleChange = (e) => {
    this.setState({
      searchValue: e.target.value,
    })
  }

  /**
   * 循环更新状态
   */
  loopGetPublishList = () => {

    this.publishTimer = setInterval(() => {
      let {getPublishAppParam} = this.state;
      this.getPublishList(getPublishAppParam);
    }, 5000)
  }

  /**
   * 获取分组部署列表
   */
  getGroupList = (param) => {
    if(!param){
      this.setState({
        breadcrumbList: []
      })
    }
    return getGroup(param).then((res) => {
      let data = res.data;
      if (data.error_code) {
        Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        });
        this.setState({
          showLoading: false,
          isFirst: false
        })
      } else {
        let ids = [];
        let sessionObj = {};
        if (data.apps instanceof Array) {
          data.apps.forEach(function (item, index) {
            item.key = index;
            ids.push(item.app_id);
            sessionObj[item.id] = item;
          })
        }
        let param = {appids: ids.join(',')};

        this.setState({
          appPublishList: data.apps,
          groupList: data.groups,
          showLoading: false,
          isFirst: false
        });

        if (data.apps.length !== 0) {
          this.getStatus(param, data.apps);
        }

      }
    }).catch((e) => {
      this.setState({
        showLoading: false
      })
    });
  }

  /**
   * 获取部署列表
   * @param param
   */
  getPublishList = (param) => {
    if (!param) {
      param = ''
    }
    let appList = {};
    this.setState({
      showLoading: true
    })

    GetPublishList(param).then((response) => {

      appList = lintAppListData(response);
      let ids = [];
      let sessionObj = {};
      if (!appList || appList.error_code) {
        this.setState({
          showLoading: false
        })
      }

      appList.forEach(function (item, index) {
        item.key = index;
        if(item.hasOwnProperty('app_id')){
          ids.push(item.app_id);
          sessionObj[item.id] = item;
        }
      });

      this.setState({
        appPublishList: appList,
        showLoading: false

      });


      let param = {appids: ids.join(',')};

      sessionStorage.setItem("publishList", JSON.stringify(sessionObj));
      if (appList.length !== 0) {
        this.getStatus(param, appList);
      }

    }).catch((e) => {
      this.setState({
        showLoading: false
      })
    });
  }

  getStatus = (param, appList) => {
    GetStatus(splitParam(param)).then((response) => {

      let sessionObj = {};
      let stateList = lintAppListData(response, null, null);

      if (!stateList || stateList.error_code) return;

      stateList.forEach((item, index) => {
        sessionObj[item.appId] = item;
      })

      appList.forEach((item, index) => {
        if(sessionObj.hasOwnProperty(item.app_id)){
          item.runState = sessionObj[item.app_id].status;
          item.runStateMessage = sessionObj[item.app_id].message;
        }
      })


      this.setState({
        appPublishList: appList
      });
    });
  }

  /**
   * 获取部署列表上部署的资源池及主机信息
   */
  getRes = () => {
    GetResPool((res) => {

      if (!res.data.error_code) {
        let resData = [];
        for (let key in res.data) {
          let resObj = {};
          resObj.name = res.data[key].resourcepool_name;
          resObj.id = res.data[key].resourcepool_id;
          resData.push(resObj);
        }
        GetResPoolInfo((response) => {
          if (!response.data.error_code) {
            this.setState({
              filterResList: resData,
              hostList: response.data
            })
          }
        })
      }
    });

  }

  /**
   * 过滤部署列表
   **/
  filterPublishData = (res, host) => {
    let {breadcrumbList} = this.state;
    let totalGroup = breadcrumbList.pop();
    let param = '';
    if (host === '') {
      if (res === 'all') {
        if (totalGroup) {
          this.getGroupList(`?group_id=${totalGroup.id}`)
        } else {
          this.getGroupList()
        }
      } else {
        param = `?filter=resource&res_id=${res}`;
        this.getPublishList(param)
      }

    } else {
      if (host === 'all' && this.state.filterRes !== 'all') {
        param = `?filter=resource&res_id=${this.state.filterRes}`;
        this.getPublishList(param)
      } else if (host === 'all' && this.state.filterRes === 'all') {
        if (totalGroup) {
          this.getGroupList(`?group_id=${totalGroup.id}`)
        } else {
          this.getGroupList()
        }
      } else {
        param = `?filter=hostname&hostname=${host}`;
        this.getPublishList(param)
      }
    }
    this.setState({
      getPublishAppParam: param
    })

  }

  /**
   * 捕获下拉选择事件
   * @param state 要改变的state
   * @returns {function(*=)}
   */
  handleSelectChange = (state) => {
    let {hostList} = this.state;
    return (value) => {
      if (state === 'filterRes') {
        this.setState({
          filterHostList: hostList.hasOwnProperty(value) ? hostList[value] : [],
          filterHost: 'all'
        })
        this.filterPublishData(value, '');
      } else {
        this.filterPublishData('', value);
      }
      this.setState({
        [state]: value
      })
    }
  }

  /**
   * 打开分组文件夹
   * @param id
   * @param name
   * @returns {function()}
   */
  handleOpenGroup = (id, name) => {
    return (e) => {
      e.stopPropagation();
      let {breadcrumbList} = this.state;
      let isMount = breadcrumbList.some((item) => item.id === id);
      if (isMount) return;
      this.setState({
        showLoading: true
      });
      this.getGroupList(`?group_id=${id}`).then(() => {
        this.addBreadGroup(id, name)
      });
    }
  }

  /**
   * 渲染部署列表
   * @returns {Array}
   */
  renderPublishList = () => {
    let {appPublishList, groupList, empty, filterRes, filterHost, isFirst} = this.state;
    let len = appPublishList.length;
    let groupLen = groupList.length;
    if(isFirst) return <Waiting />;
    if (groupLen === 0 && len === 0) return <NoData />;
    if ((empty || filterRes !== 'all') && len === 0)return <NoData />;

    return appPublishList.map((item, index) => (
      <PublishTile onChangeAlarm={ this.changeAlarm } key={item.id} index={index} AppData={item}
                   onDelete={ this.handleDelete(item.id, index) }/>
    )).reverse()

  }

  /**
   * 添加面包屑
   * @param id
   * @param name
   */
  addBreadGroup = (id, name) => {
    let {breadcrumbList} = this.state;

    breadcrumbList.push({
      id: id,
      name: name
    });
    this.setState({
      breadcrumbList
    })
  }

  /**
   * 面包屑点击事件
   */
  handleBreadcrumbClick = (id, index) => {
    return () => {
      let {breadcrumbList} = this.state;
      breadcrumbList.length = index + 1;
      this.getGroupList(`?group_id=${id}`);
      this.setState({
        breadcrumbList,
        showLoading: true,
        empty: false,
        searchValue: ''
      })
    }
  }

  /**
   * 修改分组名称
   * @param e
   */
  handleChangeName = (e) => {
    this.setState({
      groupName: e.target.value
    })
  }

  /**
   * 修改分组按钮点击
   * @param data
   * @param index
   */
  handleGroupEdit = (data, index) => {
    return (e) => {
      e.stopPropagation();

      // this.setState({
      //   modalType: 'editGroup',
      //   modalTitle: '修改产品（线）名称',
      //   showModalFlag: true,
      //   modalData: {id: id, name: name, index: index},
      //   groupName: name
      // })
      this.setState({
        editData: data,
        edit: true
      });

      this.createProduct(true)();
    }
  }

  /**
   * 修改分组
   * @param id
   * @param name
   * @param index
   */
  groupEdit = (id, name, index) => {
    if (this.state.groupName === '') {
      return Message.create({
        content: '请输入名称',
        color: 'warning',
        duration: 4.5
      })
    }
    let {groupList} = this.state;
    this.handleHideModal();
    updateGroup({group_id: id, group_name: this.state.groupName}).then((res) => {
      let data = res.data;
      if (data.error_code) {
        Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      } else {
        groupList[index].name = this.state.groupName;
        this.setState({
          groupList
        });
        Message.create({
          content: '修改成功！',
          color: 'success',
          duration: 1.5
        })
      }
    })
  }

  /**
   * 修改报警
   * @param rec
   */
  changeAlarm = (rec) => (checked) => {
    this.setState({
      modalData: rec,
      showAlarmModal: true
    })
  }

  /**
   * 删除分组按钮点击
   * @param id
   * @param index
   * @param type
   */
  handleGroupDelete = (id, index, type) => {
    return (e) => {
      e.stopPropagation();
      this.setState({
        modalType: 'deleteGroup',
        modalTitle: `删除${TYPE_NAME[type]}`,
        showModalFlag: true,
        modalData: {id: id, index: index, type: type}
      })
    }
  }

  /**
   * 删除分组
   */
  deleteGroup = (id, index) => {
    this.handleHideModal();
    let {groupList} = this.state;
    deleteGroup(id).then((res) => {
      let data = res.data;
      if (data.error_code) {
        err( data.error_message);
      } else {
        groupList.splice(index, 1);
        success('删除成功。');
        this.setState({
          groupList
        })
      }
    })
  }

  /**
   * 删除应用按钮点击
   */
  handleDelete = (id, index) => {
    return (e) => {
      e.stopPropagation();
      this.setState({
        modalType: 'deleteApp',
        modalTitle: '销毁应用',
        showModalFlag: true,
        modalData: {id: id, index: index}
      });
    }

  }

  /**
   * 销毁modal cancel后的回调
   */
  handleHideModal = () => {
    this.setState({
      showModalFlag: false
    });
  }

  /**
   * 销毁应用
   */
  handleDestory = (id) => {
    let {appPublishList} = this.state;
    this.handleHideModal();
    AppDestory(id, (res) => {
      let data = res.data;
      if (data.error_code) {
        return err(data.error_message);
      }
      success('删除成功。');
      appPublishList = appPublishList.filter((item) => item.id !== id);

      this.setState({
        appPublishList
      })
    });

  }

  /**
   * 模态确认事件
   */
  handleEnsure = () => {
    let {modalType, modalData} = this.state;

    switch (modalType) {
      case 'deleteApp':
        this.handleDestory(modalData.id);
        break;
      case 'deleteGroup':
        this.deleteGroup(modalData.id, modalData.index);
        break;
      case 'editGroup':
        this.groupEdit(modalData.id, modalData.name, modalData.index);
        break;
      default:

    }
  }

  /**
   * 修改显示顺序
   */
  changeShowFirst = () => {
    let {groupFirst} = this.state;
    this.setState({
      groupFirst: !groupFirst
    })
  }

  /**
   * 清空搜索
   */
  emptySearch = () => {
    this.setState({
      searchValue: '',
      appPublishList: [],
      empty: false
    });

    this.getGroupList();

  }

  /**
   * 关闭报警模态
   */
  closeAlarmModal = () => {
    this.setState({
      showAlarmModal: false,
      modalData: {}
    })
  }

  /**
   * 开启或关闭报警
   */
  handleConfirm = (userId, isEmail, isPhone) => {
    let {modalData} = this.state;
    if (modalData.alarm) {
      deleteAppAlarm(modalData.id)
        .then((res) => {
          let data = res.data;
          let {appPublishList} = this.state;
          if (data.error_code) {
            appPublishList.forEach((item) => {
              if (item.app_id === modalData.app_id) {
                item.alarm = true;
              }
            });
            this.setState({
              appPublishList
            })
            return Message.create({
              content: data.error_message,
              color: 'danger',
              duration: null
            })
          }
          appPublishList.forEach((item) => {
            if (item.app_id === modalData.app_id) {
              item.alarm = false;
            }
          });
          this.setState({
            appPublishList
          })
          Message.create({
            content: '关闭报警成功。',
            color: 'success',
            duration: 1.5
          })
        })
    } else {

      let param = {
        AppId: modalData.id.toString(),
        MarathonId: modalData.marathon_id,
        AppName: modalData.name,
        Contacts: userId.toString(),
        Interval: 300,
        AlarmInterval: 1800,
        Type: 1,
        Phone: isPhone,
        Email: isEmail
      };
      addAppAlarm(param)
        .then((res) => {
          let data = res.data;
          let {appPublishList} = this.state;
          if (data.error_code) {
            appPublishList.forEach((item) => {
              if (item.app_id === modalData.app_id) {
                item.alarm = false;
              }
            });
            this.setState({
              appPublishList
            })
            return Message.create({
              content: data.error_message,
              color: 'danger',
              duration: null
            })
          }
          appPublishList.forEach((item) => {
            if (item.app_id === modalData.app_id) {
              item.alarm = true;
            }
          });
          this.setState({
            appPublishList
          })
          Message.create({
            content: '开启报警成功。',
            color: 'success',
            duration: 1.5
          })
        })

    }
    this.closeAlarmModal();


  }

  /**
   * 创建产品线
   */
  createProduct = (value) => () => {
    if(!value){
      this.setState({
        edit: false,
        editData: {}
      })
    }
    this.setState({
      showCreateProductModal: value
    })
  }

  render() {


    return (
      <div>
        <Title showBack={false} name="应用管理"/>

        <div>
          <Breadcrumb className="bread-crumb">
            <Breadcrumb.Item onClick={ this.handleBreadcrumbClick('', -1) }>
              根目录
            </Breadcrumb.Item>
            {
              this.state.breadcrumbList.map((item, index, ary) => {
                if (index === ary.length) {
                  return (
                    <Breadcrumb.Item>
                      {item.name}
                    </Breadcrumb.Item>
                  )
                }
                return (
                  <Breadcrumb.Item onClick={ this.handleBreadcrumbClick(item.id, index) }>
                    {item.name}
                  </Breadcrumb.Item>
                )
              })
            }
          </Breadcrumb>
        </div>
        <Row className="header-button">

          <Link to="/publish" style={{color: "#fff"}}>
            <Button
              shape="squared"
              colors="primary"
              style={{marginRight: 8}}>
              部署列表
            </Button>
          </Link>
          <Button
            shape="squared"
            onClick={ this.createProduct(true) }
            colors="primary"
            style={{marginRight: 8}}>
            创建产品（线）
          </Button>

          <a href="/fe/continuous/index.html#createApp" style={{color: "#fff"}}>
            <Button colors="primary" shape="squared">
              创建新应用
            </Button>
          </a>
          {/*<div className="publish-list-control">*/}
            {/*<i onClick={ this.changeShowFirst } className={classnames('cl', {*/}
              {/*'cl-folder-l': this.state.groupFirst,*/}
              {/*'cl-file-l-b': !this.state.groupFirst*/}
            {/*})}/>*/}
          {/*</div>*/}
          <InputGroup simple className="publish-tile-search">
            <FormControl
              ref="search"
              onChange={ this.handleChange }
              value={ this.state.searchValue }
              onKeyDown={ this.handleKeyDown }
              type="text"
            />
            {
              this.state.empty ? (
                <Icon type="uf-close-c" onClick={ this.emptySearch } className="empty-search"/>
              ) : null
            }

            <InputGroup.Button onClick={ this.handleSearch } shape="border">
              <Icon type="uf-search"/>
            </InputGroup.Button>
          </InputGroup>
          <div style={{float: 'right'}}>
            <Select
              value={ this.state.filterRes}
              size="lg"
              className="select-res"
              onChange={this.handleSelectChange('filterRes')}>
              {
                this.state.filterResList.map(function (item, index) {
                  return (
                    <Option value={item.id} key={ index }>{ item.name }</Option>
                  )
                })
              }
              <Option value="all" key="all">全部资源池</Option>
            </Select>

            <Select
              value={ this.state.filterHost}
              size="lg"
              className="select-res"
              onChange={this.handleSelectChange('filterHost')}>
              {
                this.state.filterHostList.map(function (item, index) {
                  return (
                    <Option value={item.Hostname} key={ index }>{ item.Hostname }</Option>
                  )
                })
              }
              <Option value="all" key="all">全部主机</Option>
            </Select>
          </div>


        </Row>
        <div className="applist">
          <Row className="width-full">

            {
              !this.state.empty && this.state.filterRes === 'all' && this.state.groupFirst ? this.state.groupList.map((item, index) => {
                //return GroupTile(item, index, this.handleOpenGroup, this.handleGroupEdit, this.handleGroupDelete)
                return (
                  <ProductTile
                    data={ item }
                    index={ index }
                    onClick={ this.handleOpenGroup }
                    onEdit={ this.handleGroupEdit }
                    onDelete={ this.handleGroupDelete }
                  />
                )
              }) : null
            }
            {
              this.renderPublishList()
            }
            {
              this.state.empty || this.state.filterRes !== 'all' || this.state.groupFirst ? null : this.state.groupList.map((item, index) => {
                //return GroupTile(item, index, this.handleOpenGroup, this.handleGroupEdit, this.handleGroupDelete)
                return (
                  <ProductTile
                    data={ item }
                    index={ index }
                    onClick={ this.handleOpenGroup }
                    onEdit={ this.handleGroupEdit }
                    onDelete={ this.handleGroupDelete }
                  />
                )
              })
            }
            <PageLoading show={ this.state.showLoading }/>
          </Row>
        </div>
        <SimpleModal
          show={this.state.showModalFlag}
          onClose={this.handleHideModal}
          onEnsure={this.handleEnsure}
          title={ this.state.modalTitle }
        >
          {
            this.state.modalType === 'editGroup' ? (
              <div>
                <Label>产品（线）名称：</Label>
                <FormControl
                  value={ this.state.groupName }
                  onChange={ this.handleChangeName }
                />
              </div>

            ) : null
          }
          {
            this.state.modalType === 'deleteApp' ? (
              '确认要销毁应用吗？'
            ) : null
          }
          {
            this.state.modalType === 'deleteGroup' ? (
              `确认要删除${TYPE_NAME[this.state.modalData.type]}吗？`
            ) : null
          }
        </SimpleModal>

        <ShowDialog
          name={this.state.modalData.name}
          show={ this.state.showAlarmModal }
          checked={ this.state.modalData.alarm }
          onConfirm={ this.handleConfirm }
          close={ this.closeAlarmModal }
        />
        <CreateProduct
          show={ this.state.showCreateProductModal }
          onClose={ this.createProduct(false) }
          edit={ this.state.edit }
          data={ this.state.editData }
          breadList= { this.state.breadcrumbList }
          refresh={ this.getGroupList }
        />
      </div>
    )
  }
}

export default List;
