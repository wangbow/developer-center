const mapper = {
  '15m': '15min',
  '1h': '1h',
  '4h': '4h',
  '12h': '12h',
  '24h': '1d',
  '1week': '1w',
  'today': 'now-nd',
  '30m': '30min',
  'thisWeek': 'now-nw',
  'thisMonth': 'now-nmon',
  '30d': '30d',
  'thisyear': 'now-ny',
  '60d': '60d',
  'yesterday': 'now-yd',
  '90d': '90d',
  'beforeYesterday': 'now-ld',
  '6M': '6mon',
  'lastWeekToday': 'now-lw',
  '1y': '1y',
  'lastWeek': 'now-yw',
  '2y': '2y',
  'lastMonth': 'now-ymon',
  '5y': '5y',
  'lastYear': 'now-yy',
}

Object.keys(mapper).forEach(key => {
  if (!mapper[mapper[key]]) {
    mapper[mapper[key]] = key;
  }
});

mapper.notOther = (value) => {
  if(!value){
    return true;
  }
  return ['15min', '1h', '12h', '24h', '1w'].indexOf(value) >= 0;
}

mapper.name = {
  'now-nd': '今天',
  'now-nw': '本周',
  'now-nmon': '本月',
  'now-ny': '今年',
  'now-yd': '昨天',
  'now-ld': '前天',
  'now-lw': '上周今天',
  'now-yw': '前一周',
  'now-ymon': '前一月',
  'now-yy': '前一年',
  '30min': '30分钟',
  '4h': '4小时',
  '30d': '30天',
  '60d': '60天',
  '90d': '90天',
  '6mon': "6月",
  '1y': '1年',
  '2y': '2年',
  '5y': '5年'
}

export default mapper;