import { Component, PropTypes } from 'react';
import { Button, Row } from 'tinper-bee';
import { listQ } from 'serves/middleare';
import Item from '../components/home-items';
import { describes, logo } from '../const';
import Header from '../components/header-middleware';
import "./index.less";


class MainPage extends Component {
  // props
  static propTypes = {}
  static defaultProps = {}

  constructor(props) {
    super(props);
  }


  state = {
    mysql: 0,
    redis: 0,
    mq: 0,
    zk: 0,
    jenkins: 0,
    dclb: 0
  }
  // lifeCyle hooks
  componentDidMount() {

    listQ({ size: 20, index: 0 }, 'mysql')
      .then((data) => {
        if (data['content']) {
          this.setState({
            mysql: data['content'].length
          });
        }
      })
      .catch((error) => {
        console.log('操作失败');
        console.log(error.message);
        console.log(error.stack);
      });

    listQ({ size: 20, index: 0 }, 'redis')
      .then((data) => {
        if (data['content']) {
          this.setState({
            redis: data['content'].length
          });
        }
      })
      .catch((error) => {
        console.log('操作失败');
        console.log(error.message);
        console.log(error.stack);
      });

    listQ({ size: 20, index: 0 }, 'mq')
      .then((data) => {
        if (data['content']) {
          this.setState({
            mq: data['content'].length
          });
        }
      })
      .catch((error) => {
        console.log('操作失败');
        console.log(error.message);
        console.log(error.stack);
      });

    listQ({ size: 20, index: 0 }, 'zk')
      .then((data) => {
        if (data['content']) {
          this.setState({
            zk: data['content'].length
          });
        }
      })
      .catch((error) => {
        console.log('操作失败');
        console.log(error.message);
        console.log(error.stack);
      });

    listQ({ size: 20, index: 0 }, 'jenkins')
      .then((data) => {
        if (data['content']) {
          this.setState({
            jenkins: data['content'].length
          });
        }
      })
      .catch((error) => {
        console.log('操作失败');
        console.log(error.message);
        console.log(error.stack);
      });


    listQ({ size: 20, index: 0 }, 'dclb')
      .then((data) => {
        if (data['content']) {
          this.setState({
            dclb: data['content'].length
          });
        }
      })
      .catch((error) => {
        console.log('操作失败');
        console.log(error.message);
        console.log(error.stack);
      });
  }

  // renders
  render() {
    
    let serivceItems = describes.map((result, i) => {
      return (
        <Item
          info={result}
          count={this.state[result.id]}
          logo={logo[result.id]}
          router={this.props.router}
        />
      )
    })
    return (
      <Row>
        <Header widthGoBack={false}>
          <span>我的中间件服务</span>
        </Header>

        <div className="itemWraper clearfix">
          {serivceItems}
        </div>
      </Row>
    )
  }
}

export default MainPage;
