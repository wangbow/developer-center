import {
  Component
} from 'react';
import {
  Row
} from 'tinper-bee';
import {
  Header,
  Footer,
  Node,
  Time,
  Starter
} from '../../components';

import './index.less';

class Monitor extends Component {
  render() {
    return (
      <div className="monitor">
        <Header />
        <Time/>
        <Starter/>
        <Footer/>
      </div>
    )
  }
}

export default Monitor;