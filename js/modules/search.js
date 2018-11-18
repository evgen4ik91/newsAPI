export class Search {
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
		  handlers.getNews(apiParams.queryTypes[1],elemVal);
		};
	  }, 1000, elemVal);
	}
}