import { apiParams } from '../params';
import handlers from './handlers';

class Filter {
	constructor(el) {
	  this.container = el;
	}
	init(items) {
	  this.render(items);
	  this.changeListener();
	}
	render(items) {
	  let html = items.map(item => this.template(item)).join('');
	  this.container.innerHTML = html;
	}
	template(item) {
	  let selectedOption = apiParams.defaultParams[item.name];
	  let options = this.renderOptions(item.list, selectedOption);
	  return `
		<div class="col filter__item">
		  <select class="styled-inp" id="${item.name}-select" data-type="${item.name}">${options}</select>
		</div>
	  `;
	}
	renderOptions(options, selectedOption) {
	  return this.optionTemplate('all', selectedOption) + options.map(option => this.optionTemplate(option, selectedOption)).join('');
	}
	optionTemplate(option, selected = false) {
	  let isSource = typeof option !== 'string';
	  return `<option value="${isSource ? option.id : option}" ${option === selected ? 'selected' : ''}>${isSource ? option.name : option}</option>`;
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
		  handlers.getSources();
		};
		news.getNews();
	  };
	}
}

export default new Filter(document.getElementById('filter-container'));