import { apiParams } from '../params';
import filter from './filter';
import Fetcher from './fetcher';
import newsModule from './newsLazy';
import errorModule from './errorLazy';

let FetcherProxy = new Proxy(Fetcher, {
	construct: (target, argumentsList) => {
		console.log(`Fetcher with args: ${argumentsList}`);
		return new target(...argumentsList);
	}
});

const fetchNewsFilter = new FetcherProxy('GET', apiParams.queryTypes[0].code);
const fetchNewsSearch = new FetcherProxy('GET', apiParams.queryTypes[1].code);
const fetchSources = new FetcherProxy('GET', apiParams.queryTypes[2].code);

let fetchNewsProxy = new Proxy(fetchNewsFilter, {
	apply: (target, thisArg, argumentsList) => {
		console.log('Fetcher was called');
		return target(...argumentsList);
	}
});

class App {
	constructor() {
		this.newsModule = null;
	}
	async getNews(type = apiParams.queryTypes[0], params = apiParams.defaultParams) {
		try {
			if (this.newsModule == null) {
				this.newsModule = await newsModule.getModule();
				this.newsModule.imgLoadListener();
			}
			this.newsModule.loading(true);
			this.newsModule.setTitle(type.name);
			let newsItems = type.code === apiParams.queryTypes[0].code ? await fetchNewsProxy(params) : await fetchNewsSearch(params);
			this.newsModule.loading(false);
			if (newsItems.length) {
				this.newsModule.render(newsItems);
			} else {
				errorModule.show(apiParams.errorMessages.nothing);
			}
		} catch (e) {
			console.log('Cannot get news', e);
		}
	}
	async getSources(params = apiParams.defaultParams) {
		let sourcesEl = document.getElementById('sources-select');
		sourcesEl.disabled = true;
		try {
			let sources = await fetchSources(params);
			filter.updateSelect(sourcesEl, sources);
			sourcesEl.disabled = false;
		} catch (e) {
			console.log('Cannot get sources');
		}
	}
}

export default new App();