import { apiParams } from '../params';
import errorModule from './errorLazy';

class Fetcher {
	constructor(method = 'GET', type) {
		this.type = type;
		this.method = this.checkMethod(method);
		return this.proxyInit(this.fetchData);
	}

	proxyInit(func) {
		return new Proxy(func, {
			apply: (target, thisArg, argumentsList) => {
				console.log('Fetcher was called');
				return target.call(this, ...argumentsList);
			}
		});
	}

	checkMethod(method) {
		switch(method.toUpperCase()) {
			case 'GET': return method;
			case 'POST': return method;
			default: return 'GET';
		};
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
		return `${apiParams.url}${type}?${query}apiKey=${apiParams.apiKey}`;
	}
	async fetchData(param) {
		if (apiParams.errorIsVisible) errorModule.hide();
		let err = apiParams.errorMessages.nothing;
		try {
			let response = await fetch(this.queryConstructor(this.type, param), {method: this.method});
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

export default Fetcher;