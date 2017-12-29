import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {Row, Col, Breadcrumb, Tile, Table, Popconfirm, Icon, Message} from 'tinper-bee'
import {getImageTag, getPubImageTag, deleteImage} from 'serves/imageCata'
import {lintAppListData} from 'components/util'
import PageLoading from 'components/loading';
import { err, success } from 'components/message-util';


class Cata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cata: '',
      showLoading: true,
    };
  }


  componentDidMount() {

    window.document.body.scrollTop = 0;
    
    let pathname = this.props.location.pathname;
    let cata = pathname.split('/')[1];
    let id = this.props.location.query.id;



    if (cata === 'ownercata') {
      getImageTag(`?id=${id}`, (res) => {
        let data = res.data;
        if (data.error_code) {
          this.setState({
            showLoading: false
          })
          return err(data.error_message);
        }
        this.setState({
          data: data.data,
          showLoading: false
        });

      });
    } else {
      getPubImageTag(`?id=${id}`, (res) => {
        let data = res.data;
        if (data.error_code) {
          this.setState({
            showLoading: false
          });
          return err(data.error_message);
        }
        this.setState({
          data: data.data,
          showLoading: false
        });

      });
    }


    this.setState({
      cata: cata
    })
  }

  handleDelete = (id, index) => {
    const self = this;
    let data = this.state.data;
    return function (e) {
      deleteImage(`?id=${id}`, function (res) {
        if (res.data.error_code) {
          err(`${res.data.error_code}:${res.data.error_message}`);
        } else {
          data.splice(index, 1);

          self.setState({
            data: data
          });
          success( '删除成功');

          if (data.length === 0) {
            self.context.router.push(`/?key=${self.state.cata}`);
          }
        }
      })
    }
  }

  render() {
    const data = this.state.data;
    const self = this;
    let pathname = this.props.location.pathname;
    let cata = pathname.split('/')[1];
    let listId = this.props.location.query.listId;
    let flag = pathname.split('/')[2];
    let breadItem;
    if (data[0]) {
      if (flag === 'versioninfo' || flag === 'public') {
        breadItem = (<Link to={`/${cata}/versionlist?id=${listId}`}>{data[0].pure_image_name}</Link>)
      } else {
        breadItem = data[0].pure_image_name;
      }
    } else {
      breadItem = "";
    }
    return (
      <Row>
        <Col md={12}>
          <Row style={{boxShadow: '0 2px 3px #d3d3d3', zIndex: 1}}>
            <Col xs={4}>
              <Breadcrumb style={{backgroundColor: '#fff', margin: 0, padding: "13px 15px"}}>
                <Breadcrumb.Item>
                  <Link to={`/?key=${this.state.cata}`}>
                    { this.state.cata === 'publiccata' ? '公有仓库' : '私有仓库' }
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  { breadItem }
                </Breadcrumb.Item>
                {
                  flag === 'public' ? (
                    <Breadcrumb.Item>
                      部署
                    </Breadcrumb.Item>
                  ) : ""
                }
              </Breadcrumb>
            </Col>
            <Col xs={4} style={{textAlign: 'center', padding: '13px 15px'}}>
              { data[0] ? data[0].pure_image_name : ""}
            </Col>
          </Row>

        </Col>
        <Col md={12}>
          { React.cloneElement(this.props.children, {
            data: this.state.data,
            cata: this.state.cata,
            onDelete: this.handleDelete
          }) }
        </Col>
        <PageLoading show={ this.state.showLoading } />
      </Row>
    )
  }
}

Cata.contextTypes = {
  router: PropTypes.object
}

export default Cata;
