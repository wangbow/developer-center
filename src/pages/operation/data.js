import './china';
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
            case 'pv':
                return {
                    title : {
                        text: '页面访问量(PV)曲线',
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
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}次'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'PV',
                            type:'line',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                break;
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
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}次'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'UV',
                            type:'line',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                break;
            case 'browserType':
                return {
                    title : {
                        text: '浏览器类型',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable : true,
                    series : [
                        {
                            name:'浏览器类型',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:seriesData
                        }
                    ]
                };
                break;
            case 'statusCode':
                return {
                    title : {
                        text: '状态码',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable : true,
                    series : [
                        {
                            name:'状态码',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:seriesData
                        }
                    ]
                };
                break;
            case 'operatingSystem':
                return {
                    title : {
                        text: '操作系统',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable : true,
                    series : [
                        {
                            name:'操作系统',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:seriesData
                        }
                    ]
                };
                break;
            case 'responseTime':
                return{
                    title : {
                        text: '平均响应时间',
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
                    xAxis : [
                        {
                            type : 'category',
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}ms'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'响应时间',
                            type:'bar',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                break;
            case 'flow':
                return{
                    title : {
                        text: '网站流量曲线',
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
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+unit
                            }
                        }
                    ],
                    series : [
                        {
                            name:'流量',
                            type:'line',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            },
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        }
                    ]
                };
                break;
            case 'region':
                return{
                    title : {
                        text: '全国地区访问量',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        x:'left',
                        data:['']
                    },
                    dataRange: {
                        x: 'left',
                        y: 'bottom',
                        splitNumber:6,
                        splitList: [
                            {start: 1500},
                            {start: 1000, end: 1500},
                            {start: 500, end: 1000},
                            {start: 100, end: 500},
                            {start: 50, end: 100},
                            { end: 50},
                        ]
                    },
                    series : [
                        {
                            name: '',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:false,
                                        textStyle: {
                                            color: "rgb(249, 249, 249)"
                                        }
                                    }
                                },
                                emphasis:{label:{show:true}}
                            },
                            data:seriesData
                        }
                    ]
                };
                break;
        }
    }else{
        switch (type){
            case 'pv':
                return {
                    title : {
                        text: '页面访问量(PV)曲线',
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
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'PV',
                            type:'line',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                break;
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
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '
                            }
                        }
                    ],
                    series : [
                        {
                            name:'UV',
                            type:'line',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                break;
            case 'browserType':
                return {
                    title : {
                        text: '浏览器类型',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable : true,
                    series : [
                        {
                            name:'浏览器类型',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:seriesData
                        }
                    ]
                };
                break;
            case 'statusCode':
                return {
                    title : {
                        text: '状态码',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable : true,
                    series : [
                        {
                            name:'状态码',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:seriesData
                        }
                    ]
                };
                break;
            case 'operatingSystem':
                return {
                    title : {
                        text: '操作系统',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable : true,
                    series : [
                        {
                            name:'操作系统',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:seriesData
                        }
                    ]
                };
                break;
            case 'responseTime':
                return{
                    title : {
                        text: '平均响应时间',
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
                    xAxis : [
                        {
                            type : 'category',
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '
                            }
                        }
                    ],
                    series : [
                        {
                            name:'响应时间',
                            type:'bar',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                break;
            case 'flow':
                return{
                    title : {
                        text: '网站流量曲线',
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
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAis
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+unit
                            }
                        }
                    ],
                    series : [
                        {
                            name:'流量',
                            type:'line',
                            data:seriesData,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            },
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        }
                    ]
                };
                break;
            case 'region':
                return{
                    title : {
                        text: '全国地区访问量',
                        textStyle:{
                            color:'#333333',
                            fontWeight: 'bolder',
                            fontSize:13
                        },
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        x:'left',
                        data:['']
                    },
                    dataRange: {
                        x: 'left',
                        y: 'bottom',
                        splitNumber:6,
                        splitList: [
                            {start: 1500},
                            {start: 1000, end: 1500},
                            {start: 500, end: 1000},
                            {start: 100, end: 500},
                            {start: 50, end: 100},
                            { end: 50},
                        ]
                    },
                    series : [
                        {
                            name: '',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:false,
                                        textStyle: {
                                            color: "rgb(249, 249, 249)"
                                        }
                                    }
                                },
                                emphasis:{label:{show:true}}
                            },
                            data:seriesData
                        }
                    ]
                };
                break;
        }
    }
}