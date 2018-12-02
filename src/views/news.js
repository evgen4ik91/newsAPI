class News {
	template(item, i = 0) {
		let imgURL = item.urlToImage;
		return `
		  <div class="news__item" style="animation-delay: ${i * 50}ms">
			<div class="row news__item-container">
			  <div class="col news__item-img-col">
				<a class="news__item-img-container loading ${imgURL ? '' : 'no-img'}" href="${item.url}">
				  <img class="news__item-img"  src="${imgURL ? imgURL : 'img/picture.svg'}" alt="${item.title}"/>
				</a>
			  </div>
			  <div class="col news__item-content">
				<p class="news__item-title">
				  <a href="${item.url}">${item.title}</a>
				</p>
				${item.description ? `<p class="news__item-descr">${item.description}</p>` : ``}
				${item.author ? `<p class="news__item-author">${item.author}</p>` : ``}
			  </div>
			</div>
		  </div>
		`;
	}
}

export default new News();