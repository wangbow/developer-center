# 开发者中心前端开发文档及规范

### 规范

#### 文件命名规范及组织结构

- 文件名全部使用小写命名
- 复杂名称，使用-连接


src基本目录结构
```
|-- assets 存放资源、图片
|-- components 存放公用的组件
|-- containers 存放公共的容器组件
|-- lib 存放公共方法及hack
|-- pages 存放各个节点页面
|    |-- app-manager
|        |-- components 存放当前节点UI组件
|             |-- pubish
              |   |-- index.js
              |   |-- index.css
              |-- index.js 导出components下所有组件      
|        |-- containers 存放当前节点容器组件
              |-- list
              |   |-- index.js
              |   |-- index.css
              |-- index.js 导出containers下所有组件
|        |-- index.js   入口js，不用变
|        |-- main.js    主页js
|        |-- routes.js  当前节点路由
|        |-- index.css  全局css样式
|        |-- index.ejs  不必要，主要涉及节点引入单独使用js
|-- serves 存放各节点服务
      |-- app-manager.js 节点同名js
```


#### css规范

- 采用less预编译语言

- 项目代码分层
  - 重置样式
  - 全局样式
  - 工具样式
  - 根据组件及模块进行代码分块及命名空间划分
  
- 注释
  - 对hack代码添加注释
  - 对代码段增加注释
  - 对特殊代码增加注释

- 不使用`!import`

- 尽量将图片写成css背景图

#### js规范

- 使用es6规范开发

- 对于语义化不明显的地方，hack点，复杂功能进行必要注释

- 对不能确定数据类型的对象，使用原生数据结构上自带的方法时，必须进行数据类型校验（typeof instanceOf）

#### react开发相关规范

- 基本遵从airbnb react开发规范
- 不使用废弃与预备废弃api
- 只要有props传入的组件，就要写propTypes进行校验
- 将没有内部状态管理的组件写成木偶组件（function）

- 基本组件目录结构
```
//公共引用
import React, { Component } from 'react';

//内部组件
import { Title } from 'components';//通过webpack配置

//api

import { getList } from 'serves/app-manager'

//静态资源

import './index.css'

class Exmaple extends Component{
    static propTypes = {}
    static defaultProps = {}
    state = {}
    
    //生命周期方法
    componentDidMount(){}
    
    //自定义方法
    handleClick = () => {}
    
    render () {
      return (
        <div>
        </div>
      )
    }
    
}

export default Exmaple;

```


### 业务代码从组件中分离

- 将常量（包含写死在state中的常量）从组件中分离，在相应的节点根目录增加constant.js文件存放常量。
- 将url从组件中分离出来，写在serves文件夹相应的功能节点文件下。
- 将与环境相关的代码，提出写在lib/env-config文件中。

- 考量css公共样式的提取，将公共样式或公共变量提取到assets/styles/common.less文件中。
