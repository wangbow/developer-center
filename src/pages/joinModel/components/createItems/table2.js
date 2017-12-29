import React, {Component, PropTypes} from 'react';
import {
  Row,
  Col,
  Button,
  Table,
  FormControl,
  Popconfirm,
  Select,
  Alert,
  Icon
} from 'tinper-bee';

import Checkbox from 'rc-checkbox';

import {success, err,warn} from 'components/message-util';


import {
  validStrByReg
} from 'components/util';


class Table2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      compoList:[],
      copyList: [],
      tbNameList: []
    }
  }


  componentWillReceiveProps(nextProps,nextState) {
    // let copyList = [];
    if(JSON.stringify(nextProps.tbNameList) != JSON.stringify(this.state.tbNameList)) {

      this.setState({tbNameList:nextProps.tbNameList});
    }


    let compoList = this.getSessionKey();
    let {copyList} = this.props || [];
    let length = 0;
    let copyColumn = [];
    copyList.forEach((item) =>{
       copyColumn = item.copyColumn;
       length = copyColumn?copyColumn.length:0;
      for(let i=0;i<length;i++){
        if(compoList.indexOf(copyColumn[i]) < 0){
          item.copyColumn.splice(i,1);
        }
      }
    })
    //copyList剔除不存在的字段，子表修改的数据需要返回给主表用sessionStorage保存
    sessionStorage.setItem("copyList",JSON.stringify(copyList));
    //this.props.onInputChangeByName(copyList,"copyList");


    //编辑
    // if(nextProps.editKey !== this.props.editKey){
    //   this.setState({copyList:nextProps.copyList});
    // }
    // if(!nextProps.currentDBName) {
    //   this.setState({copyList: []});
    // }
  }

  /**
   * 添加一行复制字段
   */
  onAddCopyRow = () => {
    let { copyList } = this.props;
    let item = {
      "copyToColumn": "",
      "copyColumn": [],
      "analyzer": "not_analyzed",
      "remark":""
    };
    copyList.push(item);
    // this.setState({copyList:copyList})
    this.props.onInputChangeByName(copyList,"copyList");
  }

   /**
   * 校验是否重复
   * @param index
   */
  handleCheckNoRepeat = (index) => (e) => {
    let field = e.target.value, repeatFlag = false;
    let { copyList } = this.props;
    let compoList = this.getSessionKey();
    compoList.forEach((item) => {
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
      this.props.onInputChangeByName( copyList,"copyList");
      return warn('索引名称不能重复。');
    }
  }

   /**
   * 输入复制字段索引
   */
  handleEditCopyName = (index) => (e) => {
    let { copyList } = this.props;


    if(e.target.value!="" && !validStrByReg('/^[a-z_]+$/', e.target.value)) {

      warn("只能输入小写字母或者下划线");

    }else {
      copyList[index].copyToColumn = e.target.value;

      this.props.onInputChangeByName( copyList,"copyList");
    }
  }

  /**
   * 编辑描述
   */
  handleEditRemark = (index) => (e) => {
    let { copyList } = this.props;
    copyList[index].remark = e.target.value;

    // this.setState({
    //   copyList
    // })
    self.props.onInputChangeByName(copyList,"copyList");
  }


  onChangeCopyColumn = (e, index,name) =>{
    let self = this;
    let  { copyList } = self.props;
    copyList[index][name] = e;
    // self.setState({
    //   copyList
    // })
     self.props.onInputChangeByName(copyList,"copyList");
  }

    /**
   * 删除一行复制字段
   */
  handleDeleteCopyListRow = (index) => () => {
    let { copyList } = this.props;
    copyList.splice(index, 1);
    // this.setState({
    //   copyList
    // })
    this.props.onInputChangeByName(copyList,"copyList");
  }
  //数据去重
  unique = (data) => {
    var res = [];
    var json = {};
    for(var i = 0; i < data.length; i++){
    if(!json[data[i]]){
     res.push(data[i]);
     json[data[i]] = 1;
    }
    }
    return res;
  }

  getSessionKey = () => {
    let from = JSON.parse(sessionStorage.getItem("from")) || [];
    let singles;
    // let fromColumns =[];
    let compoList = [];
    from.forEach((item,index)=>{
      singles = item.singles ||[];
      singles.forEach((column)=>{
        // fromColumns.push(column.targetColumn);
        compoList.push(column.alias);
      })
    })


    // if(fromColumns) {
    //   for(let i in fromColumns) {
    //     compoList.push.apply(compoList, fromColumns[i]);
    //   }
    // }


    //获取主表列表字段
    let masterObj =  JSON.parse(sessionStorage.getItem("master")) || {};
    let masterSingleArr = masterObj.singles || [];
    let masterAliasArr = [];
    masterSingleArr.forEach((column)=>{
      // fromColumns.push(column.targetColumn);
      masterAliasArr.push(column.alias);
    })
    if(masterAliasArr) {
      compoList.push.apply(compoList, masterAliasArr);
    }

    return this.unique(compoList);
  }

  static contextTypes = {
    router: PropTypes.object
  };

  render() {
   let{mark,fromTargetColumns,onInputChangeByName,onInputChangeByArray} = this.props;
   let copyList = JSON.parse(sessionStorage.getItem("copyList")) ||this.props.copyList;
   let self = this;

   let compoList = this.getSessionKey();
   let compoListOption = [];

   compoList.forEach(function(item,index) {
      compoListOption.push(
        <Option
          key={index}
          value={item}>{item}
        </Option>)
    })


   let columnsCopy = [
      { title: '索引名称', dataIndex: 'copyToColumn',width: '300px', key: 'copyToColumn', render: (text, record, index) => {
        return (
          <input
            className="u-form-control md"
            value={text} type="text"
            onBlur={this.handleCheckNoRepeat(index)}
            onChange={this.handleEditCopyName(index)}
          />
        )
      } },
      { title: '包含字段别名', dataIndex: 'copyColumn', key: 'copyColumn',render: (text, record, index) => {
        return (
          <Select
            value={text}
            multiple
            onChange={(e)=>this.onChangeCopyColumn(e, index,"copyColumn")}>
            {compoListOption}
          </Select>
        )
      } },
      { title: '分词类型', dataIndex: 'analyzer', key: 'analyzer', render: (text, record, index) => {
        return (
          <Select
            value={text}
            onChange={(e)=>this.onChangeCopyColumn(e, index,"analyzer")}>
            <Option value="not_analyzed">不分词</Option>
            <Option value="ngram">模糊分词</Option>
            <Option value="pinyin">拼音分词</Option>
            <Option value="ik_max_word">ik分词</Option>
            <Option value="edgeNgram">前缀分词</Option>
          </Select>
        )
      } },
      { title: '描述', dataIndex: 'remark', key: 'remark', render: (text, record, index) => {
        return (
          <input
            className="u-form-control md"
            value={text} type="text"
            onChange={(e)=>this.onChangeCopyColumn(e.target.value, index,"remark")}
          />
        )
      } },
      { title: '操作', dataIndex: 'isPk', key: 'isPk', render: (text, record, index) => {
        return (
          <div>
             <Popconfirm content="确认删除?" placement="bottom"  onClose={this.handleDeleteCopyListRow(index)}>
             <Button >删除</Button>

           </Popconfirm>
          </div>
        )
      } }
    ]
    return(
     <Col md={12}>
       <h3>
		组合条件设置
        <Alert colors="warning" className="alert">
          <Icon type="uf-exc" />
          包含字段：只能是相同类型的字段，不同类型不能混用（比如：索引字段content为文本类型,所有包含字段也只能为文本类型）；分词类型：只适合文本类型的字段（比如VARCHAR等）
        </Alert>
      </h3>

      <div className="source-table">
        {!mark &&
        <Table
          columns={columnsCopy}
          data={copyList}
          footer={() => <Button onClick={self.onAddCopyRow}>添加一行</Button>}
        />
        }
      </div>

    </Col>
    );

  }
}


export default Table2;



