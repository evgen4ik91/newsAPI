import {apiParams} from './params';
import app from './modules/app';
import search from './modules/search';
import filter from './modules/filter';
import './css/styles.css';
import './test.json';

search.init();
filter.init(apiParams.filterItems);

app.getSources();
