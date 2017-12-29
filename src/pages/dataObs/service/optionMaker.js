import maker from '../browser/optionMaker';


export default function (data = []) {
  return data.map(item => {
    let option = maker({
      seriesType: data.graph_type,
      unit: '次',
      formatterName: '调用次数'
    }, item);
    return {
      option,
      origin: item,
    }
  })
}