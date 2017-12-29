const RuleMeta = {
  custom_name: {
    errMsg: '规则名称不能为空',
    width: '20rem',
    checkFunc: (val = '') => {
      return !!val;
    }
  },
  custom_url: {
    errMsg: '请输入正确的完整访问路径',
    width: '45rem',
    checkFunc: (val) => {
      val = val || '';
      return /^\//.test(val);
    }
  },
  sort: {
    errMsg: '优先级只能为小于999的数字',
    width: '7rem',
    checkFunc: (val = 0) => {
      return /\d/.test(val) && val < 999
    }
  }
}

export default RuleMeta;