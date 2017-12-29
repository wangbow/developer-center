import React,{Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';
//import { splitParam } from 'api/util'

const localUrl = {
  searchSource: "/api/searchsource.json"

}

const serveUrl = {
  searchSource: "/opensearch-manage-platform/web/v1/search/search",


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

