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
					var news = module.default;
					thisBtn.parentNode.classList.add('hidden');
					news.imgLoadListener();
					news.getNews();
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