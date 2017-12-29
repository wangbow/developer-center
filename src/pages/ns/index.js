import React, { Component } from 'react'
import { render } from 'react-dom'

import '../../assets/styles/common.less';

 var init = function(content,id){
    render( <div><h1>请求的域名不存在!</h1><a href="//dev-cdn.yonyoucloud.com" >前往开发者中心</a> </div>,content )
}

init(document.getElementById("content"));
