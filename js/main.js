import '@babel/polyfill';
import 'whatwg-fetch';

import './params';
import './modules/error';
import './modules/handlers';
import './modules/search';
import './modules/filter';
import './modules/news';

let errorMsg = new ErrorMsg(document.getElementById('error-msg'));
let handlers = new Handlers();
let search = new Search(document.getElementById('search-input'));
let filter = new Filter(document.getElementById('filter-container'));
let news = new News(document.getElementById('news-container'));

search.init();
filter.init(apiParams.filterItems);
news.imgLoadListener();
handlers.getSources();
handlers.getNews();