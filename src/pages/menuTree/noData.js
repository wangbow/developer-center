import React from 'react';

import imgempty from '../../assets/img/taskEmpty.png';

const NoData = () => {
    return (
        <div style={{ width: 250, height: 250, margin: '100px auto', textAlign: 'center'}}>
            <img src={imgempty} width={200} />
            <p>无数据</p>
        </div>
    )
};

export default  NoData;