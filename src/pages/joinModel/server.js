import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';
//import { splitParam } from 'api/util'

const localUrl = {
  searchSource: "/api/searchsource.json"
}

const serveUrl = {
  searchSource: "/opensearch-manage-platform/web/v1/search/search",
  saveJoinSource: "/opensearch-manage-platform/web/v1/mapping/join/save",
  updateJoinSource:"/opensearch-manage-platform/web/v1/mapping/join/update",
  joinPage: "/opensearch-manage-platform/web/v1/mapping/join/page",
  deleteJoin: "/opensearch-manage-platform/web/v1/mapping/join/delete",
  detailJoin: "/opensearch-manage-platform/web/v1/mapping/join/detail",
  getFormRelation:"/opensearch-manage-platform/web/v1/mapping/join/slavepage"

}

const headers = { "Content-Type": 'application/json'};

/**
 * 获取上传war包中的config信息
 * @param param
 * @param callback
 * @constructor
 */
export function SearchSourceBySql(param) {

    return axios.post(serveUrl.searchSource,param)
}

export function SaveJoinSource(param,id,callback) {
    //正式改成post
   let url = "";
   if(id){
      url = serveUrl.updateJoinSource;
    }else {
      url = serveUrl.saveJoinSource;
    }
    axios({
        url: url,
        method: "POST",
        data:param,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function GetJoinPage(param,callback) {
    //正式改成post
    axios.post(serveUrl.joinPage,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function DeleteJoin(param,callback) {
    //正式改成post
    axios.post(serveUrl.deleteJoin,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function GetDetail(param,callback) {
    //正式改成post
    axios.post(serveUrl.detailJoin,param).then(function(response){
       if(callback instanceof Function) {
           callback(response)
       }
   }).catch(function(err){
       console.log(err);
   });
}

export function GetFormRelation (param,callback) {
  axios.post(serveUrl.getFormRelation,param).then(function(response){
    if(callback instanceof Function) {
      callback(response)
    }
  }).catch(function(err){
    console.log(err);
  });
}

