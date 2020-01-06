/// <reference types="bluebird" />
import { IMdconfMeta } from 'node-novel-info';
import { IJSDOM } from 'jsdom-extra';
import NovelSite from '../index';
import { PromiseBluebird } from '../index';
import NovelSiteDemo = require('../demo/base');
export declare type INovel = NovelSiteDemo.INovel & {
    novel_syosetu_id: string;
};
export declare const enum EnumProtocolMode {
    NONE = 0,
    HTTPS = 1,
    HTTP = 2
}
export declare type IOptionsPlus = {
    /**
     * 不使用小說家提供的 txt 下載連結
     */
    disableTxtdownload?: boolean;
    protocolMode?: EnumProtocolMode | boolean;
};
export declare type IDownloadOptions = NovelSiteDemo.IDownloadOptions & IOptionsPlus;
export declare type IOptionsRuntime = NovelSiteDemo.IOptionsRuntime & IDownloadOptions & IOptionsPlus;
export declare class NovelSiteSyosetu extends NovelSiteDemo.NovelSite {
    static readonly IDKEY = "syosetu";
    constructor(options: IDownloadOptions, ...argv: any[]);
    session<T = NovelSite.IOptionsRuntime>(optionsRuntime: Partial<T & IDownloadOptions>, url: URL): this;
    download(url: string | URL, downloadOptions?: IDownloadOptions): PromiseBluebird<NovelSite.INovel>;
    protected _parseChapter<T>(ret: any, optionsRuntime: T & IOptionsRuntime, cache: any): Promise<string>;
    protected _createChapterUrl<T = IOptionsRuntime & IDownloadOptions>({ novel, volume, chapter, }: {
        novel: NovelSite.INovel;
        volume: NovelSite.IVolume;
        chapter: NovelSite.IChapter;
    }, optionsRuntime?: T & IOptionsRuntime): URL;
    protected _saveReadme(optionsRuntime: IOptionsRuntime, options?: {}, ...opts: any[]): Promise<{
        file: string;
        md: string;
    }>;
    _hackURL(obj: URL | string, optionsRuntime: IOptionsRuntime): URL;
    makeUrl<T>(urlobj: NovelSite.IParseUrl, bool?: boolean, optionsRuntime?: T & IOptionsRuntime): URL;
    parseUrl(url: string | URL): NovelSite.IParseUrl;
    protected _fetchChapter<T>(url: URL, optionsRuntime: T & IOptionsRuntime, _cache_: {
        novel: INovel;
    }): PromiseBluebird<NovelSiteDemo.IFetchChapter>;
    _novel18<T = NovelSite.IOptionsRuntime>(url: any, dom: IJSDOM, optionsRuntime?: Partial<T & IDownloadOptions>): Promise<IJSDOM>;
    protected _getExtraInfoURL<T>(search: string, url_data: NovelSite.IParseUrl, optionsRuntime: Partial<T & IDownloadOptions>): PromiseBluebird<IJSDOM>;
    protected _getExtraInfoURL2<T, M extends Partial<INovel & IMdconfMeta>>(url_data: NovelSite.IParseUrl, optionsRuntime: Partial<T & IDownloadOptions>, data_meta: M): PromiseBluebird<M>;
    createMainUrl<T>(url: string | URL, optionsRuntime: T & IOptionsRuntime): URL;
    get_volume_list<T = NovelSite.IOptionsRuntime>(url: string | URL, optionsRuntime?: Partial<T & IDownloadOptions>): Promise<INovel>;
}
export default NovelSiteSyosetu;
