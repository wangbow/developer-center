import './index.less';

const userClickKeyWordColumns = [{
  title: '点击内容',
  dataIndex: 'click_text',
  key: 'click_text',
  render: function (rec) {
    return (
      <span className="word-limit-tag">{rec}</span>
    )
  }
}, {
  title: '网页标题',
  dataIndex: 'page_title',
  key: 'page_title',
  render: function (rec) {
    return (
      <span className="word-limit-title">{rec}</span>
    )
  }
}, {
  title: '点击量',
  dataIndex: 'count',
  key: 'count',
}];

export default userClickKeyWordColumns;