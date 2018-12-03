import { apiParams } from '../params';
import app from './app';
import filterTpl from '../views/filter';

class Filter {
	constructor(el) {
	  this.container = el;
	}
	init(items) {
	  this.render(items);
	  this.changeListener();
	}
	render(items) {
	  let html = items.map(item => {
			let selectedOption = apiParams.defaultParams[item.name];
			let options = this.renderOptions(item.list, selectedOption);
			return filterTpl.template(item.name, options);
		}).join('');
	  this.container.innerHTML = html;
	}
	renderOptions(options, selectedOption) {
	  return filterTpl.option('all', selectedOption) + options.map(option => filterTpl.option(option, selectedOption)).join('');
	}
	updateSelect(el, options) {
	  el.innerHTML = this.renderOptions(options);
	}
	changeListener() {
	  this.container.addEventListener('change', this.changeHandler, true);
	}
	changeHandler(e) {
	  let select = e.target;
	  if(select.classList.contains('styled-inp')){
			let type = select.dataset.type;
			apiParams.defaultParams[type] = select.value;
			if (type !== 'sources') {
				apiParams.defaultParams.sources = 'all';
				app.getSources();
			};
			app.getNews();
	  };
	}
}

export default new Filter(document.getElementById('filter-container'));