class Filter {
	template(itemName, options) {
		return `
		  <div class="col filter__item">
			<select class="styled-inp" id="${itemName}-select" data-type="${itemName}">${options}</select>
		  </div>
		`;
	}
	option(option, selected = false) {
		let isSource = typeof option !== 'string';
		return `<option value="${isSource ? option.id : option}" ${option === selected ? 'selected' : ''}>${isSource ? option.name : option}</option>`;
	}
}
export default new Filter();