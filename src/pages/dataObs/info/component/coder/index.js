import PropTypes from 'prop-types';
import './index.less';

export default function Coder(props){

  return (
    <div className="coder">
      {
        props.code.map((line,index)=>{
          return (
            <div>
             {/* <span className="coder--line-number">{index}</span> */}
              <pre className="coder--code">{line}</pre>
            </div>
          )
        })
      }

    </div>
  )

}


Coder.propTypes={
  code: PropTypes.arrayOf(PropTypes.string),
}

Coder.defaultProps={
  code: [],
}