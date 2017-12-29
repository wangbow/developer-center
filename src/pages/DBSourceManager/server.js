import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';
import {splitParam} from '../../components/util';
const localUrl = {
  getdbSource: "/api/dbsource.json",
  searchSource: "/api/searchsource.json"

}

const serveUrl = {
  getdbSource: "/opensearch-manage-platform/web/v1/dbsource/page",
  checkLink: "/opensearch-manage-platform/web/v1/dbsource/check",
  addSource : "/opensearch-manage-platform/web/v1/dbsource/save",
  searchSource: "/opensearch-manage-platform/web/v1/dbsource/search",
  detail: "/opensearch-manage-platform/web/v1/dbsource/detail",
  getGatabase: "/opensearch-manage-platform/web/v1/dbsource/database",
  deleteSource: "/opensearch-manage-platform/web/v1/dbsource/delete",
  updateSource: "/opensearch-manage-platform/web/v1/dbsource/update",
}

const headers = { "Content-Type": 'application/json'};

/**
 * 获取上传war包中的config信息
 * @param param
 * @param callback
 * @constructor
 */
export function GetSourceList(param,callback) {
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

    axios.post(serveUrl.addSource,param).then(function(response){
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

export function CheckLink(param,callback) {

    return axios.post(serveUrl.checkLink,param)
}

export function GetDetail(param) {
    //正式改成post
   return axios.post(serveUrl.detail,param)
}

export function GetGatabase(param,callback) {
    //正式改成post
   axios.post(serveUrl.getGatabase,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function DeleteSource(param,callback) {
    //正式改成post
   axios.post(serveUrl.deleteSource,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function UpdateSource(param,callback) {
    //正式改成post
   axios.post(serveUrl.updateSource,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}



