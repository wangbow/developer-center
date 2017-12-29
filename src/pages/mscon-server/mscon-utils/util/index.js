import { err, warn, success } from 'components/message-util';
import { Tooltip } from 'tinper-bee';


/**
 * 获取接口的名称 
 * @param {*} firstName 
 */
export function getInterfaceName(firstName) {
    let arr = [];
    let interfaceName;
    if (firstName) {
        arr = firstName.split(".");
        if (arr && Array.isArray(arr)) {
            interfaceName = arr[arr.length - 1];
        } else {
            interfaceName = firstName;
        }
    }
    return interfaceName;
}
/**
 * 鼠标hover接口的时候，显示完整的包名和接口名
 * @param {*} data 
 */
export function toolTipData(data) {
    return (<Tooltip inverse id="toolTipId">
        <span>{data}</span>
    </Tooltip>
    )
}

/**
 * 解析并组装数据结构
 */
export function createTree(node, parentId) {
    if (this.state.oldData.length == 0) return node;//跳出递归条件
    let curp = [];

    this.state.oldData = this.state.oldData.filter((vaule) => {
        if (parentId == vaule.parentId || parentId + "" == vaule.parentId) {
            curp.push(vaule);
            return false;
        }
        return true;
    })

    if (node == null) {
        node = {
            id: curp[0].id,
            serviceName: curp[0].serviceName || "",
            statusCode: curp[0].statusCode || "",
            duration: curp[0].duration || "",
            ipv4: curp[0].binaryAnnotations[0].endpoint.ipv4 || "",
            port: curp[0].binaryAnnotations[0].endpoint.port || "",
            serviceInterface: curp[0].serviceInterface || "",
            methodName: curp[0].methodName || "",
            parentId: parentId,
            children: []
        }
        this.createTree(node, curp[0].id);
    }
    else {
        curp.forEach((value, index) => {
            node.children[index] = {
                id: value.id,
                serviceName: value.serviceName || "",
                name: curp[0].name || "",
                statusCode: value.statusCode || "",
                duration: value.duration || "",
                ipv4: value.binaryAnnotations[0].endpoint.ipv4 || "",
                port: value.binaryAnnotations[0].endpoint.port || "",
                serviceInterface: value.serviceInterface || "",
                methodName: value.methodName || "",
                parentId: parentId,
                children: []
            };

            this.createTree(node.children[index], value.id);
        })
    }
    return node;
}

/**
 * 鼠标hover接口的时候，显示信息
 * @param {*} data 
 */
export function toolTipDataText(data) {
    return (<Tooltip inverse id="toolTip_id">
        <span>{data}</span>
    </Tooltip>
    )
}

/**
 * 显示treeTable的颜色
 */
export function showRowColor(index) {
    if (index == 3) {
        return "light_green";
    } else if (index > 3) {
        return "deep_green";
    }
}

