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
  UpdateColumn
} from 'serves/importModalManager';

import {
  SaveJoinSource,
  GetDetail
} from '../../server';

import Title from 'components/Title';
import {warn, err} from 'components/message-util';
import PageLoading from 'components/loading';
import {
  validStrByReg
} from 'components/util';

import {formateReltion} from '../../util';
import {FormItem, Table2, MasterList, FromList} from '../../components';
import "./index.less";


class AddModal extends Component {
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
      editObj: {},
      alias: '',
      copyList: [], //复制字段列表
      showLoading: false,
      FromListLen: 0
    }

    //清空sessionStorage中数据
    sessionStorage.setItem("from", JSON.stringify([]));
    sessionStorage.setItem("master", JSON.stringify({}));
    sessionStorage.setItem("fromTargetColumns", JSON.stringify([]));
    sessionStorage.setItem("masterTargetColumns", JSON.stringify([]));
  }

  componentDidMount = () => {
    this.onGetDetail();
  }


  onGetDetail = () => {
    let id = this.props.params.id;
    //如果id>0
    if (id) {
      let param = {
        masterId: id
      }
      let self = this;
      GetDetail(param, function (response) {
        let res = response;

        self.setState({
          showLoading: false
        });
        if (res.data.detailMsg && JSON.stringify(res.data.detailMsg.data) !== "{}") {

          let copyList = res.data.detailMsg.data.masterTable.copyTo;
          if (copyList) {
            copyList.forEach((item) => {

              item.copyColumn = item.copyColumn.split(',');
            });
          }
          let slaveTables = res.data.detailMsg.data.slaveTables;
          let masterTable = res.data.detailMsg.data.masterTable;
          let fromListLen = 0;
          if (slaveTables) {
            fromListLen = slaveTables.length;
          }
          self.setState({
            key: id,
            detailList: res.data.detailMsg.data,
            masterTable: masterTable,
            synTime: res.data.detailMsg.data.filterSynch.crontab,
            isSync: res.data.detailMsg.data.filterSynch.isSync,
            filterCondition: res.data.detailMsg.data.filterSynch.filterCondition,
            indexConf: res.data.detailMsg.data.indexConf,
            alias: res.data.detailMsg.data.indexConf.alias,
            columnList: masterTable.singles,
            copyList: res.data.detailMsg.data.masterTable.copyTo,
            slaveTables: res.data.detailMsg.data.slaveTables,
            FromListLen: fromListLen,
            main_alias: res.data.detailMsg.data.masterTable.alias,
            currentDBNameId: res.data.detailMsg.data.source.sourceId,
            currentDBName: res.data.detailMsg.data.schema.schemaName,
            currentTbName: masterTable.tableName,
            addFromListFlag: true
          });
          slaveTables = formateReltion(res.data.detailMsg.data.masterTable.alias, slaveTables);
          sessionStorage.setItem("from", JSON.stringify(slaveTables));
          sessionStorage.setItem("master", JSON.stringify(masterTable));
        }
      })
    }
  }
  clearAddFlag = (columnList) => {
    columnList = columnList || [];

    columnList.map(function (item, index) {
      if (item.add === true) {
        delete item.add;
      }
      delete item.key;
    })

    return columnList;
  }

  isFieldSame = (arr, errInfo, field) => {
    let left, right;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (field) {
          left = arr[i][field];
          right = arr[j][field];
        } else {
          left = arr[i];
          right = arr[j];
        }
        //两值相等并且不为 空
        if (left == right && left) {
          errInfo = `${errInfo}，重复字段为${left}`;
          warn(errInfo);
          return false;
        }
      }
    }
    return true;
  }
  //保存数据库的表字段
  onSaveDBSource = () => {
    this.onUpdateColumns();
    let sourceName = this.state.currentDBSourceName;
    let schemaName = this.state.currentDBName;
    let id = this.state.currentDBNameId;
    let tbName = this.state.currentTbName;
    let sourceId = this.state.currentDBNameId;
    let filterCondition = this.state.filterCondition;
    let isSync = this.state.isSync;
    let synTime = this.state.synTime;
    let copyList = JSON.parse(sessionStorage.getItem("copyList")) ||this.state.copyList;

    if (!sourceId) {
      Message.create({content: "数据源必选", color: 'warning', duration: 2});
      return;
    }

    if (!tbName) {
      Message.create({content: "表必选", color: 'warning', duration: 2});
      return;
    }
    //自定义别名必输入
    if(!this.state.alias){
      warn("请输入自定义索引别名");
      return;
    }else if ( !validStrByReg('/^[a-z_]+$/', this.state.alias)) {
      warn("只能输入小写字母或者下划线");
      return;
    }
    let masterTable = JSON.parse(sessionStorage.getItem("master")) || {};
    let fromTable = JSON.parse(sessionStorage.getItem("from"));
    let columnList = this.clearAddFlag(masterTable.singles);
    // if(!filterCondition) {
    //   Message.create({content: "过滤条件必输", color: 'warning',duration:2});
    //   return;
    // }

    let emptyflag = false;
    copyList.forEach((item) => {
      if (!item.copyColumn || item.copyColumn.length === 0) {
        emptyflag = true;
      }
      if (Array.isArray(item.copyColumn)) {
        item.copyColumn = item.copyColumn.join(',');
      }
    });

    if (emptyflag) {
      return warn('包含字段不能为空，请选择。')
    }


    for (let i = 0; i < columnList.length; i++) {
      let item = columnList[i];
      if (!item.indexField) {
        warn(`请输入主表中第${i + 1}行的索引`);
        return
      }
      if (!validStrByReg('/^[a-zA-Z0-9_]+$/', item.indexField)) {
        warn(`请检查主表第${i + 1}行，索引只可以为字母或者下划线`);
        return
      }
    }

    for (let i = 0; i < copyList.length; i++) {
      let item = copyList[i];
      if (!item.copyToColumn) {
        warn(`请输入组合条件设置中第${i + 1}行的索引`);
        return
      }
      if (!validStrByReg('/^[a-zA-Z0-9_]+$/', item.copyToColumn)) {
        warn(`请检查组合条件设置中第${i + 1}行，索引名称只可以为字母或者下划线`);
        return
      }
    }

    masterTable.singles = columnList;
    masterTable.copyTo = copyList;

    let slaveTables = this.formateFromTable(fromTable) || [];
    if(slaveTables.length<1){
       warn(`请添加相关从表`);
       return
     }
    let key = this.state.key;
    //校验重复
    let aliasArr = [];
    if (masterTable.alias) {
      aliasArr.push(masterTable.alias);
      for (let i = 0; i < slaveTables.length; i++) {
        aliasArr.push(slaveTables[i].alias)
        //清除add字段
        slaveTables[i].singles = this.clearAddFlag(slaveTables[i].singles);
      }
    }

    //验证主表
    if (!this.isFieldSame(aliasArr, "各表的别名不能重复") || !this.isFieldSame(masterTable.singles, "主表索引不能重复", "indexField") || !this.isFieldSame(masterTable.singles, "主表模型字段不能重复", "htableColumn") || !this.isFieldSame(masterTable.singles, "主表表字段不能重复", "targetColumn") || !this.isFieldSame(masterTable.singles, "主表字段别名不能重复", "alias")) {
      return
    }
    //校验从表
    if (slaveTables) {
      let flag = false;
      slaveTables.forEach((item) => {
        if (!this.isFieldSame(item.singles, `从表${item.tableName}索引不能重复`, "indexField") || !this.isFieldSame(item.singles, `从表${item.tableName}模型字段不能重复`, "htableColumn") || !this.isFieldSame(item.singles, `从表${item.tableName}表字段不能重复`, "targetColumn") || !this.isFieldSame(item.singles, `从表${item.tableName}字段别名不能重复`, "alias")) {
          flag = true;
          return
        }
      })
      //如果flag为true说明有的从表重复了，跳出循环
      if (flag) {
        return;
      }
    }

    let param = {
      "source": {
        "sourceId": sourceId,
        "sourceName": sourceName
      },
      "schema": {
        "schemaName": schemaName
      },
      "filterSynch": {
        "isSync": isSync,
        "filterCondition": filterCondition || "",
        "crontab": synTime
      },
      "indexConf": {
        "alias": this.state.alias
      },
      "masterTable": masterTable,
      "slaveTables": slaveTables

    }
    let self = this;
    this.setState({
      showLoading: true
    });
    SaveJoinSource(param, key, function (response) {
      let res = response;
      if (res.data.success == "success") {
        self.setState({
          showLoading: false
        });
        Message.create({content: "保存成功", color: 'success', duration: 2});

        self.context.router.push('/');

      } else {
        self.setState({
          showLoading: false
        });
        Message.create({content: res.data.message || "保存失败", color: 'warning', duration: 2});
      }
    })
  }

  formateFromTable = (data) => {
    let slaveTables = [];
    let {main_alias} = this.state;
    let from_alias;

    if (!data) return;
    for (var i in data) {
      let relation = data[i].relation || {};

      let tempJoinCondition = relation.joinCondition || [];
      delete data[i].currentFromkey;
      let stringCondition;
      from_alias = data[i].alias;

      if (!tempJoinCondition || !tempJoinCondition.length) {
        Message.create({content: `${data[i].tableName}从表的表关系未设置`, color: 'warning', duration: 2});
      }

      tempJoinCondition.map(function (item, index) {
        if (index == 0) {
          stringCondition = `${main_alias}.${item.masterKey}=${from_alias}.${item.fromKey}`;
        } else {
          stringCondition = stringCondition + " and " + `${main_alias}.${item.masterKey}=${from_alias}.${item.fromKey}`;
        }

      })

      relation.joinCondition = stringCondition;

      slaveTables.push(data[i]);
    }

    return slaveTables;
  }

  onInputChange = (event) => {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // if(name === "isSync") {
    //   value = !value;
    // }
    this.onInputChangeByName(value, name);
  }


  onInputChangeByName = (value, name) => {
    //如果是currentDBSourceName改变，动态改变其他内容

    if (name === "currentDBSourceName") {
      this.onInputChangeByName("", "currentDBName");
    }

    //如果数据库变了，则对应的主表\从表、组合条件改变
    if (name === "currentDBName") {
      this.setState({
        "currentTbName": "",
        "copyList": [],
        "currentFromkey": 0,
        "main_alias": "",
        "masterTable": {},
        "FromListLen": 0,
        "tbNameList": [],
        "slaveTables": []
      });
      sessionStorage.setItem("master", JSON.stringify({}));
      sessionStorage.setItem("from", JSON.stringify([]));
      sessionStorage.setItem("fromTargetColumns", JSON.stringify([]));
      sessionStorage.setItem("masterTargetColumns", JSON.stringify([]));

    }
    //深度拷贝
    this.setState({
      [name]: value
    });
  }

  onInputChangeByArray = (arr) => {
    arr.forEach((item) => {
      this.onInputChangeByName(item.value, item.name);
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

  AddFromList = () => {
    this.state.FromListLen++;
    this.setState({FromListLen: this.state.FromListLen});
  }

  renderFromList = () => {

    let FromListDom = [];
    let self = this;
    let addFlag;
    for (var i = 0; i < this.state.FromListLen; i++) {
      FromListDom.push(
        <FromList mark={self.state.mark}
                  main_alias={self.state.main_alias}
                  masterTargetColumns={self.state.masterTargetColumns}
                  currentDBNameId={self.state.currentDBNameId}
                  currentDBName={self.state.currentDBName}
                  fromList={self.state.tbNameList}
                  currentTbName={self.state.currentTbName}
                  copyList={self.state.copyList}
                  currentFromkey={i}
                  editKey={self.state.key}
                  fromObj={self.state.slaveTables ? self.state.slaveTables[i] : {}}
                  formListLen={self.state.FromListLen}
                  onInputChange={self.onInputChange}
                  onInputChangeByName={self.onInputChangeByName}
                  onInputChangeByArray={self.onInputChangeByArray}/>
      )
    }

    return FromListDom;
  }


  render() {
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
    //修改
    let table, source, schema;
    if (this.state.detailList) {
      table = this.state.detailList.table;
      source = this.state.detailList.source;
      schema = this.state.detailList.schema;
    }
    let editKey = this.state.key;
    let disableAddFromFlag = false;
    let disableAddFromTitle = "";
    if (this.state.tbNameList && this.state.tbNameList.length == 0) {
      disableAddFromFlag = true;
      disableAddFromTitle = "无表可选，请重新选择主表";
    }


    return (
      <Row className="add-source-manage">
        <Title name="新增当前页数据关联"/>
        <FormItem onInputChange={this.onInputChange}
                  onInputChangeByName={this.onInputChangeByName}
                  onInputChangeByArray={this.onInputChangeByArray}
                  isSync={this.state.isSync}
                  synTime={this.state.synTime}
                  alias={this.state.alias}
                  currentDBNameId={this.state.currentDBNameId}
                  currentDBName={this.state.currentDBName}
                  currentTbName={this.state.currentTbName}
                  columnList={this.state.columnList}
                  source={source}
                  table={table}
                  schema={schema}
                  editKey={editKey}
                  filterCondition={this.state.filterCondition}
        />

        <MasterList mark={this.state.mark}
                    currentDBNameId={this.state.currentDBNameId}
                    currentDBName={this.state.currentDBName}
                    currentTbName={this.state.currentTbName}
                    copyList={this.state.copyList}
                    aliasColumns={this.state.aliasColumns}
                    TargetColumnOptions={TargetColumnOptions}
                    main_alias={this.state.main_alias}
                    onInputChange={this.onInputChange}
                    onInputChangeByName={this.onInputChangeByName}
                    editKey={editKey}
                    masterTable={this.state.masterTable}
                    onInputChangeByArray={this.onInputChangeByArray}/>

        {this.state.tbNameList && this.state.tbNameList.length > 1 && this.renderFromList()}
        <Button colors="primary" title={disableAddFromTitle} disabled={disableAddFromFlag} onClick={self.AddFromList}>添加从表</Button>
        <Table2 mark={this.state.mark}
                currentDBName={this.state.currentDBName}
                editKey={self.state.key}
                masterTargetColumns={self.state.masterTargetColumns}
                from={self.state.slaveTables}
                tbNameList={this.state.tbNameList}
                copyList={this.state.copyList}
                fromTargetColumns={this.state.fromTargetColumns}
                onInputChange={this.onInputChange}
                onInputChangeByName={this.onInputChangeByName}
                onInputChangeByArray={this.onInputChangeByArray}/>
        <Col md={12}>
          <div className="footer-buttons">
            {!mark && <Button colors="primary" style={{marginBottom: 40}} onClick={this.onSaveDBSource}>保存</Button>}
          </div>
        </Col>
        <PageLoading show={this.state.showLoading}/>

      </Row>)
  }
}

AddModal.contextTypes = {
  router: PropTypes.object
};

export default AddModal;
