import React, {Component, PropTypes} from 'react'
import {

    Select,
    Form,
    Row,
    Col,
    FormGroup,
    Label,
    FormControl,
    TabPanel,
    Checkbox,
    Button,
    Switch,
    Icon
} from 'tinper-bee';

import InputNumber from 'bee-input-number';

import './index.css';

import 'rc-tabs/assets/index.css';

const Option = Select.Option;

import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';


const iconArray = ['uf-wechat',
  'uf-add-c-o',
  'uf-search',
  'uf-histogram-arrow-up',
  'uf-close-bold',
  'uf-umbrella',
  'uf-qq',
  'uf-4square-3',
  'uf-send',
  'uf-map',
  'uf-9square-2',
  'uf-navmenu',
  'uf-pc-2',
  'uf-search-light-2',
  'uf-check-s-2',
  'uf-pencil',
  'uf-repeat',
  'uf-security-2',
  'uf-lexi',
  'uf-pencil-s',
  'uf-del',
  'uf-bi-o',
  'uf-pencil-c',
  'uf-qrcode',
  'uf-rmb-c-o',
  'uf-search-c-o',
  'uf-bell',
  'uf-pass-3',
  'uf-treearrow-down',
  'uf-training',
  'uf-group-2',
  'uf-zoom-in',
  'uf-security-o',
  'uf-baojia-c',
  'uf-rulerpen',
  'uf-erpsearch',
  'uf-group-o',
  'uf-cloud-o-updown',
  'uf-close-c-o',
  'uf-add-s',
  'uf-pc',
  'uf-rain',
  'uf-nodata',
  'uf-close-c',
  'uf-bohui-s-o',
  'uf-cloud',
  'uf-bag-s',
  'uf-table-2',
  'uf-anglearrowpointingtoright',
  'uf-exc-c-o',
  'uf-group',
  'uf-personin-o',
  'uf-calendar',
  'uf-add-s-o',
  'uf-sync-c-o',
  'uf-grid',
  'uf-anglepointingtoleft',
  'uf-activate-3',
  'uf-caven',
  'uf-back',
  'uf-pass-2',
  'uf-reduce-s-o',
  'uf-area',
  'uf-flag',
  'uf-box-o-2',
  'uf-arrow-s-o-down',
  'uf-arrow-s-o-up',
  'uf-building',
  'uf-tapp',
  'uf-treefolder',
  'uf-advice',
  'uf-2collayout',
  'uf-check-s',
  'uf-sign',
  'uf-listsearch',
  'uf-gridcaretarrowup',
  'uf-eye-c-o',
  'uf-check-c-o',
  'uf-seal',
  'uf-erpbox',
  'uf-rulerpen-o',
  'uf-role',
  'uf-exc-c-2',
  'uf-pad',
  'uf-treefolder-closed',
  'uf-reduce-c-o',
  'uf-pass-s-o',
  'uf-setting',
  'uf-close-s',
  'uf-map-o',
  'uf-move',
  'uf-2arrow-down',
  'uf-2arrow-right',
  'uf-arrow-c-o-left',
  'uf-plus',
  'uf-arrow-c-o-right',
  'uf-arrow-c-o-down',
  'uf-list-s-o',
  'uf-cloud-o-down',
  'uf-nodata-2',
  'uf-file-s',
  'uf-2arrow-up',
  'uf-notification',
  'uf-piechart',
  'uf-cloud-o-up',
  'uf-close',
  'uf-correct',
  'uf-histogram-s-o-2',
  'uf-4square-2',
  'uf-sunny',
  'uf-link',
  'uf-eye',
  'uf-eye-o',
  'uf-qian',
  'uf-widgetab',
  'uf-rmb-s',
  'uf-link-off',
  'uf-shang-s',
  'uf-xia-s',
  'uf-box-2',
  'uf-pass-o',
  'uf-arrow-down',
  'uf-arrow-right',
  'uf-arrow-left',
  'uf-box',
  'uf-triangle-right',
  'uf-histogram-s-o',
  'uf-book',
  'uf-bookmark-o',
  'uf-leaf',
  'uf-bullseye',
  'uf-gridcaretdown',
  'uf-triangle-up',
  'uf-triangle-down',
  'uf-cloud-down',
  'uf-cloud-up',
  'uf-bubble',
  'uf-bubble-o',
  'uf-copy',
  'uf-correct-2',
  'uf-2arrow-left',
  'uf-arrow-down-2',
  'uf-download',
  'uf-earth',
  'uf-mail-o',
  'uf-mail',
  'uf-exc',
  'uf-externallink',
  'uf-video',
  'uf-films',
  'uf-folder',
  'uf-folder-o',
  'uf-4square',
  'uf-gift',
  'uf-github-c',
  'uf-github-s',
  'uf-heart-o',
  'uf-heart',
  'uf-home',
  'uf-i-c-2',
  'uf-i',
  'uf-triangle-left',
  'uf-symlist',
  'uf-arrow-left-2',
  'uf-arrow-right-2',
  'uf-arrow-up-2',
  'uf-reduce-c',
  'uf-reduce-s',
  'uf-minus',
  'uf-mobile',
  'uf-bell-o',
  'uf-9square',
  'uf-numlist',
  'uf-folderopen-o',
  'uf-treefolderopen',
  'uf-mac',
  'uf-camera',
  'uf-picture',
  'uf-play',
  'uf-play-o',
  'uf-qm-c',
  'uf-qm',
  'uf-navmenu-light',
  'uf-settings',
  'uf-cart',
  'uf-histogram',
  'uf-finetune',
  'uf-sortup',
  'uf-sortdown',
  'uf-sort19',
  'uf-sort91',
  'uf-za',
  'uf-star-o',
  'uf-star-2',
  'uf-star',
  'uf-luggage',
  'uf-table',
  'uf-tel',
  'uf-tel-s',
  'uf-terminal',
  'uf-file',
  'uf-file-o',
  'uf-3dot-h',
  'uf-time-c-o',
  'uf-upload',
  'uf-3dot-v',
  'uf-rmb',
  'uf-arrow-c-o-up',
  'uf-reject-2',
  'uf-barcode',
  'uf-zoom-out',
  'uf-exc-t-o',
  'uf-pass',
  'uf-flow',
  'uf-add-c',
  'uf-arrow-c-o-right-2',
  'uf-shelf-on',
  'uf-shelf-off',
  'uf-file-o-2',
  'uf-truck-o',
  'uf-super',
  'uf-equipment',
  'uf-arrow-c-o-left-2',
  'uf-files-o',
  'uf-cloud-o',
  'uf-rmb-s-o-2',
  'uf-3dot-c-o',
  'uf-dafeng',
  'uf-baoxue',
  'uf-bingbao',
  'uf-fengbao',
  'uf-xiaoyu',
  'uf-zhenxue',
  'uf-zhongyu',
  'uf-es',
  'uf-flow-o-2',
  'uf-activate-2',
  'uf-flow-o',
  'uf-bulb-2',
  'uf-mi-c',
  'uf-top-up',
  'uf-creditcard',
  'uf-align-center',
  'uf-align-justify',
  'uf-align-left',
  'uf-align-right',
  'uf-ju-c-o',
  'uf-truck',
  'uf-setting-c-o',
  'uf-users-o',
  'uf-bag-s-o',
  'uf-cai-s',
  'uf-listcheck',
  'uf-users',
  'uf-i-c',
  'uf-building-o',
  'uf-rmb-s-o',
  'uf-reject',
  'uf-9dot',
  'uf-loadingstate',
  'uf-gateway',
  'uf-ticket-s-o',
  'uf-userset',
  'uf-puzzle-o',
  'uf-box-o',
  'uf-bulb',
  'uf-exc-t',
  'uf-rmb-c',
  'uf-table-s-o',
  'uf-umbrella-o',
  'uf-dropbox',
  'uf-search-light',
  'uf-cart-o',
  'uf-kero-col',
  'uf-uba-col',
  'uf-tinperzc-col',
  'uf-tinperzch-col',
  'uf-iuap-col',
  'uf-iuapdesign-col',
  'uf-bee-col',
  'uf-neoui-col',
  'uf-sparrow-col',
  'uf-tinpercn-col',
  'uf-tinperen-col',
  'uf-arrow-up',
  'uf-mailsym',
  'uf-print',
  'uf-ticket-3',
  'uf-loan',
  'uf-ticket-2',
  'uf-offwork',
  'uf-todolist',
  'uf-personin',
  'uf-ticket',
  'uf-linechart',
  'uf-4leaf',
  'uf-listset',
  'uf-qi-c-o',
  'uf-exc-c',
  'uf-code',
  'uf-plug-o',
  'uf-search-s',
  'uf-treeadd',
  'uf-mi',
  'uf-treeline-copy'];

const yunIconArray = 'cl-yes#cl-add-c-o#cl-delete#cl-add-s-l#cl-reduce#cl-deploy#cl-copy-c#cl-pencil-s#cl-del#cl-re-start#cl-fullscreen#cl-treearrow-down#cl-running#cl-pass-c#cl-shop#cl-close-c-o#cl-close-c#cl-bell#cl-done#cl-time-02#cl-refresh#cl-search#cl-more#cl-calendar#cl-arrow-down-02#cl-arrow-up#cl-weixinushentubiao01#cl-flow#cl-cloud-upload#cl-cancel#cl-suspend#cl-windows#cl-eye#cl-database#cl-global#cl-kttx#cl-start#cl-cloud-create#cl-focus#cl-enclosure#cl-menu#cl-text#cl-arrow-retract#cl-sign#cl-gridcaretarrowup#cl-filter#cl-cpu#cl-provider#cl-reduce-c-o#cl-access#cl-notice-p#cl-plus#cl-list-s-o#cl-bk-conf#cl-close-top#cl-commodity#cl-restar#cl-clouddeploy#cl-permission#cl-add-dashed#cl-pass-o#cl-arrow-down#cl-arrow-right#cl-arrow-left#cl-cloud-down#cl-reduce-c#cl-mobile#cl-play-o#cl-navmenu-light#cl-file-o#cl-log#cl-reset#cl-disk#cl-reject-2#cl-shieldlock#cl-list#cl-2file#cl-pass#cl-add-c#cl-set#cl-notice-l#cl-box#cl-piechart#cl-setting-center#cl-depot#cl-spexamine#cl-accesskey#cl-externallink#cl-apps#cl-building-o#cl-rmb-s-o#cl-history#cl-lipin#cl-customer#cl-ticket-s-o#cl-terminal#cl-sort-small#cl-cloud-download#cl-idcard#cl-search-light#cl-qiandai#cl-4leaf#cl-finance#cl-order#cl-qi-c-o#cl-setting#cl-dashboard#cl-filebox#cl-right#cl-2boxs#cl-block-line#cl-monitor#cl-xml#cl-loading#cl-up#cl-yaoqingma2#cl-tools#cl-resource#cl-restart#cl-file-box#cl-log-history#cl-screen#cl-yycoudlogo#cl-box-o#cl-unlock#cl-release#cl-bigclose-o#cl-edit-c-o#cl-4box-c-o#cl-addmachine-o#cl-settings-c-o#cl-shield-o#cl-texts-o#cl-set-c-o#cl-box-c-o#cl-4block-o#cl-www#cl-cloudapp-o#cl-cloudmachine-o#cl-add-s-o#cl-file-pdf-s#cl-find#cl-update-l#cl-verify#cl-person-o#cl-computer-o#cl-members-o#cl-close-s-l#cl-person#cl-tips-c-o#cl-selected-t#cl-block#cl-down#cl-cloud-up#cl-log-o#cl-mislog-o#cl-yongyouyun-r#cl-phoneset#cl-cloudbox#cl-3people#cl-folder-p#cl-handshake#cl-alarm#cl-checked#cl-folder-l#cl-shield#cl-tool#cl-enterprise#cl-add-reduce#cl-tree-new-sbling-node#cl-xml1#cl-properties#cl-unlink#cl-backdate-l#cl-update-p#cl-backdate-p#cl-on-off-01#cl-on-off#cl-code#cl-penguin#cl-job#cl-empty#cl-pen#cl-delete1#cl-add#cl-tree#cl-mark#cl-user#cl-active1#cl-switch'.split('#');


const colorArray = [
  "bg-orange-600", "bg-orange-A700", "bg-yellow-700", "bg-orange-900", "bg-red-400",
  "bg-pink-400", "bg-purple-400", "bg-deep-purple-300", "bg-green-500", "bg-green-A700",
  "bg-cyan-500", "bg-light-blue-A400", "bg-light-blue-A700", "bg-blue-800", "bg-indigo-700", "bg-indigo-200"
];

const propTypes = {};

const defaultProps = {};


class EditMenu extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      menuName: props.data.name ? props.data.name : '',
      menuCode: props.data.code ? props.data.code : '',
      menuLocation: props.data.location ? props.data.location : '',
      category: props.data.category ? props.data.category : 'pass',
      menuLocationtype: props.data.locationtype ? props.data.locationtype : 'view',
      menuIcon: props.data.icon ? props.data.icon : '',
      menuTag: props.data.tag ? props.data.tag : '',
      menuIsvirmenu: props.data.isvirmenu ? props.data.isvirmenu : false,
      menuSystem: props.data.system ? props.data.system : '',
      menuParent: props.data.parent ? props.data.parent : '',
      menuIsnewopen: props.data.isnewopen ? props.data.isnewopen : false,
      menuIsenable: props.data.isenable ? props.data.isenable : true,
      menuSort: props.data.sort ? props.data.sort : 0,
      menuUndercontrol: props.data.undercontrol ? props.data.undercontrol : false,
      showMessage: false,
      totalIcon: 'uf uf-4square-3',
      iconColor: '',
      mtype: props.data.mtype ? props.data.mtype : 'mgr',
      showIcon: false,

    };

  }

  /**
   * 捕获select的改变
   * @param stateName state的名字
   * @returns {Function}
   */
  handleChange = (stateName) => {

    return (value) => {
      this.setState({
        [`${stateName}`]: value
      })
    }
  }

  /**
   * 捕获input的改变
   * @param stateName state的名字
   * @returns {Function}
   */
  onEditData = (stateName) => {
    return (event) => {
      this.setState({
        [`${stateName}`]: event.target.value
      })
    }
  }


  /**
   * 确认事件
   */
  handleEnsure = () => {
    const {onEnsure, parent} = this.props;

    const data = {
      "id": this.props.data.id,
      "name": this.state.menuName,
      "code": this.state.menuCode,
      "category": this.state.category,
      "location": this.state.menuLocation,

      "locationtype": typeof(this.state.menuLocationtype) == "undefined" ? "view" : this.state.menuLocationtype,
      "icon": !this.state.menuIcon ? `iconfont ${this.state.totalIcon} ${this.state.iconColor}` : this.state.menuIcon,
      "tag": this.state.menuTag,
      "isvirmenu": !!this.state.menuIsvirmenu,
      "system": this.state.menuSystem,
      "parent": parent ? parent : this.props.data.parent,
      "isnewopen": !!this.state.menuIsnewopen,
      "isenable": typeof(this.state.menuIsenable) === undefined ? true : !!this.state.menuIsenable,
      "sort": this.state.menuSort,
      "undercontrol": !!this.state.menuUndercontrol,
      "mtype": this.state.mtype,
    }
    if (this.state.menuIsvirmenu) {
      if (this.state.menuName && this.state.menuName !== '' && this.state.menuCode && this.state.menuCode !== '') {
        this.setState({
          showMessage: false
        });
        onEnsure(data);
      } else {
        this.setState({
          showMessage: true
        });
      }
    } else {
      if (this.state.menuName && this.state.menuName !== '' && this.state.menuCode && this.state.menuCode !== '' && this.state.menuLocation && this.state.menuLocation !== '') {
        this.setState({
          showMessage: false
        });
        onEnsure(data);
      } else {
        this.setState({
          showMessage: true
        });
      }
    }


  }


  /**
   * 选取icon的取消事件
   */
  cancel = () => {
    this.setState({
      showIcon: false
    })
  }


  /**
   * 选取icon确认
   */
  selectIconEnsure = () => {

    this.setState({
      menuIcon: `iconfont ${this.state.totalIcon} ${this.state.iconColor}`
    })
    this.cancel();
  }

  verifier() {

  }


  /**
   * 填写icon的input焦点事件
   */
  handleFocus = () => {

    this.setState({
      showIcon: true
    })
  }


  /**
   * 取消编辑
   */
  handleCancel = () => {

    const {onCancel} = this.props;

    onCancel();
  }


  /**
   * 选择图标
   * @param title
   * @param value
   * @returns {function()}
   */
  selectIcon = (title, value) => {
    return () => {
      this.setState({
        totalIcon: `${title} ${value}`
      })
    }
  }


  /**
   * 选取icon颜色
   * @param value
   * @returns {Function}
   */
  selectColor = (value) => {
    const self = this;
    value = value.slice(3);
    return function () {
      self.setState({
        iconColor: value
      })
    }
  }

  render() {
    const self = this;
    const {isAdd} = this.props;
    return (
      <Form horizontal className="edit-form">
        <Row>
          <Col md={7} sm={12}>
            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>菜单名称 ：</Label>
                </Col>
                <Col md={8} sm={7}>
                  <Icon type="uf-mi" style={{color: 'red'}}/>
                  <FormControl placeholder="请输入菜单名称" value={this.state.menuName}
                               onChange={this.onEditData('menuName')}/>
                </Col>
              </FormGroup>
            </Row>
            {
              isAdd ? (
                <Row>
                  <FormGroup>
                    <Col md={4} sm={5} className="text-right">
                      <Label>菜单编码 ：</Label>
                    </Col>
                    <Col md={8} sm={7}>
                      <Icon type="uf-mi" style={{color: 'red'}}/>
                      <FormControl placeholder="请输入菜单编码" value={this.state.menuCode}
                                   onChange={this.onEditData('menuCode')}/>
                    </Col>
                  </FormGroup>
                </Row>
              ) : ""
            }
            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>菜单分类 ：</Label>
                </Col>
                <Col md={8} sm={7} style={{paddingLeft: 38}}>
                  <Select size="lg"

                          defaultValue={typeof(this.state.category) === "undefined" ? "pass" : this.state.category}
                          style={{width: 187}} onChange={this.handleChange('category')}>
                    <Option value="pass">云服务</Option>
                    <Option value="engine">云引擎</Option>
                  </Select>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>菜单类型 ：</Label>
                </Col>
                <Col md={8} sm={7} style={{paddingLeft: 38}}>
                  <Select size="lg"
                          defaultValue={typeof(this.state.mtype) === "undefined" ? "mgr" : this.state.mtype}
                          style={{width: 187}} onChange={this.handleChange('mtype')}>
                    <Option value="mgr">管理类</Option>
                    <Option value="biz">业务类</Option>
                  </Select>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>是否虚拟菜单 ：</Label>
                </Col>
                <Col md={8} sm={7} style={{paddingLeft: 38}}>
                  <Switch checked={this.state.menuIsvirmenu}
                          onChangeHandler={this.handleChange('menuIsvirmenu')} checkedChildren={'是'}
                          unCheckedChildren={'否'}/>
                </Col>
              </FormGroup>
            </Row>

            {
              this.state.menuIsvirmenu ? "" :
                (
                  <span>
                        <Row>
                        <FormGroup>
                            <Col md={4} sm={5} className="text-right">
                                <Label>URL ：</Label>
                            </Col>
                            <Col md={8} sm={7}>
                                <Icon type="uf-mi" style={{color: 'red'}}/>
                                <FormControl placeholder="请输入URL" value={this.state.menuLocation}
                                             onChange={this.onEditData('menuLocation')}/>
                            </Col>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Col md={4} sm={5} className="text-right">
                                <Label>URL类型 ：</Label>
                            </Col>
                            <Col md={8} sm={7} style={{paddingLeft: 38}}>
                                <Select size="lg"

                                        defaultValue={typeof(this.state.menuLocationtype) === "undefined" ? "url" : this.state.menuLocationtype}
                                        style={{width: 187}} onChange={this.handleChange('menuLocationtype')}>
                                    <Option value="url">URL</Option>
                                    <Option value="view">布局</Option>
                                    <Option value="plugin">插件</Option>
                                </Select>
                            </Col>
                        </FormGroup>
                    </Row>
                    </span>
                )
            }

            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>图标 ：</Label>
                </Col>
                <Col md={8} sm={7}>
                  {
                    this.state.menuIcon ? (

                      <span style={{width: 20, height: 20}}><Icon
                        style={{corsur: 'pointer'}} className={this.state.menuIcon}
                        onClick={this.handleFocus}/></span>
                    ) : (
                      <FormControl style={{left: 26}} placeholder="请输入图标"
                                   value={this.state.menuIcon}
                                   onChange={this.onEditData('menuIcon')}
                                   onFocus={this.handleFocus}/>
                    )
                  }

                </Col>
              </FormGroup>
            </Row>


            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>是否新窗口打开 ：</Label>
                </Col>
                <Col md={8} sm={7} style={{paddingLeft: 38}}>
                  <Switch checked={this.state.menuIsnewopen}
                          onChangeHandler={this.handleChange('menuIsnewopen')} checkedChildren={'是'}
                          unCheckedChildren={'否'}/>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>是否启用 ：</Label>
                </Col>
                <Col md={8} sm={7} style={{paddingLeft: 38}}>
                  <Switch
                    checked={typeof(this.state.menuIsenable) === "undefined" ? true : this.state.menuIsenable}
                    onChangeHandler={this.handleChange('menuIsenable')} checkedChildren={'是'}
                    unCheckedChildren={'否'}/>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>显示顺序 ：</Label>
                </Col>
                <Col md={8} sm={7}>
                  <InputNumber className="count" value={Number(this.state.menuSort)}
                               onChange={this.handleChange('menuSort')}/>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col md={4} sm={5} className="text-right">
                  <Label>是否受权限控制 : </Label>
                </Col>
                <Col md={8} sm={7} style={{paddingLeft: 38}}>
                  <Switch checked={this.state.menuUndercontrol}
                          onChangeHandler={this.handleChange('menuUndercontrol')}
                          checkedChildren={'是'} unCheckedChildren={'否'}/>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <Col md={11} style={{textAlign: 'center'}}>
                <span style={{color: 'red'}}>{this.state.showMessage ? "必输字段不能为空！" : ''}</span>
              </Col>
            </Row>
            <Row>
              <FormGroup>
                <Col mdOffset={3} smOffset={3} md={3} sm={2} className="text-right">
                  <Button colors="primary" shape="squared" onClick={ this.handleEnsure }>保存</Button>
                </Col>
                <Col md={3} sm={2} className="text-right">
                  <Button shape="border" onClick={ this.handleCancel }>取消</Button>
                </Col>
              </FormGroup>
            </Row>

          </Col>
          {
            this.state.showIcon ? (
              <Col md={5} sm={8}>
                <Row>
                  <Col md={12}>
                    <i style={{fontSize: 60}}
                       className={ `${this.state.totalIcon} ${this.state.iconColor}` }/>
                  </Col>
                  <Col md={12}>
                    <div className="choice-icon">
                      <Tabs
                        defaultActiveKey={'1'}
                        renderTabBar={() => <ScrollableInkTabBar />}
                        renderTabContent={() => <TabContent />}>
                        <TabPane tab="默认图标" key="1">
                          <div style={{height: 215, overflow: 'auto'}}>
                            <ul className="icon-list">
                              {
                                iconArray.map(function (item, index) {
                                  return (<li onClick={ self.selectIcon('uf', item) }
                                              key={index}><Icon type={item}/></li>)
                                })
                              }

                            </ul>
                          </div>
                        </TabPane>
                        <TabPane tab="用友云图标" key="2">
                          <div style={{height: 215, overflow: 'auto'}}>
                            <ul className="icon-list">
                              {
                                yunIconArray.map(function (item, index) {
                                  return (<li onClick={ self.selectIcon('cl', item) }
                                              key={index}><i
                                    className={`cl ${item}`}/></li>)
                                })
                              }

                            </ul>
                          </div>

                        </TabPane>
                      </Tabs>

                    </div>
                  </Col>
                  <Col md={12}>
                    <ul className="color-list">
                      {
                        colorArray.map(function (item, index) {
                          return (<li key={index} onClick={ self.selectColor(item) }
                                      className={item}/>)
                        })
                      }

                    </ul>

                  </Col>
                  <Col md={12}>
                    <Button colors="primary" shape="squared"
                            onClick={ this.selectIconEnsure }>确认</Button>
                    <Button style={{marginLeft: 30}} shape="squared"
                            onClick={ this.cancel }>取消</Button>
                  </Col>
                </Row>
              </Col>
            ) : ""
          }


        </Row>
      </Form>
    )
  }
}

EditMenu.propTypes = propTypes;
EditMenu.defaultProps = defaultProps;

export default EditMenu;
