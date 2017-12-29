import './china';

export default function chinaMap({
  title = '全国地区访问量',
}, ) {
  const option = {
    title: {
      text: title,
      textStyle: {
        color: '#333333',
        fontWeight: 'bolder',
        fontSize: 13
      },
      x: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: ['']
    },
    dataRange: {
      x: 'left',
      y: 'bottom',
      splitNumber: 6,
      splitList: [
        { start: 1500 },
        { start: 1000, end: 1500 },
        { start: 500, end: 1000 },
        { start: 100, end: 500 },
        { start: 50, end: 100 },
        { end: 50 },
      ]
    },
    series: [
      {
        name: '',
        type: 'map',
        mapType: 'china',
        roam: false,
        itemStyle: {
          normal: {
            label: {
              show: false,
              textStyle: {
                color: "rgb(249, 249, 249)"
              }
            }
          },
          emphasis: { label: { show: true } }
        },
        data: data,
      }
    ]
  };

  return option;
}