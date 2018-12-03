import { apiParams } from '../params';
import app from './app';

class Search {
	constructor(el) {
	  this.el = el;
	  this.keyTimeout = null;
	} 
	init() {
	  this.el.addEventListener('keyup', this.keyupHandler);
	}
	keyupHandler (e) {
	  let elem = e.target;
	  let elemVal = elem.value.toString();
	  if (this.keyTimeout !== null) clearTimeout(this.keyTimeout);
	  this.keyTimeout = setTimeout(() => {
		if (elemVal.length >= 3) {
		  app.getNews(apiParams.queryTypes[1],elemVal);
		};
	  }, 1000, elemVal);
	}
}

export default new Search(document.getElementById('search-input'));