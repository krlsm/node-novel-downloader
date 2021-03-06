/**
 * Created by user on 2018/3/17/017.
 */
import NovelSiteDemo, { IDownloadOptions, INovel, IOptionsRuntime, IFetchChapter } from '../demo/tree';
import NovelSite from '../index';
/**
 * 铅笔小说
 * @example https://www.x23qb.com/book/284/
 */
export declare class NovelSiteX23qb extends NovelSiteDemo {
    static readonly IDKEY = "x23qb";
    protected _cache_re: RegExp;
    static check(url: string | URL | NovelSite.IParseUrl, ...argv: any[]): boolean;
    static makeUrl(urlobj: NovelSite.IParseUrl, bool?: boolean | number, ...argv: any[]): URL;
    static parseUrl(url: string | URL | number, ...argv: any[]): import("../../util/url").IParseUrlRuntime;
    makeUrl(urlobj: NovelSite.IParseUrl, bool?: boolean | number, ...argv: any[]): URL;
    parseUrl(url: string | URL | number, ...argv: any[]): import("../../util/url").IParseUrlRuntime;
    protected _decodeChapter<T>(ret: IFetchChapter, optionsRuntime: T & IOptionsRuntime, cache: any): Promise<void>;
    protected _parseChapter<T>(ret: any, optionsRuntime: any, cache: any): Promise<string>;
    get_volume_list<T extends IOptionsRuntime>(url: string | URL, optionsRuntime?: Partial<T & IDownloadOptions>): Promise<INovel>;
}
export default NovelSiteX23qb;
