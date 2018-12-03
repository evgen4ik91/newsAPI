import { apiParams } from '../params';
import filter from './filter';
import fetchFactory from './fetcher';
import errorModule from './errorLazy';

const fetchSources = new fetchFactory(apiParams.queryTypes[2].code);
const fetchNews = new fetchFactory(apiParams.queryTypes[0].code);

class Handlers {
	constructor () {
		this.newsModule = null;
	}
	async getNews(type = apiParams.queryTypes[0], params = apiParams.defaultParams) {
		try {
			if (this.newsModule == null) await this.getNewsModule();
			this.newsModule.loading(true);
			this.newsModule.setTitle(type.name);
			let newsItems = await fetchNews(params);
			this.newsModule.loading(false);
			if (newsItems.length) {
				this.newsModule.render(newsItems);
			} else {
				errorModule.show(apiParams.errorMessages.nothing);
			}
		} catch (e) {
			console.log('Cannot get news');
		}
	}
	async getSources(type = apiParams.queryTypes[2], params = apiParams.defaultParams) {
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
	getNewsModule() {
		return import(/* webpackChunkName: "news" */ './newsLazy').catch(e => {
			errorModule.show(apiParams.errorMessages.newsNotLoaded);
			throw new Error('news module load failed');
		});
	}
}

export default new Handlers();