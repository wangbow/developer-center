import React from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';

import './index.less';

class Arrow extends React.Component {
	render() {
		let {
			color,
			id,
			refY,
			refX,
			path,
			startOrient,
			endOrient,
			startId
		} = this.props;
		let returnContent;
		// path = path ? path : "M0,8 10,8 L5,0"; //默认向下的箭头
		// refY = refY ? refY : 5;
		// refX = refX ? refX : 0;

		endOrient = endOrient ? endOrient : '0';


		if (startId) {
			returnContent = <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1" >
			                <defs>
			                	
								<marker ref="marker" refX="5" refY="0" id={startId} markerHeight="13" markerWidth="13" orient={startOrient} markerUnits="userSpaceOnUse">
			                    <path d="M0,8 10,8 L5,0" style={{fill:color}} />
			                    </marker>
			            	
			                    <marker ref="marker" refX="5" refY="8" id={id} markerHeight="13" markerWidth="13" orient={endOrient} markerUnits="userSpaceOnUse">
			                    <path d="M0,0 L10,0 L5,8" style={{fill:color}} />
			                    </marker>
			                </defs>         
					     </svg>
		} else {
			returnContent = <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1" >
			                <defs>
			                            	
			                    <marker ref="marker" refX="5" refY="8" id={id} markerHeight="13" markerWidth="13" orient={endOrient} markerUnits="userSpaceOnUse">
			                    <path d="M0,0 L10,0 L5,8" style={{fill:color}} />
			                    </marker>
			                </defs>         
					     </svg>
		}
		return (

			returnContent
		);
	}
}
export default Arrow;