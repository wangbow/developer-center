import React, {Component, PropTypes} from "react";
import {Link} from 'react-router';
import {Row, Col, Button, FormControl, Table, InputGroup, Form, FormGroup, Label, Message, Select, Alert, Icon, Popconfirm } from 'tinper-bee';
import {
  GetAddImportSource,
  GetTableList,
  GetColumnList,
  SaveColumn,
  SaveDBSource,
  DeleteColumn,
  UpdateColumn,
  GetDBSourceList,
  GetDetail,
  DeleteSource,
  UpdateSource
} from './server';
import Checkbox from 'rc-checkbox';
import Title from 'components/Title';
import {err, warn, success} from 'components/message-util';
import PageLoading from 'components/loading';
import {
  validStrByReg
} from 'components/util';

import "./index.css";


class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: [],
      sourceList: [],
      tables: ["请选择"],
      DBsourceList: [{dbName: "请选择"}],
      columnList: [],
      deltaIdentifier: false,
      deletionFlag: false,
      filterCondition: "",
      isSync: false,
      synTime: 10,
      editObj: {},
      showLoading: true,
      alias: '',
      indexConf: {},
      copyList: [], //复制字段列表
    }
  }

  componentDidMount() {
    this.onGetDetail();
  }

  onGetDetail = () => {

    let param = {
      id: this.props.params.id
    }
    let self = this;
    GetDetail(param).then((response) => {
      let res = response;
      this.setState({
        showLoading: false
      });
      if (res.data.detailMsg && JSON.stringify(res.data.detailMsg.data) !== "{}") {

        let copyList = res.data.detailMsg.data.copyTo;

        copyList.forEach((item) => {
          item.copyColumn = item.copyColumn.split(',');
        });

        self.setState({
          detailList: res.data.detailMsg.data,
          crontab: res.data.detailMsg.data.filterSynch.crontab,
          columnList: res.data.detailMsg.data.singles,
          isSync: res.data.detailMsg.data.filterSynch.isSync,
          filterCondition: res.data.detailMsg.data.filterSynch.filterCondition,
          indexConf: res.data.detailMsg.data.indexConf,
          alias: res.data.detailMsg.data.indexConf.alias,
          copyList,
        });

        let tbName = res.data.detailMsg.data && res.data.detailMsg.data.table.tbName;
        let currentDBNameId = res.data.detailMsg.data && res.data.detailMsg.data.source.id;
      }
    }).catch((e) => {
      console.log(e);
      this.setState({
        showLoading: false
      });
      err('服务端出错。');
    })
  }


  onGetColumnList = (tbName, currentDBNameId) => {
    let self = this;
    let param = {
      tbName: tbName,
      sourceId: currentDBNameId
    }
    GetColumnList(param, function (response) {
      let res = response;

      let columnList = res.data.detailMsg.data && res.data.detailMsg.data.columns;
      //let isSync = false;
      //debugger;

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

      self.setState({mark: mark, columnList: columnList});
    })
  }
  //添加数据源
  onAddSource = () => {
    let self = this;
    GetAddImportSource(param, function (response) {
      let res = response;
      if (res.data.success = "success") {
        success(data.message || "保存成功");
      }
    })
  }
  //选择数据库
  OnChooseSource = (value) => {

    this.setState({currentDBNameId: value});

    this.onGetTableList(value);
  }

  //选择表
  OnChooseTable = (e) => {
    this.setState({currentTbName: e});
    this.onGetColumnList(e)
  }

  //选择同步周期
  OnChooseSynTime = (e) => {
    this.setState({crontab: e});
  }

  //是否选中同步checkbox
  OnChangeSyn = (e) => {
    this.setState({isSync: !this.state.isSync});
  }
  //添加一行空字段映射
  onAddNext = () => {
    let list = {
      deletionFlag: false,
      add: true,
      deltaFlag: false,
      isPk: false,
      isSingle: false,
      targetColumn: "",
      htableColumn: "",
      indexField: "",
      analyzer: "not_analyzed",
    }
    this.state.columnList.push(list);
    this.setState({columnList: this.state.columnList});
  }

  clearAddFlag = () => {
    let columnList = this.state.columnList;
    let oldData = [], newData = [];
    columnList.map(function (item) {
      delete item.key;
      if (item.add == true) {
        delete item.add;
        newData.push(item);
      } else {
        oldData.push(item);
      }
    })

    return {oldData, newData};
  }

  //保存数据库的表字段
  onSaveDBSource = () => {
    let schema = this.state.detailList.schema;
    let id = this.state.detailList.table.id;
    let tbName = this.state.detailList.table.tbName;
    let sourceId = this.state.detailList.source.id;
    let synId = this.state.detailList.filterSynch.id;
    let filterCondition = ReactDOM.findDOMNode(this.refs.filterCondition).value;
    let isSync = this.state.isSync;
    let indexConf = this.state.indexConf;
    let crontab = this.state.crontab;

    let { copyList } = this.state;
    
   if (this.state.alias!=="" && !validStrByReg('/^[a-z_]+$/',this.state.alias)) {
     err("只能输入小写字母或者下划线");
     return;
    }


    let copyToAdd = [], pureCopyList = [], emptyflag = false;

    copyList.forEach((item) => {
      if(!item.copyColumn || item.copyColumn.length === 0){
        emptyflag = true;
      }
      item.copyColumn = item.copyColumn.join(',');
      if(!item.id){
        copyToAdd.push(item);
      }else{
        pureCopyList.push(item)
      }
    });


    if(emptyflag){
      return warn('包含字段不能为空，请选择。')
    }

    let {oldData, newData} = this.clearAddFlag();

    let param = {
      "singles": oldData,
      "singlesAdd": newData,
      "filterSynch": {
        "id": synId,
        "isSync": isSync,
        "filterCondition": filterCondition || "",
        "crontab": crontab
      },
      "table": {
        "id": id,
        "tbName": tbName,
        "sourceId": sourceId,
      },
      "schema": schema,
      "indexConf": {
        "id": indexConf.id,
        "alias": this.state.alias
      },
      "copyTo": pureCopyList,
      "copyToAdd": copyToAdd,
    }
    let self = this;
    this.setState({
      showLoading: true
    });
    UpdateSource(param).then((response) => {
      let res = response;
      this.setState({
        showLoading: false
      });
      if (res.data.success === "success") {
        success("保存成功")
        //self.setState({editObj:{}});
        self.context.router.push('/');
      } else {
        err(res.data.message);
      }
    }).catch((e) => {
      this.setState({
        showLoading: false
      });
      err('服务出错，请联系管理员。')
    })
  }

  //保存新添加的一列字段映射
  onAddColumn = (e) => {

    let {
      targetColumn,
      sourceColumn,
      indexColumn,
      deltaIdentifier,
      deletionFlag,
      currentTbName,
      currentDBName
    } = this.state;

    //let len = columnList.length;

    let param = {
      "targetColumn": targetColumn || "",
      "sourceColumn": sourceColumn || "",
      "indexColumn": indexColumn || "",
      "indexSegmentType": "indexSegmentType",
      "deltaIdentifier": deltaIdentifier,
      "deletionFlag": deletionFlag,
      "tbName": currentTbName,
      "dbName": currentDBName
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
        success("保存成功");
      }
    })
  }
  //删除一行字段映射
  onDeleteAttr = (index, record) => () => {
    let param = {id: record.id};
    if (record.id) {
      this.setState({
        showLoading: true
      })
      DeleteColumn(param, (res) => {
        if (res.data.success === "success") {
          success("删除成功");
          let {columnList} = this.state;

          //self.onGetDetail();
          this.deleteTargetColumn(columnList[index].targetColumn);
          columnList.splice(index, 1);
          this.setState({
            columnList,
            showLoading: false
          });
        } else {
          err(res.data.message || "删除失败");
        }
      })
    } else {
      let {columnList} = this.state;
      this.deleteTargetColumn(columnList[index].targetColumn);
      columnList.splice(index, 1);
      //self.onGetDetail();
      this.setState({
        columnList
      });

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
    // if(!self.state.editObj[record.id]) {
    //   self.state.editObj[record.id] = record;
    // }

    self.state.columnList[index].analyzer = value;
    self.setState({columnList: self.state.columnList});
  }

  editIndexField = (e, index, record) => {
    let self = this;
    let value = e.target.value;
    this.state.columnList[index].indexField = value;
    self.setState({columnList: self.state.columnList});
  }

  // setDeltaIdentifier = (e) => {
  //   this.setState({deltaIdentifier:e.target.checked});
  // }

  // setDeletionFlag = (e) => {
  //   this.setState({deletionFlag:e.target.checked});
  // }

  editDeltaIdentifier = (record, index) => {
    let self = this;
    return function () {
      // if(!self.state.editObj[record.id]) {
      //   self.state.editObj[record.id] = record;
      // }
      self.state.columnList[index].deltaFlag = !record.deltaFlag;
      self.setState({columnList: self.state.columnList});
    }
  }

  onChangeTargeColumn = (e, index, record) => {
    let  { columnList } = this.state;
    columnList[index].targetColumn = e.pop();
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

  onChangeFilterCondition = (e) => {
    let value = e.target.value;
    this.setState({filterCondition: value});
  }

  editDeletionFlag = (record, index) => {
    let self = this;
    return function () {
      // if(!self.state.editObj[record.id]) {
      //   self.state.editObj[record.id] = record;
      // }
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

  editRemark = (index, record) => (e) => {
    let {columnList} = this.state;
    let self = this;
    let value = e.target.value;
    columnList[index].remark = value;
    self.setState({columnList});
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

  /**
   * 添加一行复制字段
   */
  onAddCopyRow = () => {
    let { copyList } = this.state;
    let item = {
      "copyToColumn": "",
      "copyColumn": [],
      "analyzer": "not_analyzed",
      "remark":""
    };
    copyList.push(item);

    this.setState({
      copyList
    });
  }

  /**
   * 删除表时筛选选项
   * @param target
   */
  deleteTargetColumn = (target) => {
    let { copyList } = this.state;
    copyList.forEach((item) => {
      let copyColumn = item.copyColumn;
      if(copyColumn.indexOf(target) > -1){
        let index = copyColumn.indexOf(target);
        copyColumn.splice(index, 1);
      }
      item.copyColumn = copyColumn;
    })

    this.setState({
      copyList
    })
  }

  /**
   * 删除一行复制字段
   */
  handleDeleteCopyListRow = (index, id) => () => {
    let { copyList } = this.state;
    let param = {id: id, mark: true};
    if (id) {
      this.setState({
        showLoading: true
      });
      DeleteColumn(param, (res) => {
        if (res.data.success === "success") {
          success("删除成功");
          copyList.splice(index, 1);
          //self.onGetDetail();
          this.setState({
            copyList,
            showLoading: false
          });
        } else {
          err(res.data.message || "删除失败");
        }
      })
    } else {
      copyList.splice(index, 1);
      //self.onGetDetail();
      this.setState({
        copyList
      });
    }
  }

  /**
   * 复制字段选择分词类型
   */
  handleSelectCopyAnalyzer = (index) => (value) => {
    let { copyList } = this.state;
    copyList[index].analyzer = value;
    this.setState({
      copyList
    })
  }

  /**
   * 选择被复制字段
   */
  handleSelectCopyCol = (index) => (value) => {
    let { copyList } = this.state;
    copyList[index].copyColumn = value;
    this.setState({
      copyList
    })
  }

  /**
   * 输入复制字段索引
   */
  handleEditCopyName = (index) => (e) => {
    let { copyList } = this.state;
    copyList[index].copyToColumn = e.target.value;
    this.setState({
      copyList
    })
  }

  /**
   * 校验是否重复
   * @param index
   */
  handleCheckNoRepeat = (index) => (e) => {
    let field = e.target.value, repeatFlag = false;
    let { copyList, columnList } = this.state;

    columnList.forEach((item) => {
      if(item.indexField === field){
        repeatFlag = true;
      }
    });
    copyList.forEach((item, index2) => {
      if(item.copyToColumn === field && index !== index2){
        repeatFlag = true;
      }
    });
    if(repeatFlag){
      copyList[index].copyToColumn = '';
      this.setState({
        copyList
      });
      return warn('索引名称不能重复。');
    }
  }

  /**
   * 编辑描述
   */
  handleEditRemark = (index) => (e) => {
    let { copyList } = this.state;
    copyList[index].remark = e.target.value;

    this.setState({
      copyList
    })
  }

  render() {

    let table, source, filterSynch, singles, schema;
    if (this.state.detailList) {

      table = this.state.detailList.table;
      source = this.state.detailList.source;
      filterSynch = this.state.detailList.filterSynch;
      singles = this.state.detailList.singles;
      schema = this.state.detailList.schema;
    }

    const timeList = ['5', '10', '15'];
    const timesOptions = timeList.map(time => <Option key={time}>{time}</Option>);


    const splitType = ['不分词', '模糊分词', '拼音分词', 'ik分词'];
    const splitOption = splitType.map(types => <Option key={types}>{types}</Option>);

    let mark = this.state.mark;

    let TargetColumnOptions = [];

    if (mark !== true) {

      let TargetColumnList = this.state.columnList;

      TargetColumnOptions = TargetColumnList.map(TargetColumnList => <Option key={TargetColumnList.targetColumn}
                                                                             value={TargetColumnList.targetColumn}>{TargetColumnList.targetColumn}</Option>);

    }
    let self = this;
    const columns = [
      {
        title: '主键', dataIndex: 'isPk', key: 'isPk', render(text, record, index) {
        return <Checkbox checked={text} onChange={self.togglePk(index, record)}/>;
        //return <input type="checkbox"  defaultChecked={text} onClick={self.togglePk(index,record)} />

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
            dom = <Select tags={true} value={text} onChange={(e) => {
              self.onChangeTargeColumn(e, index, record)
            }}>
              {TargetColumnOptions}
            </Select>;
          }
          return dom;
        }
      }, {
        title: '分词类型', dataIndex: 'analyzer', key: 'analyzer', render(text, record, index) {
          let dom;
          if (text) {
            dom = ( <Select defaultValue={text} onChange={(e) => {
              self.OnSplitType(e, index, record)
            }}>
              <Option value="not_analyzed">不分词</Option>
              <Option value="ngram">模糊分词</Option>
              <Option value="pinyin">拼音分词</Option>
              <Option value="ik_max_word">ik分词</Option>
              <Option value="edgeNgram">前缀分词</Option>
            </Select>)
          } else {
            dom = null;
          }
          return dom;
        }
      }, {
        title: '增量标识', dataIndex: 'deltaFlag', key: 'deltaFlag', render(text, record, index) {
          // if(record.add) {
          //   return <Radio name="deltaFlag" defaultChecked={self.state.deltaIdentifier} onChange={self.setDeltaIdentifier}  />;
          // }else{
          //   return <Checkbox defaultChecked={!!text} onChange={self.editDeltaIdentifier(record,index)} />;
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
        title: '描述', dataIndex: 'remark', key: 'remark', render(text, record, index) {
          return <input className="u-form-control md" value={text} type="text"
                        onChange={self.editRemark(index, record)}/>
        }
      }, {
        title: '操作', dataIndex: 'oper2', key: 'oper2', render(text, record, index) {
          let dom = ""
          if (!record.isPk) {
          
			 dom = <Popconfirm content="确认删除?" placement="bottom"  onClose={self.onDeleteAttr(index, record)}>
                 <Button >删除</Button>

               </Popconfirm>;
          }
          return dom;
        }
      }
    ];

    let columnsCopy = [
      { title: '索引名称', dataIndex: 'copyToColumn', width: '200px', key: 'copyToColumn', render: (text, record, index) => {
        return (
          <input
            className="u-form-control md"
            value={text} type="text"
            onBlur={this.handleCheckNoRepeat(index)}
            onChange={this.handleEditCopyName(index)}
          />
        )
      } },
      { title: '包含字段', dataIndex: 'copyColumn', key: 'copyColumn',render: (text, record, index) => {
        return (
          <Select
            value={text}
            multiple
            onChange={this.handleSelectCopyCol(index)}>
            {TargetColumnOptions}
          </Select>
        )
      } },
      { title: '分词类型', dataIndex: 'analyzer', key: 'analyzer', render: (text, record, index) => {
        return (
          <Select
            value={text}
            onChange={this.handleSelectCopyAnalyzer(index)}>
            <Option value="not_analyzed">不分词</Option>
            <Option value="ngram">模糊分词</Option>
            <Option value="pinyin">拼音分词</Option>
            <Option value="ik_max_word">ik分词</Option>
            <Option value="edgeNgram">前缀分词</Option>
          </Select>
        )
      } },
      { title: '描述', dataIndex: 'remark', key: 'remark', render:(text, record, index) => {
        return (
          <input
            className="u-form-control md"
            value={text} type="text"
            onChange={this.handleEditRemark(index)}
          />
        )
      } },
      { title: '操作', dataIndex: 'id', key: 'id', render: (text, record, index) => {
        return (
          <div>
            
			<Popconfirm content="确认删除?" placement="bottom"  onClose={this.handleDeleteCopyListRow(index, text)}>
			 <Button >删除</Button>

		   </Popconfirm>
          </div>
        )
      } }
    ]

    return (
      <Row className="add-source-manage">
        <Title name="编辑单表模型"/>
        <Col md={12}>
          <Form horizontal>
            <FormGroup>
              <Label>数据源:</Label>
              <Label>{source && source.dbName}</Label>
            </FormGroup>
            <FormGroup>
              <Label>数据库:</Label>
              <Label>{schema && schema.schemaName}</Label>
            </FormGroup>
            <FormGroup>
              <Label>表名称:</Label>
              <Label>{table && table.tbName}</Label>
            </FormGroup>
            <FormGroup>
              <Label>过滤条件:</Label>
              <input
                className="u-form-control"
                ref="filterCondition"
                type="text"
                value={this.state.filterCondition}
                onChange={this.onChangeFilterCondition}
              />
            </FormGroup>
            <FormGroup>
              <Label>数据自动同步:</Label>
              <Checkbox
                checked={this.state.isSync}
                onChange={(e) => {
                  this.OnChangeSyn(e)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>数据同步周期:</Label>
              <Select ref="crontab" value={this.state.crontab}
                      onChange={this.OnChooseSynTime}>
                {timesOptions}
              </Select> 分钟
            </FormGroup>
            <FormGroup>
              <Label>自定义别名:</Label>
              <FormControl
                defaultValue={this.state.alias}
                onBlur={this.changeAlias}
				placeholder="只可输入小写字母或下划线"
              />
            </FormGroup>
          </Form>
          <h3>字段映射</h3>

          <div className="source-table">
            <Table ref="table" columns={columns} data={this.state.columnList} footer={() =><Button onClick={this.onAddNext}>添加一行</Button>} />
          </div>

          <h3>组合条件设置
            <Alert colors="warning" className="alert">
              <Icon type="uf-exc" />
              包含字段：只能是相同类型的字段，不同类型不能混用（比如：索引字段content为文本类型,所有包含字段也只能为文本类型）；分词类型：只适合文本类型的字段（比如VARCHAR等）
            </Alert>
          </h3>

          <div className="source-table">
            {!mark &&
            <Table
              columns={columnsCopy}
              data={this.state.copyList}
              footer={() => <Button onClick={this.onAddCopyRow}>添加一行</Button>}
            />
            }
          </div>
          <div className="footer-buttons">
            {!mark && <Button colors="primary" style={{ marginBottom: 40 }} onClick={this.onSaveDBSource}>保存</Button>}
          </div>
        </Col>

        <PageLoading show={ this.state.showLoading }/>
      </Row>)
  }
}

Edit.contextTypes = {
  router: PropTypes.object
};

export default Edit;
