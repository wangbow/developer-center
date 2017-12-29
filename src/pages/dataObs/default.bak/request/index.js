import { splitParam } from '../../../../components/util';

export default function ({
  appId,
}) {
  let providerId = '#providerId#';
  let query = 'appId:' + appId + ' AND providerId:' + providerId;
  //query = 'lId:nginx';//测试使用
  let param = {
    pv: {
      queryParams: '{"index": "iuap","type": "nginx_notype","st": "' + st + '","et": "' + et + '",providerid:"' + providerId + '","tgs": [{"metric": [{"type": "count"}],"query": "' + query + '","group": [{"field": "ts","type": "date_histogram","interval": "' + interval + '","size": ' + size + '}],"nm": "' + appId + '","datatype": "es"}]}'
    },
    uv: {
      queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"field":"remote_addr","type":"cardinality"}],"query":"' + query + '","group":[{ "field":"ts","type":"date_histogram", "interval":"' + interval + '","size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
    },
    bv: {//浏览器类型
      queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"browser.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
    },
    status: {//状态码
      queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"status.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
    },
    systemVersion: {//操作系统类型
      queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"system.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
    },
    province: {//地区
      queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"type":"count"}],"query":"' + query + '","group":[{ "field":"city.raw","type":"terms", "size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
    },
    rt: {//响应时间
      queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"field":"request_time","type":"avg"}],"query":"' + query + '","group":[{ "field":"ts","type":"date_histogram", "interval":"' + interval + '","size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
    },
    qps: {//流量
      queryParams: '{"index":"iuap","type":"nginx_notype","st":"' + st + '","et":"' + et + '",providerid:"' + providerId + '","tgs":[{"metric":[ {"field":"bytes_sent","type":"sum"}],"query":"' + query + '","group":[{ "field":"ts","type":"date_histogram", "interval":"' + interval + '","size":' + size + '}], "nm":"' + appId + '", "datatype":"es "}] }'
    }
  };

  let ret = {};

  Object.keys(param).forEach(key => {
    ret[key] = splitParam(param[key]);
  })

  return ret;
}