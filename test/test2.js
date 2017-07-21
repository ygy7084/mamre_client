function aa(cell_value) {
    let regex;
    let return_value;
    regex = new RegExp(/\^([가-힇]+)([0-9]+)시/);
    let t = regex.exec(cell_value);
    if(t===null) return 0;
    else return t

}
let cell_data = '[날짜를선택하세요^공연시간^좌석등급:2017-07-22^오후4시30분^02.R석:1개]'
if (typeof cell_data === 'string')
    cell_data = cell_data.replace(/\s/gi, "");
 console.log(aa(cell_data))
