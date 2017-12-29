import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';
import {splitParam} from '../../components/util';

const localUrl = {
  getModalSource: "/posts/",
  searchSource: "/api/searchsource.json",
  getTable: "/peizhitime/",
  getColumn: "/posts/"

}

const serveUrl = {
  getdbSource: "/opensearch-manage-platform/web/v1/dbsource/page",
  getModalSource: "/opensearch-manage-platform/web/v1/table/page",
  addSource : "/opensearch-manage-platform/web/v1/mapping/save",
  getTable: "/opensearch-manage-platform/web/v1/table/tables",
  getColumn: "/opensearch-manage-platform/web/v1/column/columns",
  saveColumn: "/opensearch-manage-platform/web/v1/mapping/save",
  deleteColumn: "/opensearch-manage-platform/web/v1/column/delete",
  updateColums: "/opensearch-manage-platform/web/v1/mapping/save",
  saveSource: "/opensearch-manage-platform/web/v1/mapping/save",
  createHBase:"/opensearch-manage-platform/web/v1/createhbase/createHBase",
  detail: "/opensearch-manage-platform/web/v1/mapping/detail",
  deleteSource: "/opensearch-manage-platform/web/v1/mapping/delete",
  updateSource: "/opensearch-manage-platform/web/v1/mapping/update",
  dataBaseSource: "/opensearch-manage-platform/web/v1/dbsource/database"
}

const headers = { "Content-Type": 'application/json'};

/**
 * 获取上传war包中的config信息
 * @param param
 * @param callback
 * @constructor
 */
export function GetSourceList(param,callback) {
    let lintParam = splitParam(param);
    console.log(lintParam);
    axios.post(serveUrl.getModalSource,param).then(function(response){
        if(callback instanceof Function) {
            callback(response)
        }
    }).catch(function(err){
        console.log(err);
    });
}
export function GetDBSourceList(param,callback) {
    axios({
        url:serveUrl.getdbSource,
        method: "POST",
        data:param,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }
  ).then(function(response){
        if(callback instanceof Function) {
            callback(response)
        }
    }).catch(function(err){
        console.log(err);
    });
}


export function GetAddSource(param,callback) {

    axios.post(serveUrl.addSource).then(function(response){
        if(callback instanceof Function) {
            callback(response)
        }
    }).catch(function(err){
        console.log(err);
    });
}
export function GetAddImportSource(param,callback) {

    axios.post(serveUrl.addSource).then(function(response){
        if(callback instanceof Function) {
            callback(response)
        }
    }).catch(function(err){
        console.log(err);
    });
}
export function SearchSource(param,callback) {

    axios.post(serveUrl.searchSource).then(function(response){
        if(callback instanceof Function) {
            callback(response)
        }
    }).catch(function(err){
        console.log(err);
    });
}
export function GetTableList(param,callback) {
     //正式改成post
    axios.post(serveUrl.getTable,param).then(function(response){
        if(callback instanceof Function) {
            callback(response)
        }
    }).catch(function(err){
        console.log(err);
    });
}
export function GetColumnList(param,callback) {
     //正式改成post
    axios({
        url:serveUrl.getColumn,
        method: "POST",
        data:param,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(function(response){
        if(callback instanceof Function) {
            callback(response)
        }
    }).catch(function(err){
        console.log(err);
    });
}

export function SaveColumn(param,callback) {
    //正式改成post
   axios.post(serveUrl.saveColumn,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function SaveDBSource(param,callback) {
    //正式改成post
   axios.post(serveUrl.saveSource,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}
export function DeleteColumn(param,callback) {
    //正式改成post
   axios.post(serveUrl.deleteColumn,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function UpdateColumn(param,callback) {
    //正式改成post
   axios.post(serveUrl.updateColums,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function CreateHBase(param,callback) {
    //正式改成post
   axios.post(serveUrl.createHBase,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function GetDetail(param) {
    //正式改成post
   return axios.post(serveUrl.detail,param)
}

export function DeleteSource(param,callback) {
    //正式改成post
   return axios.post(serveUrl.deleteSource,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   })
}

export function UpdateSource(param) {
    //正式改成post
   return axios.post(serveUrl.updateSource,param)
}

export function GetDataBaseSourceList(param,callback) {
    //正式改成post
   axios.post(serveUrl.dataBaseSource,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

