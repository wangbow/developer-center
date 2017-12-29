import React, {Component, PropTypes} from 'react';
import {Row, Message} from 'tinper-bee';
import PublishForm from '../../components/publishForm/index';
import {UpdatePublishTime} from '../../serves/appTile';
import {getImageInfo, getPubImageInfo, getConfig} from '../../serves/imageCata';
import {formateDate, lintAppListData} from '../../components/util';
import {getDescription} from '../../serves/CI';

class AppPublish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      configData: {},
    };
  }

  componentDidMount() {
    const {cata} = this.props;
    const self = this;
    const id = this.props.params.id;

    if (cata === 'publiccata') {
      getPubImageInfo(`?id=${id}`, function (res) {
        let data = lintAppListData(res);
        if (!data.error_code) {
          let newData = data.data;
          if (newData instanceof Array && newData.length !== 0) {
            self.setState({
              data: newData[0]
            });
            getConfig(`?image_name=${newData[0].image_name}`, function (res) {
              let configData = lintAppListData(res);
              self.setState({
                configData: configData.data
              })
            })
          }
        }
      });


    } else {
      getImageInfo(`?id=${id}`, function (res) {
        let data = lintAppListData(res);
        if (!data.error_code) {
          let newData = data.data;
          if (newData instanceof Array && newData.length !== 0) {
            self.setState({
              data: newData[0]
            })
            if (newData[0].hasOwnProperty('descFileId')) {
              getDescription(newData[0].descFileId, 'PUBLISH_MODULE')
                .then((res2) => {
                  let data = res2.data;
                  if (data.error_code) {
                    Message.create({
                      content: data.error_message,
                      color: 'danger',
                      duration: null
                    })
                  } else {
                    this.setState({
                      configData: data.modules[0].content
                    })
                  }
                })
            }
          }
        }

      });
    }


  }

  /**
   * 发布成功的回调函数
   * @param logId
   * @param appName
   */
  publishCallback = (logId, appName) => {


    return (response) => {
      const {cata} = this.props;
      let id = this.props.params.id;
      let data = response.data;
      if (!response.data.error_code) {
        if (cata !== 'publiccata') {
          UpdatePublishTime(`?appUploadId=${this.state.data.appUploadId}&publishTime=${formateDate(data.ts)}`, function (res) {
            if (res.data.error_code) {
              Message.create({content: res.data.error_message, color: 'danger', duration: null});
            }
          })
        }

        this.context.router.push(`/transition/success?id=${data.id}&imagecata=true&logId=${logId}&appName=${appName}&offset=${response.data.log_size}&appId=${data.app_id}`);
      } else {
        this.context.router.push(`/transition/failed?id=${id}&imagecata=true`);
      }
    }

  }

  render() {
    let {cata} = this.props;
    return (
      <PublishForm
        data={ this.state.data }
        isRegistry={cata === 'publiccata'}
        onSubmit={ this.publishCallback }
        configData={ this.state.configData }
      />

    )
  }

}

AppPublish.contextTypes = {
  router: PropTypes.object
};


export default AppPublish;
