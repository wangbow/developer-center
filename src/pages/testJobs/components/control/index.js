import { Component, PropTypes } from 'react';
import { Col, Button, InputGroup, FormControl, Icon} from 'tinper-bee';
import { Link } from 'react-router';
import ErrorModal from 'components/ErrorModal';

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

  handleEnsure = () =>{
    this.setState({
      showDelBatchModal:false
    })
    this.props.handleDelebatch();
  }


  render() {
    let { onSearch} = this.props;

    return (
        <Col sm={12} className="control-bar">
          <Link to="/create" style={{color: "#fff"}}>
            <Button
              shape="squared"
              colors="primary">
              创建测试任务
            </Button>
          </Link>
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
              placeholder="请输入任务名称或测试人"
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
            message={"确定要删除这些任务吗？"}
            title={"删除任务"}
          />
        </Col>
    )
  }
}

export default Control;
