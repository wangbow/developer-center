import React, { Component, PropTypes, cloneElement } from 'react';
import ReactDom from 'react-dom';
import { Row, Col, Button, Select, Table, Message, Popconfirm, FormControl, InputGroup, Icon } from 'tinper-bee';
import classnames from 'classnames';
import './index.less';
import { interfaceList, serviceList, searchList, modifyauth } from 'serves/microServe';
import ServerTable from '../mscon-table';
import ServerLeftList from '../mscon-left-list';
import ServerCard from '../mscon-card';
import ServerDetails from '../mscon-details';
//import MiroAuthPage from '../../../appManager/components/miro-auth-page';
import MiroAuthPage from '../mscon-auth-page';
import LinkPath from '../mscon-link';
import CurrentLimit from '../mscon-limit';
import Rely from '../mscon-rely';
import Statis from '../mscon-statis';
import LinkRoad from '../mscon-link-road';
import { getQueryString, getHostId, getCookie } from 'components/util';
import { err, warn, success } from 'components/message-util';
import PageLoading from 'components/loading';

class MircoServer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,//loading进度条的显示与否
      flag: true,//通过true和false来进行卡片和table的切换
      interface_name: "", //接口名称
      service_name: "", //接口下的服务名称
      addActive: 0,//选中的接口索引
      data_interface_list: [], //接口的分类列表
      data_service_list: [],//具体接口下的服务列表
      activePage: 0,
      page: 1,
      changeMain: "1",
      resId: "",
      traceId: "",//链路id
      changeIndex: "",
      searchValue: ""
    }
  }
  /**
   * dom渲染完毕后，请求左侧的接口
   */
  componentDidMount() {
    let { appCode, envType } = this.props;
    if (appCode) {
      this.getInterface(appCode, envType);
    }
  }

  /**
   * 刷新
   */
  refresh = () => {
    let { appCode, envType } = this.props;
    let { interface_name, data_interface_list, addActive } = this.state;

    if (addActive == -1) {
      this.handleSearch();
    } else if (!interface_name) {
      data_interface_list.map((item, index) => {
        if (index == addActive) {
          interface_name = item.name;
          this.setState({
            interface_name: interface_name
          }, () => {
            this.getServerListMain(appCode, interface_name);
          });
        }
      })
    } else {
      this.getServerListMain(appCode, interface_name);
    }

  }
  /**
   * 获取左侧列表的接口
   */

  getInterface(appCode, envType) {
    let { interface_name } = this.state;
    let params = {
      appCode: appCode,
      envType: envType
    }

    this.setState({
      showLoading: true
    })

    interfaceList(params)
      .then(data => {
        this.setState({
          showLoading: false
        })
        if (data && data.data.error_code) {
          if (data.data.error_message.indexOf("not exist") != -1) {
            return warn("应用在当前环境下没有匹配的数据");
          } else {
            return err("接口异常，请重试 " + data.data.error_message);
          }

        } else if (data.data.detailMsg.data.objects && data.data.detailMsg.data.objects.length > 0) {

          if (interface_name) {
            this.getServerListMain(appCode, interface_name);
          } else {
            this.getServerListMain(appCode, data.data.detailMsg.data.objects[0].name);
          }

          this.setState({
            data_interface_list: data.data.detailMsg.data.objects,
            interface_name: data.data.detailMsg.data.objects[0].name
          })

        }

      })
      .catch((error) => {
        return err(error.message);
      })
  }
  /**
   * 获取中间内容区域的列表数据
   */
  getServerListMain = (appCode, interface_name) => {
    let { activePage, data_interface_list, addActive } = this.state;
    let { envType } = this.props;
    let params = {
      size: '10',
      index: activePage,
      appCode: appCode,
      serverName: interface_name,
      envType: envType
    }

    this.setState({
      showLoading: true
    })

    serviceList(params)
      .then(data => {
        this.setState({
          showLoading: false
        })
        if (data && data.data.error_code) {
          return err("接口异常，请重试 " + data.data.error_message);
        } else if (data.data.content && Array.isArray(data.data.content)) {
          if (addActive == -1) {
            data_interface_list.map((item, index) => {
              if (item.name.indexOf(interface_name) != -1) {
                this.setState({
                  addActive: index
                })
              }
            })
          }

          this.setState({
            data_service_list: data.data.content,
            searchValue: ""
          })
        }

      })
      .catch((error) => {
        return err(error.message);
      })

  }
  /**
   * 切换卡片和table显示
   */
  handleClick = (e) => {
    this.setState({
      flag: !this.state.flag
    })

  }

  /**
   * 点击左侧的接口分类,请求当前分类的下的服务
   */
  handleClickInterface = (value, addActive) => (e) => {
    let { appCode } = this.props;
    this.getServerListMain(appCode, value);
    this.setState({
      interface_name: value,
      addActive: addActive
    })
  }

  /**
   * 点击当前的服务名称，去往详情页
   */
  handleClickServiceName = (value, interface_value) => (e) => {
    let { id } = this.props;
    let { interface_name, data_interface_list, data_service_list } = this.state;

    if (!interface_name) {
      interface_name = data_interface_list[0].name;
    }

    this.setState({
      changeMain: "2",
      service_name: value,
      interface_name: interface_name
    })
    sessionStorage.setItem("data_service_list", JSON.stringify(data_service_list));
  }

  /**
    * 选中第几页
    */
  handleSelect = (key) => {
    let { interface_name } = this.state;
    let { appCode } = this.props;
    this.setState({
      activePage: key
    }, () => {
      this.getServerListMain(appCode, interface_name);
    });


  }
  /**
   * 搜索框输入
   */
  handleInputChange = (e) => {
    let searchValue = e.target.value;
    this.setState({
      searchValue: searchValue
    })
  }
  /**
   *点击搜索按钮。如果没有选择所属分类，默认从第一个分类查询
   */
  handleSearch = () => {
    let { activePage, searchValue } = this.state;
    let { appCode, envType } = this.props;
    let params = {
      searchValue: searchValue,
      size: '10',
      index: activePage,
      appCode: appCode,
      envType: envType
    }
    if (searchValue.trim() != "") {
      this.setState({
        showLoading: true
      })

      searchList(params)
        .then(data => {
          this.setState({
            showLoading: false
          })
          if (data && data.data.error_code) {
            return err("接口异常，请重试 " + data.data.error_message);
          } else if (data.data.content && Array.isArray(data.data.content)) {
            this.setState({
              data_service_list: data.data.content,
              addActive: -1
            })
          }
        })
        .catch((error) => {
          return err("接口异常，请重试 " + error.message);
        })
    } else {
      return warn("搜索内容不能为空");
    }




  }

  /**
  * 搜索框的回车事件
  */
  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }
  /**
  * switch点击,切换公私有
  */
  handleChange = (metaId, resId, userPriviledge, defaultIndex) => (e) => {
    let { appCode, envType } = this.props;
    let providerId = getCookie("u_providerid");
    let params = {
      metaId: metaId,
      resId: resId,
      providerId: providerId,
      envType: envType,
      busiCode: `mic_service_` + appCode,
      userPriviledge: userPriviledge
    }
    this.setState({
      showLoading: true
    })

    modifyauth(params)
      .then(data => {
        this.setState({
          showLoading: false
        })
        if (data && data.data.error_code) {
          return err("接口异常，请重试 " + data.data.error_message);
        } else if (data) {
          this.setState({
            changeIndex: defaultIndex
          })
          return success("修改成功");
        }

      })
      .catch((error) => {
        return err("接口异常，请重试 " + error.message);
      })

  }

  changeState = (changeStateValue, interface_name, service_name, resId, traceId) => (e) => {
    this.setState({
      changeMain: changeStateValue,
      interface_name: interface_name,
      service_name: service_name,
      resId: resId,
      traceId: traceId
    })
  }

  getMainState = (e) => {
    let { flag, resId, traceId, data_interface_list,
      addActive, data_service_list, changeMain,
      interface_name, service_name, changeIndex, searchValue } = this.state;
    let { appCode, envType, id } = this.props;

    if (!interface_name && data_interface_list.length > 0) {
      interface_name = data_interface_list[0].name;
    }
    switch (changeMain) {
      case '1':
        return (
          <div className="container">
            <Row>
              {data_interface_list.length > 0 ?
                (
                  <div>
                    <div className="serverWrap clearfix margin-bottom-10">
                      <span className="list-icon pull-right" onClick={this.handleClick}>
                        <i className="cl cl-list"></i>
                      </span>

                      <div md={3} className="pull-left">
                        <div className="refersh-btn" onClick={this.refresh}>刷新</div>
                      </div>

                      <div md={3} className="pull-right search-form">
                        <InputGroup simple >
                          <FormControl ref="searchKey" className="input-search" placeholder="请输入搜索内容" type="text" onKeyDown={this.handleSearchKeyDown} value={searchValue} onChange={this.handleInputChange} />
                          <InputGroup.Button shape="border" onClick={this.handleSearch}>
                            <span className="uf uf-search curpoint"> </span>
                          </InputGroup.Button>
                        </InputGroup>
                      </div>
                    </div>
                    <Col md={2} sm={2}>
                      <ServerLeftList
                        addActive={addActive}
                        envType={envType}
                        dataSource={data_interface_list}
                        getFirst={(value, index) => {
                          this.handleClickInterface(value, index)()
                        }}
                      />
                    </Col>
                    <Col md={10} sm={10}>
                      {
                        flag ? (
                          <ServerCard
                            appCode={appCode}
                            flag={flag}
                            envType={envType}
                            interface_name={interface_name}
                            changeIndex={changeIndex}
                            data_service_list={data_service_list}
                            getSencond={(value, interface_value) => {
                              this.handleClickServiceName(value, interface_value)()
                            }}
                            switchonClick={(metaId, resId, userPriviledge, defaultIndex) => { this.handleChange(metaId, resId, userPriviledge, defaultIndex)() }}
                            changeParentState={(value, interface_name, service_name, resId) => {
                              this.changeState(value, interface_name, service_name, resId)()
                            }}
                          />
                        )
                          : (
                            <ServerTable
                              appCode={appCode}
                              flag={flag}
                              envType={envType}
                              interface_name={interface_name}
                              changeIndex={changeIndex}
                              data_service_list={data_service_list}
                              getSencond={(value) => {
                                this.handleClickServiceName(value)()
                              }}
                              switchonClick={(metaId, resId, userPriviledge, defaultIndex) => {
                                this.handleChange(metaId, resId, userPriviledge, defaultIndex)()
                              }}
                              changeParentState={(value, interface_name, service_name, resId) => {
                                this.changeState(value, interface_name, service_name, resId)()
                              }}
                            />
                          )
                      }

                    </Col>
                    <Col md={12}>
                      {
                        this.state.page > 1 ? (
                          <Pagination
                            first
                            last
                            prev
                            next
                            boundaryLinks
                            items={this.state.page}
                            maxButtons={5}
                            activePage={this.state.activePage}
                            onSelect={this.handleSelect} />
                        ) : ""
                      }
                    </Col>
                  </div>
                ) : <h4 className="text-center"> no Data</h4>
              }
              <PageLoading show={this.state.showLoading} />
            </Row>
          </div>
        )
      case '2':
        return <ServerDetails
          appCode={appCode}
          envType={envType}
          interface_name={interface_name}
          service_name={service_name}
          changeState={(value) => this.changeState(value)()}
        />
      case '11':
        return <MiroAuthPage
          appCode={appCode}
          envType={envType}
          interface_name={interface_name}
          service_name={service_name}
          id={id}
          resId={resId}
          changeState={(value, firsetName) => this.changeState(value)()}
        />
      case '12':
        return <LinkPath
          appCode={appCode}
          envType={envType}
          id={id}
          interface_name={interface_name}
          service_name={service_name}
          changeParentState={(value, interface_name, service_name, resId, traceId) => {
            this.changeState(value, interface_name, service_name, resId, traceId)()
          }}
          changeState={(value, firsetName, service_name) => {
            this.changeState(value, firsetName, service_name)()
          }}
        />
      case '14':
        return <Rely
          appCode={appCode}
          envType={envType}
          id={id}
          interface_name={interface_name}
          service_name={service_name}
          changeState={(value, firsetName) => this.changeState(value)()}
        />
      case '15':
        return <Statis
          appCode={appCode}
          envType={envType}
          id={id}
          interface_name={interface_name}
          service_name={service_name}
          changeState={(value, firsetName) => this.changeState(value)()}
        />
      case '121':
        return <LinkRoad
          appCode={appCode}
          envType={envType}
          id={id}
          interface_name={interface_name}
          service_name={service_name}
          traceId={traceId}
          changeState={(value, firsetName, service_name) => this.changeState(value, firsetName, service_name)()}
        />
    }

  }
  render() {
    let getMainState = this.getMainState();
    return (
      <div>
        {
          getMainState
        }
      </div>
    )
  }
}


export default MircoServer;
