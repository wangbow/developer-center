import React from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import Arrow from '../Arrow'

import './index.less';

class Line extends React.Component {

	componentDidMount() {
		//给各个箭头添加属性
		// let markerRightNode = ReactDOM.findDOMNode(this.refs.markerRight);
		// let markerTopNode = ReactDOM.findDOMNode(this.refs.markerTop);
		// let markerBottomNode = ReactDOM.findDOMNode(this.refs.markerBottom);

		let markerEndNode = ReactDOM.findDOMNode(this.refs.markerEndNode);
		let startIconOrient, endIconOrient = "auto",
			startArrowIdUrl, endArrowIdUrl, refX, refY; //开始和结尾箭头的方向

		// markerRightNode.setAttribute('refX', 8);
		// markerRightNode.setAttribute('refY', 5);
		// markerTopNode.setAttribute('refX', 5);
		// markerTopNode.setAttribute('refY', 0);
		// markerBottomNode.setAttribute('refX', 5);
		// markerBottomNode.setAttribute('refY', 8);



		//默认都有结尾箭头
		endArrowIdUrl = this.props.arrowId ? 'url(\#' + this.props.arrowId + ')' : 'url(\#arrow)';
		markerEndNode.style.markerEnd = endArrowIdUrl;
		if (this.props.startId) {
			startArrowIdUrl = 'url(\#' + this.props.startId + ')';
			markerEndNode.style.markerStart = startArrowIdUrl;
		}
		// markerNode.setAttribute('markerWidth', 13);
		// markerNode.setAttribute('markerHeight', 13);
		// 如果有开始箭头，判断箭头方向，并添加开始箭头
		// if (this.props.startIconDirec) {
		// 	startArrowIdUrl = 'url(\#arrow' + this.props.startIconDirec + ')'
		// 	if (this.props.startIconOrient) {
		// 		startIconOrient = this.props.startIconFlag;
		// 	}
		// 	markerEndNode.style.markerStart = startArrowIdUrl;
		// 	// markerNode.setAttribute('orient', endIconOrient);
		// }

		// if (this.props.endIconOrient) {
		// 	endIconOrient = this.props.endIconOrient;
		// }


	}
	render() {


		let {
			color,
			startIconFlag,
			endOrient,
			startOrient,
			pathStr,
			lineWidth,
			lineHeight,
			arrowId,
			startId,
			className
		} = this.props;

		pathStr = pathStr ? pathStr : "M0,5 L48,5";
		// debugger;
		lineWidth = lineWidth ? lineWidth : 48;
		lineHeight = lineHeight ? lineHeight : 10;
		arrowId = arrowId ? arrowId : 'arrow';
		return (
			<div className={classnames('line',className)}>
				<Arrow color={color} refX="8" refY="5" id={arrowId} endOrient={endOrient} startOrient={startOrient} startId={startId}/>
				
		        <svg width={lineWidth} height={lineHeight}  xmlns="http://www.w3.org/2000/svg" version="1.1" >
	                     
		            <path ref="markerEndNode" d={pathStr}
			                style={{stroke: color,  fill: "none",strokeWidth: "2px" }}
			            />
		        </svg>
        	</div>
		);
	}
}
export default Line;