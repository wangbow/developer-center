import React from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import Arrow from '../Arrow'

import './index.less';

class Line extends React.Component {

	componentDidMount() {
		//给各个箭头添加属性
		let markerRightNode = ReactDOM.findDOMNode(this.refs.markerRight);
		let markerTopNode = ReactDOM.findDOMNode(this.refs.markerTop);
		let markerBottomNode = ReactDOM.findDOMNode(this.refs.markerBottom);

		let markerEndNode = ReactDOM.findDOMNode(this.refs.markerEndNode);
		let startIconOrient, endIconOrient = "auto",
			startArrowIdUrl, endArrowIdUrl, refX, refY; //开始和结尾箭头的方向

		markerRightNode.setAttribute('refX', 8);
		markerRightNode.setAttribute('refY', 5);
		markerTopNode.setAttribute('refX', 5);
		markerTopNode.setAttribute('refY', 0);
		markerBottomNode.setAttribute('refX', 5);
		markerBottomNode.setAttribute('refY', 8);



		//默认都有结尾箭头
		endArrowIdUrl = this.props.endIconDirec ? 'url(\#arrow' + this.props.endIconDirec + ')' : 'url(\#arrowright)';
		markerEndNode.style.markerEnd = endArrowIdUrl;
		// markerNode.setAttribute('markerWidth', 13);
		// markerNode.setAttribute('markerHeight', 13);
		// 如果有开始箭头，判断箭头方向，并添加开始箭头
		if (this.props.startIconDirec) {
			startArrowIdUrl = 'url(\#arrow' + this.props.startIconDirec + ')'
			if (this.props.startIconOrient) {
				startIconOrient = this.props.startIconFlag;
			}
			markerEndNode.style.markerStart = startArrowIdUrl;
			// markerNode.setAttribute('orient', endIconOrient);
		}

		if (this.props.endIconOrient) {
			endIconOrient = this.props.endIconOrient;
		}


	}
	render() {


		let {
			color,
			startIconFlag,
			startIconOrient,
			endIconOrient,
			pathStr,
			lineWidth,
			lineHeight,
			arrowId,
			className
		} = this.props;

		pathStr = pathStr ? pathStr : "M0,5 L48,5";
		// debugger;
		lineWidth = lineWidth ? lineWidth : 48;
		lineHeight = lineHeight ? lineHeight : 10;
		arrowId = arrowId ? arrowId : 'arrow';
		return (
			<div className={classnames('line',className)}>
				<Arrow color={color} refX="8" refY="5" id={arrowId}/>
				<svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1" >
	                <defs>
                        <marker ref="markerRight" id="arrowright" markerHeight="13" markerWidth="13" >
                        <path d="M0,0 L0,10 L8,5" style={{fill:color}} />
                        </marker>
                    </defs>         
		            
                    <defs>
                        <marker ref="markerTop" id="arrowtop" markerHeight="13" markerWidth="13">
                        <path d="M0,8 10,8 L5,0" style={{fill:color}} />
                        </marker>
                    </defs> 
                    <defs>
                        <marker ref="markerBottom" id="arrowbottom" markerHeight="13" markerWidth="13" >
                        <path d="M0,0 L10,0 L5,8 " style={{fill:color}} />
                        </marker>
                    </defs> 
		        </svg>
		        <svg width={lineWidth} height={lineHeight}  xmlns="http://www.w3.org/2000/svg" version="1.1" >
	                     
		            <path ref="markerEndNode" d={pathStr}
			                style={{stroke: color,  fill: "none",strokeWidth: "1px" }}
			            />
		        </svg>
        	</div>);
	}
}
export default Line;