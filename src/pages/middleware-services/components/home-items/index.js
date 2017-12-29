import { Component, PropTypes } from 'react';
import { Button } from 'tinper-bee';
import { Link } from 'react-router';
import classnames from 'classnames';
import './index.less';

class Item extends Component {
    
    constructor(props) {
        super(props);
    }

    // 去往当前选中卡片的管理界面
    gotoManageList = type => evt => {
        this.props.router.push(`/list/${type}`);
    }
    render() {

        let { info,count, logo } = this.props;
        let bgcolor = info.bgcolor;
        let cardId = info.id;
        let cardName = info.name;

        return (
            <div className="item">
                <div className="item-wrap">
                    <div className={classnames({ 'item-left': true, bgcolor: true })} >
                        {
                            info.isprobation ?
                                (<div className="probation">试用</div>)
                                : ''
                        }
                        <img src={logo} />
                        <span className="serivce-count">{count}</span>
                    </div>
                    <div className="item-right">
                        <div className="item-right-top">
                            <span className="item-name">{info.name}服务</span>
                            <Link to={info.newSerivce}>
                                <Button shape="round" bordered="true" className="new-serivce">
                                    创建一个
                                </Button>
                            </Link>
                        </div>
                        <div className="item-right-center">
                            <p>
                                {info.describe}
                            </p>
                        </div>
                        <div className="item-right-bottom">
                            <Button
                                colors="primary"
                                onClick={this.gotoManageList(cardId)}
                            >
                                管理我的{cardName}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Item;
