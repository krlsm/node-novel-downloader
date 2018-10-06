/**
 * Created by user on 2018/3/25/025.
 */
import _NovelSite from '../index';
import { IDownloadOptions, INovel } from '../demo/base';
import { IFetchChapter, IOptionsRuntime } from '../demo/base';
import NovelSiteBase from '../demo/base';
import { IJSDOM } from 'jsdom-extra';
export declare type ISessionData = {
    sessionid: string;
    steins_csrf_token: string;
    online?: 1 | '1';
    id?: number | string;
    avatar?: string;
    username?: string;
};
export declare class NovelSiteIqing extends NovelSiteBase {
    static readonly IDKEY = "iqing";
    checkSessionData<T = ISessionData>(data: T & ISessionData, optionsRuntime?: IOptionsRuntime): T;
    makeUrl(urlobj: _NovelSite.IParseUrl, bool?: boolean | number): URL;
    parseUrl(url: URL | string, options?: any): _NovelSite.IParseUrl;
    createMainUrl(url: any): URL;
    protected _parseChapter<T>(ret: IFetchChapter, optionsRuntime: T & IOptionsRuntime, cache: any): string;
    get_volume_list<T = IOptionsRuntime>(inputUrl: string | URL, optionsRuntime?: Partial<T & IDownloadOptions>): Promise<INovel>;
    protected _get_meta(inputUrl: any, optionsRuntime: any, cache: {
        dom: IJSDOM;
    }): Promise<{
        novel_title: string;
        novel_author: any;
        novel_desc: any;
        novel_date: any;
        novel?: {
            title?: string;
            title_source?: string;
            title_short?: string;
            title_output?: string;
            title_zh?: string;
            title_cn?: string;
            title_tw?: string;
            title_en?: string;
            title_jp?: string;
            author?: string;
            authors?: string[];
            cover?: string;
            illust?: string[];
            preface?: string;
            tags?: string[];
            date?: string;
            status?: string;
            r18?: string;
            series?: {
                name?: string;
                name_short?: string;
                position?: number;
            };
            source?: string;
            sources?: string[];
            publisher?: string;
        };
        contribute?: string[];
        options?: {
            [key: string]: any;
            dmzj?: import("node-novel-info").IMdconfMetaOptionsNovelSite;
            kakuyomu?: import("node-novel-info").IMdconfMetaOptionsNovelSite;
            wenku8?: import("node-novel-info").IMdconfMetaOptionsNovelSite;
            webqxs?: import("node-novel-info").IMdconfMetaOptionsNovelSite;
            syosetu?: import("node-novel-info").IMdconfMetaOptionsNovelSite & {
                txtdownload_id: string | number;
            };
            novel?: {
                [key: string]: any;
                pattern?: string;
            };
            textlayout?: {
                [key: string]: any;
                allow_lf2?: boolean;
            };
        };
        link?: string[];
        url: any;
        url_data: _NovelSite.IParseUrl;
    }>;
}
export default NovelSiteIqing;