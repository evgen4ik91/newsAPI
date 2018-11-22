import {apiParams} from './params';
import handlers from './modules/handlers';
import search from './modules/search';
import filter from './modules/filter';
import news from './modules/news';

search.init();
filter.init(apiParams.filterItems);
news.imgLoadListener();
handlers.getSources();
handlers.getNews();