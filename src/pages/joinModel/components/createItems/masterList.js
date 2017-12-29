import React, {Component, PropTypes} from 'react';
import {
  Icon,
  Row,
  Col,
  Button,
  Table,
  FormControl,
  FormGroup,
  Label,
  Select,
  Popconfirm
} from 'tinper-bee';

import Checkbox from 'rc-checkbox';

import {success, err,warn} from 'components/message-util';


import {
  validStrByReg
} from 'components/util';


import {
  GetTableList,
  GetColumnList
 } from 'serves/importModalManager';


class MasterList extends Component {

  constructor(props) {
    super(props);
    //是否点击数据库
    this.dataBaseSourceFin = false;
    this.tableFin = false;
    this.state = {
      masterList: ["请选择"],
      currentDBName: "",
      currentDBNameId: "",
      columnList: []
    }
  }

  componentDidMount() {
    if(this.props.currentDBNameId && this.props.currentDBName) {
      this.onGetTableList();
    }
  }

  componentWillReceiveProps (nextProps,nextState) {
   //如果数据库的没有或者改变时则清空现有的表字段
    if(!nextProps.currentDBName || nextProps.currentDBName!==this.props.currentDBName) {
      this.setState({columnList:[]});
    }
    if(nextProps.currentDBName && nextProps.currentDBNameId && (nextProps.currentDBNameId != this.state.currentDBNameId || nextProps.currentDBName != this.state.currentDBName)) {

      this.onGetTableList(nextProps.currentDBNameId,nextProps.currentDBName);
      this.setState({currentDBName:nextProps.currentDBName,currentDBNameId:nextProps.currentDBNameId});
    }
    //修改时columnList第一次从父节点获取
    if(nextProps.editKey && this.state.columnList.length == 0 && nextProps.masterTable && nextProps.masterTable.singles.length > 0 ) {
      let masterTargetColumns =[];
      nextProps.masterTable.singles.forEach((item, index) => {
        //如果item下的alias字段没有取targetColumn字段；
        if(!item.alias){
          item.alias = item.targetColumn;
        }
        masterTargetColumns.push(item.targetColumn);
      })

      let param = {
        sourceId:  nextProps.currentDBNameId,
        dbName: nextProps.currentDBName
      }
      let self = this;
      GetTableList(param, function (response) {
        let res = response;
        let tables = res.data.detailMsg.data.tables;

        self.props.onInputChangeByArray([{value:masterTargetColumns,name:"masterTargetColumns"},{value:tables,name:"tbNameList"}]);

      })
      this.setState({columnList:nextProps.masterTable.singles});
    }
  }

   //添加一行空字段映射
  onAddNext = () => {
    let { columnList } = this.state;
    let list = {
      deletionFlag: false,
      add: true,
      deltaFlag: false,
      isPk: false,
      alias: "",
      isSingle: false,
      targetColumn: "",
      htableColumn: "",
      indexField: "",
      analyzer: "not_analyzed"
    }
    columnList.push(list);
    this.setState({columnList:columnList});
    //this.props.onInputChangeByName(columnList,"columnList");
  }

  onGetTableList = (sourceId,dbName) => {

    let self = this;
    let param = {
      sourceId:  sourceId || this.props.currentDBNameId,
      dbName: dbName || this.props.currentDBName
    }

    console.log(this.props.currentDBName);

    GetTableList(param, function (response) {
      let res = response;
      let tables = res.data.detailMsg.data.tables;

      self.setState({masterList: tables,showLoading: false});
      self.props.onInputChangeByName(tables,"tbNameList");
      //数据库已经加载完了
      self.tableFin = true;
    })
  }

   //选择表
  OnChooseTable = (e) => {
    let masterObj = JSON.parse(sessionStorage.getItem("master"));

    if(!masterObj) {
      masterObj = {};
    }

    masterObj.tableName = e;
    masterObj.alias = e;
    sessionStorage.setItem("master",JSON.stringify(masterObj));

    //剔除已经选中的主表名
    // let temp = [];
    // this.state.masterList.map(function(item) {
    //   temp.push(item);
    // })
    // let spliceValue = this.removeByValue(temp,e);
    // this.props.onInputChangeByName(spliceValue,"tbNameList");
    this.props.onInputChangeByName(e,"currentTbName");
    //默认别名为表名
    // if(!this.props.main_alias){
    this.props.onInputChangeByName(e,"main_alias");

    // }
    this.onGetColumnList(e);
  }

  //存储已经修改的从表到sessionStorage
  storeColumnList = (data) => {
    let masterObj = JSON.parse(sessionStorage.getItem("master"));
    if(!masterObj) {
      masterObj = {};
    }
    masterObj.singles = data || [];
    let targetColumns=[];
    data.forEach((item, index) => {

      targetColumns.push(item.targetColumn);
    })
    this.props.onInputChangeByName(targetColumns,"masterTargetColumns");
    sessionStorage.setItem("master",JSON.stringify(masterObj));
  }

  removeByValue = (data,val) => {
    for(var i=0; i<data.length; i++) {
      if(data[i] == val) {
        data.splice(i, 1);
        return data;
      }
    }
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
      let targetColumns = [];
      let aliasColumns = [];
      columnList.forEach((item, index) => {
        //item.alias = '';
        if(!item.alias){
          item.alias = item.targetColumn;
        }
        //item.key = index;
        targetColumns.push(item.targetColumn);
        aliasColumns.push(item.alias);
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

      self.storeColumnList(columnList);
      self.storeTargetColumn(targetColumns);
      self.props.onInputChangeByArray([{name:"mark",value:mark},{name:"masterTargetColumns",value:targetColumns},{name:"aliasColumns",value:aliasColumns}]);
      self.setState({showLoading: false,columnList:columnList});

    })
  }

  storeTargetColumn = (data) => {
    let masterTargetColumns = JSON.parse(sessionStorage.getItem("masterTargetColumns"));
    if(!masterTargetColumns) {
      masterTargetColumns = {}
    }
    masterTargetColumns = data;
    sessionStorage.setItem("masterTargetColumns",JSON.stringify(masterTargetColumns));
  }

  togglePk = (index, record) => {
    let self = this;
    return () => {
      //let columnList = this.clearPk();
      let columnList = self.state.columnList;

      columnList[index].isPk = !record.isPk;
      self.storeColumnList(columnList);
      self.setState({columnList:columnList});
      self.props.onInputChangeByName(columnList,"columnList");
    }

  }

  editIndexField = (e, index, record) => {
    let self = this;
    let value = e.target.value;
    if (value!=="" && !validStrByReg('/^[a-zA-Z0-9_]+$/', value)) {
      warn("只能输入字母或者下划线");
    }else {
      this.state.columnList[index].indexField = value;
      this.storeColumnList(this.state.columnList);
      this.setState({columnList:this.state.columnList});
      self.props.onInputChangeByName(self.props.columnList , "columnList");
    }

  }
  editDeltaIdentifier = (record, index) => {
      let self = this;
      return function () {

        self.state.columnList[index].deltaFlag = !record.deltaFlag;
        self.storeColumnList(self.state.columnList);
        self.setState({columnList:self.state.columnList});
        self.props.onInputChangeByName(self.state.columnList,"columnList");
      }
  }

  editDeletionFlag = (record, index) => {
    let self = this;
    return function () {

      self.state.columnList[index].deletionFlag = !record.deletionFlag;
      self.storeColumnList(self.state.columnList);
      self.setState({columnList:self.state.columnList});
      self.props.onInputChangeByName(self.state.columnList,"columnList");
    }
  }

  onChangehtableColumn = (e, index, record) => {
    let value = e.target.value;
    let self = this;
    if (value!=="" && !validStrByReg('/^[a-zA-Z0-9_]+$/', value)) {
      warn("只能输入字母或者下划线");
    }else {
      this.state.columnList[index].htableColumn = value;
      self.storeColumnList(this.state.columnList);
      this.setState({columnList:this.state.columnList});
      self.props.onInputChangeByName(self.props.columnList , "columnList");
    }
  }

  onChangeMarkColumn = (e,text,index, record) => {
    let value = e.target.value;
    if (value!=="" && !validStrByReg('/^[a-zA-Z0-9_]+$/', value)) {
      warn("只能输入字母或者下划线");
    }else {
      this.state.columnList[index].alias = value;
      let aliasColumns = this.props.aliasColumns || [];
      //如果没有值则放到数组中，有值则直接改变
      if(aliasColumns.length <index){
        aliasColumns.push(value);
      }else {
        aliasColumns[index] = value;
      }

      this.props.onInputChangeByName(aliasColumns , "aliasColumns");
      this.storeColumnList(this.state.columnList);
      this.setState({columnList:this.state.columnList});
      this.props.onInputChangeByName(this.state.columnList , "columnList");
    }
  }

  onChangeColumn = (e, index, record,name) => {
      let  { columnList } = this.state;
      columnList[index][name] = e;
      this.storeColumnList(columnList);
      this.setState({columnList:columnList});
      this.props.onInputChangeByName(columnList,"columnList");
  }



  /**
   * 删除表时筛选选项
   * @param target
   */
  deleteTargetColumn = (target) => {
    let { copyList } = this.props;
    if(copyList) {
      copyList.forEach((item) => {
        let copyColumn = item.copyColumn;
        if(copyColumn.indexOf(target) > -1){
          let index = copyColumn.indexOf(target);
          copyColumn.splice(index, 1);
        }
        item.copyColumn = copyColumn;
      })
      this.props.onInputChangeByName(copyList,"copyList");
    }

  }


  //删除一行字段映射
  onDeleteAttr = (index) => {
    let self = this;

    return function () {
      //获取所有表关系，判断关系中是否有这个表字段如果有，则不允许删除
      let relation = [];
      let from = JSON.parse(sessionStorage.getItem("from")) || [];
      let isexit = false;
      let columnList = self.state.columnList;
      from.forEach((item)=>{
        relation = item.relation && item.relation.joinCondition;
        for(let i=0;i<relation.length;i++){
          if(relation[i].masterKey == columnList[index].targetColumn){
            warn(`请先删除主表字段${relation[i].masterKey}对应的表关系再删除该行数据`);
            isexit = true;
            return
          }
          if(isexit){
            return
          }
        }
      })
      if(!isexit){

        self.deleteTargetColumn(columnList[index].targetColumn);
        columnList.splice(index, 1);
        let aliasColumns = self.props.aliasColumns || [];
        aliasColumns.splice(index,1);

        self.storeColumnList(columnList);
        self.setState({columnList:columnList});
        self.props.onInputChangeByName(columnList,"columnList");
        self.props.onInputChangeByName(aliasColumns,"aliasColumns");
      }

    }
  }

  onChangeTargeColumn = (e, index, record) => {
    let  { columnList } = this.state;
    columnList[index].targetColumn = e;
    this.storeColumnList(columnList);
    this.setState({columnList:columnList});
    this.props.onInputChangeByName(columnList,"columnList");
  }

  onAddTargetColumn = (e, index, record) => {
    let self = this;
    let value = e.target.value;

    this.state.columnList[index].targetColumn = value;
    this.storeColumnList(this.state.columnList);
    this.setState({columnList:this.state.columnList});
    self.props.onInputChangeByName(this.props.columnList,"columnList");
  }

  onChangeAlias = (value) => {
    let masterObj = JSON.parse(sessionStorage.getItem("master"));
    if(!masterObj) {
      masterObj = {};
    }
    masterObj.alias = value;
    sessionStorage.setItem("master",JSON.stringify(masterObj));
    this.props.onInputChangeByName(value,"main_alias");
  }

  static contextTypes = {
    router: PropTypes.object
  };

  render() {

    let self = this;
    let{mark,main_alias,editKey,masterTable,currentDBName,currentTbName,onInputChangeByName,onInputChangeByArray} = this.props;
    currentTbName = currentTbName || "请选择"
    let {columnList} = this.state;
    let masterList = this.state.masterList;
    let masterListOptions = masterList.map(item => <Option key={item} value={item}>{item}</Option>);

    let TargetColumnList = columnList;
    const TargetColumnOptions = TargetColumnList.map(
      TargetColumnList =>
        <Option
          key={TargetColumnList.targetColumn}
          value={TargetColumnList.targetColumn}>{TargetColumnList.targetColumn}
          </Option>
    );

    let masterTableName;
    if(editKey) {
      masterTableName =  <FormGroup>
                          <Label>主表:</Label>
                          <Label>{masterTable && masterTable.tableName}</Label>
                        </FormGroup>
    }else{
      masterTableName =  <FormGroup>
                          <Label>主表<Icon type="uf-mi" className="red" />:</Label>
                          <Select value={currentTbName}
                                  onChange={this.OnChooseTable}>
                            {masterListOptions}
                          </Select>
                        </FormGroup>
    }
    const columns = [
      {
        title: '主键', dataIndex: 'isPk', key: 'isPk', render(text, record, index) {
        return <Checkbox checked={text} onChange={self.togglePk(index, record)}/>;
        // return <input type="checkbox"  defaultChecked={text} onChange={self.togglePk(index,record)} />
      }
      }, {
        title: '索引字段', dataIndex: 'indexField', key: 'indexField', render(text, record, index) {
          return <input className="u-form-control md" value={text} type="text" onChange={(e) => {
            self.editIndexField(e, index, record)
          }}/>
        }
      }, {
        title: '模型字段', dataIndex: 'htableColumn', key: 'htableColumn', render(text, record, index) {
          return <span indexFlag={index}><input className="u-form-control md" value={text} type="text"
                                                onChange={(e) => {
                                                  self.onChangehtableColumn(e, index, record)
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
            dom = <Select value={text} onChange={(e) => {
               self.onChangeTargeColumn(e, index, record)
            }}>
              {TargetColumnOptions}
            </Select>;
          }

          return dom;
        }
      },
      {
        title: '分词类型', dataIndex: 'analyzer', key: 'analyzer', render(text, record, index) {

        return (
          <Select
            value={text}
            onChange={(e) => {
              self.onChangeColumn(e, index, record,"analyzer")
            }}>
            <Option value="not_analyzed">不分词</Option>
            <Option value="ngram">模糊分词</Option>
            <Option value="pinyin">拼音分词</Option>
            <Option value="ik_max_word">ik分词</Option>
            <Option value="edgeNgram">前缀分词</Option>
          </Select>
        )
      }
      }, {
        title: '增量标识', dataIndex: 'deltaFlag', key: 'deltaFlag', render(text, record, index) {

          return <Checkbox checked={text} onChange={self.editDeltaIdentifier(record, index)}/>;

        }
      }, {
        title: '删除标识', dataIndex: 'deletionFlag', key: 'deletionFlag', render(text, record, index) {

          return <Checkbox checked={text} onChange={self.editDeletionFlag(record, index)}/>;

        }
      }, {
        title: '字段别名', dataIndex: 'alias', key: 'alias', render(text, record, index) {


          return <input className="u-form-control md" value={text} type="text"
                        onChange={(e) => {
              self.onChangeMarkColumn(e,text,index, record)
            }}/>
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
    return(
      <Col md={12}>
        {masterTableName}
          <FormGroup>
              <Label>主表别名<Icon type="uf-mi" className="red" />:</Label>
              <FormControl
                name="main_alias"
                placeholder="请输入主表别名"
                value ={main_alias}
                onChange = {(e) => {
                  this.onChangeAlias(e.target.value)
              }}
              />
            </FormGroup>
          <div className="source-table">

            {!mark &&
            <Table
              ref="table"
              columns={columns}
              data= {columnList}
              footer={() =>
                <Button onClick={this.onAddNext}>
                添加一行
                </Button>
              }
            />
            }
          </div>

      </Col>
    );

  }
}


export default MasterList;
