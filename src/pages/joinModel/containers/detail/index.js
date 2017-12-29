import React, {
  Component,
  PropTypes
} from "react";
import {
  Link
} from 'react-router';
import Title from 'components/Title';
import {
  Button,
  Table,
  FormControl,
  InputGroup,
  Form,
  FormGroup,
  Label,
  Message,
  Select
} from 'tinper-bee';
import {
  GetDetail
} from '../../server';
import Checkbox from 'rc-checkbox';

import "./index.less";
import {formateReltion} from '../../util';
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: [],
      synTime: 10,
      filterCondition: "1=1",
      isSync: false

    }
  }

  componentDidMount() {

    this.onGetDetail();
  }

  onGetDetail = () => {
    let param = {
      masterId: this.props.params.id
    }
    let self = this;
    GetDetail(param,function(response) {
      let res = response;
      self.setState({
        detailList: res.data.detailMsg.data
      });
    })
  }

  toArray = (data) => {
    let arr = [];
    if(!data) return;
    arr.push(data);
    return arr;
  }



  render() {


    let self = this;
    let table, source, filterSynch,main_alias,slaveTables,slaveName, singles, schema, alias, copyList,masterTable;

    let {
      detailList
    } = this.state;
    if(!detailList) return <div></div>;

    source = detailList.source;
    filterSynch = detailList.filterSynch;
    masterTable = detailList.masterTable;
    main_alias = detailList.masterTable && detailList.masterTable.alias;
    slaveTables = detailList.slaveTables;
    slaveName = detailList.slaveName;
    copyList = detailList.masterTable && detailList.masterTable.copyTo;
    schema = detailList.schema;
    alias = detailList.indexConf ? detailList.indexConf.alias : '';

    if(slaveTables && slaveTables.length>0) {
      slaveTables = formateReltion(main_alias,slaveTables);
    }



    const columns = [{
      title: '表字段',
      dataIndex: 'targetColumn',
      key: 'targetColumn'
    }, {
      title: '模型字段',
      dataIndex: 'htableColumn',
      key: 'htableColumn'
    }, {
      title: '索引字段',
      dataIndex: 'indexField',
      key: 'indexField'
    }, {
      title: '分词类型',
      dataIndex: 'analyzer',
      key: 'analyzer',
      render(text, record, index) {

        switch (text) {
          case "not_analyzed":
            return "不分词";
          case "ngram":
            return "模糊分词";
          case "pinyin":
            return "拼音分词";
          case "ik_max_word":
            return "ik分词";
          case "edgeNgram":
            return "前缀分词";
          default:
            return ""
        }
      }
    }, {
      title: '增量标识',
      dataIndex: 'deltaFlag',
      key: 'deltaFlag',
      render(text, record, index) {

        return <Checkbox checked={text}/>;

      }
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark'
    }, {
      title: '删除标识',
      dataIndex: 'deletionFlag',
      key: 'deletionFlag',
      render(text, record, index) {

        return <Checkbox checked={text}/>;

      }
    }, {
      title: '字段别名', dataIndex: 'alias', key: 'alias'
    }];

    let relationColumns = [{
      title: '主表关键字段',
      dataIndex: 'masterKey',
      key: 'masterKey'
    }, {
      title: '从表关键字段',
      dataIndex: 'fromKey',
      key: 'fromKey',
    }]

    let columnsCopy = [{
      title: '索引名称',
      dataIndex: 'copyToColumn',
      key: 'copyToColumn'
    }, {
      title: '包含字段',
      dataIndex: 'copyColumn',
      key: 'copyColumn'
    }, {
      title: '分词类型',
      dataIndex: 'analyzer',
      key: 'analyzer',
      render: (text, record, index) => {
        switch (text) {
          case "not_analyzed":
            return "不分词";
          case "ngram":
            return "模糊分词";
          case "pinyin":
            return "拼音分词";
          case "ik_max_word":
            return "ik分词";
          case "edgeNgram":
            return "前缀分词";
          default:
            return ""
        }
      }
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark'
    }]

    return (
      <div className="add-source-manage">

        <Title name="数据模型详情"/>
        <Form horizontal>
          <FormGroup>
            <Label>数据源:</Label>

            <input value={source && source.sourceName}/>
          </FormGroup>
          <FormGroup>
            <Label>数据库:</Label>
            <input value={schema && schema.schemaName}/>
          </FormGroup>
          <FormGroup>
            <Label>过滤条件:</Label>
            <FormControl ref="filterCondition" type="text" value={filterSynch && filterSynch.filterCondition}/>
          </FormGroup>
          <FormGroup>
            <Label>数据自动同步:</Label>
            <Checkbox ref="test" checked={filterSynch && filterSynch.isSync}/>
          </FormGroup>
          <FormGroup>
            <Label>数据同步周期:</Label>
            <input value={filterSynch && filterSynch.crontab}/>分钟
          </FormGroup>
          <FormGroup>
            <Label>自定义别名:</Label>
            <input value={alias}/>
          </FormGroup>
        </Form>
        <h3>主表:{masterTable && masterTable.tableName}   <span className={"margin-left-30"}>别名:{main_alias}</span>  </h3>

        <div className="source-table">
          <Table ref="table" columns={columns} data={masterTable && masterTable.singles}/>
        </div>

        {slaveTables && slaveTables.length>0 && slaveTables.map(function(item) {
          return (<div className="source-table">
            <h3>从表:{item && item.tableName} <span className={"margin-left-30"}>别名:{item && item.alias}</span>   </h3>
                    <Table ref="table" columns={columns} data={item && item.singles}/>
                    <div className="relation-set">
                      <h3>表关系设置</h3>
                      <span>连接方式:{item.relation.joinType}</span>
                      <Table ref="table" columns={relationColumns} data={item && item.relation.joinCondition}/>
                    </div>
                  </div>)
        })}

        <h3>组合条件设置</h3>

        <div className="source-table">
          <Table
            columns={columnsCopy}
            data={copyList}
          />
        </div>

      </div>)
  }
}

Detail.contextTypes = {
  router: PropTypes.object
};

export default Detail;
