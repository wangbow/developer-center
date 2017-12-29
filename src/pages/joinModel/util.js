export function formateReltion(main_alias,slaveTables) {
  let from_alias;
  let andSplit,stsplit,masterKey,fromKey,temp;

  let tempstr="";
  slaveTables.map(function(item,index) {
    masterKey = [];
    fromKey = [];
    let joinCondition = item.relation.joinCondition;
    from_alias = item.alias;
    if(joinCondition){
      andSplit = joinCondition.split(" and ");
    }

    if(!andSplit) return;
    andSplit.map(function(item,index){
      stsplit = item.split("=");
      stsplit.map(function(item,index) {
        tempstr = item.substr(0,item.indexOf('.'));
        if(tempstr == main_alias) {
          temp = item.split(".")[1];
          masterKey.push(temp);
        }
        if(tempstr == from_alias) {
          temp = item.split(".")[1];
          fromKey.push(temp);
        }
      })
    })
    let keys = [];
    masterKey.map(function(item,index) {
      keys.push({masterKey:item,fromKey:fromKey[index]});
    })
    item.relation.joinCondition = keys;
  })
  return slaveTables;
}
