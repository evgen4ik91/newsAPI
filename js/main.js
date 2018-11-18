import '@babel/polyfill';
import 'whatwg-fetch';

import { apiParams } from './params';
import { ErrorMsg } from './modules/error';
import { Handlers } from './modules/handlers';
import { Search } from './modules/search';
import { Filter } from './modules/filter';
import { News } from './modules/news';

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