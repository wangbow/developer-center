import React, {
  Component
} from "react";
import ReactDOM from "react-dom";
import {
  Link
} from "react-router";
import {
  Row,
  Col,
  Button,
  Table,
  FormControl,
  InputGroup,
  FormGroup,
  Label,
  Message,
  Pagination,
  Icon
} from 'tinper-bee';
import {
  SearchSourceBySql
} from './server';
import Title from 'components/Title';
import PageLoading from 'components/loading';

import "./index.css";
const Base64 = {

  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode: function(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
  },

  // public method for decoding
  decode: function(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    }

    output = Base64._utf8_decode(output);

    return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode: function(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode: function(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while (i < utftext.length) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }

    return string;
  }

}


class SearchDataManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: [],
      keysArray: [],
      showLoading: false
    }
  }

  componentDidMount() {

  }

  verifySearchValue = (value) => {
    if (value.indexOf("limit") > 0) {
      Message.create({
        content: "不能包含limit",
        color: 'danger',
        duration: 4.5
      });
      return false;
    }
    if (value != "") {
      return Base64.encode(value);
    }
  }

  getList = (params) => {
    this.setState({
      showLoading: true
    });
    let self = this;
    SearchSourceBySql(params).then(function(response) {
      let res = response;


      if (res.data.success == "success") {
        if (res.data.message) {
          Message.create({
            content: res.data.message,
            color: 'info',
            duration: 2
          });
        }

        let data = res.data.detailMsg.data;
        let keysArray = [];
        if (data && data.list.length > 0) {
          keysArray = self.getKeys(data.list);
        }

        self.setState({
          searchData: data,
          keysArray: keysArray
        });
      } else {
        //如果诶呦数据复制为空
        self.setState({
          searchData: [],
          keysArray: []
        });
      }
      this.setState({
        showLoading: false
      });
    }).catch((e) => {
      this.setState({
        showLoading: false
      });
    })
}
  onSearchSql = () => {
    let self = this;
    let value = ReactDOM.findDOMNode(this.refs.sqlValue).value;
    let base64Value = this.verifySearchValue(value);
    if (!base64Value) return;
    let param = {
      sql: base64Value,
      number: 0,
      size: "10",
    };
   this.getList(param);


  }

  getKeys = (data) => {
    let keysArray = [];

    for (let key in data[0]) {
      keysArray.push(key);
    }
    keysArray.sort();
    return keysArray;
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });

    let self = this;
    let value = ReactDOM.findDOMNode(this.refs.sqlValue).value;
    let base64Value = this.verifySearchValue(value);
    if (!base64Value) return;
    let param = {
      sql: base64Value,
      number: eventKey - 1,
      size: "10",
    };
    this.getList(param);


  }


  render() {
    const columns = [];
    let keysArray = this.state.keysArray;
    keysArray.map(function(item, index) {
      columns.push({
        title: item,
        dataIndex: item,
        key: `${item}&${index}`,
        render(text, record, index) {
          return <a className="text-eclipse" title={text}>{text}</a>
        }
      })
    })


    return (
      <Row className="data-source-manage">
        <Title showBack={false} name="数据检索"/>
        <Col md={12}>
          <FormGroup>
            <Label>SQL查询:</Label>
            <textarea ref="sqlValue" placeholder="select * from db_table"/>
            <Button onClick={this.onSearchSql}>查询</Button>
            <a target="_blank" href="https://github.com/iuap3/cloud_developer_center/blob/master/articles/cloud/3-/opensearch-help.md">
              <Icon type="uf uf-qm-c"/>查看帮助文档
            </a>
          </FormGroup>
          <div className="search-result">
            <span>数据共{(this.state.searchData && this.state.searchData.total) || 0}条</span>
          </div>
          <div className="source-table">
            <Table columns={columns} data={this.state.searchData && this.state.searchData.list}/>
          </div>
          <div className="footer-pagination">

            <Pagination
              first
              last
              prev
              next
              boundaryLinks
              items={this.state.searchData && this.state.searchData.totalPage}
              maxButtons={5}
              activePage={this.state.searchData && Number(this.state.searchData.number) + 1}
              onSelect={this.handleSelect.bind(this)}/>
          </div>
        </Col>
        <PageLoading show={ this.state.showLoading }/>
      </Row>)
  }
}

export default SearchDataManager;
