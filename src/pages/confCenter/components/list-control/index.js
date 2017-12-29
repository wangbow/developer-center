import { Component, PropTypes } from 'react';
import { Col, Button, Select} from 'tinper-bee';
import { Link } from 'react-router';

import './index.less';

const Option = Select.Option;

/**
 * 批量下载
 */

const handleDownloadAll = (data) => () => {
  let appName = data[0].value,
    version = data[2].value,
    env = data[1].value;
  if (appName === '' || env === '' || version === '') {
    return;
  }
  window.location.href = `${window.location.origin}/confcenter/api/web/config/downloadfilebatch?appId=${appName}&envId=${env}&version=${version}`;
}

class ListControl extends Component{
  static contextTypes = {
    router: PropTypes.object
  };
  goTo = (value) => () => {
    this.context.router.push(value);
  };
  render() {

    let { data, onSelect } = this.props;


    return (
      <Col className="list-control clearfix">
        <div className="left-btn-group">
          <Button
            shape="squared"
            onClick={ this.goTo('/create')}
            colors="primary">
              创建文件
          </Button>
          <Button
            shape="squared"
            colors="primary"
            onClick={ this.goTo('/createitem')}
            className="button-margin">
              创建项
          </Button>
          <Button
            shape="squared"
            colors="primary"
            className="button-margin"
            onClick={ handleDownloadAll(data) }>
            批量下载
          </Button>
        </div>
        <div className="right-bar">
          {
            data.map((item) => {

             return (
               <Select
                 key={ item.stateName }
                 showSearch
                 optionFilterProp="children"
                 value={ item.value }
                 className="select select-margin"
                 onChange={onSelect(item.stateName)}>
                 {
                   item.children.map((item1, index) => {
                     return (
                       <Option value={ item1.value } key={ index }>{ item1.name }</Option>
                     )
                   })
                 }
               </Select>
             )
            })
          }
        </div>
      </Col>
    )
  }
}

export default ListControl;
