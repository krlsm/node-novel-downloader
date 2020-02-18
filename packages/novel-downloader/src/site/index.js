"use strict";
/**
 * Created by user on 2018/2/10/010.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("../decorator/bluebird");
exports.bluebirdDecorator = bluebird_1.default;
//import bluebirdDecorator from 'bluebird-decorator';
const PromiseBluebird = require("bluebird");
exports.PromiseBluebird = PromiseBluebird;
//import { URL } from 'jsdom-url';
const path = require("upath2");
const _root_1 = require("../../_root");
const jsdom_1 = require("../jsdom");
exports.defaultJSDOMOptions = jsdom_1.defaultJSDOMOptions;
exports.createOptionsJSDOM = jsdom_1.createOptionsJSDOM;
const node_novel_info_1 = require("node-novel-info");
const fs = require("fs-extra");
const util_1 = require("fs-iconv/util");
const crlf_normalize_1 = require("crlf-normalize");
const StrUtil = require("str-util");
const const_1 = require("node-novel-info/lib/const");
const log_1 = require("../util/log");
const url_1 = require("../util/url");
//import * as moment from 'moment';
const moment = require("moment-timezone");
exports.moment = moment;
const util_2 = require("../util");
moment.fn.toJSON = function () { return this.format(); };
exports.SYMBOL_CACHE = Symbol.for('cache');
let NovelSite = /** @class */ (() => {
    class NovelSite {
        constructor(options, ...argv) {
            if (!this.IDKEY) {
                throw new ReferenceError(`IDKEY is null`);
            }
            this.optionsInit = options;
            this.optionsInit.cwd = this.optionsInit.cwd || process.cwd();
            [this.PATH_NOVEL_MAIN, this.optionsInit] = this.getOutputDir(this.optionsInit);
            if (this.optionsInit.debugLog) {
                log_1.consoleDebug.enabled = true;
            }
            this._constructor(options, ...argv);
        }
        _constructor(options, ...argv) {
            log_1.consoleDebug.debug('root._constructor');
        }
        static create(options, ...argv) {
            return new this(options, ...argv);
        }
        static check(url, options) {
            return false;
        }
        session(optionsRuntime, url) {
            optionsRuntime.optionsJSDOM = jsdom_1.createOptionsJSDOM(optionsRuntime.optionsJSDOM);
            if (url) {
                optionsRuntime[exports.SYMBOL_CACHE].url = url;
            }
            return this;
        }
        download(url, options) {
            throw new SyntaxError(`Function not implemented`);
        }
        get_volume_list(url, optionsRuntime = {}) {
            throw new SyntaxError(`Function not implemented`);
        }
        makeUrl(urlobj, options, optionsRuntime) {
            throw new SyntaxError(`Function not implemented`);
        }
        parseUrl(url, options) {
            throw new SyntaxError(`Function not implemented`);
        }
        getStatic() {
            // @ts-ignore
            return this.__proto__.constructor;
        }
        get IDKEY() {
            let key = this.getStatic().IDKEY;
            if (typeof key != 'string' || !key) {
                throw new SyntaxError(`IDKEY not implemented`);
            }
            return key;
        }
        _pathNovelID(novel, optionsRuntime) {
            return novel.url_data.novel_id;
        }
        getPathNovel(PATH_NOVEL_MAIN, novel, optionsRuntime) {
            let name;
            let novel_id = this._pathNovelID(novel, optionsRuntime);
            if (optionsRuntime.pathNovelStyle) {
                if (optionsRuntime.pathNovelStyle == 1 /* NOVELID */) {
                    name = novel_id;
                }
            }
            if (name == null) {
                name = `${this.trimFilenameNovel(novel.novel_title)}_(${novel_id})`;
            }
            return path.join(PATH_NOVEL_MAIN, name);
        }
        /**
         * 如果已經下載過 則試圖從 README.md 內讀取缺漏的下載設定
         *
         * @private
         */
        _loadExistsConf(inputUrl, optionsRuntime, novel, path_novel) {
            let file = path.resolve(path_novel, 'README.md');
            if (fs.pathExistsSync(file)) {
                let md = fs.readFileSync(file).toString();
                let conf = node_novel_info_1.default.parse(md, {
                    lowCheckLevel: true,
                    throw: false,
                });
                log_1.consoleDebug.debug('檢查 README.md 是否存在下載設定');
                if (conf && conf.options) {
                    if (conf.options.downloadOptions || conf.options.downloadoptions) {
                        log_1.consoleDebug.debug('載入並且合併已存在的設定');
                        Object.entries(conf.options.downloadOptions || conf.options.downloadoptions)
                            .forEach(function ([k, v]) {
                            if (optionsRuntime[k] == null) {
                                optionsRuntime[k] = v;
                            }
                        });
                    }
                }
            }
        }
        getOutputDir(options, novelName) {
            options = Object.assign({}, this.optionsInit, options);
            if (!options.outputDir) {
                throw new ReferenceError(`options: outputDir is not set`);
            }
            let p = path.join(options.outputDir, options.disableOutputDirPrefix ? '' : this.IDKEY);
            if (!path.isAbsolute(p)) {
                p = path.join(options.cwd, p);
            }
            _root_1.default.disablePaths.concat(__dirname).forEach(function (dir) {
                if (p.indexOf(__dirname) == 0) {
                    throw new ReferenceError(`path not allow "${p}"`);
                }
            });
            if (typeof novelName == 'string' || novelName) {
                if (!novelName) {
                    throw new ReferenceError();
                }
                p = path.join(p, novelName);
            }
            options = this._fixOptionsRuntime(options);
            return [p, options];
        }
        _fixOptionsRuntime(optionsRuntime) {
            optionsRuntime[exports.SYMBOL_CACHE] = (optionsRuntime[exports.SYMBOL_CACHE] || {});
            optionsRuntime.startIndex = optionsRuntime.startIndex || 0;
            // @ts-ignore
            optionsRuntime.optionsJSDOM = jsdom_1.createOptionsJSDOM(optionsRuntime.optionsJSDOM);
            if (optionsRuntime.debugLog != null) {
                optionsRuntime.debugLog = !!optionsRuntime.debugLog;
            }
            if (optionsRuntime.keepImage == null) {
                optionsRuntime.keepImage = true;
            }
            if (optionsRuntime.keepRuby == null) {
                optionsRuntime.keepRuby = true;
            }
            return optionsRuntime;
        }
        trimFilenameChapter(name) {
            return this.trimFilename(name);
        }
        trimFilenameVolume(name) {
            return this.trimFilename(name);
        }
        trimFilenameNovel(name) {
            return this.trimFilename(name);
        }
        trimFilename(name) {
            return util_1.trimFilename(util_2._fixVolumeChapterName(name));
        }
        trimTag(tag) {
            return tag
                .replace(/[\[\]\/\\]/g, (s) => {
                return StrUtil.toFullWidth(s);
            });
        }
        _exportDownloadOptions(optionsRuntime) {
            return void (0);
        }
        _handleDataForStringify(...argv) {
            // @ts-ignore
            let mdconf = node_novel_info_1._handleDataForStringify(...argv);
            if (mdconf.novel) {
                let bool;
                if (mdconf.novel.tags && Array.isArray(mdconf.novel.tags)) {
                    bool = [
                        '書籍化',
                        '书籍化',
                        '文庫化',
                        '文库化',
                    ].some(v => {
                        return mdconf.novel.tags.includes(v);
                    });
                    if (bool) {
                        mdconf.novel.novel_status = (mdconf.novel.novel_status | 0) | const_1.EnumNovelStatus.P_BOOK;
                    }
                }
                if (mdconf.novel.status) {
                    bool = [
                        '完結済',
                        '完結',
                        '已完結',
                        '已完成',
                        '完结済',
                        '完结',
                        '已完结',
                        '已完成',
                    ].includes(mdconf.novel.status);
                    if (bool) {
                        mdconf.novel.novel_status = (mdconf.novel.novel_status | 0) | const_1.EnumNovelStatus.AUTHOR_DONE;
                    }
                }
            }
            return mdconf;
        }
        _saveReadme(optionsRuntime, options = {}, ...opts) {
            const self = this;
            if (util_2.isUndef(optionsRuntime)
                || util_2.isUndef(optionsRuntime[exports.SYMBOL_CACHE], {})
                || util_2.isUndef(optionsRuntime[exports.SYMBOL_CACHE].novel, {})
                || util_2.isUndef(optionsRuntime[exports.SYMBOL_CACHE].path_novel, '')) {
                throw new ReferenceError(`saveReadme`);
            }
            const novel = optionsRuntime[exports.SYMBOL_CACHE].novel;
            const path_novel = optionsRuntime[exports.SYMBOL_CACHE].path_novel;
            let mdconfig = this._handleDataForStringify({
                novel: {
                    illust: '',
                    title_zh1: '',
                    illusts: [],
                    publishers: [
                        self.IDKEY,
                    ],
                    tags: [
                        self.IDKEY,
                    ],
                    series: {
                        name: novel.novel_series_title || novel.novel_title || '',
                    },
                    novel_status: 0,
                },
                options,
                link: novel.link || [],
            }, novel, ...opts);
            let md = node_novel_info_1.default.stringify(mdconfig);
            let file = path.join(path_novel, `README.md`);
            log_1.consoleDebug.info(`[META]`, `save README.md`);
            return fs.outputFile(file, md)
                .then(function () {
                return {
                    file,
                    md,
                };
            });
        }
        createMainUrl(url, optionsRuntime) {
            let data = this.parseUrl(url);
            if (!data || !data.novel_id) {
                //console.log(data);
                throw new ReferenceError(JSON.stringify(data));
            }
            return this.makeUrl(data, true, optionsRuntime);
        }
        _createChapterUrl({ novel, volume, chapter, }, optionsRuntime) {
            return url_1.default(chapter.chapter_url);
        }
        _fetchChapter(url, optionsRuntime, _cache_) {
            throw new SyntaxError(`Function not implemented`);
        }
        _parseChapter(dom, optionsRuntime, cache) {
            throw new SyntaxError(`Function not implemented`);
        }
        getExtraInfo(urlobj, optionsRuntime, data_meta, cache) {
            throw new SyntaxError(`Function not implemented`);
        }
        _checkExists(optionsRuntime, file) {
            if (!optionsRuntime.disableCheckExists && fs.existsSync(file)) {
                let txt = fs.readFileSync(file);
                if (txt.toString().replace(/^\s+|\s+$/g, '')) {
                    return true;
                }
            }
            return false;
        }
        emit(event, eventName, ...argv) {
            let bool = event.emit(eventName, this, ...argv);
            return [event, bool];
        }
        _saveFile(opts) {
            return PromiseBluebird.resolve()
                .bind(this)
                .then(() => {
                let { file, context, optionsRuntime } = opts;
                if (optionsRuntime.lineBreakCrlf) {
                    let txt1 = context.toString();
                    if (crlf_normalize_1.R_CRLF.test(txt1)) {
                        let txt2 = crlf_normalize_1.crlf(txt1, crlf_normalize_1.CRLF);
                        if (txt1 !== txt2) {
                            context = txt2;
                        }
                        txt1 = null;
                        txt2 = null;
                    }
                }
                return fs.outputFile(file, context)
                    .then(r => {
                    if (optionsRuntime.debugLog) {
                        let file2 = path.relative(optionsRuntime.outputDir, file);
                        log_1.consoleDebug.success(`[SAVE]`, file2);
                    }
                    return r;
                });
            });
        }
    }
    NovelSite.IDKEY = null;
    return NovelSite;
})();
exports.NovelSite = NovelSite;
exports.EnumPathNovelStyle = NovelSite.EnumPathNovelStyle;
(function (NovelSite) {
    let EnumPathNovelStyle;
    (function (EnumPathNovelStyle) {
        EnumPathNovelStyle[EnumPathNovelStyle["DEFAULT"] = 0] = "DEFAULT";
        EnumPathNovelStyle[EnumPathNovelStyle["NOVELID"] = 1] = "NOVELID";
    })(EnumPathNovelStyle = NovelSite.EnumPathNovelStyle || (NovelSite.EnumPathNovelStyle = {}));
})(NovelSite = exports.NovelSite || (exports.NovelSite = {}));
exports.NovelSite = NovelSite;
function staticImplements() {
    return (constructor) => { };
}
exports.staticImplements = staticImplements;
exports.default = NovelSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsb0RBQXNEO0FBc0M3Qyw0QkF0Q0Ysa0JBQWlCLENBc0NFO0FBckMxQixxREFBcUQ7QUFFckQsNENBQTZDO0FBbUNqQiwwQ0FBZTtBQWxDM0Msa0NBQWtDO0FBQ2xDLCtCQUFnQztBQUVoQyx1Q0FBbUM7QUFHbkMsb0NBQXVIO0FBRTlHLDhCQUZBLDJCQUFtQixDQUVBO0FBQWtDLDZCQUZBLDBCQUFrQixDQUVBO0FBQ2hGLHFEQUFrRjtBQUtsRiwrQkFBZ0M7QUFDaEMsd0NBQTZDO0FBQzdDLG1EQUFvRDtBQUNwRCxvQ0FBcUM7QUFDckMscURBQTREO0FBRTVELHFDQUEyQztBQUMzQyxxQ0FBb0M7QUFFcEMsbUNBQW1DO0FBQ25DLDBDQUEyQztBQVFsQyx3QkFBTTtBQVBmLGtDQUF5RDtBQUt6RCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxjQUFjLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBTTVDLFFBQUEsWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFaEQ7SUFBQSxNQUFhLFNBQVM7UUFPckIsWUFBWSxPQUEyQixFQUFFLEdBQUcsSUFBSTtZQUUvQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFDZjtnQkFDQyxNQUFNLElBQUksY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQzFDO1lBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTdELENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcs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QUFrQjtRQUVuQyxpRUFBVyxDQUFBO1FBQ1gsaUVBQVcsQ0FBQTtJQUNaLENBQUMsRUFKaUIsa0JBQWtCLEdBQWxCLDRCQUFrQixLQUFsQiw0QkFBa0IsUUFJbkM7QUF3R0YsQ0FBQyxFQTNLZ0IsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUEyS3pCO0FBaHFCWSw4QkFBUztBQXVxQnRCLFNBQWdCLGdCQUFnQjtJQUUvQixPQUFPLENBQUMsV0FBYyxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUE7QUFDOUIsQ0FBQztBQUhELDRDQUdDO0FBRUQsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOC8yLzEwLzAxMC5cbiAqL1xuXG5pbXBvcnQgYmx1ZWJpcmREZWNvcmF0b3IgZnJvbSAnLi4vZGVjb3JhdG9yL2JsdWViaXJkJztcbi8vaW1wb3J0IGJsdWViaXJkRGVjb3JhdG9yIGZyb20gJ2JsdWViaXJkLWRlY29yYXRvcic7XG5cbmltcG9ydCBQcm9taXNlQmx1ZWJpcmQgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuLy9pbXBvcnQgeyBVUkwgfSBmcm9tICdqc2RvbS11cmwnO1xuaW1wb3J0IHBhdGggPSByZXF1aXJlKCd1cGF0aDInKTtcblxuaW1wb3J0IHJvb3RQYXRoIGZyb20gXCIuLi8uLi9fcm9vdFwiO1xuaW1wb3J0IHsgcmV0cnlSZXF1ZXN0IH0gZnJvbSAnLi4vZmV0Y2gnO1xuXG5pbXBvcnQgeyBkZWZhdWx0SlNET01PcHRpb25zLCBJRnJvbVVybE9wdGlvbnMsIElPcHRpb25zSlNET00sIGNyZWF0ZU9wdGlvbnNKU0RPTSwgSU5vdmVsT3B0aW9uc0pTRE9NIH0gZnJvbSAnLi4vanNkb20nO1xuXG5leHBvcnQgeyBkZWZhdWx0SlNET01PcHRpb25zLCBJRnJvbVVybE9wdGlvbnMsIElPcHRpb25zSlNET00sIGNyZWF0ZU9wdGlvbnNKU0RPTSB9XG5pbXBvcnQgbm92ZWxJbmZvLCB7IElNZGNvbmZNZXRhLCBfaGFuZGxlRGF0YUZvclN0cmluZ2lmeSB9IGZyb20gJ25vZGUtbm92ZWwtaW5mbyc7XG5cbmV4cG9ydCB7IElNZGNvbmZNZXRhIH1cbmltcG9ydCB7IExhenlDb29raWUsIExhenlDb29raWVKYXIgfSBmcm9tICdqc2RvbS1leHRyYSc7XG5cbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5pbXBvcnQgeyB0cmltRmlsZW5hbWUgfSBmcm9tICdmcy1pY29udi91dGlsJztcbmltcG9ydCB7IGNybGYsIENSTEYsIFJfQ1JMRiB9IGZyb20gJ2NybGYtbm9ybWFsaXplJztcbmltcG9ydCBTdHJVdGlsID0gcmVxdWlyZSgnc3RyLXV0aWwnKTtcbmltcG9ydCB7IEVudW1Ob3ZlbFN0YXR1cyB9IGZyb20gJ25vZGUtbm92ZWwtaW5mby9saWIvY29uc3QnO1xuaW1wb3J0IHsgSU5vdmVsIH0gZnJvbSAnLi9zeW9zZXR1JztcbmltcG9ydCB7IGNvbnNvbGVEZWJ1ZyB9IGZyb20gJy4uL3V0aWwvbG9nJztcbmltcG9ydCBjcmVhdGVVUkwgZnJvbSAnLi4vdXRpbC91cmwnO1xuXG4vL2ltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudC10aW1lem9uZScpO1xuaW1wb3J0IHsgX2ZpeFZvbHVtZUNoYXB0ZXJOYW1lLCBpc1VuZGVmIH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmltcG9ydCB7IElEb3dubG9hZE9wdGlvbnMgfSBmcm9tICcuL2RlbW8vYmFzZSc7XG5cbm1vbWVudC5mbi50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmZvcm1hdCgpOyB9O1xuXG5leHBvcnQgeyBtb21lbnQgfTtcblxuZXhwb3J0IHsgYmx1ZWJpcmREZWNvcmF0b3IsIFByb21pc2VCbHVlYmlyZCB9XG5cbmV4cG9ydCBjb25zdCBTWU1CT0xfQ0FDSEUgPSBTeW1ib2wuZm9yKCdjYWNoZScpO1xuXG5leHBvcnQgY2xhc3MgTm92ZWxTaXRlIGltcGxlbWVudHMgTm92ZWxTaXRlLklOb3ZlbFNpdGVcbntcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBJREtFWTogc3RyaW5nID0gbnVsbDtcblxuXHRwdWJsaWMgUEFUSF9OT1ZFTF9NQUlOOiBzdHJpbmc7XG5cdHB1YmxpYyBvcHRpb25zSW5pdD86IE5vdmVsU2l0ZS5JT3B0aW9ucztcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBOb3ZlbFNpdGUuSU9wdGlvbnMsIC4uLmFyZ3YpXG5cdHtcblx0XHRpZiAoIXRoaXMuSURLRVkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBJREtFWSBpcyBudWxsYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5vcHRpb25zSW5pdCA9IG9wdGlvbnM7XG5cdFx0dGhpcy5vcHRpb25zSW5pdC5jd2QgPSB0aGlzLm9wdGlvbnNJbml0LmN3ZCB8fCBwcm9jZXNzLmN3ZCgpO1xuXG5cdFx0W3RoaXMuUEFUSF9OT1ZFTF9NQUlOLCB0aGlzLm9wdGlvbnNJbml0XSA9IHRoaXMuZ2V0T3V0cHV0RGlyKHRoaXMub3B0aW9uc0luaXQpO1xuXG5cdFx0aWYgKHRoaXMub3B0aW9uc0luaXQuZGVidWdMb2cpXG5cdFx0e1xuXHRcdFx0Y29uc29sZURlYnVnLmVuYWJsZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMuX2NvbnN0cnVjdG9yKG9wdGlvbnMsIC4uLmFyZ3YpO1xuXHR9XG5cblx0X2NvbnN0cnVjdG9yKG9wdGlvbnM6IE5vdmVsU2l0ZS5JT3B0aW9ucywgLi4uYXJndilcblx0e1xuXHRcdGNvbnNvbGVEZWJ1Zy5kZWJ1Zygncm9vdC5fY29uc3RydWN0b3InKTtcblx0fVxuXG5cdHN0YXRpYyBjcmVhdGUob3B0aW9uczogTm92ZWxTaXRlLklPcHRpb25zLCAuLi5hcmd2KVxuXHR7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKG9wdGlvbnMsIC4uLmFyZ3YpO1xuXHR9XG5cblx0c3RhdGljIGNoZWNrKHVybDogc3RyaW5nIHwgVVJMIHwgTm92ZWxTaXRlLklQYXJzZVVybCwgb3B0aW9ucz8pOiBib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRzZXNzaW9uPFQgPSBOb3ZlbFNpdGUuSU9wdGlvbnNSdW50aW1lPihvcHRpb25zUnVudGltZTogVCAmIE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWUsIHVybD86IFVSTClcblx0e1xuXHRcdG9wdGlvbnNSdW50aW1lLm9wdGlvbnNKU0RPTSA9IGNyZWF0ZU9wdGlvbnNKU0RPTShvcHRpb25zUnVudGltZS5vcHRpb25zSlNET00pO1xuXG5cdFx0aWYgKHVybClcblx0XHR7XG5cdFx0XHRvcHRpb25zUnVudGltZVtTWU1CT0xfQ0FDSEVdLnVybCA9IHVybDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGRvd25sb2FkKHVybDogc3RyaW5nIHwgVVJMLCBvcHRpb25zPzogTm92ZWxTaXRlLklEb3dubG9hZE9wdGlvbnMpOiBQcm9taXNlQmx1ZWJpcmQ8Tm92ZWxTaXRlLklOb3ZlbD5cblx0e1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihgRnVuY3Rpb24gbm90IGltcGxlbWVudGVkYCk7XG5cdH1cblxuXHRnZXRfdm9sdW1lX2xpc3Q8VCA9IE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWU+KHVybDogc3RyaW5nIHwgVVJMLFxuXHRcdG9wdGlvbnNSdW50aW1lOiBQYXJ0aWFsPFQgJiBOb3ZlbFNpdGUuSURvd25sb2FkT3B0aW9ucz4gPSB7fSxcblx0KTogUHJvbWlzZTxOb3ZlbFNpdGUuSU5vdmVsPlxuXHR7XG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKGBGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWRgKTtcblx0fVxuXG5cdG1ha2VVcmw8VCBleHRlbmRzIE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWU+KHVybG9iajogTm92ZWxTaXRlLklQYXJzZVVybCwgb3B0aW9ucz8sIG9wdGlvbnNSdW50aW1lPzogVCk6IFVSTFxuXHR7XG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKGBGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWRgKTtcblx0fVxuXG5cdHBhcnNlVXJsKHVybDogVVJMIHwgc3RyaW5nLCBvcHRpb25zPyk6IE5vdmVsU2l0ZS5JUGFyc2VVcmxcblx0e1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihgRnVuY3Rpb24gbm90IGltcGxlbWVudGVkYCk7XG5cdH1cblxuXHRnZXRTdGF0aWM8VCA9IHR5cGVvZiBOb3ZlbFNpdGU+KCk6IFRcblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRyZXR1cm4gdGhpcy5fX3Byb3RvX18uY29uc3RydWN0b3I7XG5cdH1cblxuXHRnZXQgSURLRVkoKTogc3RyaW5nXG5cdHtcblx0XHRsZXQga2V5ID0gdGhpcy5nZXRTdGF0aWMoKS5JREtFWTtcblxuXHRcdGlmICh0eXBlb2Yga2V5ICE9ICdzdHJpbmcnIHx8ICFrZXkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKGBJREtFWSBub3QgaW1wbGVtZW50ZWRgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga2V5O1xuXHR9XG5cblx0cHJvdGVjdGVkIF9wYXRoTm92ZWxJRDxOIGV4dGVuZHMgTm92ZWxTaXRlLklOb3ZlbCwgVCBleHRlbmRzIE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWU+KG5vdmVsOiBOLCBvcHRpb25zUnVudGltZTogVClcblx0e1xuXHRcdHJldHVybiBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZDtcblx0fVxuXG5cdGdldFBhdGhOb3ZlbDxOIGV4dGVuZHMgTm92ZWxTaXRlLklOb3ZlbCwgVCBleHRlbmRzIE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWU+KFBBVEhfTk9WRUxfTUFJTjogc3RyaW5nLFxuXHRcdG5vdmVsOiBOLFxuXHRcdG9wdGlvbnNSdW50aW1lOiBULFxuXHQpXG5cdHtcblx0XHRsZXQgbmFtZTogc3RyaW5nO1xuXG5cdFx0bGV0IG5vdmVsX2lkID0gdGhpcy5fcGF0aE5vdmVsSUQobm92ZWwsIG9wdGlvbnNSdW50aW1lKTtcblxuXHRcdGlmIChvcHRpb25zUnVudGltZS5wYXRoTm92ZWxTdHlsZSlcblx0XHR7XG5cdFx0XHRpZiAob3B0aW9uc1J1bnRpbWUucGF0aE5vdmVsU3R5bGUgPT0gTm92ZWxTaXRlLkVudW1QYXRoTm92ZWxTdHlsZS5OT1ZFTElEKVxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lID0gbm92ZWxfaWQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKG5hbWUgPT0gbnVsbClcblx0XHR7XG5cdFx0XHRuYW1lID0gYCR7dGhpcy50cmltRmlsZW5hbWVOb3ZlbChub3ZlbC5ub3ZlbF90aXRsZSl9Xygke25vdmVsX2lkfSlgXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhdGguam9pbihQQVRIX05PVkVMX01BSU4sIG5hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIOWmguaenOW3sue2k+S4i+i8iemBjiDliYfoqablnJblvp4gUkVBRE1FLm1kIOWFp+iugOWPlue8uua8j+eahOS4i+i8ieioreWumlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2xvYWRFeGlzdHNDb25mPFQsIE4gZXh0ZW5kcyBOb3ZlbFNpdGUuSU5vdmVsPihpbnB1dFVybCwgb3B0aW9uc1J1bnRpbWU6IFQsIG5vdmVsOiBOLCBwYXRoX25vdmVsOiBzdHJpbmcpXG5cdHtcblx0XHRsZXQgZmlsZSA9IHBhdGgucmVzb2x2ZShwYXRoX25vdmVsLCAnUkVBRE1FLm1kJyk7XG5cblx0XHRpZiAoZnMucGF0aEV4aXN0c1N5bmMoZmlsZSkpXG5cdFx0e1xuXHRcdFx0bGV0IG1kID0gZnMucmVhZEZpbGVTeW5jKGZpbGUpLnRvU3RyaW5nKCk7XG5cblx0XHRcdGxldCBjb25mID0gbm92ZWxJbmZvLnBhcnNlKG1kLCB7XG5cdFx0XHRcdGxvd0NoZWNrTGV2ZWw6IHRydWUsXG5cdFx0XHRcdHRocm93OiBmYWxzZSxcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zb2xlRGVidWcuZGVidWcoJ+aqouafpSBSRUFETUUubWQg5piv5ZCm5a2Y5Zyo5LiL6LyJ6Kit5a6aJyk7XG5cblx0XHRcdGlmIChjb25mICYmIGNvbmYub3B0aW9ucylcblx0XHRcdHtcblx0XHRcdFx0aWYgKGNvbmYub3B0aW9ucy5kb3dubG9hZE9wdGlvbnMgfHwgY29uZi5vcHRpb25zLmRvd25sb2Fkb3B0aW9ucylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGVEZWJ1Zy5kZWJ1Zygn6LyJ5YWl5Lim5LiU5ZCI5L215bey5a2Y5Zyo55qE6Kit5a6aJyk7XG5cblx0XHRcdFx0XHRPYmplY3QuZW50cmllcyhjb25mLm9wdGlvbnMuZG93bmxvYWRPcHRpb25zIHx8IGNvbmYub3B0aW9ucy5kb3dubG9hZG9wdGlvbnMpXG5cdFx0XHRcdFx0XHQuZm9yRWFjaChmdW5jdGlvbiAoW2ssIHZdKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9uc1J1bnRpbWVba10gPT0gbnVsbClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnNSdW50aW1lW2tdID0gdjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRnZXRPdXRwdXREaXI8VD4ob3B0aW9ucz86IFQgJiBOb3ZlbFNpdGUuSU9wdGlvbnMsIG5vdmVsTmFtZT86IHN0cmluZyk6IFtzdHJpbmcsIFQgJiBOb3ZlbFNpdGUuSU9wdGlvbnNdXG5cdHtcblx0XHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zSW5pdCwgb3B0aW9ucyk7XG5cblx0XHRpZiAoIW9wdGlvbnMub3V0cHV0RGlyKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgb3B0aW9uczogb3V0cHV0RGlyIGlzIG5vdCBzZXRgKTtcblx0XHR9XG5cblx0XHRsZXQgcCA9IHBhdGguam9pbihvcHRpb25zLm91dHB1dERpciwgb3B0aW9ucy5kaXNhYmxlT3V0cHV0RGlyUHJlZml4ID8gJycgOiB0aGlzLklES0VZKTtcblxuXHRcdGlmICghcGF0aC5pc0Fic29sdXRlKHApKVxuXHRcdHtcblx0XHRcdHAgPSBwYXRoLmpvaW4ob3B0aW9ucy5jd2QsIHApO1xuXHRcdH1cblxuXHRcdHJvb3RQYXRoLmRpc2FibGVQYXRocy5jb25jYXQoX19kaXJuYW1lKS5mb3JFYWNoKGZ1bmN0aW9uIChkaXIpXG5cdFx0e1xuXHRcdFx0aWYgKHAuaW5kZXhPZihfX2Rpcm5hbWUpID09IDApXG5cdFx0XHR7XG5cdFx0XHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgcGF0aCBub3QgYWxsb3cgXCIke3B9XCJgKVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKHR5cGVvZiBub3ZlbE5hbWUgPT0gJ3N0cmluZycgfHwgbm92ZWxOYW1lKVxuXHRcdHtcblx0XHRcdGlmICghbm92ZWxOYW1lKVxuXHRcdFx0e1xuXHRcdFx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoKTtcblx0XHRcdH1cblxuXHRcdFx0cCA9IHBhdGguam9pbihwLCBub3ZlbE5hbWUpO1xuXHRcdH1cblxuXHRcdG9wdGlvbnMgPSB0aGlzLl9maXhPcHRpb25zUnVudGltZShvcHRpb25zKTtcblxuXHRcdHJldHVybiBbcCwgb3B0aW9uc107XG5cdH1cblxuXHRwcm90ZWN0ZWQgX2ZpeE9wdGlvbnNSdW50aW1lPFQgPSBOb3ZlbFNpdGUuSU9wdGlvbnNSdW50aW1lPihvcHRpb25zUnVudGltZTogVCAmIE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWUpOiBUICYgTm92ZWxTaXRlLklPcHRpb25zUnVudGltZVxuXHR7XG5cdFx0b3B0aW9uc1J1bnRpbWVbU1lNQk9MX0NBQ0hFXSA9IChvcHRpb25zUnVudGltZVtTWU1CT0xfQ0FDSEVdIHx8IHt9KSBhcyB7XG5cdFx0XHR1cmw/OiBVUkwsXG5cdFx0XHRwYXRoX25vdmVsPzogc3RyaW5nLFxuXHRcdFx0bm92ZWw/OiBOb3ZlbFNpdGUuSU5vdmVsLFxuXHRcdH07XG5cblx0XHRvcHRpb25zUnVudGltZS5zdGFydEluZGV4ID0gb3B0aW9uc1J1bnRpbWUuc3RhcnRJbmRleCB8fCAwO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdG9wdGlvbnNSdW50aW1lLm9wdGlvbnNKU0RPTSA9IGNyZWF0ZU9wdGlvbnNKU0RPTShvcHRpb25zUnVudGltZS5vcHRpb25zSlNET00pO1xuXG5cblx0XHRpZiAob3B0aW9uc1J1bnRpbWUuZGVidWdMb2cgIT0gbnVsbClcblx0XHR7XG5cdFx0XHRvcHRpb25zUnVudGltZS5kZWJ1Z0xvZyA9ICEhb3B0aW9uc1J1bnRpbWUuZGVidWdMb2c7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnNSdW50aW1lLmtlZXBJbWFnZSA9PSBudWxsKVxuXHRcdHtcblx0XHRcdG9wdGlvbnNSdW50aW1lLmtlZXBJbWFnZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnNSdW50aW1lLmtlZXBSdWJ5ID09IG51bGwpXG5cdFx0e1xuXHRcdFx0b3B0aW9uc1J1bnRpbWUua2VlcFJ1YnkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBvcHRpb25zUnVudGltZTtcblx0fVxuXG5cdHRyaW1GaWxlbmFtZUNoYXB0ZXIobmFtZSk6IHN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMudHJpbUZpbGVuYW1lKG5hbWUpO1xuXHR9XG5cblx0dHJpbUZpbGVuYW1lVm9sdW1lKG5hbWUpOiBzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLnRyaW1GaWxlbmFtZShuYW1lKTtcblx0fVxuXG5cdHRyaW1GaWxlbmFtZU5vdmVsKG5hbWUpOiBzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLnRyaW1GaWxlbmFtZShuYW1lKTtcblx0fVxuXG5cdHRyaW1GaWxlbmFtZShuYW1lKTogc3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdHJpbUZpbGVuYW1lKF9maXhWb2x1bWVDaGFwdGVyTmFtZShuYW1lKSk7XG5cdH1cblxuXHR0cmltVGFnKHRhZyk6IHN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuICh0YWcgYXMgc3RyaW5nKVxuXHRcdFx0LnJlcGxhY2UoL1tcXFtcXF1cXC9cXFxcXS9nLCAocykgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFN0clV0aWwudG9GdWxsV2lkdGgocylcblx0XHRcdH0pXG5cdFx0XHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgX2V4cG9ydERvd25sb2FkT3B0aW9uczxUID0gSU9wdGlvbnNSdW50aW1lPihvcHRpb25zUnVudGltZT86IFQgJiBJT3B0aW9uc1J1bnRpbWUpOiB1bmtub3duXG5cdHtcblx0XHRyZXR1cm4gdm9pZCAoMCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgX2hhbmRsZURhdGFGb3JTdHJpbmdpZnkoLi4uYXJndik6IElNZGNvbmZNZXRhXG5cdHtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0bGV0IG1kY29uZjogSU1kY29uZk1ldGEgPSBfaGFuZGxlRGF0YUZvclN0cmluZ2lmeSguLi5hcmd2KTtcblxuXHRcdGlmIChtZGNvbmYubm92ZWwpXG5cdFx0e1xuXHRcdFx0bGV0IGJvb2w6IGJvb2xlYW47XG5cblx0XHRcdGlmIChtZGNvbmYubm92ZWwudGFncyAmJiBBcnJheS5pc0FycmF5KG1kY29uZi5ub3ZlbC50YWdzKSlcblx0XHRcdHtcblx0XHRcdFx0Ym9vbCA9IFtcblx0XHRcdFx0XHQn5pu457GN5YyWJyxcblx0XHRcdFx0XHQn5Lmm57GN5YyWJyxcblx0XHRcdFx0XHQn5paH5bqr5YyWJyxcblx0XHRcdFx0XHQn5paH5bqT5YyWJyxcblx0XHRcdFx0XS5zb21lKHYgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBtZGNvbmYubm92ZWwudGFncy5pbmNsdWRlcyh2KVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoYm9vbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1kY29uZi5ub3ZlbC5ub3ZlbF9zdGF0dXMgPSAobWRjb25mLm5vdmVsLm5vdmVsX3N0YXR1cyB8IDApIHwgRW51bU5vdmVsU3RhdHVzLlBfQk9PSztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobWRjb25mLm5vdmVsLnN0YXR1cylcblx0XHRcdHtcblx0XHRcdFx0Ym9vbCA9IFtcblx0XHRcdFx0XHQn5a6M57WQ5riIJyxcblx0XHRcdFx0XHQn5a6M57WQJyxcblx0XHRcdFx0XHQn5bey5a6M57WQJyxcblx0XHRcdFx0XHQn5bey5a6M5oiQJyxcblx0XHRcdFx0XHQn5a6M57uT5riIJyxcblx0XHRcdFx0XHQn5a6M57uTJyxcblx0XHRcdFx0XHQn5bey5a6M57uTJyxcblx0XHRcdFx0XHQn5bey5a6M5oiQJyxcblx0XHRcdFx0XS5pbmNsdWRlcyhtZGNvbmYubm92ZWwuc3RhdHVzKTtcblxuXHRcdFx0XHRpZiAoYm9vbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1kY29uZi5ub3ZlbC5ub3ZlbF9zdGF0dXMgPSAobWRjb25mLm5vdmVsLm5vdmVsX3N0YXR1cyB8IDApIHwgRW51bU5vdmVsU3RhdHVzLkFVVEhPUl9ET05FO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1kY29uZjtcblx0fVxuXG5cdHByb3RlY3RlZCBfc2F2ZVJlYWRtZShvcHRpb25zUnVudGltZT86IElPcHRpb25zUnVudGltZSwgb3B0aW9ucyA9IHt9LCAuLi5vcHRzKVxuXHR7XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRpZiAoaXNVbmRlZihvcHRpb25zUnVudGltZSlcblx0XHRcdHx8IGlzVW5kZWYob3B0aW9uc1J1bnRpbWVbU1lNQk9MX0NBQ0hFXSwge30pXG5cblx0XHRcdHx8IGlzVW5kZWYob3B0aW9uc1J1bnRpbWVbU1lNQk9MX0NBQ0hFXS5ub3ZlbCwge30pXG5cdFx0XHR8fCBpc1VuZGVmKG9wdGlvbnNSdW50aW1lW1NZTUJPTF9DQUNIRV0ucGF0aF9ub3ZlbCwgJycpXG5cdFx0KVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgc2F2ZVJlYWRtZWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IG5vdmVsID0gb3B0aW9uc1J1bnRpbWVbU1lNQk9MX0NBQ0hFXS5ub3ZlbDtcblx0XHRjb25zdCBwYXRoX25vdmVsID0gb3B0aW9uc1J1bnRpbWVbU1lNQk9MX0NBQ0hFXS5wYXRoX25vdmVsO1xuXG5cdFx0bGV0IG1kY29uZmlnID0gdGhpcy5faGFuZGxlRGF0YUZvclN0cmluZ2lmeSh7XG5cdFx0XHRub3ZlbDoge1xuXHRcdFx0XHRpbGx1c3Q6ICcnLFxuXHRcdFx0XHR0aXRsZV96aDE6ICcnLFxuXHRcdFx0XHRpbGx1c3RzOiBbXSxcblx0XHRcdFx0cHVibGlzaGVyczogW1xuXHRcdFx0XHRcdHNlbGYuSURLRVksXG5cdFx0XHRcdF0sXG5cdFx0XHRcdHRhZ3M6IFtcblx0XHRcdFx0XHRzZWxmLklES0VZLFxuXHRcdFx0XHRdLFxuXHRcdFx0XHRzZXJpZXM6IHtcblx0XHRcdFx0XHRuYW1lOiBub3ZlbC5ub3ZlbF9zZXJpZXNfdGl0bGUgfHwgbm92ZWwubm92ZWxfdGl0bGUgfHwgJycsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG5vdmVsX3N0YXR1czogMCxcblx0XHRcdH0sXG5cdFx0XHRvcHRpb25zLFxuXG5cdFx0XHRsaW5rOiBub3ZlbC5saW5rIHx8IFtdLFxuXHRcdH0sIG5vdmVsLCAuLi5vcHRzKTtcblxuXHRcdGxldCBtZCA9IG5vdmVsSW5mby5zdHJpbmdpZnkobWRjb25maWcpO1xuXG5cdFx0bGV0IGZpbGUgPSBwYXRoLmpvaW4ocGF0aF9ub3ZlbCwgYFJFQURNRS5tZGApO1xuXG5cdFx0Y29uc29sZURlYnVnLmluZm8oYFtNRVRBXWAsIGBzYXZlIFJFQURNRS5tZGApO1xuXG5cdFx0cmV0dXJuIGZzLm91dHB1dEZpbGUoZmlsZSwgbWQpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGZpbGUsXG5cdFx0XHRcdFx0bWQsXG5cdFx0XHRcdH07XG5cdFx0XHR9KVxuXHRcdFx0O1xuXHR9XG5cblx0Y3JlYXRlTWFpblVybDxUID0gSU9wdGlvbnNSdW50aW1lPih1cmw6IHN0cmluZyB8IFVSTCwgb3B0aW9uc1J1bnRpbWU/OiBUICYgSU9wdGlvbnNSdW50aW1lKTogVVJMXG5cdHtcblx0XHRsZXQgZGF0YSA9IHRoaXMucGFyc2VVcmwodXJsKTtcblxuXHRcdGlmICghZGF0YSB8fCAhZGF0YS5ub3ZlbF9pZClcblx0XHR7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEpO1xuXG5cdFx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLm1ha2VVcmwoZGF0YSwgdHJ1ZSwgb3B0aW9uc1J1bnRpbWUpO1xuXHR9XG5cblx0cHJvdGVjdGVkIF9jcmVhdGVDaGFwdGVyVXJsPFQgPSBJT3B0aW9uc1J1bnRpbWU+KHtcblx0XHRub3ZlbCxcblx0XHR2b2x1bWUsXG5cdFx0Y2hhcHRlcixcblx0fToge1xuXHRcdG5vdmVsOiBOb3ZlbFNpdGUuSU5vdmVsLFxuXHRcdHZvbHVtZTogTm92ZWxTaXRlLklWb2x1bWUsXG5cdFx0Y2hhcHRlcjogTm92ZWxTaXRlLklDaGFwdGVyLFxuXHR9LCBvcHRpb25zUnVudGltZT86IFQgJiBJT3B0aW9uc1J1bnRpbWUpXG5cdHtcblx0XHRyZXR1cm4gY3JlYXRlVVJMKGNoYXB0ZXIuY2hhcHRlcl91cmwpO1xuXHR9XG5cblx0cHJvdGVjdGVkIF9mZXRjaENoYXB0ZXI8VD4odXJsOiBVUkwsIG9wdGlvbnNSdW50aW1lOiBUICYgSU9wdGlvbnNSdW50aW1lLCBfY2FjaGVfOiB7XG5cdFx0bm92ZWw6IElOb3ZlbCxcblx0fSlcblx0e1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihgRnVuY3Rpb24gbm90IGltcGxlbWVudGVkYCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgX3BhcnNlQ2hhcHRlcjxUPihkb20sIG9wdGlvbnNSdW50aW1lOiBUICYgSU9wdGlvbnNSdW50aW1lLCBjYWNoZToge1xuXHRcdGZpbGU6IHN0cmluZyxcblx0XHRub3ZlbDogTm92ZWxTaXRlLklOb3ZlbCxcblx0XHR2b2x1bWU6IE5vdmVsU2l0ZS5JVm9sdW1lLFxuXHRcdGNoYXB0ZXI6IE5vdmVsU2l0ZS5JQ2hhcHRlcixcblx0fSlcblx0e1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihgRnVuY3Rpb24gbm90IGltcGxlbWVudGVkYCk7XG5cdH1cblxuXHRnZXRFeHRyYUluZm88VCwgTSBleHRlbmRzIFBhcnRpYWw8SU5vdmVsICYgSU1kY29uZk1ldGE+LCBDIGV4dGVuZHMgdW5rbm93bj4odXJsb2JqOiBOb3ZlbFNpdGUuSVBhcnNlVXJsLFxuXHRcdG9wdGlvbnNSdW50aW1lOiBUICYgSU9wdGlvbnNSdW50aW1lLFxuXHRcdGRhdGFfbWV0YT86IE0sXG5cdFx0Y2FjaGU/OiBDLFxuXHQpOiBQcm9taXNlQmx1ZWJpcmQ8TT5cblx0e1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihgRnVuY3Rpb24gbm90IGltcGxlbWVudGVkYCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgX2NoZWNrRXhpc3RzKG9wdGlvbnNSdW50aW1lOiBJT3B0aW9uc1J1bnRpbWUsIGZpbGU6IHN0cmluZyk6IGJvb2xlYW5cblx0e1xuXHRcdGlmICghb3B0aW9uc1J1bnRpbWUuZGlzYWJsZUNoZWNrRXhpc3RzICYmIGZzLmV4aXN0c1N5bmMoZmlsZSkpXG5cdFx0e1xuXHRcdFx0bGV0IHR4dCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlKTtcblxuXHRcdFx0aWYgKHR4dC50b1N0cmluZygpLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblxuXHRwcm90ZWN0ZWQgZW1pdChldmVudDogRXZlbnRFbWl0dGVyLCBldmVudE5hbWU6IHN0cmluZywgLi4uYXJndilcblx0e1xuXHRcdGxldCBib29sID0gZXZlbnQuZW1pdChldmVudE5hbWUsIHRoaXMsIC4uLmFyZ3YpO1xuXHRcdHJldHVybiBbZXZlbnQsIGJvb2xdO1xuXHR9XG5cblx0X3NhdmVGaWxlPFQgPSBOb3ZlbFNpdGUuSU9wdGlvbnNSdW50aW1lPihvcHRzOiB7XG5cdFx0ZmlsZTogc3RyaW5nLFxuXHRcdGNvbnRleHQ6IHN0cmluZyB8IEJ1ZmZlcixcblx0XHRvcHRpb25zUnVudGltZTogVCAmIE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWUsXG5cdH0pXG5cdHtcblx0XHRyZXR1cm4gUHJvbWlzZUJsdWViaXJkLnJlc29sdmUoKVxuXHRcdFx0LmJpbmQodGhpcylcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0bGV0IHsgZmlsZSwgY29udGV4dCwgb3B0aW9uc1J1bnRpbWUgfSA9IG9wdHM7XG5cblx0XHRcdFx0aWYgKG9wdGlvbnNSdW50aW1lLmxpbmVCcmVha0NybGYpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgdHh0MSA9IGNvbnRleHQudG9TdHJpbmcoKTtcblxuXHRcdFx0XHRcdGlmIChSX0NSTEYudGVzdCh0eHQxKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgdHh0MiA9IGNybGYodHh0MSwgQ1JMRik7XG5cblx0XHRcdFx0XHRcdGlmICh0eHQxICE9PSB0eHQyKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb250ZXh0ID0gdHh0Mjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dHh0MSA9IG51bGw7XG5cdFx0XHRcdFx0XHR0eHQyID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZnMub3V0cHV0RmlsZShmaWxlLCBjb250ZXh0KVxuXHRcdFx0XHRcdC50aGVuKHIgPT4ge1xuXG5cdFx0XHRcdFx0XHRpZiAob3B0aW9uc1J1bnRpbWUuZGVidWdMb2cpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBmaWxlMiA9IHBhdGgucmVsYXRpdmUob3B0aW9uc1J1bnRpbWUub3V0cHV0RGlyLCBmaWxlKTtcblxuXHRcdFx0XHRcdFx0XHRjb25zb2xlRGVidWcuc3VjY2VzcyhgW1NBVkVdYCwgZmlsZTIpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gcjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHQ7XG5cdH1cblxufVxuXG5leHBvcnQgaW1wb3J0IElPcHRpb25zUnVudGltZSA9IE5vdmVsU2l0ZS5JT3B0aW9uc1J1bnRpbWU7XG5leHBvcnQgaW1wb3J0IElWb2x1bWUgPSBOb3ZlbFNpdGUuSVZvbHVtZTtcbmV4cG9ydCBpbXBvcnQgSUNoYXB0ZXIgPSBOb3ZlbFNpdGUuSUNoYXB0ZXI7XG5leHBvcnQgaW1wb3J0IEVudW1QYXRoTm92ZWxTdHlsZSA9IE5vdmVsU2l0ZS5FbnVtUGF0aE5vdmVsU3R5bGU7XG5cbmV4cG9ydCBuYW1lc3BhY2UgTm92ZWxTaXRlXG57XG5cblx0ZXhwb3J0IHR5cGUgSUZpbGVQcmVmaXhNb2RlID0gMCB8IDEgfCAyIHwgMyB8IDQgfCA1O1xuXG5cdGV4cG9ydCB0eXBlIElPcHRpb25zUGx1cyA9IHtcblxuXHRcdGRpc2FibGVPdXRwdXREaXJQcmVmaXg/OiBib29sZWFuLFxuXG5cdFx0bm9EaXJQcmVmaXg/OiBib29sZWFuLFxuXHRcdG5vRGlyUGFkZW5kPzogYm9vbGVhbixcblxuXHRcdG5vRmlyZVByZWZpeD86IGJvb2xlYW4sXG5cdFx0bm9GaWxlUGFkZW5kPzogYm9vbGVhbixcblxuXHRcdHJldHJ5RGVsYXk/OiBudW1iZXIsXG5cdFx0c3RhcnRJbmRleD86IG51bWJlcixcblxuXHRcdGZpbGVQcmVmaXhNb2RlPzogbnVtYmVyIHwgSUZpbGVQcmVmaXhNb2RlLFxuXG5cdFx0YWxsb3dFbXB0eVZvbHVtZVRpdGxlPzogYm9vbGVhbixcblxuXHRcdGV2ZW50PzogRXZlbnRFbWl0dGVyLFxuXG5cdFx0LyoqXG5cdFx0ICog55So5L6G55m75YWl56uZ6bue55qEIGNvb2tpZXMgc2Vzc2lvblxuXHRcdCAqL1xuXHRcdHNlc3Npb25EYXRhPzoge1xuXHRcdFx0W2tleTogc3RyaW5nXTogYW55LFxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiDlj6rmipPlj5blsI/oqqrnmoQgTUVUQSDos4fmlplcblx0XHQgKi9cblx0XHRmZXRjaE1ldGFEYXRhT25seT86IGJvb2xlYW4sXG5cblx0XHRkZWJ1Z0xvZz86IGJvb2xlYW4sXG5cblx0XHRsaW5lQnJlYWtDcmxmPzogYm9vbGVhbixcblxuXHRcdC8qKlxuXHRcdCAqIOS/neeVmeazqOmfs+agvOW8j1xuXHRcdCAqL1xuXHRcdGtlZXBSdWJ5PzogYm9vbGVhbjtcblx0XHQvKipcblx0XHQgKiDkv53nlZnlhbbku5bmoLzlvI9cblx0XHQgKi9cblx0XHRrZWVwRm9ybWF0PzogYm9vbGVhbjtcblxuXHRcdC8qKlxuXHRcdCAqIOWcqOWFp+aWh+WOn+Wni+S9jee9ruS4iuS/neeVmeWclueJh1xuXHRcdCAqL1xuXHRcdGtlZXBJbWFnZT86IGJvb2xlYW47XG5cblx0fVxuXG5cdGV4cG9ydCB0eXBlIElPcHRpb25zID0ge1xuXG5cdFx0b3V0cHV0RGlyPzogc3RyaW5nLFxuXHRcdGN3ZD86IHN0cmluZyxcblxuXHR9ICYgSU9wdGlvbnNQbHVzO1xuXG5cdGV4cG9ydCBjb25zdCBlbnVtIEVudW1QYXRoTm92ZWxTdHlsZVxuXHR7XG5cdFx0REVGQVVMVCA9IDAsXG5cdFx0Tk9WRUxJRCA9IDEsXG5cdH1cblxuXHRleHBvcnQgdHlwZSBJRG93bmxvYWRPcHRpb25zID0ge1xuXG5cdFx0LyoqXG5cdFx0ICog5Y+q55Si55Sf55uu6YyE57WQ5qeLIOS4jeS4i+i8ieWFp+WuuVxuXHRcdCAqL1xuXHRcdGRpc2FibGVEb3dubG9hZD86IGJvb2xlYW4sXG5cdFx0ZGlzYWJsZUNoZWNrRXhpc3RzPzogYm9vbGVhbixcblxuXHRcdG9wdGlvbnNKU0RPTT86IElGcm9tVXJsT3B0aW9ucyAmIElPcHRpb25zSlNET00gJiB7XG5cdFx0XHRjb29raWVKYXI/OiBQYXJ0aWFsPExhenlDb29raWVKYXI+LFxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiDoqK3lrprlsI/oqqros4fmlpnlpL7mqKPlvI9cblx0XHQgKi9cblx0XHRwYXRoTm92ZWxTdHlsZT86IEVudW1QYXRoTm92ZWxTdHlsZSxcblxuXHR9ICYgSU9wdGlvbnNQbHVzO1xuXG5cdGV4cG9ydCB0eXBlIElPcHRpb25zUnVudGltZSA9IElPcHRpb25zICYgSURvd25sb2FkT3B0aW9ucyAmIElPcHRpb25zUGx1cztcblxuXHRleHBvcnQgaW50ZXJmYWNlIElQYXJzZVVybFxuXHR7XG5cdFx0dXJsPzogVVJMIHwgc3RyaW5nLFxuXG5cdFx0bm92ZWxfcGlkPyxcblx0XHRub3ZlbF9pZD8sXG5cdFx0Y2hhcHRlcl9pZD8sXG5cdFx0dm9sdW1lX2lkPyxcblxuXHRcdG5vdmVsX3IxOD8sXG5cblx0XHRba2V5OiBzdHJpbmddOiBhbnksXG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIElDaGFwdGVyXG5cdHtcblx0XHRjaGFwdGVyX2luZGV4PzogbnVtYmVyIHwgc3RyaW5nLFxuXHRcdGNoYXB0ZXJfdGl0bGU6IHN0cmluZyxcblx0XHRjaGFwdGVyX2lkP1xuXHRcdGNoYXB0ZXJfdXJsP1xuXHRcdGNoYXB0ZXJfdXJsX2RhdGE/XG5cdFx0Y2hhcHRlcl9kYXRlPzogbW9tZW50Lk1vbWVudCxcblxuXHRcdGltZ3M/OiBzdHJpbmdbXSxcblxuXHRcdFtrZXk6IHN0cmluZ106IGFueSxcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVZvbHVtZVxuXHR7XG5cdFx0dm9sdW1lX2luZGV4P1xuXHRcdHZvbHVtZV90aXRsZTogc3RyaW5nLFxuXHRcdGNoYXB0ZXJfbGlzdD86IElDaGFwdGVyW10sXG5cblx0XHRba2V5OiBzdHJpbmddOiBhbnksXG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIElOb3ZlbFxuXHR7XG5cdFx0dXJsOiBVUkwgfCBzdHJpbmcsXG5cdFx0dXJsX2RhdGE6IElQYXJzZVVybCxcblxuXHRcdG5vdmVsX3RpdGxlOiBzdHJpbmcsXG5cdFx0bm92ZWxfYXV0aG9yPzogc3RyaW5nLFxuXG5cdFx0bm92ZWxfZGVzYz86IHN0cmluZyxcblx0XHRub3ZlbF9kYXRlPzogbW9tZW50Lk1vbWVudCxcblx0XHRub3ZlbF9wdWJsaXNoZXI/OiBzdHJpbmcsXG5cblx0XHRub3ZlbF9zZXJpZXNfdGl0bGU/OiBzdHJpbmcsXG5cblx0XHR2b2x1bWVfbGlzdDogSVZvbHVtZVtdLFxuXG5cdFx0Y2hlY2tkYXRlPzogbW9tZW50Lk1vbWVudCxcblxuXHRcdGltZ3M/OiBzdHJpbmdbXSxcblxuXHRcdFtrZXk6IHN0cmluZ106IGFueSxcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU5vdmVsU2l0ZVN0YXRpYzxUPiBleHRlbmRzIFR5cGU8VCAmIE5vdmVsU2l0ZS5JTm92ZWxTaXRlPlxuXHR7XG5cdFx0cmVhZG9ubHkgSURLRVk6IHN0cmluZyxcblx0XHRyZWFkb25seSBkaXNhYmxlZD86IGJvb2xlYW4sXG5cblx0XHRjaGVjaz8odXJsOiBzdHJpbmcgfCBVUkwgfCBOb3ZlbFNpdGUuSVBhcnNlVXJsIHwgbnVtYmVyLCBvcHRpb25zPywgLi4uYXJndik6IGJvb2xlYW47XG5cblx0XHRtYWtlVXJsPyh1cmxvYmo6IE5vdmVsU2l0ZS5JUGFyc2VVcmwsIG9wdGlvbnM/LCAuLi5hcmd2KTogVVJMO1xuXG5cdFx0cGFyc2VVcmw/KHVybDogc3RyaW5nIHwgVVJMIHwgbnVtYmVyLCAuLi5hcmd2KTogTm92ZWxTaXRlLklQYXJzZVVybDtcblxuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJTm92ZWxTaXRlXG5cdHtcblx0XHRkb3dubG9hZCh1cmw6IHN0cmluZyB8IFVSTCwgb3B0aW9ucz86IElEb3dubG9hZE9wdGlvbnMpOiBQcm9taXNlQmx1ZWJpcmQ8Tm92ZWxTaXRlLklOb3ZlbD47XG5cblx0XHRtYWtlVXJsKHVybG9iajogTm92ZWxTaXRlLklQYXJzZVVybCwgb3B0aW9ucz8sIC4uLmFyZ3YpOiBVUkw7XG5cblx0XHRwYXJzZVVybCh1cmw6IFVSTCB8IHN0cmluZyB8IG51bWJlciwgLi4uYXJndik6IE5vdmVsU2l0ZS5JUGFyc2VVcmw7XG5cdH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUeXBlPFQ+XG57XG5cdG5ldyhvcHRpb25zOiBOb3ZlbFNpdGUuSU9wdGlvbnMsIC4uLmFyZ3M6IGFueVtdKTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXRpY0ltcGxlbWVudHM8VD4oKVxue1xuXHRyZXR1cm4gKGNvbnN0cnVjdG9yOiBUKSA9PiB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBOb3ZlbFNpdGU7XG4iXX0=