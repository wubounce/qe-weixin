/**
 *  报表
 */
import fetch from '@/service/http';

//导出
export const exportExcel = (url, fileName, payload) =>
  fetch
    .post(url, payload, {
      responseType: 'blob',
      timeout: 60000
    })
    .then(res => {
      let disposition = String(res.headers['content-disposition']) || '';
      let name = null;
      if (disposition) {
        let header = disposition.indexOf('=');
        name =
          header !== -1
            ? decodeURIComponent(disposition.substring(header).replace('=', ''))
            : fileName;
      } else {
        name = fileName;
      }
      let blob = (blob = new Blob([res.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
      }));
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, name);
      } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    });
