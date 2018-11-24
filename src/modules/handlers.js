import { apiParams } from '../params';
import errorMsg from './error';
import filter from './filter';

class Handlers {
	queryItem(param, value) {
	  return `${param}=${value}&`;
	}
	queryConstructor(type, params) {
	  //news.setTitle(type.name);
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
	  errorMsg.hide();
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
			errorMsg.show(err);
		  };
		};
		return response.articles || response.sources;
	  } catch (e) {
		console.log(e);
		errorMsg.show(err);
	  }
	}
	async getNews(type = apiParams.queryTypes[0], params = apiParams.defaultParams) {
	  //news.loading(true);
	  try {
		let newsItems = await this.fetcher(this.queryConstructor(type, params));
		//news.loading(false);
		//news.render(newsItems);
	  } catch (e) {
		console.log('Cannot get news')
	  }
	}
	async getSources(type = apiParams.queryTypes[2], params = apiParams.defaultParams) {
	  let sourcesEl = document.getElementById('sources-select');
	  sourcesEl.disabled = true;
	  try {
		let sources = await this.fetcher(this.queryConstructor(type, params));
		filter.updateSelect(sourcesEl, sources);
		sourcesEl.disabled = false;
	  } catch (e) {
		console.log('Cannot get sources')
	  }
	}
}

export default new Handlers();