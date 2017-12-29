import  React,{Component} from 'react';
import PropTypes from 'prop-types';
import Process from './component/process';
import './index.less';

export default function Info (props){

  return (
    <div className="info">
      <div className="info--head">
        <span className="cl cl-robot2 info--head-icon"></span>
        <span className="info--head-cap">当前应用暂无数据哦～您可能未埋点，请查看下面的埋点流程进行设置吧！</span>
      </div>
      <Process  appId={props.appId}/>
    </div>
  )

}

Info.propTyes = {
  appId: PropTypes.string,
}