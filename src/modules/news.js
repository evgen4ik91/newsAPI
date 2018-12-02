import { apiParams } from '../params';

class News {
	constructor(el) {
	  this.container = el;
	  this.loadingBar = document.getElementById('news-loading-bar');
	  this.titleEl = document.getElementById('news-title');
	}
	render(items) {
		let html = items.map((item, i) => this.template(item, i)).join('');
		this.container.innerHTML = html;
	}
	template(item, i) {
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
	setTitle(title) {
	  this.titleEl.innerHTML = title;
	}
	loading(bool) {
	  let loadingBarClasses = this.loadingBar.classList;
	  let className = 'visible';
	  if (bool) {
			this.container.innerHTML = '';
			loadingBarClasses.add(className)
	  } else {
			loadingBarClasses.remove(className);
	  };
	}
	imgIsLoaded(e) {
	  let img = e.target;
	  if(img.classList.contains('news__item-img')){
			img.parentElement.classList.remove('loading');
	  };
	}
	imgLoadListener() {
	  this.container.addEventListener('load', this.imgIsLoaded, true);
	}
}

export default new News(document.getElementById('news-container'));