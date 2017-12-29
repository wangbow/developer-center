import {
  Component
} from 'react';
import classnames from 'classnames';

import ErrorMessage from '../ErrorMessage';
import ReactDOM from 'react-dom';

import './index.less';

class Node extends Component {
  constructor(props) {
    super(props);
    this.focusIn = this.focusIn.bind(this);
    this.focusOut = this.focusOut.bind(this);

  }
  focusIn() {

    debugger;
    let errorDom, bodyWidth, bodyHeight, domPosition, domWidthSize, domHeightSize, tempWidth, tempHeight;
    errorDom = ReactDOM.findDOMNode(this.refs.error);
    bodyWidth = document.body.clientWidth;
    bodyHeight = document.body.clientHeight;
    errorDom.style.display = "block";
    // domPosition = errorDom.getBoundingClientRect();
    // domWidthSize = domPosition.left + errorDom.clientWidth;
    // domHeightSize = domPosition.top + errorDom.clientHeight;
    // if (domWidthSize > bodyWidth) {
    //   tempWidth = bodyWidth - domWidthSize + 20 + "px";

    //   errorDom.style.left = tempWidth;
    //   errorDom.style.right = "auto";
    // }
    // if (domHeightSize > bodyHeight) {
    //   tempHeight = bodyHeight - domHeightSize - 20 + "px";
    //   errorDom.style.top = tempHeight;
    // }
  }
  focusOut() {

    let errorDom;
    errorDom = ReactDOM.findDOMNode(this.refs.error);

    errorDom.style.display = 'none';
  }
  render() {
    let {
      shape,
      state,
      children,
      infoList
    } = this.props;
    let classes = {
        'node': true,
        [`node-${shape}`]: shape,
        [state]: state
      }
      //let classes = ['node',[`node-${shape}`],state];
    return (

      <div className={classnames(classes,this.props.className)} onMouseOver={this.focusIn} onMouseLeave={this.focusOut}>
        <ErrorMessage infoList={infoList} ref='error'/>
        {
          children
        }
      </div>
    )
  }
}

export default Node;