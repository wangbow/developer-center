import React,{Component} from 'react';
import {Icon,Button,Row,Col,Pagination,Tabs, TabPanel,Message} from 'tinper-bee';
import ScrollableInkTabBar from 'bee-tabs/build/ScrollableInkTabBar';
import TabContent from 'bee-tabs/build/TabContent';
import {GetPublishDetailDebug,GetErrorTargerList,GetPerOperaList} from '../../../serves/appTile';
import {lintAppListData,dataPart,formateDate} from '../../../components/util';

import LoadingTable from '../../../components/loading-table';

class EventRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: this.props.id,
      debugList: {},
      currentKey: "3",
      activeKey: this.props.activeKey,
      activePage: 1,
      showLoading: true,
      page1: 1,
      page2: 1,
      errorArray: [],
      operaArray: []
    }

    this.getErroList = this.getErroList.bind(this);
    this.getOperaList = this.getOperaList.bind(this);
  }

  OperaTimer = null;

  colum1 = [{
    title: '操作用户',
    dataIndex: 'user_name',
    key: 'user_name',
    render: (text) => {
      return decodeURIComponent(text);
    }
  },{
    title: '操作内容',
    dataIndex: 'content',
    key: 'content',
  }, {
    title: '操作时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text) => {
      return formateDate(text);
   }
  }, {
    title: '操作标题',
    dataIndex: 'title',
    key: 'title',
  }];

  colum2 = [{
    title: '事件类型',
    dataIndex: 'task_status',
    key: 'task_status',
  }, {
    title: '事件时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: '20%',
    render: (text) => {
      return  formateDate(text);
    }
  },  {
    title: '所在主机',
    dataIndex: 'hostname',
    key: 'hostname',
  }, {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
  },{
    title: '事件信息',
    dataIndex: 'message',
    key: 'message',
    width: '40%'
  }];

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey !== this.state.currentKey) {
      return;
    }
  }

  componentDidMount() {
    if (this.state.activeKey !== this.state.currentKey) return;
    this.getErroList();
    this.getOperaList();
    this.loopGetOperaList();
  }

  componentWillUnMount() {
    window.clearInterval(this.OperaTimer);
  }


  /**
   * 循环更新操作列表
   */
loopGetOperaList (){
  this.OperaTimer = setInterval(() => {
      this.getOperaList();
    }, 5000)
}


  //获取系统事件列表
  getErroList = () => {
    let self = this;
    GetErrorTargerList({
      "id": self.state.currentId,
      "pageIndex": 1,
      "pageSize": 10
    }, function (res) {
      if (res.data.status !== 0) {
        let pageNumber = Math.ceil(res.data.total / 10);
        self.setState({
          errorArray: res.data.data,
          page2: pageNumber,
          showLoading: false
        })
      } else {
        Message.create({content: res.data.error_message, color: 'danger', duration: null});
      }
    })
  }





  //获取人员操作列表
  getOperaList = () => {
    let self = this;
    GetPerOperaList({
      "offer": 'app-manage',
      "offer_id": self.props.id,
      "pageIndex": 1,
      "limit": 10,
      "stime": '1483200000'//时间戳2017年一月一号零分零秒
    }, function (res) {
      if (res.data.status !== 0) {
        let pageNumber = Math.ceil(res.data.total / 10);
        self.setState({
          operaArray: res.data.data,
          page1: pageNumber,
          showLoading:false
        })
      } else {
        Message.create({content: res.data.error_message, color: 'danger', duration: null});
      }

    })
  }

  /**
   * 获取事件列表
   * @param e
   */
  handleSelect2 = (eventKey) => {
    const self = this;
    this.setState({
      activePage: eventKey
    });
    GetErrorTargerList({
      "id": self.state.currentId,
      "pageIndex": eventKey,
      "pageSize": 10,
    }, function (res) {
      if (res.data.status !== 0) {
        let pageNumber = Math.ceil(res.data.total / 10);
        self.setState({
          errorArray: res.data.data,
          page2: pageNumber,
          showLoading:false
        })
      } else {
        Message.create({content: res.data.error_message, color: 'danger', duration: null});
      }
    });
  }

  /**
   * 获取人员操作列表
   * @param e
   */
  handleSelect1 = (eventKey) => {
    const self = this;
    this.setState({
      activePage: eventKey
    });
    GetPerOperaList({//stime和etime暂不填，默认今天一天
      "offer": 'app-manage',
      "offer_id": this.props.id,
      "pageIndex": eventKey,
      "limit": 10,
      "stime": '1483200000'
    }, function (res) {
      if (res.data.status !== 0) {
        let pageNumber = Math.ceil(res.data.total / 10);
        self.setState({
          operaArray: res.data.data,
          page1: pageNumber,
          showLoading: false
        })
      } else {
        Message.create({content: res.data.error_message, color: 'danger', duration: null});
      }
    })
  }

  render() {

    return (
        <div className="event-list">
          <Tabs
            defaultActiveKey="1"
            onChange={() => {}}
            destroyInactiveTabPane
            renderTabBar={()=><ScrollableInkTabBar />}
            renderTabContent={()=><TabContent />}
            >
            <TabPanel tab="系统事件" key="1">
                <LoadingTable
                  className="sys-table"
                  showLoading={ this.state.showLoading }
                  data={ this.state.errorArray }
                  columns={ this.colum2 }/>
              {
                this.state.page2 > 1 ? (
                  <Pagination
                    className="info-pagination"
                    first
                    last
                    prev
                    next
                    items={this.state.page2}
                    maxButtons={5}
                    activePage={this.state.activePage}
                    onSelect={this.handleSelect2}/>
                ) : ''
              }
            </TabPanel>

            <TabPanel tab="人员操作" key="2">

              <LoadingTable
                  className="personnel-table"
                  showLoading={ this.state.showLoading }
                  data={ this.state.operaArray }
                  columns={ this.colum1 }/>
              {
                this.state.page1 > 1 ? (
                  <Pagination
                    className="info-pagination"
                    first
                    last
                    prev
                    next
                    items={this.state.page1}
                    maxButtons={5}
                    activePage={this.state.activePage}
                    onSelect={this.handleSelect1}/>
                ) : ''
              }
            </TabPanel>

          </Tabs>

        </div>

    )
  }
}


export default EventRecord;
