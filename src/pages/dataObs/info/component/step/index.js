import PropTypes from 'prop-types';
import './index.less';

export default function Step(props){
  return (
    <div className="step">
       <div className="step--icon">
         <span className={`cl ${props.icon} step--icon-font`}></span>
       </div>
       <div className="step--line"/>
       <div className="step--body">
         <div className="step--title">{props.title}</div>
         {props.children}
       </div>
    </div>
  )
}

Step.propTyes ={
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}