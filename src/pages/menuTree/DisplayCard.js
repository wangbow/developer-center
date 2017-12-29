import React from 'react'
import { Panel, Icon } from 'tinper-bee'

const URLMAP = {
    url : 'URL',
    plugin : '插件',
    view : '布局'
};

const DisplayCard = (data) => {

    if(!data.name){
        return (<span>没有数据</span>)
    }
    return (
        <div className='info-list'>
            <div className="ipass-list">
                <span className="label">菜单名称 ：</span>
                <span className="value">{ data.name }</span>
            </div>
            <div className="ipass-list">
                <span className="label">菜单编码 ：</span>
                <span className="value">{data.code}</span>
            </div>
            <div className="ipass-list">
                <span className="label">是否虚拟菜单 ：</span>
                <span className="value">{data.isvirmenu ? "是" : "否"}</span>
            </div>
            <div className="ipass-list">
                <span className="label">菜单分类 ：</span>
                <span className="value">{data.category === 'pass' ? "云服务" : "云引擎"}</span>
            </div>
            <div className="ipass-list">
                <span className="label">菜单类型 ：</span>
                <span className="value">{data.mtype === 'mgr' ? "管理类" : "业务类"}</span>
            </div>
            {
                data.isvirmenu ? "" : (
                    <div>
                        <div className="ipass-list">
                            <span className="label">URL ：</span>
                            <span className="value">{data.location}</span>
                        </div>
                        <div className="ipass-list">
                            <span className="label">URL类型 ：</span>
                            <span className="value">{URLMAP[data.locationtype]}</span>
                        </div>
                    </div>
                )
            }

            <div className="ipass-list">
                <span className="label">图标 ：</span>
                <span className="value">
                        <Icon className={`${data.icon}`} />
                    </span>

            </div>


            <div className="ipass-list">
                <span className="label">是否新窗口打开 ：</span>
                <span className="value">{data.isnewopen ? "是" : "否"}</span>
            </div>
            <div className="ipass-list">
                <span className="label">是否启用 ：</span>
                <span className="value">{data.isenable ? "是" : "否"}</span>
            </div>
            <div className="ipass-list">
                <span className="label">显示顺序 ：</span>
                <span className="value">{data.sort}</span>
            </div>
            <div className="ipass-list">
                <span className="label">是否受权限控制 ：</span>
                <span className="value">{data.undercontrol ? "是" : "否" }</span>
            </div>
        </div>
    )
};

export default DisplayCard;

