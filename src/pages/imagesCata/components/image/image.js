import React, {Component} from 'react'
import {Link} from 'react-router'
import {Row, Col, Button, Tile, Icon} from 'tinper-bee'
import classnames from 'classnames'
import styles from './index.css';
import imgUrl from '../../../../assets/img/image_cata/docker.png';


class Image extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const self = this;

    }

    render() {

        const {data, path} = this.props;
        name = data.pure_image_name;
        name = name.replace(/\s/g, '');
        name = name.split('.').join('');
        return (
            <Tile className="imagecata-image">
                <Link to={ path }>
                    <div className="pic">

                            <span style={{display: 'inline-block', width: 80, height: 80}}
                                  className={classnames("default-png", `${name.toLowerCase()}-png`)}/>


                    </div>
                    <div className="image-title">
                        <h3>{ data.pure_image_name }</h3>
                        <p>Docker Official</p>
                        <div style={{marginLeft: -5}}>
                            <span><i className="cl cl-eye"/>{ data.view_count }</span>
                            <span><i className="cl cl-cloud-download"/>{ data.pull_count }</span>
                        </div>
                    </div>

                    <p className="image-description">
                        { data.image_info }
                    </p>
                </Link>
            </Tile>
        )
    }
}


export default Image;
