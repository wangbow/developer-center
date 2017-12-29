import { Message } from 'tinper-bee';

export default function parser({ appId }, res) {
  if (res.error_code) {
    Message.create({
      content: '请求出错',
      color: 'danger',
      duration: 1
    });
    return [];
  }

  let {
    detailMsg: {
      data: {
        [appId]: {
          detail
        }
      }
    }
  } = res;

  return detail;
}