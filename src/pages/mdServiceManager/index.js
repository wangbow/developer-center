import { Component } from 'react'
import { render } from 'react-dom'

import routes from './routes'

const init = function (content) {
  render(routes, content);
}

init(document.getElementById("content"));
