/**
 * Created by user on 2018/3/17/017.
 */

import { minifyHTML, trim } from '../../util';
import NovelSiteDemo, { IDownloadOptions, INovel, IOptionsRuntime, IFetchChapter } from '../demo/tree';
import { IRowVolume, TreeNode } from '../../tree/index';

import fs from 'fs-extra';
import { trimFilename } from 'fs-iconv/util';
import path from 'upath2';
import novelInfo, { IMdconfMeta } from 'node-novel-info';
import { fromURL, IFromUrlOptions, IJSDOM } from 'jsdom-extra';

//import { URL } from 'jsdom-url';

import NovelSite, { staticImplements, defaultJSDOMOptions, SYMBOL_CACHE } from '../index';
import { PromiseBluebird, bluebirdDecorator } from '../index';
import { moment } from '../index';
import { retryRequest } from '../../fetch';
import { parseUrl, makeUrl, check } from './util';

@staticImplements<NovelSite.INovelSiteStatic<NovelSiteESJZone>>()
export class NovelSiteESJZone extends NovelSiteDemo
{
	public static readonly IDKEY = 'novelup';

	/*
	protected _fixOptionsRuntime(optionsRuntime)
	{
		optionsRuntime.optionsJSDOM = optionsRuntime.optionsJSDOM || {};

		//optionsRuntime.optionsJSDOM.runScripts = 'dangerously';

		return super._fixOptionsRuntime(optionsRuntime)
	}
	 */

	static check(url: string | URL | NovelSite.IParseUrl, ...argv): boolean
	{
		return check(url, ...argv);
	}

	static makeUrl(urlobj: NovelSite.IParseUrl, bool?: boolean | number, ...argv)
	{
		return makeUrl(urlobj, bool, ...argv)
	}

	static parseUrl(url: string | URL | number, ...argv)
	{
		return parseUrl(url, ...argv);
	}

	makeUrl(urlobj: NovelSite.IParseUrl, bool?: boolean | number, ...argv)
	{
		return makeUrl(urlobj, bool, ...argv)
	}

	parseUrl(url: string | URL | number, ...argv)
	{
		return parseUrl(url, ...argv);
	}

	protected async _decodeChapter<T>(ret: IFetchChapter, optionsRuntime: T & IOptionsRuntime, cache)
	{
		const { dom } = ret;
		const { $ } = dom;
	}

	protected async _parseChapter<T>(ret, optionsRuntime, cache)
	{
		if (!ret)
		{
			return '';
		}

		const $ = ret.dom.$;

		let section_episode = $('#section_episode');

		try
		{
			//let html = minifyHTML(section_episode.html());

			//section_episode.html(html);
		}
		catch (e)
		{

		}

		let elem = section_episode.find('.content > p');

		let txt: string = (await elem
			.text())
			//.replace(/\x20/g, '\n')
			.replace(/^\n+|\s+$/g, '')
		;

//		let html = elem.html();

		/*
		let html = elem.html();

		throw console.dir({
			html,
			txt,
		});
		 */

//		console.dir(html);
//
//		console.dir(txt);

//		console.dir(txt);
//
//		process.exit();

		return txt as string
	}

	getOutputDir<T extends IOptionsRuntime>(options?: T & IOptionsRuntime, novelName?: string)
	{
		let ret = super.getOutputDir<T>(options, novelName);

		ret[1].optionsJSDOM.minifyHTML = false;

		return ret;
	}

	async get_volume_list<T extends IOptionsRuntime>(url: string | URL,
		optionsRuntime: Partial<T & IDownloadOptions> = {},
	): Promise<INovel>
	{
		const self = this;

		url = await this.createMainUrl(url as any, optionsRuntime);

		return fromURL(url, optionsRuntime.optionsJSDOM)
			.then(async function (dom: IJSDOM)
			{
				const $ = dom.$;

				let data_meta: IMdconfMeta = {
					novel: {

					},
				};

				let section_works_info = $('#section_works_info');

				let novel_title = trim(section_works_info.find('.novel_title').text());

				let novel_publisher = self.IDKEY;

				let url_data = self.parseUrl(dom.url.href);

				let novel_author = trim(section_works_info.find('.novel_author').text());
				let novel_date;

				const novelTree = optionsRuntime.novelTree;
				let currentVolume: TreeNode<IRowVolume>;

				let _cache_dates = [];

				let total_idx = 0;

				{
					let volume_title = 'null';
					let volume_level = null;

					currentVolume = novelTree.addVolume({
						volume_title,
						volume_level,
						volume_index: novelTree.root().size(),
						total_idx: total_idx++,
					});
				}

				let table = $('#section_episode .episode_list ul:eq(0) > li');

				table
					.each(function (index, elem)
					{
						let tr = $(elem);

						if (tr.is('.chapter'))
						{
							let volume_title = trim(tr.text());

							if (volume_title != currentVolume.content.volume_title)
							{

								currentVolume = novelTree.addVolume({
									volume_title,
									volume_index: novelTree.root().size(),
									total_idx: total_idx++,
								});

							}
						}
						else
						{


							let a = tr.find('.episode_link a');
							let chapter_title = trim(a.text(), true);

							let href = a.prop('href');

							let data = self.parseUrl(href);

							if (!data.chapter_id)
							{
								return;
							}
							else
							{
								href = self.makeUrl(data);

								data.url = href;
							}

							let chapter = {
								chapter_title,
								chapter_id: data.chapter_id,
								chapter_url: href,
								chapter_url_data: data,
								chapter_index: currentVolume.size(),
								total_idx: total_idx++,
							};

							novelTree.addChapter(chapter, currentVolume)
						}
					})
				;

				data_meta.novel.cover = section_works_info.find('.novel_cover img').prop('src');

				let novel_desc = trim(section_works_info.find('.novel_synopsis').text());

				data_meta.novel.tags = data_meta.novel.tags || [];

				$('#section_episode .info_table dd')
					.find(`a[href*="[tag]"], a[href*="genre[1]"]`)
					.each((i, elem) => {

						data_meta.novel.tags.push(trim($(elem).text()));

					})
				;

				return {

					...data_meta,

					url: dom.url,
					url_data,

					novel_author,
					novel_date,

					novel_desc,

					novel_title,
					novel_publisher,

					//volume_list,
					novelTree,

					checkdate: moment().local(),

					imgs: [] as string[],
				} as INovel;
			})
			;
	}

}

export default NovelSiteESJZone;
