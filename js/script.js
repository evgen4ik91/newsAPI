let apiParams = {
  apiKey: '5a67f9304faa41e5b457f84bd54c0a20',
  url: 'https://newsapi.org/v2/',
  queryTypes: [
    {
      name: 'Top headlines',
      code: 'top-headlines'
    },{
      name: 'Search',
      code: 'everything'
    },{
      name: 'Sources',
      code: 'sources'
    }
  ],
  defaultParams: {
    country: 'us',
    language: 'en',
    category: 'all',
    sources: 'all'
  },
  filterItems: [
    {
      name: 'country',
      list: ['ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za']
    },
    {
      name: 'language',
      list: ['ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'se', 'ud', 'zh']
    },
    {
      name: 'category',
      list: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
    },
    {
      name: 'sources',
      list: []
    }
  ],
  errorMessages: {
    nothing: {
      isWarn: false,
      text: 'Nothing to show'
    },
    limitReached: {
      isWarn: true,
      text: 'Requests limit has been reached'
    },
    badRequest: {
      isWarn: true,
      text: 'Bad request'
    }
  }
}

class ErrorMsg {
  constructor(el) {
    this.el = el;
    this.visibleClass = 'visible';
    this.warningClass = 'warn';
  }
  show(msg) {
    let classArr = [this.visibleClass];
    if (msg.isWarn) classArr.push(this.warningClass);
    this.el.innerHTML = msg.text;
    this.el.classList.add(...classArr);
  }
  hide() {
    this.el.classList.remove(this.visibleClass, this.warningClass);
    this.el.innerHTML = '';
  }
}

class Handlers {
  queryItem(param, value) {
    return `${param}=${value}&`;
  }
  queryConstructor(type, params) {
    news.setTitle(type.name);
    let query = '';
    if (typeof params !== 'string') {
      for (let param in params) {
        let value = params[param];
        let sources = apiParams.filterItems[3].name;
        if (params[sources] === 'all') {
          if (value !== 'all') query = `${query}${this.queryItem(param, value)}`;
        } else if (param === sources) {
          query = `${query}${this.queryItem(param, value)}`;
        };
      };
      if (query === '') query = `${query}${this.queryItem('category', 'general')}`;
    } else {
      query = `${query}${this.queryItem('q', params)}`;
    };
    return `${apiParams.url}${type.code}?${query}apiKey=${apiParams.apiKey}`;
  }
  fetcher(url) {
    errorMsg.hide();
    let err = apiParams.errorMessages.nothing;
    return fetch(url)
      .then(response => {
        if (response.ok) {
          let status = response.status;
          if (status === 200) {
            return response.json();
          } else {
            if (status === 429) err = apiParams.errorMessages.limitReached;
            if (status === 400) err = apiParams.errorMessages.badRequest;
            errorMsg.show(err);
          };
        };
      }).then(res => {
        if (res.sources) {
          return res.sources;
        } else if (res.articles) {
          return res.articles;
        }
      }).catch(e => {
        console.log(e);
        errorMsg.show(err);
      });
  }
  getNews(type = apiParams.queryTypes[0], params = apiParams.defaultParams) {
    news.loading(true);
    this.fetcher(this.queryConstructor(type, params))
      .then(newsItems => {
        news.loading(false);
        news.render(newsItems);
      }).catch(e => console.log('Cannot get news'));
  }
  getSources(type = apiParams.queryTypes[2], params = apiParams.defaultParams) {
    let sourcesEl = document.getElementById('sources-select');
    sourcesEl.disabled = true;
    this.fetcher(this.queryConstructor(type, params))
      .then(sources => filter.updateSelect(sourcesEl, sources))
      .catch(e => console.log('Cannot get sources'))
      .then(sourcesEl.disabled = false);
  }
}

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
        handlers.getNews(apiParams.queryTypes[1],elemVal);
      };
    }, 1000, elemVal);
  }
}

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
      handlers.getNews();
    };
  }
}

class News {
  constructor(el) {
    this.container = el;
    this.loadingBar = document.getElementById('news-loading-bar');
    this.titleEl = document.getElementById('news-title');
  }
  render(items) {
    if (items.length) {
      let html = items.map((item, i) => this.template(item, i)).join('');
      this.container.innerHTML = html;
    } else {
      errorMsg.show(apiParams.errorMessages.nothing);
    };
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

let errorMsg = new ErrorMsg(document.getElementById('error-msg'));
let handlers = new Handlers();
let search = new Search(document.getElementById('search-input'));
let filter = new Filter(document.getElementById('filter-container'));
let news = new News(document.getElementById('news-container'));

search.init();
filter.init(apiParams.filterItems);
news.imgLoadListener();
handlers.getSources();
handlers.getNews();