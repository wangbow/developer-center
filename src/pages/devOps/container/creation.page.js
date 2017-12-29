// publics 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select,Message } from 'tinper-bee';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;

// self compoents
import PageHeader from '../component/page_header';

// api  
import { 
  commitChangeBill, 
  getDepts, 
  getChangeType 
} from '../../../serves/devOpts';

// static 
import './creation.style.css';

// varible
const Option = Select.Option;

export default class Home extends Component {
  state={
    optType: [],
    optDpt:[],
    stime: '',
    etime: '',

    title: '',
    content: '',
    startTime: '',
    endTime:'',
    typeVal: '',
    dptVal: '',
  }

  componentDidMount(){
    Promise.all([getDepts(), getChangeType()])
      .then(([optDpt,optType])=>{
         this.setState({
           optType: optType.slice(0,optType.length-1),
           typeVal: optType[0].index,
           optDpt,
           dptVal:optDpt[0].index,
         })
      })
  }
  
  handleSubmit=(e)=>{
    e.preventDefault();

    if(!this.state.title){
      return Message.create({ content: '请输入变更标题', color: 'danger', duration: 2 })
    }
    if(!this.state.typeVal){
      return Message.create({ content: '请选择变更类型', color: 'danger', duration: 2 })
    }
    if(!this.state.content){
      return Message.create({ content: '请填写变更内容', color: 'danger', duration: 2 })
    }
    if(!this.state.dptVal){
      return Message.create({ content: '请选择变更部门', color: 'danger', duration: 2 })
    }
    if(!this.state.startTime || ! this.state.endTime){
      return Message.create({ content: '请选择起止时间', color: 'danger', duration: 2 })
    }

    commitChangeBill({
      title:this.state.title,
      type:this.state.typeVal,
      content: this.state.content,
      dept: this.state.dptVal,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    }).then(data=>{
      if(data.success){
        this.props.router.goBack();
      }else{
        Message.create({ content: '提交失败稍候重试', color: 'danger', duration: 2 })
      }
    })
  }
  
  handleCancel=()=>{
    this.props.router.goBack();
  }

  render() {
    return (
      <section className="creation">
        <header>
          <PageHeader
            showBack
            title="变更申请"
          />
        </header>
        <form className="creation__body"
          onSubmit={this.handleSubmit}
        >
          <div className="creation__field">
            <label
              className="creation__label"
              for="ch-title"
            >
              变更标题
            </label>
            <input
              className="creation__input"
              onChange={(e)=>{this.setState({title: e.target.value})}}
              value={this.state.title}
              type="text"
              id="ch-title"
              name="ch-title"
            />
          </div>
          <div className="creation__field">
            <label
              for="ch-type"
              className="creation__label"
            >
              变更类型
            </label>
            <Select defaultValue="lucy"
              className="creation__sinput"
              onChange={value=>this.setState({typeVal: value})}
              value={this.state.typeVal}
            > 
              { 
                this.state.optType.map((item,index)=>{
                  return <Option value={item.index} key={item.index}>{item.desc}</Option>
                })
              }
            </Select>
          </div>
          <div className="creation__field">
            <label
              for="ch-content"
              className="creation__label"
            >
              变更内容
            </label>
            <textarea
              className="creation__finput"
              onChange={(e) => { this.setState({ content: e.target.value }) }}
              value={this.state.content}
              id="ch-content"
              name="ch-content"
            ></textarea>
          </div>
          <div className="creation__field">
            <label
              className="creation__label"
              for="ch-depart"
            >
              变更部门
            </label>
            <Select defaultValue="lucy"
              className="creation__sinput"
              onChange={value => this.setState({ dptVal: value })}
              value={this.state.dptVal}
            >
              {
                this.state.optDpt.map((item, index) => {
                  return <Option value={item.index} key={item.index}>{item.desc}</Option>
                })
              }
            </Select>
          </div>
          <div className="creation__field">
            <label
              className="creation__label"
            >起止时间</label>
            <RangePicker
              style={{ width: 600 }}
              onChange={([ms,me])=>{
                 this.setState({
                   stime: ms.valueOf(),
                   etime: me.valueOf(),
                 })
              }}
              onOk={()=>{
                this.setState({
                  startTime: this.state.stime,
                  endTime: this.state.etime,
                })
              }}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
            />
          </div>


          <div className="creation__field" style={{ margin: '60px 0' }}>
            <Button
              className="creation__btn creation__btn--ok"
              type="submit"
            >提交</Button>
            <Button
              onClick={this.handleCancel}
              className="creation__btn creation__btn--cancel"
            >取消</Button>
          </div>
        </form>
      </section>
    )
  }
}