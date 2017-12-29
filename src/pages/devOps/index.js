import { Component } from 'react';
import { render } from 'react-dom';
import routes from './routes';
import './index.css';


const init = function (content) {
  render(routes, content);
}

init(document.getElementById("content"));
