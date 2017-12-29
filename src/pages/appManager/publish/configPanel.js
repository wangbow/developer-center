import React,{Component} from 'react';
import {Icon,PanelGroup,Panel} from 'tinper-bee';
import {lintAppListData,dateSubtract,dataPart} from '../../../components/util';
import {GetVersions,GetVersionDetail} from '../../../serves/appTile';
import ConfigPanelDetail from './configPanelDetail';

class ConfigPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            configTimeList: '',
            currentInfoList: '',
            versionList: [],
            currentId: this.props.id,
            currentKey: "2",
            activeKey: this.props.activeKey,
            pollFlag: false,
        }
        //this.renderlist = this.renderlist.bind(this);


        this.handleSelect = this.handleSelect.bind(this);
        this.getVersions = this.getVersions.bind(this);
        this.getVersionDetail = this.getVersionDetail.bind(this);
        this.formIsoDate = this.formIsoDate.bind(this);
    }
    
    componentDidMount() {
        if(this.state.activeKey !== this.state.currentKey) return;
        this.getVersions();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeKey !== this.state.currentKey) {
            //window.clearInterval(this.configTimer);
            return;
        };
        this.setState({pollFlag:nextProps.pollFlag});
        this.getVersions();
    }

    componentWillUnMount() {
        window.clearInterval(this.configTimer);
    }

    getVersions(timeout=0) {
        let id = this.state.currentId;
        let self = this;
        
        //this.configTimer = setTimeout(function() {
            GetVersions(id,function(response){
                let versionList = lintAppListData(response,null,null);
                if(!versionList || versionList.error_code) return;
                self.setState({versionList:versionList});
                //sessionStorage.setItem("versionList&"+id,JSON.stringify(versionList));
                if(self.state.pollFlag){
                    timeout = 10000;
                    //self.getVersions(10000)
                }else {
                    window.clearInterval(self.configTimer);
                }
            })
        //}, timeout)   
    }
    getVersionDetail(e) {
        let id = this.state.currentId;
        let version;
        if(e.target.className=="u-panel-title"){
            version = e.target.attributes[0].value;
        }else{
            version = e.target.parentElement.attributes[0].value;   
        }
        

        let self = this;

        //let sessionVersionInfo = JSON.parse(sessionStorage.getItem("versionDetail&"+version+'&'+id));

        // if(sessionVersionInfo){
        //     self.setState({currentInfoList:sessionVersionInfo});
        //     return;
        // }

        GetVersionDetail({id,version},function(response){
            let list;
            let versionDetailInfo= lintAppListData(response,null,null);
            if(!versionDetailInfo) return;
            //sessionStorage.setItem("versionDetail&"+version+'&'+id,JSON.stringify(versionDetailInfo));
            self.setState({currentInfoList:versionDetailInfo});
            event.stopPropagation()
        })
        event.stopPropagation();
    }
    handleSelect(activeKey) {
      this.setState({ activeKey });
    }
    
    formIsoDate(item) {
        return dataPart(new Date(item),'yyyy-MM-dd hh:mm:ss');
    }

    render(){
      const self = this;

      if(!this.state.versionList) {
        this.state.versionList = [];
      }
        return (
           
            <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
               {
                this.state.versionList.map(function (item,index){
                  return (
                    <Panel ref="panel-header" header={<span value={item} onClick={self.getVersionDetail}>{self.formIsoDate(item)}</span>} eventKey={index} key={index}>
                      <ConfigPanelDetail data={self.state.currentInfoList}/>
                    </Panel>
                  )
                })
               } 
            </PanelGroup>
        )
    }

}


export default ConfigPanel;
