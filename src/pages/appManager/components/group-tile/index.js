//公共
import {Tile, Icon, Col} from 'tinper-bee';

//资源
import './index.less'

function GroupTile(props) {
  let {data, index, onClick, onEdit, onDelete} = props;
  return (
  <div className="tile-container">
    <Tile className="group-tile text-center" onClick={onClick(data.group_id, data.name)}>
      <i className="cl cl-folder-l-t folder" />
       <div className="app-count"> {data.res_app_count}</div>
      <h4 className="group-tile-title">{data.name}</h4>
      <p className="group-tile-time">最近更新 <span>{data.update_time}</span></p>
      <ul className="group-control">
        <li onClick={onEdit(data.group_id, data.name, index)}>
          <Icon type="uf-pencil-s"  />
          编辑
        </li>
        <li onClick={onDelete(data.group_id, index)}>
          <Icon type="uf-del"  />
          删除
        </li>
        <li>
          <Icon type="uf-eye"/>
          查看分组
        </li>
      </ul>
    </Tile>
  </div>
  )
}

export default GroupTile;
