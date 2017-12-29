import { Tooltip } from 'tinper-bee';

/**
 * 鼠标hover接口的时候，显示完整信息
 * @param {*} data 
 */
export function toolTipData(data) {
    return (<Tooltip inverse id="toolTipId">
        <span>{data}</span>
    </Tooltip>
    )
}
