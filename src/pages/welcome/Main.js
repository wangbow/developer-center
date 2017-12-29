import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import {Tile,Button} from 'tinper-bee';
import ReactSwipe from 'react-swipe';
import styles from './index.css';
import overlayBg from '../../assets/img/u164.png';
import logo1 from '../../assets/img/u206.png';
import logo2 from '../../assets/img/line_vertical_u208.png';
import logo3 from '../../assets/img/u210.png';
import swiper1 from '../../assets/img/u162.jpg';
import swiper2 from '../../assets/img/u166.jpg';
import swiper3 from '../../assets/img/u170.jpg';

class MainPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            index:0
        };
        this.handClick = this.handClick.bind(this);
    }
    changeDot(index){
        let self=this;
        for(let i=0;i<3;i++){
            let temp='dot'+i;
            ReactDOM.findDOMNode(self.refs[temp]).className=' u-button';
        }
        let dot='dot'+index;
        ReactDOM.findDOMNode(self.refs[dot]).className=' u-button active';
    }

    handClick(e){
        let self=this;
        let number=parseInt(e.target.getAttribute('data-index'));
        self.changeDot(number);
        if(number>this.state.index){
            for(let i=this.state.index;i<number;i++){
                this.refs.reactSwipe.next();
            }
        }else if(number<this.state.index){
            for(let j=number;j<this.state.index;j++){
                this.refs.reactSwipe.prev();
            }
        }
        this.setState({index:number});
    }
    componentDidMount() {
        let self=this;
        ReactDOM.findDOMNode(self.refs.dot0).className=' u-button active';
        window.setInterval(function(){
            self.refs.reactSwipe.next();
        },5000);
    }



    render() {
        let self=this;
        const swipeOptions = {
            disableScroll: true,
            continuous: true,
            autoplay : 1000,
            loop : true,
            touchRatio : 0.5,
            callback(number) {
                self.changeDot(number);
            }
        };

        let overlayStyle = {
            backgroundImage: 'url('+overlayBg+')',
            backgroundSize: '100% 100%',
            width:'100%',
            height:'1000px',
            opacity: 1,
            position: 'fixed',
            zIndex: 2,
            marginTop: '50px'
        };
     return (
         <div className="center">
             <div className="top">
                 <ul className="logo">
                     <li> <img src={logo1} height="40px" /></li>
                     <li> <img src={logo2} height="40px" /></li>
                     <li> <img src={logo3} height="40px" /></li>
                 </ul>
                 <ul className="link">
                     <li> <a href="//developer.yonyoucloud.com/" target="_blank" className="link-a">首页</a> </li>
                     <li> <a href="//www.yonyou.com/" target="_blank" className="link-a">文档</a> </li>
                     <li> <a href="//udn.yyuap.com/" target="_blank" className="link-a">论坛</a> </li>
                     <li> <a href="//www.yonyou.com/" target="_blank" className="link-a">官网</a> </li>
                     <li> <a href="//developer.yonyoucloud.com/portal/" ><Button colors="info">开发者登录</Button></a> </li>
                     <li> <a href="//uas.yyuap.com/tenant/register/register.html?service=//developer.yonyoucloud.com:80/portal/sso/login.jsp?r=L3BvcnRhbC8&systemId=portal" ><Button colors="info">开发者注册</Button></a> </li>
                 </ul>
             </div>
             <div style={overlayStyle}></div>
             <Tile  className="login-area" border={false}>
                 <h1>用友云 开发者中心</h1>
                 <h2>高效  安全  共赢  </h2>
                 <h2>宣传语宣传语宣传语宣传语宣传语宣传语宣传语宣传语宣传语宣传语，宣传语宣传语宣传语。</h2>
                 <div className="login-btn">
                     <a href="//developer.yonyoucloud.com/portal/" className="login" ><Button colors="danger">登录</Button></a>
                     <a href="//uas.yyuap.com/tenant/register/register.html?service=//developer.yonyoucloud.com:80/portal/sso/login.jsp?r=L3BvcnRhbC8&systemId=portal" className="register">还没有账号？点击这里注册</a>
                 </div>
             </Tile>
             <ReactSwipe ref="reactSwipe" className="mySwipe" swipeOptions={swipeOptions}>
                 <div key="0">
                     <img src={swiper1} width="100%"/>
                 </div>
                 <div key="1">
                     <img src={swiper2} width="100%"/>
                 </div>
                 <div key="2">
                     <img src={swiper3} width="100%"/>
                 </div>
             </ReactSwipe>
             <div className="dot" ref="dot">
                 <Button ref="dot0" onClick={self.handClick} data-index="0"></Button>
                 <Button ref="dot1" onClick={self.handClick} data-index="1"></Button>
                 <Button ref="dot2" onClick={self.handClick} data-index="2"></Button>
             </div>
         </div>
     )
 }
}
export default MainPage;
