import { Component } from 'react';
import Dnd from 'bee-dnd';
import {Input, FormControl} from 'tinper-bee';

class SortCase extends Component {

    render() {
        let {cases} = this.props;
        let sortedCases = [];
        cases.forEach((item)=> {
            sortedCases.push(
                <div className="sort-case">
                    {
                        `${item.testcaseName}`
                    }
                </div>
            );
        })
        return (

            <div >
                <div className ="tips">请用鼠标拖动下列用例进行排序！</div>
                <Dnd list={sortedCases} className="drag" onStop={this.props.onDragEnd}/>
            </div>
        )
    }
}
export default SortCase;