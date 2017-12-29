import axios from 'axios';
import { Message } from 'tinper-bee';

const serveUrl = {
  userAct: '/iuapInsight/behavior/select',
  browser: '/iuapInsight/browser/select',
  customSet: '/iuapInsight/custom/select',
  customGet: '/iuapInsight/custom/selectCustom',
}


export function userAct({ appId, timeId }) {

  let query = `?app_id=${appId}&time_code=${timeId}`;
  return axios.post(serveUrl.userAct + query, {
    app_id: appId,
    time_code: timeId,
  }).then(res => res.data)
    .then(data => {
      if (!data) {
        return {
          "keyWordList": null,
          "tagList": null,
          "behaviorList": null,
          "topList": null,
          "fromList": null,

        }
      }
      return data;
    })
}


export function browser({ appId, timeId }) {
  let query = `?app_id=${appId}&time_code=${timeId}`;
  return axios.post(serveUrl.browser + query, {
    app_id: appId,
    time_code: timeId,
  }).then(res => res.data)
    .then(data => {
      if (!data) {
        return {
          "t_dns": null,
          "t_white": null,
          "t_request": null,
          "t_domready": null,
          "t_all": null,
          "t_tcp": null,
          "jserror": null,
        }
      }
      return data;
    })
}