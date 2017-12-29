import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Row, Col, Button, InputGroup, FormGroup, FormControl, Icon, Popconfirm} from 'tinper-bee';

import './index.less';
class SearchControl extends Component {
  static propTypes = {
    onSearch: PropTypes.func
  };
  static defaultProps = {
    onSearch: () => {}
  };
  state = {
    searchValue: ''
  };

  /**
   * 捕获搜索
   * @param e
   */
  handleSearchKeyDown = (e) => {
    let { onSearch } = this.props;
    if (e.keyCode === 13) {
      onSearch(this.state.searchValue);
    }
  }


  /**
   * 输入框改变
   * @param state
   * @returns {function(*)}
   */
  handleInputChange = (state) => {
    return (e) => {
      this.setState({
        [state]: e.target.value
      })
    }
  }


  render() {
    let { onSearch } = this.props;
    return (
    <Col md={12}>
	    <div className="source-header">
		  <Link to="/add">
		  	<Button colors="primary" shape="squared">新增当前页数据关联</Button>
		  </Link>
		  <div className="search-container">
		    <FormControl
		     placeholder="数据源名称"
		     type="text"
		     value={ this.state.searchValue }
	         onChange={ this.handleInputChange('searchValue') }
	         onKeyDown={ this.handleSearchKeyDown }

		     />
		    <Button colors="primary" shape="squared" onClick={()=>onSearch(this.state.searchValue)}> 搜索 </Button>
		  </div>

		</div>
	</Col>
  )
  }
}


export default SearchControl;


