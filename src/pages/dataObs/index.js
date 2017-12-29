import { Component } from 'react';
import { render } from 'react-dom';
import routes from './routes';
import './index.css';

import '../../assets/styles/common.less';
const init = content => render(routes, content);

init(document.getElementById("content"));
