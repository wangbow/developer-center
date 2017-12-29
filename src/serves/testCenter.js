import React, {Component} from 'react';
import axios from 'axios';
import {Message} from 'tinper-bee';

const serveUrl = {
  getTestlist:'/cloudtest/boot_testcase/testcase',
  deleteTestCase:'/cloudtest/boot_testcase/deleteTestCase',
  viewTestCases:'/cloudtest/boot_testcase/detail/',
  deleteCaseScript:'/cloudtest/boot_testcase/deleteCaseScript/',
  deleteTestJob:'/cloudtest/boot_testcase/deleteTestCase',
  saveCase:'/cloudtest/boot_testcase/saveCaseScript',
  getScriptlist:'/cloudtest/boot_testscript/testscript',
  downLoadScript:'/cloudtest/boot_testcase/download',
  downLoadCase:'/cloudtest/boot_testcase/downloads',
  downLoadCaseBefore:'/cloudtest/boot_testcase/downloadsBefore',
  generateJob:'/cloudtest/boot_testcase/testJob',
  deleteScript:'/cloudtest/boot_testscript/delete',
  generateCase:'/cloudtest/boot_testscript/testCase',
  updateScript:'/cloudtest/boot_testscript/update',
  saveScript:'/cloudtest/boot_testscript/save',
  downLoadSample:'/cloudtest/boot_testscript/downloadDemo',
  interfaceJobList:'/cloudtest/boot_itfjob/itfjob',
  viewRestJob:'/cloudtest/boot_itfjob/detail/',
  saveRestJob:'/cloudtest/boot_itfjob/saveRestJob',
  deleteRestJob:'/cloudtest/boot_itfjob/deleteRestJob',
  excuteRestJobBefore:'/cloudtest/boot_itfjob/executeJobBefore/',
  excuteRestJob:'/cloudtest/boot_itfjob/executeJob/',
  restJobReports:'/cloudtest/restreport/restreport',
  resJobReportDetail:'/cloudtest/restreport/detail',
  deleteRestReports:'/cloudtest/restreport/delete',

}


const headers = {"Content-Type": 'application/json'};

/**
 * 获取当前租户下的用例列表
 */
export function getCasesList(param) {
  return axios.get(serveUrl.getTestlist + param)
}

/**
 * 删除用例
 */
export function deleteTestCase(data) {
  return axios({
    method: 'post',
    url: serveUrl.deleteTestJob,
    headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
    data: `data= ${JSON.stringify(data)}`
  })
}
/**
 * 查看用例详细信息
 */
export function viewTestCases(param) {
  return axios.get(serveUrl.viewTestCases + param)
}

/**
 * 删除用例与脚本的关系
 */
export function deleteCaseScript(param,data) {
  return axios({
    method: 'post',
    url: serveUrl.deleteCaseScript + param,
    headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
    data: `data=${JSON.stringify(data)}`
  })
}
/**
 * 保存用例
 */
export function saveCase(data) {
  return axios.post(serveUrl.saveCase , data)
}


/**
 * 获取脚本列表
 */
export function getScriptlist(param) {
  return axios.get(serveUrl.getScriptlist + param)
}

/**
 * 下载脚本
 */
export function downLoadScript(param) {
  return axios.get(serveUrl.downLoadScript + `?testscriptId=${param}`)
}

/**
 * 下载用例
 */
export function downLoadCase(param) {
  return axios.get(serveUrl.downLoadCase + `?testcaseId=${param}`)
}

/**
 * 下载用例前判断该用例下是否有脚本
 */
export function downLoadCaseBefore(param) {
  return axios.get(serveUrl.downLoadCaseBefore + `?testcaseId=${param}`)
}

/**
 * 生成测试任务
 */
export function generateJob(param) {
  return axios.post(serveUrl.generateJob, param)
}

/**
 * 生成用例
 */
export function generateCase(param) {
  return axios.post(serveUrl.generateCase, param)
}

/**
 * 删除脚本
 */
export  function deleteScript(data) {
  return axios({
    method: 'post',
    url: serveUrl.deleteScript,
    headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
    data: `data= ${JSON.stringify(data)}`
  })
}
/**
 * 下载脚本样例
 */
export function downLoadSample() {
  return axios.get(serveUrl.downLoadSample)
}

/**
 * 新增保存脚本
 */
export function saveScript(data) {
  return axios.post(serveUrl.saveScript, data)
}

/**
 * 更新脚本
 */
export function updateScript(data) {
  return axios.post(serveUrl.updateScript, data)
}

/**
 * 获取当前租户下的接口任务列表
 */
export function restJobList(param) {
  return axios.get(serveUrl.interfaceJobList + param)
}

/**
 * 查看接口任务
 */
export function viewRestJob(param) {
  return axios.get(serveUrl.viewRestJob + param)
}
/**
 * 保存接口任务
 */
export function saveRestJob(data) {
  return axios.post(serveUrl.saveRestJob ,data)
}

/**
 * 删除接口任务
 */
export function deleteRestJob(data) {
  return axios({
    method: 'post',
    url: serveUrl.deleteRestJob,
    headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
    data: `data=${JSON.stringify(data)}`
  })
}

/**
 * 执行接口任务时改变状态
 */
export function excuteRestJobBefore(data) {
  return axios.post(serveUrl.excuteRestJobBefore + data)
}
/**
 * 执行接口任务
 */
export function excuteRestJob(data) {
  return axios.post(serveUrl.excuteRestJob + data)
}

/**
 * 获取执行后接口任务的所有历史报告
 */
export function restJobReports(param) {
  return axios.get(serveUrl.restJobReports + param)
}

/**
 * 获取单次报告的详细信息
 */
export function resJobReportDetail(param) {
  return axios.get(serveUrl.resJobReportDetail + param)
}


/**
 * 删除报告
 */
export function deleteRestReports(data) {
  return axios({
    method: 'post',
    url: serveUrl.deleteRestReports,
    headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'},
    data: `data=${JSON.stringify(data)}`
  })
}








