import { formateDate ,addByTransDate} from 'components/util';
import { err, warn, success } from 'components/message-util';

export function getDefaultStartTime() {
  let data = addByTransDate(formateDate(new Date()), 0);
  let date,strReplace,dateMs;
  let obj = {};
  if(typeof data == "string"){
    let dateArr = data.split(" ");
    dateArr[1] = "00:00:00";
    strReplace = dateArr.toString().replace(","," ");
    date = new Date(strReplace);
    dateMs = date.getTime();
    obj.ms = dateMs;
    obj.timeStr = strReplace; 
    return obj
  }else{
     return warn("默认日期出错");
  }
}

export function getDefaultEndTime() {
  let data = formateDate(new Date());
  let date,strReplace,dateMs;
  let obj = {};
  if(typeof data == "string"){
    let dateArr = data.split(" ");
    dateArr[1] = "23:59:59";
    strReplace = dateArr.toString().replace(","," ");
    date = new Date(strReplace);
    dateMs = date.getTime();
    obj.ms = dateMs;
    obj.timeStr = strReplace; 
    return obj
  }else{
     return warn("默认日期出错");
  }
}


