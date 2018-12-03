import newsTemplate from '../views/news';
import "../css/news.css";

class News {
	constructor(el) {
	  this.container = el;
	  this.loadingBar = document.getElementById('news-loading-bar');
	  this.titleEl = document.getElementById('news-title');
	}
	render(items) {
		let html = items.map((item, i) => newsTemplate.template(item, i)).join('');
		this.container.innerHTML = html;
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