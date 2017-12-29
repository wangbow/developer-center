// publics
import { Component, PropTypes } from 'react'
import {Button, FormGroup, Row, Col, Label, FormControl, Select, Option} from 'tinper-bee';

import Header from './component/header.component'
import List from './component/list'
import './index.css'


class MainPage extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <Header widthGoBack={false}>
          <span>体验资源池续期</span>
        </Header>

        <div className="md-tas">
        <List/>
        </div>
      </div>
    )
  }
}

export default MainPage;
