
import './macarons';
/**
 * 获得图表配置 option
 * @param type 图表名称
 * @param xAis  x轴坐标
 * @param seriesData y轴值
 * @param unit 单位
 * @returns {{tooltip: {trigger: string}, legend: {data: [string,string,string,string,string], bottom: string}, backgroundColor: string, grid: {left: string, right: string, top: string, containLabel: boolean}, xAxis: [*], yAxis: [*], color: [string,string,string,string,string,string,string], series: [*,*,*,*,*]}}
 */
export function getOption(type,xAis,seriesData,unit){
    xAis=xAis||[];
    seriesData=seriesData||[];
    if(xAis&&xAis.length&&seriesData&&seriesData.length){
        switch (type){
            case 'uv':
                return {
                    title : {
                        text: '用户访问量(UV)曲线',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    xAxis :xAis,
                    yAxis : [
                         {
                            type: 'value'
                         }
                    ],
                    series : seriesData
                };
                break;
        }        
    }
}