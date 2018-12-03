import { apiParams } from '../params';
import filter from './filter';
import Fetcher from './fetcher';
import errorModule from './errorLazy';

const fetchNewsFilter = new Fetcher(apiParams.queryTypes[0].code);
const fetchNewsSearch = new Fetcher(apiParams.queryTypes[1].code);
const fetchSources = new Fetcher(apiParams.queryTypes[2].code);

class Handlers {
	constructor () {
		this.newsModule = null;
	}
	async getNews(type = apiParams.queryTypes[0], params = apiParams.defaultParams) {
		try {
			if (this.newsModule == null) await this.getNewsModule();
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
	async getNewsModule() {
		await import(/* webpackChunkName: "news" */ './news')
			.then(module => {
				this.newsModule = module.default;
				this.newsModule.imgLoadListener();
			})
			.catch(e => {
				errorModule.show(apiParams.errorMessages.newsNotLoaded);
				throw new Error('news module load failed');
			});
	}
}

export default new Handlers();