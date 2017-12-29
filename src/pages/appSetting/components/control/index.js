import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Row, Col, Button, InputGroup, FormGroup, FormControl, Icon, Popconfirm} from 'tinper-bee';


class Control extends Component {
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
      onSearch(this.state.searchValue)();
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

    <Col sm={12} className="control-bar">
      <Button
        shape="squared"
        colors="primary">
        <Link to="/create">
          新增应用
        </Link>
      </Button>

      <InputGroup simple style={{float: 'right'}}>
        <FormControl
          value={ this.state.searchValue }
          onChange={ this.handleInputChange('searchValue') }
          style={{width: 300}}
          onKeyDown={ this.handleSearchKeyDown }
          type="text"
        />
        <InputGroup.Button shape="border" onClick={ onSearch(this.state.searchValue) }>
          <Icon type="uf-search"/>
        </InputGroup.Button>
      </InputGroup>

    </Col>
  )
  }
}


export default Control;
