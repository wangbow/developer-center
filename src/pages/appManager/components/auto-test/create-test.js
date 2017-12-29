import {Component} from 'react';
import {
    Modal,
    Button,
    Form,
    Label,
    FormControl,
    FormGroup,
    Radio,
    Select,
    Message,
    Pagination,
    InputGroup,
    Row,
    Col,
    Icon
} from 'tinper-bee';
import TestCase from './test-case';
import SortCase from './sort-case';
import './index.less';
import {saveJob, viewTestJob, deleteJobCase} from 'serves/appTile';

const Option = Select.Option;


class CreateTest extends Component {
    state = {
        name: '',
        desc: '',
        email: '',
        browser: 'chrome',
        status: 'Y',
        step: 0,
        cases: [],
        checkedAll: false,
        testjobId: null,
        executeOrder: [],
        delecases:[],
        bootTestJob:{},
        addcases:[],
    }
    bootJobCaseList = [];
    executeOrder = 1;
    componentWillReceiveProps(nextProps) {
        if(this.props.editFlag !== nextProps.editFlag) {
            if (nextProps.editFlag) {
                this.viewTestJob(nextProps.dataId).then((jobData) => {
                    let bootTestJob = jobData.bootTestJob;
                    this.setState({
                        name: bootTestJob.testjobName,
                        browser: bootTestJob.browserType,
                        desc: bootTestJob.testjobNote,
                        email: bootTestJob.email,
                        status: bootTestJob.testjobState,
                        cases: jobData.bootJobCaseList,
                        testjobId: bootTestJob.testjobId,
                        bootTestJob:bootTestJob
                    })
                });
            }
        }
    }
    /**
     * 页面值改变
     */

    handleChange = (state) => (e) => {
        this.setState({
            [state]: e.target.value
        })
    }

    /**
     * 浏览器类型值改变
     */
    handleTypeChange = (value) =>{
        this.setState({
            browser: value,
        });
    }


    nextStep = () => {
        let {step,  name, cases}  = this.state;
        if(step === 0 && name ===''){
            return Message.create({
                content:"请输入任务名称！",
                color: 'warning',
                duration: null
            })
        }
        if(step === 0){
            this.bootJobCaseList = JSON.parse(JSON.stringify(cases));
        }
        if(step === 1 && cases.length === 0 ){
            return Message.create({
                content:"请选择测试用例！",
                color: 'warning',
                duration: null
            })
        }
        if(step == 1 ){
           cases.forEach((item,index) =>{
                item.executeOrder = index + 1;
            })
            this.setState({
                cases
            })
        }
        this.setState({
            step:step + 1
        })
    }

    preStep = () => {
        let step = this.state.step;
        this.setState({
            step: step - 1
        })
    }

    /**
     * 关闭模态框
     */
    handleCancel = () => {
        this.setState({
            step: 0,
            name: '',
            desc: '',
            email: '',
            browser: 'chrome',
            status: 'Y',
            checkedAll: false,
            cases:[],
            data:'',
            testjobId: null,
            delecases:[],
            bootTestJob:{},
            addcases:[]
        })
        this.executeOrder = 1;
        this.bootJobCaseList = [];
        this.props.close();
    }


    /**
     * 创建测试任务
     */
    handleEnsure = () => {
        let {name, desc, email, browser, status, cases, testjobId, delecases, addcases, bootTestJob} = this.state;
        let {app_id, app_name, editFlag} = this.props;
        let testJob = {//新增时的bootTestJob
            testjobId: testjobId,
            testjobState: status,
            browserType: browser,
            testjobName: name,
            testjobNote: desc,
            email: email,
            productId: app_id,
            productName: app_name,
            testjobType: "selenium"
        };
        //任务详情更新
        bootTestJob.testjobState = status;
        bootTestJob.browserType = browser;
        bootTestJob.testjobName = name;
        bootTestJob.testjobNote = desc;
        bootTestJob.email = email;

        this.props.close();
        let paramData = {};

        if(editFlag){
            if (delecases.length !== 0) {//没有新增有删除
                deleteJobCase(testjobId, delecases)
            }
            paramData = {
                bootTestJob: bootTestJob,
                bootJobCaseList: cases
            };
        }else {//新增，bootJobCaseList为cases，bootTestJob手动
            paramData = {
                bootTestJob: testJob,
                bootJobCaseList: cases
            };
        }
        saveJob(paramData)
            .then((res) => {
                let data = res.data;
                if (data.flag === "success") {
                    Message.create({
                        content:editFlag?'测试任务修改成功!':'创建测试任务成功！',
                        color: 'success',
                        duration: 4.5
                    });
                    this.props.getJoblist(`?search_productId=${app_id}`);
                } else {
                    Message.create({
                        content: data.msg,
                        color: 'danger',
                        duration: 4.5
                    })
                }
            })
        this.executeOrder = 1;
        this.bootJobCaseList = [];
        this.setState({
            step: 0,
            name: '',
            desc: '',
            email: '',
            browser: 'chrome',
            status: 'Y',
            checkedAll: false,
            cases:[],
            data:'',
            testjobId:null,
            delecases:[],
            bootTestJob:{},
            addcases:[]
        })
    }

    viewTestJob = (id) =>{
        return viewTestJob(id).then((res) =>{//在这里直接setState不可以，异步执行
            let data = res.data;
            return data.data;
        })
    }

    /**
     * 表格checkbox点选
     * @param record
     * @returns {function(*)}
     */

    handleChoiseCase = (record) => (e) => {
        let {cases, delecases, addcases} = this.state;
        let obj ={};
        if (e.target.checked) {
            let flag1 = true,flag2 = false;
            let rec = {
                testcaseName: record.testcaseName,
                testcaseId: record.testcaseId,
                executeOrder: this.executeOrder
            }
            this.executeOrder += 1;
            cases.forEach((item)=>{
                if(item.testcaseId === record.testcaseId){return flag1 = false}
            })
            this.bootJobCaseList.forEach((item)=>{
                if(item.testcaseId === record.testcaseId){return flag2 = true}
            })
            if(flag1){//当前cases没有这个值
                if(flag2){//之前保存过得cases里有这个值
                    this.bootJobCaseList.forEach((item)=>{
                        if(item.testcaseId === record.testcaseId){
                            return cases.push(item);
                        }
                    })
                }else{
                    cases.push(rec);//新增用例，没有关联过
                }
            }
            if(delecases.length > 0){
                delecases = delecases.filter((item) => {//去除删除后又选中的实例
                    if (item.testcaseName !== record.testcaseName) return item
                })
            }
        } else {

            obj = cases.filter(function(item){//根据record找到对应的case
                if( item.testcaseId === record.testcaseId){
                    return item
                }
            })

            this.bootJobCaseList.forEach((item)=>{
                if(item.testcaseName === record.testcaseName){
                    return delecases.push({
                        jobCaseId: obj[0].jobCaseId,
                        testcaseName: record.testcaseName,
                        userId: record.userId
                    })
                }
            })

            cases = cases.filter(item => {
                if (item.testcaseId !== record.testcaseId)return item
            })  //去除反选的用例
            this.setState({
                checkedAll: false,
            })
        }

        this.setState({
            cases,
            delecases,
            addcases
        })
    }

    handleCheckAll = (data) => (e) => {
        let {cases, delecases} = this.state;
        if (e.target.checked) {

            data.forEach((item, index) => {
                let flag1 = true, flag2 = false;
                cases.forEach(elem =>{
                   if( elem.testcaseId === item.testcaseId){
                       return flag1 = false;
                   }
                })
                this.bootJobCaseList.forEach((elem)=>{
                    if( elem.testcaseId === item.testcaseId){
                        return flag2 = true;
                    }
                })
                if(flag1) {
                    if (flag2) {
                        this.bootJobCaseList.forEach((elem)=> {
                            if (elem.testcaseId === item.testcaseId) return cases.push(elem)
                        })
                    } else {
                        cases.push({
                            testcaseName: item.testcaseName,
                            testcaseId: item.testcaseId,
                            executeOrder: index + 1
                        });
                    }
                }
            })

            this.setState({
                cases,
                checkedAll: true,
                delecases:[],
            })
        } else {
            this.bootJobCaseList.forEach((item, index)=>{
                delecases.push({
                    testcaseName: item.testcaseName,
                    jobCaseId: cases[index].jobCaseId,
                    userId: item.userId
                })
            })

            this.setState({
                cases: [],
                checkedAll: false,
                delecases
            })
        }
    }


    //拖拽结束
    onDragEnd = (list) => {
        let {cases} = this.state;
        let primindex = list.draggableId;
        let desindex = list.destination.index;

        let case1 = JSON.parse(JSON.stringify(cases));
        let elem = case1[primindex];
        case1.splice(primindex,1);
        case1.splice(desindex,0,elem);
        case1.forEach((item,index)=>{
            item.executeOrder = index + 1;
        })

        this.setState({
            cases:case1
        })
    }//list是排序结果

    render() {
        let {status, browser, step, name, email, desc, cases} = this.state;
        let {showCreateModal, editFlag} = this.props;

        return (
            <Modal
                show={ showCreateModal }
                className="simple-modal"
                size="md"
                onHide={ this.handleCancel }>
                <Modal.Header closeBtn>
                    <Modal.Title className="special">
                        {
                            step === 2?(
                                <div>调整用例执行顺序</div>
                            ):(
                                editFlag ?(
                                    <div>修改测试任务</div>
                                ):(
                                    <div>新增测试任务</div>
                                )
                            )

                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="min-set">
                    {
                        step === 0 ? (
                            <Form horizontal className="create-test-form">
                                <FormGroup>
                                    <Row>
                                        <Col md={3} className="text-right">
                                            <Label>
                                                任务名称
                                            </Label>
                                        </Col>
                                        <Col md={8}>
                                            <FormControl
                                                onChange={this.handleChange('name')}
                                                value={name}

                                                />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="hide">
                                    <Row>
                                        <Col md={3} className="text-right">
                                            <Label>
                                                任务状态
                                            </Label>
                                        </Col>
                                        <Col md={8}>
                                            <Radio.RadioGroup
                                                selectedValue={status}
                                                onChange={this.handleChange('status')}>
                                                <Radio value="Y">
                                                    <span>激活</span>
                                                </Radio>
                                                <Radio value="start">
                                                    <span>执行中</span>
                                                </Radio>
                                                <Radio value="N">
                                                    <span>停用</span>
                                                </Radio>
                                                <Radio value="stop">
                                                    <span>已停止</span>
                                                </Radio>
                                            </Radio.RadioGroup>
                                        </Col>
                                    </Row>


                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col md={3} className="text-right">
                                            <Label>
                                                浏览器类型
                                            </Label>
                                        </Col>
                                        <Col md={8}>
                                            <Select
                                                defaultValue='chrome'
                                                value={browser}
                                                dropdownStyle={{zIndex: '9999'}}
                                                onChange={this.handleTypeChange}>
                                                <Option value="chrome">chrome</Option>
                                                <Option value="firefox">firefox</Option>
                                                <Option value="ie">ie</Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col md={3} className="text-right">
                                            <Label>
                                                邮件接收人
                                            </Label>
                                        </Col>
                                        <Col md={8}>
                                            <FormControl
                                                onChange={this.handleChange('email')}
                                                value={email}
                                                />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col md={3} className="text-right">
                                            <Label>
                                                描述信息
                                            </Label>
                                        </Col>
                                        <Col md={8}>
                      <textarea
                          rows="3"
                          className="auto-test-desc"
                          onChange={this.handleChange('desc')}
                          value={desc}
                          />
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Form>
                        ) : ''
                    }
                    {
                        step === 1 ?(
                            <TestCase
                                onChioseCase={this.handleChoiseCase}
                                cases={cases}
                                appId={this.props.app_id}
                                checkAll={ this.handleCheckAll }
                                checkedAll={ this.state.checkedAll}
                                fmtDate={this.props.fmtDate}
                                />
                      ):''
                    }
                    {
                        step === 2 ?(
                            <SortCase
                               cases={cases}
                               onDragEnd={this.onDragEnd}
                                />
                        ) :''
                    }

                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <Button onClick={ this.handleCancel } shape="squared">取消</Button>
                    {
                        step === 0 ? (
                            <Button onClick={ this.nextStep } style={{marginLeft: 50}} colors="primary" shape="squared">下一步</Button>
                        ) : ''
                    }
                    {
                        step === 1 ? (
                            <span>
                                <Button onClick={ this.preStep } colors="primary" style={{ marginLeft: 25}} shape="squared">上一步</Button>
                                <Button onClick={ this.nextStep } style={{marginLeft: 25}} colors="primary" shape="squared">下一步</Button>
                            </span>
                        ):''
                    }
                    {
                        step === 2 ? (
                            <span>
                                <Button onClick={ this.preStep } colors="primary" style={{marginRight: 25, marginLeft: 25}} shape="squared">上一步</Button>
                                <Button onClick={ this.handleEnsure } colors="primary" shape="squared">创建</Button>
                            </span>
                        ):''
                    }
                </Modal.Footer>
            </Modal>
        )
    }
}

export default CreateTest;
