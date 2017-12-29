import { Component, PropTypes } from 'react';
import { Col, Button, InputGroup, FormControl, Icon} from 'tinper-bee';
import { Link } from 'react-router';
import ErrorModal from 'components/ErrorModal';
import {downLoadSample} from 'serves/testCenter';
import './index.less';

class Control extends Component{

  state = {
    searchValue:'',
    showDelBatchModal:false
  }
  static contextTypes = {
    router: PropTypes.object
  };

  /**
   * 捕获搜索
   * @param e
   */
  handleSearchKeyDown = (e) => {
    let { onSearch } = this.props;
    if (e.keyCode === 13) {
      onSearch(this.state.searchValue)();
    }
  }

  /**
   * 输入框改变
   * @param state
   * @returns {function(*)}
   */
  handleInputChange = (state) => (e)=> {
    this.setState({
      [state]: e.target.value
    })
  }


  /**
   * 清空输入框后搜索
   */
  emptySearch = () => {
    //let state = 'Y';
    this.setState({
      searchValue: '',
    })
  }

  /**
   *批量删除确认
   */
  handleDelebatch = () =>{
    this.setState({
      showDelBatchModal:true
    })
  }

  closeModal =()=>{
    this.setState({
      showDelBatchModal:false
    })
  }

  /**
   *批量删除确认
   */
  handleEnsure = () =>{
    this.setState({
      showDelBatchModal:false
    })
    this.props.delebatch();
  }


  /**
   *下载脚本样例
   */
  downLoadSample = ()=>{
    window.location.href="/cloudtest/boot_testscript/downloadDemo"
  }


  render() {
    let { onSearch} = this.props;

    return (
        <Col sm={12} className="control-bar">
          <Link to="/create" style={{color: "#fff"}}>
            <Button
              shape="squared"
              colors="primary">
              新增脚本
            </Button>
          </Link>
          <Button
            colors="primary"
            shape="squared"
            style={{marginLeft:20}}
            onClick={ this.downLoadSample}>
            <i className=" uf1 uf-download"/>
            下载脚本样例
          </Button>
            <Button
              className="control-button"
              shape="squared"
              colors="default"
              onClick={ this.handleDelebatch}>
              批量删除
            </Button>

          <InputGroup simple style={{float: 'right'}}>
            <FormControl
              value={ this.state.searchValue }
              onChange={ this.handleInputChange('searchValue') }
              style={{width: 300}}
              onKeyDown={ this.handleSearchKeyDown }
              type="text"
              placeholder="请输入脚本名称/应用名称或上传人"
            />
            {
              this.state.searchValue ? (
                <Icon type="uf-close-c" onClick={ this.emptySearch } className="empty-search"/>
              ) : null
            }
            <InputGroup.Button shape="border" onClick={ onSearch(this.state.searchValue) }>
              <Icon type="uf-search"/>
            </InputGroup.Button>
          </InputGroup>

          <ErrorModal
            show ={this.state.showDelBatchModal}
            onEnsure={this.handleEnsure}
            onClose={this.closeModal}
            message={"确定要删除这些脚本吗？"}
            title={"删除脚本"}
          />
        </Col>
    )
  }
}

export default Control;
