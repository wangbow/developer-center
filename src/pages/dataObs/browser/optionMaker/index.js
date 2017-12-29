function parser(data) {
  data = data || {};
  let graphDataList = data.graphDataList || [];
  let ret = [];

  graphDataList.forEach(item => {
    item.dataList.forEach(li => {
      ret.push([
        item['x_position'],
        li.count
      ])
    })
  });

  return ret;
}

export default function opiontMaker({
  title = '',
  seriesType = 'line',
  unit = 'ms',
  formatterName = '时间'
}, data) {
  let option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let { data } = params[0];
        let t = new Date(data[0]);
        let date = t.toLocaleDateString();
        let time = t.toLocaleTimeString(undefined, { hour12: false })

        return `${date},${time}<br />${formatterName}: ${data[1]} ${unit}`;
      },
      axisPointer: {
        type: 'line',
        animation: false,
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: ['20%', '20%'],
      splitNumber: 8,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: `{value}${unit}`
      },
      splitLine: {
        show: false
      }
    },
    series: [{
      type: seriesType,
      showSymbol: false,
      hoverAnimation: false,
      data: parser(data),
    }]
  }

  return option;
}