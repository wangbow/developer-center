import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {
  Icon,
  Row,
  Col,
  Button,
  Table,
  FormControl,
  FormGroup,
  Label,
  Message,
  Select,
  Popconfirm
} from 'tinper-bee';

import Checkbox from 'rc-checkbox';

import {success, warn,err} from 'components/message-util';


import {
  validStrByReg
} from 'components/util';


import {
  GetColumnList
 } from 'serves/importModalManager';


class FromList extends Component {

  constructor(props) {
    super(props);
    //是否点击数据库
    this.dataBaseSourceFin = false;
    this.tableFin = false;
    this.state = {
      fromList: ["请选择"],
      currentDBName: "",
      currentDBNameId: "",
      defaultTbName: "",
      columnList: [],
      disAddRelationFlag:true,
      relationColumnList: [{
        linktype: "left join"
      }]
    }
  }

  componentWillReceiveProps (nextProps,nextState) {

    // if(nextProps.currentFromkey !== this.props.currentFromkey) {
      let from = JSON.parse(sessionStorage.getItem("from")) || [];
     if(from[this.props.currentFromkey]){
       let alias = from[this.props.currentFromkey].alias ;
       let relationColumnList = from[this.props.currentFromkey].relation && from[this.props.currentFromkey].relation.joinCondition ;
       let defaultTbName = from[this.props.currentFromkey].tableName;
       let currentFromkey = from[this.props.currentFromkey].currentFromkey;
       let linkType = (from[this.props.currentFromkey].relation && from[this.props.currentFromkey].relation.joinType) ;
       let columnList = from[this.props.currentFromkey].singles ;
       if(!relationColumnList){
         relationColumnList =  [{
           linktype: "left join"
         }];
       }
       this.setState({fromList:this.props.fromList,defaultTbName:defaultTbName,currentFromkey:currentFromkey,columnList:columnList,relationColumnList:relationColumnList,alias:alias,linkType:linkType});
     }else{
       this.state = {
         fromList: ["请选择"],
         currentDBName: "",
         currentDBNameId: "",
         defaultTbName: "",
         columnList: [],
         disAddRelationFlag:true,
         relationColumnList: [{
           linktype: "left join"
         }]
       }
     }


    // }
  }
  componentDidMount() {
      if(this.props.fromList) {
        let from = JSON.parse(sessionStorage.getItem("from"));
        if(!from) {
          from = {};
        }
        if(!from[this.props.currentFromkey]) {
          from[this.props.currentFromkey] = {};
        }
        let alias = from[this.props.currentFromkey].alias || this.state.alias;
        let relationColumnList = from[this.props.currentFromkey].relation && from[this.props.currentFromkey].relation.joinCondition || this.state.relationColumnList;
        let defaultTbName = from[this.props.currentFromkey].tableName || this.state.defaultTbName;
        let currentFromkey = from[this.props.currentFromkey].currentFromkey;
        let linkType = (from[this.props.currentFromkey].relation && from[this.props.currentFromkey].relation.joinType) || this.state.linkType;
        let columnList = from[this.props.currentFromkey].singles || this.state.columnList;

        //编辑，获取targtColumn
        if(this.props.editKey && !this.state.fromTargetColumns) {
          let fromTargetColumns= [];
          columnList.forEach((item, index) => {
            //item.alias = '';
            //item.key = index;
            if(!item.alias) {
              item.alias = item.targetColumn;
            }
            fromTargetColumns.push(item.targetColumn);
            if (!this.props.mark) {
              if(!item.htableColumn){
                item.htableColumn = item.targetColumn;
              }
              if(!item.indexField){
                item.indexField = item.targetColumn;
              }

              if (!item.deltaFlag) {
                item.deltaFlag = false
              }
              if (!item.deletionFlag) {
                item.deletionFlag = false
              }
            }
          })
          this.setState({fromTargetColumns,fromTargetColumns});
        }
        this.setState({fromList:this.props.fromList,defaultTbName:defaultTbName,currentFromkey:currentFromkey,columnList:columnList,relationColumnList:relationColumnList,alias:alias,linkType:linkType});
      }else {
        this.setState({fromList:[],defaultTbName:"",currentFromkey:0,columnList:[],relationColumnList:[],alias:"",linkType:""});
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

  onAddRelationNext = () => {
    let { relationColumnList,fromTargetColumns,disAddRelationFlag,masterTargetColumnsTemp } = this.state;
    fromTargetColumns = fromTargetColumns||[];
    let  masterTargetColumns  = this.props.masterTargetColumns||[];
    if(fromTargetColumns.length>masterTargetColumns.length) {
      disAddRelationFlag = relationColumnList.length<=masterTargetColumns.length;
    }else {
      disAddRelationFlag = relationColumnList.length<=fromTargetColumns.length;
    }
    if(disAddRelationFlag) {
      let list = {
        linktype: "left join",
        masterKey: "",
        fromKey: ""
      }
      relationColumnList.push(list);
    }

    this.setState({relationColumnList:relationColumnList,disAddRelationFlag:disAddRelationFlag});
  }

  //点击表

  onTableFocus = () => {
    console.log("点表了");
    //如果没有数据的话显示loading
    if(!this.props.currentDBName){
      warn('请先选择主表');
      return false;
    }
    if(!this.tableFin) {
      this.setState({showLoading:true});
    }
  }

   //选择表
  OnChooseTable = (e) => {
    let fromObj = JSON.parse(sessionStorage.getItem("from"));
    let flag = this.checkTbNameDulp(fromObj,e);
    if(!flag) return;
    if(!fromObj) {
      fromObj = [];
    }
    if(!fromObj[this.props.currentFromkey]) {
      fromObj[this.props.currentFromkey] = {};
    }
    fromObj[this.props.currentFromkey].tableName = e;
    //如果alias不存在取表名
    // if(!fromObj[this.props.currentFromkey].alias){
      fromObj[this.props.currentFromkey].alias = e;
    // }
    //表变了对应的关系也不存在了
    if(fromObj[this.props.currentFromkey].relation){
      fromObj[this.props.currentFromkey].relation.joinType = "";
      fromObj[this.props.currentFromkey].relation.joinCondition = [{
        linktype: "left join"
      }]
    }


    fromObj[this.props.currentFromkey].currentFromkey = this.props.currentFromkey;

    sessionStorage.setItem("from",JSON.stringify(fromObj));

    let temp = [];
    this.state.fromList.map(function(item) {
      temp.push(item);
    })

    let spliceValue = this.removeByValue(temp,e);
    this.props.onInputChangeByName(spliceValue,"tbNameList");
    this.props.onInputChangeByName(true,"addFromListFlag");
    this.setState({"defaultTbName":e});
    // if(!this.state.alias){
    this.setState({"alias":e});
    // }
    this.onGetColumnList(e);
  }

  removeByValue = (data,val) => {
    for(var i=0; i<data.length; i++) {
      if(data[i] == val) {
        data.splice(i, 1);
        return data;
      }
    }
  }

  checkTbNameDulp = (fromObj,value) => {
    if(Number(this.props.currentFromkey)<1 || !fromObj) return true;
    for(var i in fromObj) {
      if(fromObj[i].tbName == value) {
        Message.create({
          content: "从表名已用",
          color: 'warning',
          duration: 1
        });
        return false;
      }
    }

    return true;
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

      let fromTargetColumns= [];
      columnList.forEach((item, index) => {
        if(!item.alias) {
          item.alias = item.targetColumn;
        }
        //item.key = index;
        fromTargetColumns.push(item.targetColumn);
        if (!mark) {
          if(!item.htableColumn){
            item.htableColumn = item.targetColumn;
          }
          if(!item.indexField){
            item.indexField = item.targetColumn;
          }

          if (!item.deltaFlag) {
            item.deltaFlag = false
          }
          if (!item.deletionFlag) {
            item.deletionFlag = false
          }
        }
      })

      self.storeColumnList(columnList);
      self.storeTargetColumn(fromTargetColumns);
      self.props.onInputChangeByArray([{name:"mark",value:mark},{name:"fromTargetColumns",value:fromTargetColumns}]);
      let from = JSON.parse(sessionStorage.getItem("from")) || [];
      //字段更新时需要重新渲染组合关系
      self.props.onInputChangeByName(from,"slaveTables");
      self.setState({showLoading: false,columnList:columnList,fromTargetColumns:fromTargetColumns});

    })
  }

  storeTargetColumn = (data) => {
    let fromTargetColumns = JSON.parse(sessionStorage.getItem("fromTargetColumns"));
    if(!fromTargetColumns) {
      fromTargetColumns = {}
    }
    if(fromTargetColumns[this.props.currentFromkey]) {
      fromTargetColumns[this.props.currentFromkey] = {}
    }
    fromTargetColumns[this.props.currentFromkey] = data;
    sessionStorage.setItem("fromTargetColumns",JSON.stringify(fromTargetColumns));
  }

  //存储已经修改的从表到sessionStorage
  storeColumnList = (data) => {
    let fromObj = JSON.parse(sessionStorage.getItem("from"));
    if(!fromObj) {
      fromObj = [];
      fromObj[this.props.currentFromkey] = {};
    }
    fromObj[this.props.currentFromkey].singles = data;
    sessionStorage.setItem("from",JSON.stringify(fromObj));
  }

  storeRelation = (key,value,relationIndex) => {
    let {main_alias} = this.props;

    let from_alias = ReactDOM.findDOMNode(this.refs.alias).value;

    let fromObj = JSON.parse(sessionStorage.getItem("from"));
    if(!fromObj) {
      fromObj = [];
    }
    if(!fromObj[this.props.currentFromkey]) {
      fromObj[this.props.currentFromkey] = {};
    }
    let relationLen = this.state.relationColumnList.length;

    if(!fromObj[this.props.currentFromkey].relation) {
      fromObj[this.props.currentFromkey].relation = {"joinType":"left"};
    }

    let tempRelation = fromObj[this.props.currentFromkey].relation;

      switch(key) {
        case "alias": {
          //if(value) {
            fromObj[this.props.currentFromkey].alias = value;
            this.setState({"alias":value});
            break;
          //}
        }
        case "masterKey": {
          if(!tempRelation.joinCondition) {
            tempRelation.joinCondition = [];
          }
          if(!tempRelation.joinCondition[relationIndex]) {
            tempRelation.joinCondition[relationIndex] = {};
          }
          //this.setState({})
          tempRelation.joinCondition[relationIndex].masterKey=value;

          break;
        }
        case "fromKey": {

          if(!tempRelation.joinCondition) {
            tempRelation.joinCondition = [];
          }
          if(!tempRelation.joinCondition[relationIndex]) {
            tempRelation.joinCondition[relationIndex] = {};
          }

          tempRelation.joinCondition[relationIndex].fromKey=value;

          break;
        }
        case "joinType": {
          tempRelation.joinType = value;
          break;
        }
    }

    let slaveName = fromObj[this.props.currentFromkey].tableName;
    tempRelation.slaveName = slaveName;
    fromObj[this.props.currentFromkey].relation = tempRelation;
    sessionStorage.setItem("from",JSON.stringify(fromObj));
  }

  togglePk = (index, record) => {
    let self = this;
    return () => {
      //let columnList = this.clearPk();
      let columnList = self.state.columnList;

      columnList[index].isPk = !record.isPk;
      self.storeColumnList(columnList);
      self.setState({columnList:columnList});
      //self.props.onInputChangeByName(columnList,"columnList");
    }

  }

  editIndexField = (e, index, record) => {
    let value = e.target.value;

    this.state.columnList[index].indexField = value;
    this.storeColumnList(this.state.columnList);
    this.setState({columnList:this.state.columnList});

  }

  onChangehtableColumn = (e, index, record) => {
    let value = e.target.value;
    if (value!=="" && !validStrByReg('/^[a-z_A-Z]+$/', value)) {
      warn("请输入字母或者下划线");
    }else {
      this.state.columnList[index].htableColumn = value;
      this.storeColumnList(this.state.columnList);
      this.setState({columnList:this.state.columnList});
      //self.props.onInputChangeByName(self.props.columnList , "columnList");
    }
  }

  onChangeMarkColumn = (e,text,index, record) => {
    let value = e.target.value;
    if (value!=="" && !validStrByReg('/^[a-z_A-Z]+$/', value)) {
      warn("只能输入字母或者下划线");
    }else {
      this.state.columnList[index].alias = value;
      this.storeColumnList(this.state.columnList);
      this.setState({columnList:this.state.columnList});
      let fromObj = JSON.parse(sessionStorage.getItem("from")) || [];
      this.props.onInputChangeByName(fromObj , "slaveTables");
    }
  }


  editDeltaIdentifier = (record, index) => {
      let self = this;
      return function () {

        self.state.columnList[index].deltaFlag = !record.deltaFlag;
        self.storeColumnList(self.state.columnList);
        self.setState({columnList:self.state.columnList});
        //self.props.onInputChangeByName(self.state.columnList,"columnList");
      }
  }

  editDeletionFlag = (record, index) => {
    let self = this;
    return function () {

      self.state.columnList[index].deletionFlag = !record.deletionFlag;
      self.storeColumnList(self.state.columnList);
      self.setState({columnList:self.state.columnList});
      //self.props.onInputChangeByName(self.state.columnList,"columnList");
    }
  }

  onChangeColumn = (e,index, record,name) => {

      let  { columnList } = this.state;
      columnList[index][name] = e;
      this.storeColumnList(columnList);
      this.setState({columnList:columnList});
      //this.props.onInputChangeByName(columnList,"columnList");

  }



  /**
   * 删除表时筛选选项
   * @param target
   */
  deleteTargetColumn = (target) => {
    let { copyList } = this.props;
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


  //删除一行字段映射
  onDeleteAttr = (index) => {
    let self = this;
    return function () {
      //获取所有表关系，判断关系中是否有这个表字段如果有，则不允许删除
      let relation = [];
      let columnList = self.state.columnList||[];
      let from = JSON.parse(sessionStorage.getItem("from")) || [];
      let isexit = false;
      from.forEach((item)=>{
        relation = item.relation && item.relation.joinCondition || [];
        for(let i=0;i<relation.length;i++){
          if(relation[i].fromKey == columnList[index].targetColumn){
            // warn("请先删除改行表字段对应的表关系");
            warn(`请先删除表字段${relation[i].fromKey}对应的表关系再删除该行数据`);
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
        self.storeColumnList(columnList);
      //修改表关系中的表字段
        let targetColumns=[];
        columnList.forEach((item, index) => {

          targetColumns.push(item.targetColumn);
        })
        self.setState({fromTargetColumns:targetColumns});

        self.setState({columnList:columnList});
        let from = JSON.parse(sessionStorage.getItem("from")) || [];

        //删除时需要重新渲染组合关系
        self.props.onInputChangeByName(from,"slaveTables");

      }


    }
  }

  onDeleteRelation = (index,record) => {
    let self = this;
    return function () {
      let relationColumnList = self.state.relationColumnList;
      relationColumnList.splice(index, 1);
      self.setState({relationColumnList:relationColumnList,disAddRelationFlag:true});
      //存放在session中
      let fromObj = JSON.parse(sessionStorage.getItem("from")) || [];
      let preRelation =  (fromObj[self.props.currentFromkey] && fromObj[self.props.currentFromkey].relation) || {};
      if(preRelation.joinCondition){
         preRelation.joinCondition.splice(index,1);
        fromObj[self.props.currentFromkey].relation = preRelation;

        let temp =  JSON.stringify(fromObj);
        sessionStorage.setItem("from",temp);
      }

    }
  }

  onChangeTargeColumn = (e, index, record) => {
    let  { columnList } = this.state;
    columnList[index].targetColumn = e;
    this.storeColumnList(columnList);
    this.setState({columnList:columnList});
    let from = JSON.parse(sessionStorage.getItem("from")) || [];
    //修改时需要重新渲染组合关系
    this.props.onInputChangeByName(from,"slaveTables");

  }

  onAddTargetColumn = (e, index, record) => {
    let self = this;
    let value = e.target.value;

    this.state.columnList[index].targetColumn = value;
    this.storeColumnList(this.state.columnList);

    //表关系中的表字段增加
    let fromTargetColumns;
    fromTargetColumns = this.state.fromTargetColumns||[];
    if(fromTargetColumns[index]){
      fromTargetColumns[index] = value;
    }else {
      fromTargetColumns.push(value);
    }

    let from = JSON.parse(sessionStorage.getItem("from")) || [];

    //增加时需要重新渲染组合关系
    self.props.onInputChangeByName(from,"slaveTables");
    this.setState({columnList:this.state.columnList,fromTargetColumns:fromTargetColumns});

  }


  static contextTypes = {
    router: PropTypes.object
  };

  removeByValue = (data,val) => {
    for(var i=0; i<data.length; i++) {
      if(data[i] == val) {
        data.splice(i, 1);
        return data;
      }
    }
  }

  onChangeFromKey = (e, index, record) => {
    let from_alias = ReactDOM.findDOMNode(this.refs.alias).value;
    if(!from_alias) {
      Message.create({
            content: "请先输入从表别名",
            color: 'warning',
            duration: 1
          });
      return;
    }
    let {relationColumnList} = this.state;
    relationColumnList[index].fromKey = e;
    this.storeRelation("fromKey",e,index);
    this.setState({relationColumnList:relationColumnList});
  }

  onChangeMasterKey = (e, index, record) => {
    if(!this.props.main_alias) {
      Message.create({
            content: "请先输入主表别名",
            color: 'warning',
            duration: 1
          });
      return;
    }
    let {relationColumnList} = this.state;
    relationColumnList[index].masterKey = e;
    this.storeRelation("masterKey",e,index);
    this.setState({relationColumnList:relationColumnList});
  }

  onChangeLinkType = (e) => {
    let value = e;
    this.storeRelation("joinType",value);
    this.setState({linkType:value});
  }

  arrayToString = (array) => {
    if(!array || !array.length) return;
    let st;
    array.forEach(function(item) {
      st+=item+",";
    })
    return st;
  }


  spliceMasterColumnName = () => {
    let {masterTargetColumns} = this.props;
    let {relationColumnList} = this.state;
    if(!masterTargetColumns) return;

    let masterTargetColumnsTemp = [];
    for(var i in masterTargetColumns) {
      masterTargetColumnsTemp.push(masterTargetColumns[i]);
    }

    for(var key=0;key<masterTargetColumnsTemp.length;key++) {
      for(var j=0;j<relationColumnList.length;j++) {
        if(relationColumnList[j].masterKey == masterTargetColumnsTemp[key]) {
          masterTargetColumnsTemp.splice(key,1);
          key--;
        }
      }
    }

    return masterTargetColumnsTemp;
  }

  compareArrays = (array1,array2) => {
    if(!array2 || !array1) return;
    //临时数组存放
    var tempArray1 = [];//临时数组1
    var tempArray2 = [];//临时数组2

    for(var i=0;i<array2.length;i++){
        tempArray1[array2[i]]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
    }

    for(var i=0;i<array1.length;i++){
        if(tempArray1[array1[i]]){
            tempArray2.push(array1[i]);//过滤array1 中与array2 相同的元素；
        }
    }
    return tempArray2;
  }


  spliceFromColumnName = () => {
    let {relationColumnList,fromTargetColumns} = this.state;
    if(!fromTargetColumns) return;

    let fromTargetColumnsTemp = [];
    for(var i in fromTargetColumns) {
      fromTargetColumnsTemp.push(fromTargetColumns[i]);
    }

    for(var key=0;key<fromTargetColumnsTemp.length;key++) {
      for(var j=0;j<relationColumnList.length;j++) {
        if(relationColumnList[j].fromKey == fromTargetColumnsTemp[key]) {
          fromTargetColumnsTemp.splice(key,1);
          key--;
        }
      }
    }

    return fromTargetColumnsTemp;
  }

  renderMasterKey = (text,record,index) => {
    let masterColumnOptions = [];
    let masterColumnName = this.spliceMasterColumnName();
    if(!masterColumnName) return;
    masterColumnName.forEach(function(item,index) {
        masterColumnOptions.push(
        <Option
          key={index}
          value={item}>{item}
        </Option>)
    })

    return (<Select value={text} onChange={(e) => {
               this.onChangeMasterKey(e, index, record)
            }}>
              {masterColumnOptions}
            </Select>)
  }

  renderFromKey = (text,record,index) => {
    let fromColumnOptions = [];
    let fromColumnName = this.spliceFromColumnName();
    if(!fromColumnName) return;

    fromColumnName.forEach(function(item,index) {
      fromColumnOptions.push(
        <Option
          key={index}
          value={item}>{item}
        </Option>)
    })

    return (<Select value={text} onChange={(e) => {
               this.onChangeFromKey(e, index, record)
            }}>
              {fromColumnOptions}
            </Select>)
  }

  deleteSub=()=>{
    let index = this.props.currentFromkey;
    let formListLen = this.props.formListLen - 1;
    let from = JSON.parse(sessionStorage.getItem("from"))||[];
    let tableName = from[index].tableName;
    from.splice(index,1);
    sessionStorage.setItem("from",JSON.stringify(from));
    let fromList = this.state.fromList || [];
    this.setState({fromList:[],defaultTbName:"",columnList:[],relationColumnList:[],alias:"",linkType:""});
    // 删除后将表字段添加到tbNameList,以后添加的表可以选择
    fromList.push(tableName);

    this.props.onInputChangeByName(fromList,"tbNameList");
    this.props.onInputChangeByName(formListLen,"FromListLen");
}
  render() {
    let self = this;
    let{fromList,mark,currentFromkey} = this.props;
    let {columnList,relationColumnList} = this.state;
    let fromListOptions = [];
    if(fromList){
      fromList.forEach(function(value,item) {
        fromListOptions.push(<Option key={item} value={value}>{value}</Option>)
      })
    }
    let TargetColumnList = columnList;
    let TargetColumnOptions = [];
    if(TargetColumnList) {
      TargetColumnOptions  = TargetColumnList.map(
        TargetColumnList =>
          <Option
            key={TargetColumnList.targetColumn}
            value={TargetColumnList.targetColumn}>{TargetColumnList.targetColumn}
          </Option>
      );
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
          return <span indexFlag={index}>
                  <input className="u-form-control md" value={text} type="text" onChange={(e) => {self.onChangehtableColumn(e, index, record)}}/>
                </span>

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
    const relationColumns = [
      {
        title: '主表关键字段', dataIndex: 'masterKey', key: 'masterKey', render(text, record, index) {
          return self.renderMasterKey(text, record,index);
        }
      }, {
        title: '从表关键字段', dataIndex: 'fromKey', key: 'fromKey', render(text, record, index) {
          return self.renderFromKey(text, record,index);

        }
      }, {
        title: '操作', dataIndex: 'oper2', key: 'oper2', render(text, record, index) {
          let dom = ""
          dom = <Popconfirm content="确认删除?" placement="bottom"  onClose={self.onDeleteRelation(index, record)}>
               <Button >删除</Button>

             </Popconfirm>

          return dom;
        }
      }
    ];

    return(
      <Col md={12}>
        <h3>{`第${currentFromkey+1}个从表`}</h3>
          <FormGroup>
            <Label>从表名称<Icon type="uf-mi" className="red" />:</Label>
            <Select value={this.state.defaultTbName}
                    onChange={this.OnChooseTable}
                    onFocus={this.onTableFocus}>
              {fromListOptions}
            </Select>
            <Popconfirm content="确认删除?" placement="bottom"  onClose={self.deleteSub}>
              <Button colors="primary"  style={{float:"right",marginRight:"50px"}} >删除该表</Button>

            </Popconfirm>

          </FormGroup>
          <FormGroup>
              <Label>从表别名<Icon type="uf-mi" className="red" />:</Label>
              <FormControl
                name="alias"
                ref="alias"
                value={this.state.alias}
                placeholder="请输入从表别名"
                onChange = {(e) => {
                   this.storeRelation("alias",e.target.value)
                }}
              />
            </FormGroup>
          <div className="source-table">

            {!mark &&
            <Table
              ref="table"
              columns={columns}
              data={columnList}
              footer={() =>
                <Button  onClick={this.onAddNext} >
                添加一行
                </Button>
              }
            />
            }
          </div>
          <Col md={12}>
             <h4>表关系设置</h4>
              <div className="source-table">
                <FormGroup style={{width:450}}>
                  <Label>连接方式:</Label>
                  <Select
                    value={this.state.linkType}
                    onChange={this.onChangeLinkType}>
                    <Option value="left join">left</Option>
                    <Option value="right join">right</Option>
                    <Option value="inner join">inner</Option>
                  </Select>
                </FormGroup>
                <Table
                  ref="table2"
                  columns={relationColumns}
                  data={relationColumnList}
                  footer={() =>
                    <Button onClick={this.onAddRelationNext}>
                    添加一行
                    </Button>
                   }
                />
                {!this.state.disAddRelationFlag &&
                      (<span>主表或者主表的字段已设置完！</span>)
                    }
              </div>
          </Col>
      </Col>
    );

  }
}
export default FromList;
