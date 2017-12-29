import React, { Component } from 'react'
import { render } from 'react-dom'

import routes from './routes'
window.__DEV__ = true;

import '../../assets/styles/common.less';

var init = function(content,id){
  render( routes,content )



}

init(document.getElementById("content"));
