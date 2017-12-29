import React,{Component} from 'react'
import { Link } from 'react-router'
import ListMenu from './Menu'
import {Row, Col} from 'tinper-bee'


class MainPage extends Component{
 render() {
   return (
       <Row>
        <Col md={4}>
            <ListMenu />
        </Col>
        <Col md={8}></Col>
       </Row>
   )
 }
}
export default MainPage;
