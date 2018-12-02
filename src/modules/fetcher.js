import { apiParams } from '../params';
import errorModule from './errorLazy';

class Fetcher {
	constructor(type) {
		this.type = type;
	}
	queryItem(param, value) {
		return `${param}=${value}&`;
	}
	queryConstructor(type, params) {
		let query = '';
		if (typeof params !== 'string') {
			for (let param in params) {
				let value = params[param];
				let sources = apiParams.filterItems[3].name;
				if (params[sources] === 'all') {
					if (value !== 'all') query = `${query}${this.queryItem(param, value)}`;
				} else if (param === sources) {
					query = `${query}${this.queryItem(param, value)}`;
				};
			};
			if (query === '') query = `${query}${this.queryItem('category', 'general')}`;
		} else {
			query = `${query}${this.queryItem('q', params)}`;
		};
		return `${apiParams.url}${type.code}?${query}apiKey=${apiParams.apiKey}`;
	}
	async fetcher(url) {
		errorModule.hide();
		let err = apiParams.errorMessages.nothing;
		try {
			let response = await fetch(url);
			if (response.ok) {
				let status = response.status;
				if (status === 200) {
					response = await response.json();
				} else {
					if (status === 429) err = apiParams.errorMessages.limitReached;
					if (status === 400) err = apiParams.errorMessages.badRequest;
					errorModule.show(err);
				};
			};
			return response.articles || response.sources;
		} catch (e) {
			console.log(e);
			errorModule.show(err);
		}
	}
}