import { apiParams } from '../params';
import filter from './filter';
import Fetcher from './fetcher';
import errorLazy from './errorLazy';

const fetchSources = new Fetcher(apiParams.queryTypes[2].code);
const fetchNews = new Fetcher(apiParams.queryTypes[0].code);

class Handlers {
	constructor () {
		this.newsModule = null;
	}
	async getNews(type = apiParams.queryTypes[0], params = apiParams.defaultParams) {
		if (this.newsModule != null) {
			this.newsModule.loading(true);
			this.newsModule.setTitle(type.name);
			try {
				let newsItems = await this.fetcher(this.queryConstructor(type, params));
				this.newsModule.loading(false);
				if (newsItems.length) {
					this.newsModule.render(newsItems);
				} else {
					errorModule.show(apiParams.errorMessages.nothing);
				}
			} catch (e) {
				console.log('Cannot get news')
			}
		} else {
			errorModule.show(apiParams.errorMessages.newsNotLoaded);
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
			console.log('Cannot get sources');
	  }
	}
	getNewsBtnListener() {
		document.getElementById('show-news').addEventListener('click', e => {
			console.log(errorLazy.then(res => res));
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