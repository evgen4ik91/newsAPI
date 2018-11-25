import {apiParams} from './params';
import handlers from './modules/handlers';
import search from './modules/search';
import filter from './modules/filter';


search.init();
filter.init(apiParams.filterItems);

handlers.getSources();
handlers.getNewsBtnListener();

import "./css/styles.css";