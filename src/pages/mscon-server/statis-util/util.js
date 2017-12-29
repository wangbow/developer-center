export function getQuery(str = '') {
  str = window.location.hash;
  let start = str.indexOf('?');
  let query = str.slice(start + 1);
  let pair = query.split('&');
  let ref = {};
  pair.forEach(item => {
    let nv = item.split('=');
    if (/^[0-9]+$/.test(nv[1])) {
      nv[1] = Number(nv[1])
    }
    ref[nv[0]] = nv[1];
  })
  return ref;
}