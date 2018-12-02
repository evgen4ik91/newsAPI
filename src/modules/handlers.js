import { apiParams } from '../params';
import filter from './filter';

class Handlers {
	constructor () {
		this.newsModule = null;
		this.errModule = null;
	}
	showError(msg) {
		if (this.errModule == null) {
			import(/* webpackChunkName: "error" */ './error')
				.then(module => {
					this.errModule = module.default;
					this.errModule.show(msg);
				}).catch(e => {
					console.log(e);
				});
		} else {
			this.errModule.show(msg);
		}
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
	  if (this.errModule != null) this.errModule.hide();
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
					
					this.showError(err);
				};
			};
			return response.articles || response.sources;
	  } catch (e) {
			console.log(e);
			this.showError(err);
	  }
	}
	async getNews(type = apiParams.queryTypes[0], params = apiParams.defaultParams) {
		if (this.newsModule != null) {
			this.newsModule.loading(true);
			try {
				let newsItems = await this.fetcher(this.queryConstructor(type, params));
				this.newsModule.loading(false);
				if (newsItems.length) {
					this.newsModule.render(newsItems);
				} else {
					this.showError(apiParams.errorMessages.nothing);
				}
			} catch (e) {
				console.log('Cannot get news')
			}
		} else {
			this.showError(apiParams.errorMessages.newsNotLoaded);
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
					this.getNews();
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