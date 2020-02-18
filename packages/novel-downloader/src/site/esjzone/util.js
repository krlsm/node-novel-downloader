"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("../../util/url");
function check(url, options) {
    return /esjzone\.cc/i.test(url_1.default(url).hostname || '');
}
exports.check = check;
function makeUrl(urlobj, bool, ...argv) {
    let pad;
    if (!bool && urlobj.chapter_id) {
        pad = `forum/${urlobj.novel_id}/${urlobj.chapter_id}.html`;
    }
    else {
        pad = `detail/${urlobj.novel_id}.html`;
    }
    return url_1.default(`https://www.esjzone.cc/${pad}`);
}
exports.makeUrl = makeUrl;
function parseUrl(_url, ...argv) {
    const { urlobj, url } = url_1._handleParseURL(_url, ...argv);
    let r;
    let m;
    r = /^(\d{6,})$/;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        return urlobj;
    }
    r = /esjzone\.cc\/forum\/(\d+)(?:\.html|\/(\d+).html)/g;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        urlobj.chapter_id = m[2];
        return urlobj;
    }
    r = /esjzone\.cc\/detail\/(\d+)(?:\.html)?/g;
    if (m = r.exec(url)) {
        urlobj.novel_id = m[1];
        return urlobj;
    }
    return urlobj;
}
exports.parseUrl = parseUrl;
function _p_2_br(target, $) {
    return $(target)
        .each(function (i, elem) {
        let _this = $(elem);
        let _html = _this
            .html()
            .replace(/(?:&nbsp;?)/g, ' ')
            .replace(/[\xA0\s]+$/g, '');
        if (_html == '<br/>' || _html == '<br>') {
            _html = '';
        }
        _this.after(`${_html}<br/>`);
        _this.remove();
    });
}
exports._p_2_br = _p_2_br;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx3Q0FBNEQ7QUFFNUQsU0FBZ0IsS0FBSyxDQUFDLEdBQXVDLEVBQUUsT0FBUTtJQUV0RSxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBUyxDQUFDLEdBQVUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBSEQsc0JBR0M7QUFFRCxTQUFnQixPQUFPLENBQUMsTUFBMkIsRUFBRSxJQUF3QixFQUFFLEdBQUcsSUFBSTtJQUVyRixJQUFJLEdBQVcsQ0FBQztJQUVoQixJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQzlCO1FBQ0MsR0FBRyxHQUFHLFNBQVMsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxPQUFPLENBQUE7S0FDMUQ7U0FFRDtRQUNDLEdBQUcsR0FBRyxVQUFVLE1BQU0sQ0FBQyxRQUFRLE9BQU8sQ0FBQTtLQUN0QztJQUVELE9BQU8sYUFBUyxDQUFDLDBCQUEwQixHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFkRCwwQkFjQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxJQUEyQixFQUFFLEdBQUcsSUFBSTtJQUU1RCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLHFCQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFdkQsSUFBSSxDQUFTLENBQUM7SUFDZCxJQUFJLENBQWtCLENBQUM7SUFFdkIsQ0FBQyxHQUFHLFlBQVksQ0FBQztJQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUNuQjtRQUNDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE9BQU8sTUFBTSxDQUFDO0tBQ2Q7SUFFRCxDQUFDLEdBQUcsbURBQW1ELENBQUM7SUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFDbkI7UUFDQyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QixPQUFPLE1BQU0sQ0FBQztLQUNkO0lBRUQsQ0FBQyxHQUFHLHdDQUF3QyxDQUFDO0lBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQ25CO1FBQ0MsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkIsT0FBTyxNQUFNLENBQUM7S0FDZDtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQWhDRCw0QkFnQ0M7QUFFRCxTQUFnQixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFaEMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1NBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUk7UUFFdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBCLElBQUksS0FBSyxHQUFHLEtBQUs7YUFDZixJQUFJLEVBQUU7YUFDTixPQUFPLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQzthQUM1QixPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUMzQjtRQUVELElBQUksS0FBSyxJQUFJLE9BQU8sSUFBSSxLQUFLLElBQUksTUFBTSxFQUN2QztZQUNDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDWDtRQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUNmLENBQUMsQ0FBQyxDQUNEO0FBQ0gsQ0FBQztBQXRCRCwwQkFzQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTm92ZWxTaXRlIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCBjcmVhdGVVUkwsIHsgX2hhbmRsZVBhcnNlVVJMIH0gZnJvbSAnLi4vLi4vdXRpbC91cmwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sodXJsOiBzdHJpbmcgfCBVUkwgfCBOb3ZlbFNpdGUuSVBhcnNlVXJsLCBvcHRpb25zPyk6IGJvb2xlYW5cbntcblx0cmV0dXJuIC9lc2p6b25lXFwuY2MvaS50ZXN0KGNyZWF0ZVVSTCh1cmwgYXMgYW55KS5ob3N0bmFtZSB8fCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVXJsKHVybG9iajogTm92ZWxTaXRlLklQYXJzZVVybCwgYm9vbCA/OiBib29sZWFuIHwgbnVtYmVyLCAuLi5hcmd2KVxue1xuXHRsZXQgcGFkOiBzdHJpbmc7XG5cblx0aWYgKCFib29sICYmIHVybG9iai5jaGFwdGVyX2lkKVxuXHR7XG5cdFx0cGFkID0gYGZvcnVtLyR7dXJsb2JqLm5vdmVsX2lkfS8ke3VybG9iai5jaGFwdGVyX2lkfS5odG1sYFxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHBhZCA9IGBkZXRhaWwvJHt1cmxvYmoubm92ZWxfaWR9Lmh0bWxgXG5cdH1cblxuXHRyZXR1cm4gY3JlYXRlVVJMKGBodHRwczovL3d3dy5lc2p6b25lLmNjLyR7cGFkfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVcmwoX3VybDogc3RyaW5nIHwgVVJMIHwgbnVtYmVyLCAuLi5hcmd2KVxue1xuXHRjb25zdCB7IHVybG9iaiwgdXJsIH0gPSBfaGFuZGxlUGFyc2VVUkwoX3VybCwgLi4uYXJndik7XG5cblx0bGV0IHI6IFJlZ0V4cDtcblx0bGV0IG06IFJlZ0V4cEV4ZWNBcnJheTtcblxuXHRyID0gL14oXFxkezYsfSkkLztcblx0aWYgKG0gPSByLmV4ZWModXJsKSlcblx0e1xuXHRcdHVybG9iai5ub3ZlbF9pZCA9IG1bMV07XG5cdFx0cmV0dXJuIHVybG9iajtcblx0fVxuXG5cdHIgPSAvZXNqem9uZVxcLmNjXFwvZm9ydW1cXC8oXFxkKykoPzpcXC5odG1sfFxcLyhcXGQrKS5odG1sKS9nO1xuXHRpZiAobSA9IHIuZXhlYyh1cmwpKVxuXHR7XG5cdFx0dXJsb2JqLm5vdmVsX2lkID0gbVsxXTtcblx0XHR1cmxvYmouY2hhcHRlcl9pZCA9IG1bMl07XG5cblx0XHRyZXR1cm4gdXJsb2JqO1xuXHR9XG5cblx0ciA9IC9lc2p6b25lXFwuY2NcXC9kZXRhaWxcXC8oXFxkKykoPzpcXC5odG1sKT8vZztcblx0aWYgKG0gPSByLmV4ZWModXJsKSlcblx0e1xuXHRcdHVybG9iai5ub3ZlbF9pZCA9IG1bMV07XG5cblx0XHRyZXR1cm4gdXJsb2JqO1xuXHR9XG5cblx0cmV0dXJuIHVybG9iajtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9wXzJfYnIodGFyZ2V0LCAkKVxue1xuXHRyZXR1cm4gJCh0YXJnZXQpXG5cdFx0LmVhY2goZnVuY3Rpb24gKGksIGVsZW0pXG5cdFx0e1xuXHRcdFx0bGV0IF90aGlzID0gJChlbGVtKTtcblxuXHRcdFx0bGV0IF9odG1sID0gX3RoaXNcblx0XHRcdFx0Lmh0bWwoKVxuXHRcdFx0XHQucmVwbGFjZSgvKD86Jm5ic3A7PykvZywgJyAnKVxuXHRcdFx0XHQucmVwbGFjZSgvW1xceEEwXFxzXSskL2csICcnKVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAoX2h0bWwgPT0gJzxici8+JyB8fCBfaHRtbCA9PSAnPGJyPicpXG5cdFx0XHR7XG5cdFx0XHRcdF9odG1sID0gJyc7XG5cdFx0XHR9XG5cblx0XHRcdF90aGlzLmFmdGVyKGAke19odG1sfTxici8+YCk7XG5cdFx0XHRfdGhpcy5yZW1vdmUoKVxuXHRcdH0pXG5cdFx0O1xufVxuIl19