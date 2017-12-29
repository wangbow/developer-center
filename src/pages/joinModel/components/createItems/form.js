import React, {Component, PropTypes} from 'react';
import {
  Icon,
  Row,
  Col,
  Button,
  Table,
  FormControl,
  InputGroup,
  Form,
  FormGroup,
  Label,
  Select,
  Popconfirm
} from 'tinper-bee';
import {warn, err} from 'components/message-util';
import Checkbox from 'rc-checkbox';

import {
  validStrByReg
} from 'components/util';


import {

  GetDBSourceList,
  GetTableList,
  GetColumnList,
  GetDataBaseSourceList
 } from 'serves/importModalManager';

class FormItem extends Component {

  constructor(props) {
    super(props);
    //是否点击数据库
    this.dataBaseSourceFin = false;
    this.tableFin = false;
    this.state = {
      DatabaseSourceList: ["请选择"],
      tables: ["请选择"],
      DBsourceList: [{dbName: "请选择"}],
      showLoading: false
    }
  }

  componentDidMount() {
    this.onSearchDBSource();
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
      self.props.onInputChangeByName(res.data.detailMsg.data.content[0].id,"currentDBNameId");

    })
  }


  //选择数据库
  OnChooseSource = (id) => {
    let value = this.filterDBSourceName(id);
    this.props.onInputChangeByName(value,"currentDBSourceName");
    this.props.onInputChangeByName(id,"currentDBNameId");
    //数据源改变后对应的数据库，表信息做清空

    this.onSearchDataBaseSource(id);

  }

  filterDBSourceName = (id) => {
    let DBsourceList = this.state.DBsourceList;
    let dbName;
    DBsourceList.map(function(item) {
      if(item.id == id) {
        dbName = item.dbName;
      }
    })
    return dbName;
  }

   //点击选择数据库

  onDatabaseSourceFocus = () => {
    console.log("点数据源了");
    if(!this.props.currentDBNameId){
      warn('请先选择数据源');
      return false;
    }
    //如果没有数据的话显示loading
    if(!this.dataBaseSourceFin) {
      this.setState({showLoading:true});
    }
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
        warn(res.data && res.data.message);
      }
      //数据库已经加载完了
      self.dataBaseSourceFin = true;

    })
  }


   //选择数据库
  OnChooseDataBaseSource = (value) => {
    // this.setState({currentDBName: value});
    this.props.onInputChangeByName(value,"currentDBName");
    //this.onGetTableList(this.props.currentDBNameId, value);
  }

  onGetTableList = (dbNameId, dbName) => {

    let self = this;
    let DBsourceList = this.state.DBsourceList;

    let param = {
      sourceId: dbNameId || this.props.currentDBNameId,
      dbName: dbName || this.props.currentDBName
    }

    GetTableList(param, function (response) {
      let res = response;
      let tables = res.data.detailMsg.data.tables;

      self.setState({tables: tables,showLoading: false});
      //数据库已经加载完了
      self.tableFin = true;
    })
  }


   //选择表
  OnChooseTable = (e) => {
    this.props.onInputChangeByName(e,"currentTbName");
    // this.setState({currentTbName: e});
    this.onGetColumnList(e);
  }

  onGetColumnList = (currentTbName) => {
    let self = this;

    let tbName = currentTbName || this.props.currentTbName;
    let currentDBNameId = this.props.currentDBNameId;
    let dbName = this.props.currentDBName;
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


      self.props.onInputChangeByArray([{name:"columnList",value:columnList},
                                      {name:"mark",value:mark}]);
      self.setState({showLoading: false});

    })
  }



  //点击表

  onTableFocus = () => {
    //如果没有数据的话显示loading
    if(!this.props.currentDBName){
      warn('请先选择数据库');
      return false;
    }
    if(!this.tableFin) {
      this.setState({showLoading:true});
    }
  }


  /**
   * 填写自定义别名
   */

  changeAlias = (e) => {
    if(e.target.value!==this.state.alias) {

      if (e.target.value!=="" && !validStrByReg('/^[a-z_]+$/', e.target.value)) {
        warn("只能输入小写字母或者下划线");
      } else {
        this.props.onInputChange(e);
      }
    }

  }

  static contextTypes = {
    router: PropTypes.object
  };

  render() {

    let DBsourceList = this.state.DBsourceList;
    const DBSourceNameOptions = DBsourceList.map(DBsourceList => <Option key={DBsourceList.id}

                                                                    value={DBsourceList.id}>
                                                                         {DBsourceList.dbName}
                                                                  </Option>);


    const timeList = ['5', '10', '15'];
    const timesOptions = timeList.map(time => <Option key={time}>{time}</Option>);


    let {currentDBName} = this.props;
    currentDBName = currentDBName||"请选择";
    let DatabaseSourceList = this.state.DatabaseSourceList;
    let DataBaseSourceOptions = DatabaseSourceList.map(item => <Option key={item} value={item}>{item}</Option>);
    let {editKey,table,schema,source,onInputChange,isSync,synTime,filterCondition,alias,onInputChangeByName,onInputChangeByArray} = this.props;
    let preformItems;
    //key不为空说明是修改
    if(editKey) {
      preformItems = <div>
                      <FormGroup>
                        <Label>数据源名 :</Label>
                        <Label>{source && source.sourceName}</Label>
                      </FormGroup>
                      <FormGroup>
                        <Label>数据库名:</Label>
                        <Label>{schema && schema.schemaName}</Label>
                      </FormGroup>

                    </div>
    }else{
      preformItems =  <div>
                        <FormGroup>
                          <Label>数据源名<Icon type="uf-mi" className="red" />:</Label>
                          <Select defaultValue={this.state.DBsourceList[0].dbName}
                                  onChange={(e) => {
                                    this.OnChooseSource(e)
                                  }}
                                  name={"currentDBSourceName"}>
                            {DBSourceNameOptions}
                          </Select>
                        </FormGroup>
                        <FormGroup>
                          <Label>数据库名<Icon type="uf-mi" className="red" />:</Label>
                          <Select value={currentDBName}
                                  onChange={this.OnChooseDataBaseSource}
                                  onFocus={this.onDatabaseSourceFocus}
                                  name={"currentDBName"}>
                            {DataBaseSourceOptions}
                          </Select>
                        </FormGroup>
                      </div>
    }
    return(
      <Col md={12}>
         <Form horizontal>
           {preformItems}

            <FormGroup>
              <Label>过滤条件:</Label>
              <FormControl
                type="text"
                name="filterCondition"
                value={filterCondition}
                placeholder="自定义sql过滤条件"
                onChange={onInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>数据自动同步:</Label>
              <Checkbox name="isSync" checked={isSync} onChange={this.props.onInputChange}/>
            </FormGroup>
            <FormGroup>
              <Label>数据同步周期:</Label>
              <Select value={synTime}
                      onChange={(e)=>onInputChangeByName(e,"synTime")}
                      name="synTime">
                {timesOptions}
              </Select> 分钟
            </FormGroup>
            <FormGroup>
              <Label>自定义索引别名<Icon type="uf-mi" className="red" />:</Label>
              <FormControl
                value={alias}
                onChange={this.changeAlias}
                name="alias"
                placeholder="只可输入小写字母或下划线"
              />
            </FormGroup>
          </Form>
      </Col>
    );

  }
}
export default FormItem;
