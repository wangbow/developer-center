import React,{Component} from 'react';
import {JSONFormatter,dataPart} from '../../../components/util.js';

const options = {
    collapsed: false,
    nl2br: false,
    recursive_collapser: false,
    escape: true,
    strict: false
}
//const formatter = new JSONFormatter(options);


class ConfigPanelDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            versionDetail:{}
        }
    }

    render(){
        const {data} = this.props;
        let formatter = new JSONFormatter(options);
        return (
            <div className="config-list-wraper">
                <div className="config-list">
                  <span className="label">应用名称</span>
                  <span className="value">{data.id}</span>
                </div>
                <div className="config-list">
                  <span className="label">命令</span>
                  <span className="value">{data.cmd}</span>
                </div>
                <div className="config-list">
                    <span className="label">约束</span>
                    <span className="value config_constraints" ></span>
                </div>
                <div className="config-list">
                    <span className="label">依赖</span>
                    <span className="value" dangerouslySetInnerHTML={{__html:formatter.jsonToHTML(data.dependencies)}}></span>
                </div>
                <div className="config-list">
                    <span className="label">标签</span>
                    <span className="value" dangerouslySetInnerHTML={{__html:formatter.jsonToHTML(data.labels)}}></span>
                </div>
                <div className="config-list">
                    <span className="label">Resource Roles</span>
                    <span className="value">{data.acceptedResourceRoles}</span>
                </div>
                <div className="config-list">
                    <span className="label">容器</span>
                    <span className="value" dangerouslySetInnerHTML={{__html:formatter.jsonToHTML(data.container)}}></span>
                </div>
                <div className="config-list">
                    <span className="label">CPU</span>
                    <span className="value">{data.cpu}</span>
                </div>
                <div className="config-list">
                    <span className="label">环境</span>
                    <span className="value" dangerouslySetInnerHTML={{__html:formatter.jsonToHTML(data.env)}}></span>
                </div>
                <div className="config-list">
                    <span className="label">Executor</span>
                    <span className="value">{data.executor}</span>
                </div>
                <div className="config-list">
                    <span className="label">健康检查</span>
                    <span className="value" dangerouslySetInnerHTML={{__html:formatter.jsonToHTML(data.healthChecks)}}></span>
                </div>
                <div className="config-list">
                    <span className="label">实例</span>
                    <span className="value">{data.instances}</span>
                </div>
                <div className="config-list">
                    <span className="label">IP地址</span>
                    <span className="value">{data.ipAddress}</span>
                </div>
                <div className="config-list">
                    <span className="label">内存</span>
                    <span className="value">{data.mem}M | {Number(data.mem)*Number(data.instances)}M</span>
                </div>
                <div className="config-list">
                    <span className="label">磁盘空间</span>
                    <span className="value">{data.disk}</span>
                </div>
                 <div className="config-list">
                    <span className="label">端口</span>
                    <span className="value" dangerouslySetInnerHTML={{__html:formatter.jsonToHTML(data.portDefinitions)}}></span>
                </div>
                <div className="config-list">
                  <span className="label">失败重启间隔系数</span>
                  <span className="value">{data.backoffFactor}</span>
                </div>
                <div className="config-list">
                  <span className="label">失败最小重启间隔</span>
                  <span className="value">{data.backoffSeconds}</span>
                </div>
                <div className="config-list">
                  <span className="label">失败最大重启间隔</span>
                  <span className="value">{data.maxLaunchDelaySeconds}</span>
                </div>
                <div className="config-list">
                  <span className="label">URIs</span>
                  <span className="value">{data.uris}</span>
                </div>
                <div className="config-list">
                  <span className="label">用户</span>
                  <span className="value">{data.user}</span>
                </div>
                <div className="config-list">
                  <span className="label">发布时间</span>
                  <span className="value">{dataPart(new Date(data.version),'yyyy-MM-dd hh:mm:ss')}</span>
                </div>
            </div>
        )
    }

}


export default ConfigPanelDetail;
