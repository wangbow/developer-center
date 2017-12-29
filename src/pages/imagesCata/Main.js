import React, {Component} from 'react'
import {Row, Col, Button, InputGroup, FormControl, Icon} from 'tinper-bee'
import styles from './index.css';
import OwnerCata from './ownerCata'
import PublicCata from './publicCata'
import classnames from 'classnames'

import Title from "../../components/Title";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cata: "publiccata",
            searchValue: ""
        }
    }

    componentDidMount() {
        let cata = this.props.location.query.key;
        if (cata) {
            this.setState({
                cata: cata
            });
        }
    }

    /**
     * 切换页签
     * @param name 页签name
     * @returns {Function}
     */
    changeCata(name) {
        const self = this;
        return function () {
            self.setState(
                {
                    cata: name
                }
            )
        }
    }

    handleSearch = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    }

    render() {

        return (
            <Row className="image-cata">
                <Title name="镜像仓库" showBack={false}/>
                <div className="button-menu">
                    <Button
                        colors="primary"
                        shape="squared"
                        bordered
                        onClick={ this.changeCata('publiccata') }
                        className={classnames('tab-btn',{'active': this.state.cata === 'publiccata'})}
                        style={{width: 120}}>
                        公有仓库
                    </Button>
                    <Button
                        colors="primary"
                        shape="squared"
                        bordered
                        onClick={ this.changeCata('ownercata') }
                        style={{marginLeft: 10, width: 120}}
                        className={classnames('tab-btn',{'active': this.state.cata === 'ownercata'})}>
                        私有仓库
                    </Button>
                    {/*<InputGroup*/}
                        {/*simple*/}
                        {/*className="image-search"*/}
                        {/*style={{float: 'right'}}>*/}
                        {/*<FormControl*/}

                            {/*type="text"*/}
                            {/*placeholder="搜索"*/}
                            {/*onChange={ this.handleSearch }*/}
                        {/*/>*/}
                        {/*<InputGroup.Button*/}
                            {/*shape="border">*/}
                            {/*<Icon type="uf-search" />*/}
                        {/*</InputGroup.Button>*/}
                    {/*</InputGroup>*/}
                </div>
                <div>
                    {
                        this.state.cata === 'publiccata' ? <PublicCata searchValue={ this.state.searchValue } /> : <OwnerCata  searchValue={ this.state.searchValue } />
                    }
                </div>

            </Row>
        )
    }
}
export default MainPage;
