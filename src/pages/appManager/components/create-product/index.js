import {Component} from 'react';
import {Modal, Button, Form, InputGroup, FormControl, FormGroup, Label, Col, Row, Radio, Icon} from 'tinper-bee';

import {createGroup, updateGroup} from 'serves/appTile';

import {err, success} from 'components/message-util';

import './index.less';

const ENV = [
  {
    value: 'dev',
    name: '开发环境'
  },
  {
    value: 'test',
    name: '测试环境'
  },
  {
    value: 'gray',
    name: '灰度环境'
  },
  {
    value: 'prod',
    name: '生产环境'
  },
];

const ENVCOLOR = {
  'dev': '#6EBEFF',
  'test': '#78C878',
  'gray': '#BEBEBE',
  'prod': '#F5A623'
}


class CreateProduct extends Component {
  static defaultProps = {
    data: {}
  }
  state = {
    name: '',
    type: 'business',
    dev: '',
    test: '',
    gray: '',
    prod: '',

  }

  componentWillReceiveProps(nextProps) {
    let {data, show, edit} = nextProps;
    if (show) {
      if (edit && data.hasOwnProperty('type')) {
        this.setState({
          name: data.name,
          type: data.type,
          dev: data.develop_url,
          test: data.test_url,
          gray: data.gray_url,
          prod: data.pro_url,
        })
      }
    }
  }

  /**
   * 选择产品线
   * @param value
   */
  handleRadioChange = (value) => {
    this.setState({
      type: value
    })
  }

  /**
   * 输入框设置
   * @param state
   */
  handleInputChange = (state) => (e) => {
    this.setState({
      [state]: e.target.value
    })
  }

  /**
   * 清空数据
   * @param state
   */
  clear = (state) => () => {
    this.setState({
      [state]: ''
    })
  }

  /**
   * 关闭模态
   */
  handleClose = () => {
    let {onClose} = this.props;
    this.setState({
      name: '',
      desc: '',
      test: '',
      dev: '',
      prod: '',
      gray: '',
      type: ''
    });

    onClose && onClose();
  }

  /**
   * 创建
   */
  handleAdd = () => {
    let {name, desc, test, dev, prod, gray, type} = this.state;
    let {edit, data, refresh, breadList} = this.props;
    let param = new FormData();
    param.append('name', name);
    param.append('develop_url', dev);
    param.append('test_url', test);
    param.append('gray_url', gray);
    param.append('pro_url', prod);
    param.append('type', type);
    param.append('description', desc);

    console.log(breadList);
    if (breadList.length !== 0) {
      param.append('parent', breadList[0].id);
    }

    let param2 = {
      group_id: data.group_id,
      group_name: name,
      develop_url: dev,
      test_url: test,
      gray_url: gray,
      pro_url: prod,
      description: desc,
    };

    if (edit) {
      updateGroup(param2)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return err(`${data.error_code}:${data.error_message}`)
          }
          success('修改成功。');
          refresh && refresh();
        });
    } else {
      createGroup(param)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return err(`${data.error_code}:${data.error_message}`)
          }
          success('创建成功。');
          refresh && refresh();
        });
    }

    this.handleClose();
  }

  render() {
    let {show, data, edit} = this.props;
    let title = '新建产品（线）';
    if (data && edit) {
      if (data.type === 'service') {
        title = '编辑服务'
      } else if (data.type === 'business') {
        title = '编辑产品线'
      } else if (data.type === 'product') {
        title = '编辑产品'
      }
    }

    return (
      <Modal
        show={ show }
        className="create-product"
        onHide={ this.handleClose }>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Form horizontal>
              {
                this.props.edit ? null : (
                  <FormGroup>
                    <Label>创建类型</Label>

                    <Radio.RadioGroup
                      selectedValue={this.state.type}
                      onChange={this.handleRadioChange}>
                      <Radio value="business">新建产品线</Radio>
                      <Radio value="product">新建产品</Radio>
                    </Radio.RadioGroup>

                  </FormGroup>
                )
              }

              <FormGroup>
                <Label>产品（线）名称</Label>

                <InputGroup simple className="input">
                  <FormControl

                    placeholder="请输入数字、字母、下划线"
                    value={ this.state.name }
                    onChange={ this.handleInputChange('name') }
                  />
                  <InputGroup.Button>
                    {
                      this.state.name !== '' ? (
                        <Icon type="uf-close-c" Click={ this.clear('name') }/>
                      ) : null
                    }
                  </InputGroup.Button>
                </InputGroup>

              </FormGroup>
              {
                this.props.data.type === 'service' ? null : (
                  <FormGroup>
                    <Label>访问地址</Label>
                    {
                      ENV.map((item) => {
                        return (
                          <div key={ item.value } className="input env-row">

                            <InputGroup className="env-input">
                              <InputGroup.Button style={{ background: ENVCOLOR[item.value], borderRadiusTopLeft: 3, borderRadiusBottomLeft: 3}}>
                                <span className={`env env-${item.value}`}>
                                  {item.name}
                                </span>
                              </InputGroup.Button>
                              <FormControl
                                value={ this.state[item.value] }
                                onChange={ this.handleInputChange(item.value) }
                              />
                              <InputGroup.Button style={{ position: 'absolute',top: 4, right: 20, zIndex: '2',borderRadiusTopLeft: 3, borderRadiusBottomLeft: 3}}>
                                {
                                  this.state[item.value] !== '' ? (
                                    <Icon type="uf-close-c" onClick={ this.clear(item.value)  }/>
                                  ) : null
                                }
                              </InputGroup.Button>
                            </InputGroup>
                          </div>
                        )
                      })
                    }
                  </FormGroup>
                )
              }

              <FormGroup>
                <Label>描述信息</Label>
                <div className="input">
                   <textarea
                     className="desc-text"
                     value={ this.state.desc }
                     onChange={ this.handleInputChange('desc') }
                     rows="4"
                   />
                </div>

              </FormGroup>
            </Form>
          </Row>

        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            onClick={this.handleClose}
            shape="squared"
            className="btn-cancel">
            取消
          </Button>
          <Button
            onClick={this.handleAdd}
            colors="primary"
            shape="squared"
            className="btn-ensure">
            {
              this.props.edit ? '修改' : '创建'
            }

          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default CreateProduct;
