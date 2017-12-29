import React, {
  Component,
  PropTypes
} from "react";
import {
  Link
} from 'react-router';
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
} from './server';
import Checkbox from 'rc-checkbox';

import "./index.css";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: [],
      synTime: 10,
      filterCondition: "1=1",
      isSync: false,
      detailList: {}

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
    GetDetail(param).then(function(response) {
      let res = response;
      self.setState({
        detailList: res.data.detailMsg.data
      });
    })
  }

  render() {


    let self = this;
    let table, source, filterSynch, singles, schema, alias, copyList;
    let {
      detailList
    } = this.state;
    if (detailList) {
      table = detailList.table;
      source = detailList.source;
      filterSynch = detailList.filterSynch;
      singles = detailList.singles;
      schema = detailList.schema;
      alias = detailList.indexConf ? detailList.indexConf.alias : '';
      copyList = detailList.copyTo;
    }


    const columns = [{
      title: '表字段',
      dataIndex: 'targetColumn',
      key: 'targetColumn'
    }, , {
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
    }];
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
        <Link to="/"><Button >返回</Button></Link>
        <Form horizontal>
          <FormGroup>
            <Label>数据源:</Label>
            <input value={source && source.dbName}/>
          </FormGroup>
          <FormGroup>
            <Label>数据库:</Label>
            <input value={schema && schema.schemaName}/>
          </FormGroup>
          <FormGroup>
            <Label>表名称:</Label>
            <input value={table && table.tbName}/>
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
        <h3>字段映射</h3>

        <div className="source-table">
          <Table ref="table" columns={columns} data={singles}/>
        </div>
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