import React, {Component, PropTypes} from "react";
import {Link} from 'react-router';
import {
  Row,
  Col,
  Button,
  Table,
  FormControl,
  InputGroup,
  Form,
  FormGroup,
  Label,
  Message,
  Select,
  Radio,
  Alert,
  Icon,
  Popconfirm 
} from 'tinper-bee';
import {
  GetAddImportSource,
  GetTableList,
  GetColumnList,
  SaveColumn,
  SaveDBSource,
  DeleteColumn,
  UpdateColumn,
  GetDBSourceList,
  GetDataBaseSourceList
} from './server';
import Checkbox from 'rc-checkbox';
import Title from 'components/Title';
import { warn,err } from 'components/message-util';
import PageLoading from 'components/loading';
import {
  validStrByReg
} from 'components/util';

import "./index.css";


class HDFSAddModal extends Component {
  constructor(props) {
    super(props);
    //是否点击数据库
    this.dataBaseSourceFin = false;
    this.tableFin = false;
    this.state = {
      dataSourceList: [],
      sourceList: [],
      DatabaseSourceList: ["请选择"],
      tables: ["请选择"],
      DBsourceList: [{dbName: "请选择"}],
      columnList: [],
      deltaIdentifier: false,
      deletionFlag: false,
      filterCondition: "",
      isSync: false,
      synTime: 10,
      dateLine:"1",
      editObj: {},
      alias: '',
      copyList: [], //复制字段列表
      showLoading: false
    }
  }

  componentDidMount() {
    // let DBsourceList = JSON.parse(sessionStorage.getItem("ModalList"));

    // this.setState({currentDBName:DBsourceList[0].dbName,currentDBNameId:DBsourceList[0].sourceId});
    this.onSearchDBSource();
    //this.onGetTableList();
  }

  onSearchDBSource = () => {
    //if(value == "") return;
    let param = {
      number: "", //当前页码
      size: "", //每页显示行数
      dbName: "",  //数据库名称
    };
    let self = this;

    GetDBSourceList(param, function (response) {
      let res = response;
      let content = res.data.detailMsg.data.content;
      if (content.length <= 0) return;
      self.setState({
        DBsourceList: res.data.detailMsg.data.content,
        currentDBNameId: res.data.detailMsg.data.content[0].id
      });

    })
  }

  onSearchDataBaseSource = (id) => {
    //if(value == "") return;
    let param = {
      id: id, //当前页码

    };
    let self = this;

    GetDataBaseSourceList(param, function (response) {
      let res = response;
      if (res.data.success == "success") {
        self.setState({
          DatabaseSourceList: res.data.detailMsg.data,
          showLoading: false
        });
      } else {
        self.setState({
          showLoading: false
        });
        Message.create({content: res.data && res.data.message, color: 'warning', duration: 4.5});
      }
      //数据库已经加载完了
      self.dataBaseSourceFin = true;

    })
  }


  onGetTableList = (dbNameId, dbName) => {

    let self = this;
    let DBsourceList = this.state.DBsourceList;

    let param = {
      sourceId: dbNameId || this.state.currentDBNameId,
      dbName: dbName || this.state.currentDBName
    }

    GetTableList(param, function (response) {
      let res = response;
      let tables = res.data.detailMsg.data.tables;
      
      self.setState({tables: tables,showLoading: false});
      //数据库已经加载完了
      self.tableFin = true;
    })
  }

  onGetColumnList = (currentTbName) => {
    let self = this;

    let tbName = currentTbName || this.state.currentTbName;
    let currentDBNameId = this.state.currentDBNameId;
    let dbName = this.state.currentDBName;
    let param = {
      tbName: tbName,
      sourceId: currentDBNameId,
      dbName: dbName
    }

    this.setState({
      showLoading: true
    })
    GetColumnList(param, function (response) {
      let res = response;

      let columnList = res.data.detailMsg.data && res.data.detailMsg.data.columns;
      //let isSync = false;

      //let synTime = res.data.detailMsg.data && res.data.detailMsg.data.crontab;
      //let filterCondition = res.data.detailMsg.data && res.data.detailMsg.data.filterCondition;
      let mark = res.data.detailMsg.data && res.data.detailMsg.data.mark;

      columnList.forEach((item, index) => {
        item.remark = '';
        item.key = index;
        if (!mark) {
          item.htableColumn = item.targetColumn;
          item.indexField = item.targetColumn;
          if (!item.deltaFlag) {
            item.deltaFlag = false
          }
          if (!item.deletionFlag) {
            item.deletionFlag = false
          }
        }
      })


      self.setState({mark: mark, columnList: columnList, showLoading: false});
    })
  }
  //添加数据源
  onAddSource = () => {
    let self = this;
    GetAddImportSource(param, function (response) {
      let res = response;
      if (res.data.success = "success") {
        Message.create({content: data.message || "保存成功", color: 'success', duration: 4.5});
      }
    })
  }
  //选择数据库
  OnChooseSource = (value) => {
    this.setState({currentDBNameId: value});

    this.onSearchDataBaseSource(value);
  }

  //点击选择数据库
  
  onDatabaseSourceFocus = () => {
    console.log("点数据源了");
    if(!this.state.currentDBNameId){
      err('请先选择数据源');
      return false;
    }
    //如果没有数据的话显示loading
    if(!this.dataBaseSourceFin) {
      this.setState({showLoading:true});
    }
  }

  //点击表

  onTableFocus = () => {
    console.log("点表了");
    //如果没有数据的话显示loading
    if(!this.state.currentDBName){
      err('请先选择数据库');
      return false;
    }
    if(!this.tableFin) {
      this.setState({showLoading:true});
    }
  }
 

  //选择数据库
  OnChooseDataBaseSource = (value) => {
    this.setState({currentDBName: value});
    this.onGetTableList(this.state.currentDBNameId, value);
  }

  //选择表
  OnChooseTable = (e) => {
    this.setState({currentTbName: e});
    this.onGetColumnList(e);
  }

  //选择同步周期
  OnChooseSynTime = (e) => {
    let value = e;
    if (e.length>0){
      value = e[e.length - 1];
    }else {
      //数组小于0时默认为空字符串
      e = "";
    }
    
    this.setState({synTime: value});
  }

  OnDateLine = (e) => {
    this.setState({dateLine: e.target.value});
  }

  //是否选中同步checkbox
  OnChangeSyn = () => {
    this.setState({isSync: !this.state.isSync});
  }

  //添加一行空字段映射
  onAddNext = () => {
    let { columnList } = this.state;
    let list = {
      deletionFlag: false,
      add: true,
      deltaFlag: false,
      isPk: false,
      remark: "",
      isSingle: false,
      targetColumn: "",
      htableColumn: "",
      indexField: "",
      analyzer: "not_analyzed",
    }
    columnList.push(list);

    this.setState({
      columnList
    });
  }

  clearAddFlag = () => {
    let columnList = this.state.columnList;
    columnList.map(function (item, index) {
      if (item.add == true) {
        delete item.add;
      }
      delete item.key;
    })

    return columnList;
  }
  //保存数据库的表字段
  onSaveDBSource = () => {
    this.onUpdateColumns();

    let schemaName = this.state.currentDBName;
    let id = this.state.currentDBNameId;
    let tbName = this.state.currentTbName;
    let sourceId = this.state.currentDBNameId;
    let filterCondition = ReactDOM.findDOMNode(this.refs.filterCondition).value;
    let isSync = this.state.isSync;
    let synTime = this.state.synTime;
    let dateLine = this.state.dateLine;
    let { copyList } = this.state;

    if (!sourceId) {
      Message.create({content: "数据源必选", color: 'warning', duration: 2});
      return;
    }

    if (!tbName) {
      Message.create({content: "表必选", color: 'warning', duration: 2});
      return;
    }
    if (this.state.alias!=="" && !validStrByReg('/^[a-z_]+$/',this.state.alias)) {
     err("只能输入小写字母或者下划线");
     return;
    }

    //如果自动同步勾选上，同步周期必须输入
    if (filterCondition) {
      if(!synTime) {
        warn("请选择数据同步周期");
        return;
      }
    }

    let columnList = this.clearAddFlag();
    
   

    let deltaFlagNum = 0, deltaFlagName=""; 

    columnList.forEach((item) => {
        if(item.deltaFlag) {
          deltaFlagNum = deltaFlagNum +1;
          deltaFlagName = item.targetColumn;
        }
    })
    if(deltaFlagNum > 1) {
      warn(`只能一个增量标识`);
      return;
    }

    if(deltaFlagNum == 0) {
      warn(`请选择一个增量标识`);
      return;
    }

    
    let param = {
      "singles": columnList,
      "dateLine":dateLine,
      "deltaFlag":deltaFlagName,
      "filterSynch": {
        "isSync": isSync,
        "filterCondition": filterCondition || "",
        "crontab": synTime
      },
      "table": {
        "tbName": tbName,
        "sourceId": sourceId
      },
      "schema": {
        "schemaName": schemaName
      },
      "isSingle": false
    }
    let self = this;
    this.setState({
      showLoading: true
    });
    SaveDBSource(param, function (response) {
      let res = response;
      if (res.data.success == "success") {
        self.setState({
          showLoading: false
        });
        Message.create({content: "保存成功", color: 'success', duration: 2});

        //self.setState({editObj:{}});
        self.context.router.push('/HDFS');

      } else {
        self.setState({
          showLoading: false
        });
        Message.create({content: res.data.message || "保存失败", color: 'warning', duration: 2});
      }
    })
  }

  //保存新添加的一列字段映射
  onAddColumn = (e) => {
    let len = this.state.columnList.length;
    let targetColumn = this.state.targetColumn;
    let sourceColumn = this.state.sourceColumn;
    let indexColumn = this.state.indexColumn;
    let deltaIdentifier = this.state.deltaIdentifier;
    let deletionFlag = this.state.deletionFlag;
    let isPk = false;
    let param = {
      "isPk": false,
      "targetColumn": targetColumn || "",
      "sourceColumn": sourceColumn || "",
      "indexColumn": indexColumn || "",
      "indexSegmentType": "indexSegmentType",
      "deltaIdentifier": deltaIdentifier,
      "deletionFlag": deletionFlag,
      "tbName": this.state.currentTbName,
      "dbName": this.state.currentDBName
    }

    SaveColumn(param, function (response) {
      let res = response;
      if (res.data.success == "success") {
        self.onGetColumnList();
      }
    })


  }

  onUpdateColumns = () => {
    let editArray = [];
    let param = {
      "entitys": []
    };
    if (JSON.stringify(this.state.editObj) == "{}") {
      return;
    }
    let editObj = this.state.editObj;

    for (var item in editObj) {
      param.entitys.push(editObj[item]);
    }

    UpdateColumn(param, function (response) {
      let res = response;
      if (res.success == "success") {
        Message.create({content: "保存成功", color: 'success', duration: 4.5});
      }
    })
  }
  //删除一行字段映射
  onDeleteAttr = (index) => {
    let self = this;

    return function () {

      let columnList = self.state.columnList;
      //self.deleteTargetColumn(columnList[index].targetColumn);
      columnList.splice(index, 1);
      self.setState({columnList: columnList});

    }

  }

  editHtableColumn = (e, index, record) => {
    let self = this;
    let value = e.target.value;

    this.state.columnList[index].htableColumn = value;
    self.setState({columnList: self.state.columnList});
  }

  //选择字段分词
  OnSplitType = (value, index, record) => {
    let self = this;

    self.state.columnList[index].analyzer = value;
    self.setState({columnList: self.state.columnList});
  }

  editIndexField = (e, index, record) => {
    let self = this;
    let value = e.target.value;
    this.state.columnList[index].indexField = value;
    self.setState({columnList: self.state.columnList});
    
    
  }


  editDeltaIdentifier = (record, index) => {
    let self = this;
    return function () {

      self.state.columnList[index].deltaFlag = !record.deltaFlag;
      self.setState({columnList: self.state.columnList});
    }
  }

  onChangeTargeColumn = (e, index, record) => {
    let  { columnList } = this.state;
    if(e.length>0){
      e = e[e.length - 1];
    }
    columnList[index].targetColumn = e+"";
    this.setState({
      columnList
    });
  }

  onAddTargetColumn = (e, index, record) => {
    let self = this;
    let value = e.target.value;

    this.state.columnList[index].targetColumn = value;
    self.setState({columnList: self.state.columnList});
  }


  editDeletionFlag = (record, index) => {
    let self = this;
    return function () {
      console.log(index)

      self.state.columnList[index].deletionFlag = !record.deletionFlag;
      self.setState({columnList: self.state.columnList});
    }
  }

  togglePk = (index, record) => {
    return () => {
      //let columnList = this.clearPk();
      let columnList = this.state.columnList;

      columnList[index].isPk = !record.isPk;
      this.setState({columnList: columnList});
    }

  }

  clearPk = () => {
    let columnList = this.state.columnList;
    columnList.map(function (item, index) {
      item.isPk = false;
    })
    return columnList;
  }

  editRemark = (index, record) => (e) => {
    let {columnList} = this.state;
    let value = e.target.value;
    columnList[index].remark = value;
    this.setState({
      columnList
    });
  }

  /**
   * 填写自定义别名
   */
  changeAlias = (e) => {
    if(e.target.value!==this.state.alias) {
      
      if (e.target.value!=="" && !validStrByReg('/^[a-z_]+$/', e.target.value)) {
        err("只能输入小写字母或者下划线");
      } else {
        this.setState({
        alias: e.target.value
        })
      }
    }
  
  }


  render() {
    const timeList = ['5', '10', '15','30','60'];
    const timesOptions = timeList.map(time => <Option key={time}>{time}</Option>);

    const provinceData = ['Zhejiang', 'Jiangsu'];
    const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
    let DBsourceList = this.state.DBsourceList;

    const DBSourceNameOptions = DBsourceList.map(DBsourceList => <Option key={DBsourceList.dbName}
                                                                         value={DBsourceList.id}>{DBsourceList.dbName}</Option>);

    let DatabaseSourceList = this.state.DatabaseSourceList;
    let DataBaseSourceOptions = DatabaseSourceList.map(item => <Option key={item} value={item}>{item}</Option>);

    let tables = this.state.tables || [];
    const tablesOptions = tables.map(tableName => <Option key={tableName}>{tableName}</Option>);
    const splitType = ['不分词', '模糊分词', '拼音分词', 'ik分词'];
    const splitOption = splitType.map(types => <Option key={types}>{types}</Option>);
    let self = this;
    let mark = this.state.mark;

    let TargetColumnList = this.state.columnList || [];

    const TargetColumnOptions = TargetColumnList.map(
      TargetColumnList =>
        <Option
          key={TargetColumnList.targetColumn}
          value={TargetColumnList.targetColumn}>{TargetColumnList.targetColumn}
          </Option>
    );

    const columns = [
      {
        title: '主键', dataIndex: 'isPk', key: 'isPk', render(text, record, index) {
        return <Checkbox checked={text} onChange={self.togglePk(index, record)}/>;
        // return <input type="checkbox"  defaultChecked={text} onChange={self.togglePk(index,record)} />
      }
      }, {
        title: '模型字段', dataIndex: 'htableColumn', key: 'htableColumn', render(text, record, index) {
          return <span indexFlag={index}><input className="u-form-control md" value={text} type="text"
                                                onChange={(e) => {
                                                  self.editHtableColumn(e, index, record)
                                                }}/></span>

        }
      }, {
        title: '表字段', dataIndex: 'targetColumn', key: 'targetColumn', render(text, record, index) {
          let dom;
          if (record.add == true) {
            dom = <input className="u-form-control md" type="text" onChange={(e) => {
              self.onAddTargetColumn(e, index, record)
            }}/>
          } else {
            dom = <Select tags value={text} onChange={(e) => {
              self.onChangeTargeColumn(e, index, record)
            }}>
              {TargetColumnOptions}
            </Select>;
          }

          return dom;
        }
      },
       {
        title: '增量标识', dataIndex: 'deltaFlag', key: 'deltaFlag', render(text, record, index) {
          // if(record.add) {
          //   return <Radio name="deltaFlag" defaultChecked={self.state.deltaIdentifier} onChange={self.setDeltaIdentifier}  />;
          // }else{
          //   return <Checkbox checked={!!text} onChange={self.editDeltaIdentifier(record,index)} />;
          // }
          return <Checkbox checked={text} onChange={self.editDeltaIdentifier(record, index)}/>;

        }
      }, {
        title: '删除标识', dataIndex: 'deletionFlag', key: 'deletionFlag', render(text, record, index) {
          // if(record.add) {
          //   return <Checkbox defaultChecked={self.state.deletionFlag} onChange={self.setDeletionFlag}  />;
          // }else {
          //   return <Checkbox defaultChecked={!!text} onChange={self.editDeletionFlag(record, index)}/>;
          // }

          return <Checkbox checked={text} onChange={self.editDeletionFlag(record, index)}/>;

        }
      }, {
        title: '操作', dataIndex: 'oper2', key: 'oper2', render(text, record, index) {
          let dom = ""
          if (!record.isPk) {
            dom = <Popconfirm content="确认删除?" placement="bottom"  onClose={self.onDeleteAttr(index, record)}>
                 <Button >删除</Button>

               </Popconfirm>
          }
          return dom;
        }
      }
    ];

    return (
      <Row className="add-source-manage hdfs">
        <Title name="新增HDFS数据关联"  path={"/HDFS"}/>
        <Col md={12}>
          <Form horizontal>
            <FormGroup>
              <Label>数据源名:</Label>
              <Select defaultValue={this.state.DBsourceList[0].dbName}
                      onChange={this.OnChooseSource}>
                {DBSourceNameOptions}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>数据库名:</Label>
              <Select defaultValue={this.state.DatabaseSourceList[0]}
                      onChange={this.OnChooseDataBaseSource} onFocus={this.onDatabaseSourceFocus}>
                {DataBaseSourceOptions}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>表名称:</Label>
              <Select defaultValue={this.state.tables[0]}
                      onChange={this.OnChooseTable} onFocus={this.onTableFocus}>
                {tablesOptions}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>过滤条件:</Label>
              <FormControl
                ref="filterCondition"
                type="text"
                defaultValue={this.state.filterCondition}
                placeholder="自定义sql过滤条件"
              />
            </FormGroup>
            <FormGroup>
              <Label>数据自动同步:</Label>
              <Checkbox ref="test" defaultChecked={this.state.isSync} onChange={this.OnChangeSyn}/>
            </FormGroup>
            <FormGroup>
              <Label>数据同步周期:</Label>
              <Select value= {this.state.synTime}
                      onChange= {this.OnChooseSynTime}
                      tags= {true}
                      >
                {timesOptions}
              </Select>&nbsp;&nbsp;天
            </FormGroup>
            <FormGroup>
              <Label>历史数据时间范围:</Label>
              <FormControl
                defaultValue={1}
                onChange={this.OnDateLine}
              />&nbsp;&nbsp;天
            </FormGroup>
          </Form>
          <h3>字段映射</h3>

          <div className="source-table">
            {mark && <h4>数据库为：{this.state.currentDBName} 表为：{this.state.currentTbName}字段映射关系都已新增</h4>}
            {!mark &&
            <Table
              ref="table"
              columns={columns}
              data={this.state.columnList}
              footer={() =>
                <Button onClick={this.onAddNext}>
                添加一行
                </Button>
              }
            />
            }
          </div>
          
          <div className="footer-buttons">
            {!mark && <Button colors="primary" style={{ marginBottom: 40 }} onClick={this.onSaveDBSource}>保存</Button>}
          </div>
        </Col>
        <PageLoading show={ this.state.showLoading } />

      </Row>)
  }
}


HDFSAddModal.contextTypes = {
  router: PropTypes.object
};

export default HDFSAddModal;
