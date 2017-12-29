const option = {
  // title: {
  //   text: '行为来源',
  //   x: 'center'
  // },
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['电脑', '平板', '手机']
  },
  series: [
    {
      name: '行为来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: '电脑' },
        { value: 310, name: '平板' },
        { value: 234, name: '手机' },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};


export default function (data) {
  data = data || {
    legend: [],
    data: [],
  }
  let legend = data.legend;
  option.legend.data = legend;
  option.series[0].data = data.data;
  return option;
}