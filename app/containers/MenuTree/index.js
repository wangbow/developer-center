import React, { Component } from 'react';
import {Navbar,Row, Col, Button,Panel,PanelGroup} from 'tinper-bee';

const Menu = Navbar.Menu;
class MenuTree extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activeKey: '1',
      current: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
        <Row>
            <div className='grayDeep' >8 push-4</div>
            <Col md={8} mdPush={4} xs={8} xsPush={4} sm={8} smPush={4} >
                <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
                  <Panel header="Panel 1" eventKey="1">Panel 1 content</Panel>
                </PanelGroup>
            </Col>
            <Col md={4} mdPull={8} xs={4} xsPull={8} sm={4} smPull={8}  >
              <Menu onClick={this.handleClick.bind(this)} style={{ width: 240 }} defaultOpenKeys={['demo3sub1']} selectedKeys={[this.state.current]} mode="inline">
                  <Menu.Item key="1">选项 1</Menu.Item>
                  <Menu.Item key="2">选项 2</Menu.Item>
                  <Menu.Item key="3">选项 3</Menu.Item>
              </Menu>
            </Col>
        </Row>
  )
  }
}

export default MenuTree;