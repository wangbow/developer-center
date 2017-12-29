function tagList(data) {
  data = data || [];
  return data.filter(item => {
    let val = item.view.replace(/[:-]/g, '').trim();
    return !/^$|^[0-9]+$/.test(val);
  }).map(item => {
    return {
      name: item.view,
      value: item.count,
    }
  });
}

function keyWordList(data) {
  data = data || [];
  return data.filter(item => {
    let val = item.click_text.replace(/[:-]/g, '').trim();
    return !/^$|^[0-9]+$/.test(val);
  });
}

function fromList(data) {
  data = data || []
  let legend = [];
  let ret = [];
  data.forEach(item => {
    legend.push(item.view);
    ret.push({
      value: item.count,
      name: item.view,
    })
  })

  return {
    data: ret,
    legend: legend,
  }
}

function histogramData(data = {}) {
  data = data || {};
  let graphDataList = data.graphDataList || [];

  let ret = [];

  graphDataList.forEach(item => {
    let total = item.dataList.reduce((total, li) => {
      return total + li.count;
    }, 0);
    ret.push([
      item['x_position'],
      total
    ])
  });

  return ret;

  // data = data || {};
  // let legend = data.dataTypeList || [];
  // let graphDataList = data.graphDataList || [];
  // let ret = {
  //   legend,
  //   data: {},
  // };
  // legend.forEach(item => {
  //   ret.data[item] = [];
  // });

  // graphDataList.forEach(item => {
  //   item.dataList.forEach(li => {
  //     ret.data[li.view].push([
  //       item['x_position'],
  //       li.count
  //     ])
  //   })
  // });

  // return ret;
}

export const parsers = {
  tagList,
  keyWordList,
  fromList,
  histogramData,
}

export default function parser(data) {
  let ret = {};

  Object.keys(data).forEach(key => {
    let pfunc = parsers[key] || (d => d);
    ret[key] = pfunc(data[key]);
  });

  return ret;
}
