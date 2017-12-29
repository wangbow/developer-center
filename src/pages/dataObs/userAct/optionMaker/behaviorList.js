const option = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'line',       // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  legend: {
    data: [],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}次'
    }
  },
  xAxis: {
    type: 'time',
    splitNumber: 8,
    minInterval: 1,
    boundaryGap: ['20%', '20%']
  },
  series: [
  ]
};


export default function (data) {

  data = data || [];
  let series = {
    name: '点击量',
    type: 'line',
    showSymbol: false,
    hoverAnimation: false,
    data: data,
  }
  option.series = series;
  return option;

  // data = data || {
  //   legend: [],
  //   data: {}
  // }
  // let legend = data.legend;
  // let series = Object.keys(data.data).map(item => {
  //   return {
  //     name: item,
  //     type: 'bar',
  //     stack: '总量',
  //     barWidth: '15px',
  //     data: data.data[item],
  //   }
  // });

  // option.legend.data = legend;
  // option.series = series;

  // return option;
}