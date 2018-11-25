import { apiParams } from '../params';
import errorMsg from './error';
import filter from './filter';

class Handlers {
	constructor () {
		this.newsModule = null;
	}
	queryItem(param, value) {
	  return `${param}=${value}&`;
	}
	queryConstructor(type, params) {
		if (this.newsModule != null) this.newsModule.setTitle(type.name);
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
		if (this.newsModule != null) {
			this.newsModule.loading(true);
			try {
				let newsItems = await this.fetcher(this.queryConstructor(type, params));
				this.newsModule.loading(false);
				this.newsModule.render(newsItems);
			} catch (e) {
				console.log('Cannot get news')
			}
		} else {
			errorMsg.show(apiParams.errorMessages.newsNotLoaded);
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
	getNewsBtnListener() {
		let context = this;
		document.getElementById('show-news').addEventListener('click', e => {
			let loadingClass = 'loading';
			let thisBtn = e.target;
			thisBtn.classList.add(loadingClass);
			thisBtn.innerHTML = 'Loading...';
			import(/* webpackChunkName: "news" */ '../news')
				.then(module => {
					this.newsModule = module.default;
					thisBtn.parentNode.classList.add('hidden');
					this.newsModule.imgLoadListener();
					context.getNews();
				}).catch(e => {
					console.log(e);
					thisBtn.innerHTML = 'Loading failed';
					setTimeout(()=>{
						thisBtn.classList.remove(loadingClass);
						thisBtn.innerHTML = 'Try again';
					}, 3000);
				});
		});
	}
}

export default new Handlers();