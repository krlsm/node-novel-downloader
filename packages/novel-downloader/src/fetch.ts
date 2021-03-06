/**
 * Created by user on 2018/2/9/009.
 */

import request from '@bluelovers/request-promise';
import Bluebird from 'bluebird';
import { console } from './util/log';
import { IRequestPromise } from './util/request/create';

//import fetch from 'lets-fetch';
//fetch.retry((tries) => tries <= 3);

export interface IOptions extends request.RequestPromiseOptions
{
	retry?: number,
	delay?: number,

	jar?,

	libRequest?: ((url: string, options?: IOptions) => request.RequestPromise) | IRequestPromise,
}

export function retryRequest(url, options: IOptions = {})
{
	options = Object.assign({
		retry: 3,
		delay: 1000,
	}, options);

	let retry = options.retry || 3;
	let libRequest = options.libRequest || request;

	let tries = 0;

	if (url.href)
	{
		url = url.href;
	}

	function fn()
	{
		tries++;

		// @ts-ignore
		return libRequest(url.toString(), options)
			.catch(function (err)
			{
				if (retry-- > 0)
				{
					console.warn(`fetch fail(${tries}), will wait ${options.delay}ms, for try again\n${url}`);

					return Bluebird.delay(options.delay).then(fn);
				}

				err.tries = tries;

				return Bluebird.reject(err);
			})
			;
	}

	return Bluebird.resolve().then(function ()
	{
		return fn();
	}).tapCatch(function (err)
	{
		console.error(err);
	});
}

export function manyRequest(url_arr: any[], options: IOptions = {})
{
	options = Object.assign({
		retry: 3,
		delay: 1000,
	}, options);

	let libRequest = options.libRequest || request;

	return Bluebird
		.mapSeries(url_arr, function (url)
		{
			if (url.href)
			{
				url = url.href;
			}

			// @ts-ignore
			return libRequest(url.toString(), options);
		})
		.tapCatch(function (err)
		{
			console.error(err);
		})
		;
}
