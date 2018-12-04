import { apiParams } from '../params';
import filter from './filter';
import Fetcher from './fetcher';
import newsModule from './newsLazy';
import errorModule from './errorLazy';

const fetchNewsFilter = new Fetcher('GET', apiParams.queryTypes[0].code);
const fetchNewsSearch = new Fetcher('GET', apiParams.queryTypes[1].code);
const fetchSources = new Fetcher('GET', apiParams.queryTypes[2].code);

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
			let newsItems = type.code === apiParams.queryTypes[0].code ? await fetchNewsFilter(params) : await fetchNewsSearch(params);
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