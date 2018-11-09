var apiParams = {
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
  defaultParams: [
    'us',
    'en',
    'all',
    'all'
  ],
  filterItems: [
    {
      id: 1,
      name: 'country',
      list: ['ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za']
    },
    {
      id: 2,
      name: 'language',
      list: ['ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'se', 'ud', 'zh']
    },
    {
      id: 3,
      name: 'category',
      list: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
    },
    {
      id: 4,
      name: 'sources',
      list: []
    }
  ]
}

var search = {
  el: document.getElementById('search-input'),
  keyTimeout: null,
  init() {
    this.el.addEventListener('keyup', this.keyupHandler);
  },
  keyupHandler (e) {
    let elem = e.target;
    let elemVal = elem.value + '';
    if (this.keyTimeout !== null) clearTimeout(this.keyTimeout);
    this.keyTimeout = setTimeout(() => {
      if (elemVal.length >= 3) {
        handlers.getNews(apiParams.queryTypes[1],elemVal);
      };
    }, 1000, elemVal);
  }
}

var filter = {
  container: document.getElementById('filter-container'),
  init(items) {
    this.render(items);
  },
  render(items) {
    let html = items.map((item, i) => this.template(item, i)).join('');
    this.container.innerHTML = html;
  },
  template(item, i) {
    let options = item.list.map(option => `<option value="${option}" ${option === apiParams.defaultParams[i] ? 'selected' : ''}>${option}</option>`).join('');
    return `
      <div class="col filter__item">
        <select class="styled-inp">${options}</select>
      </div>
    `;
  }
}

var news = {
  container: document.getElementById('news-container'),
  titleEl: document.getElementById('news-title'),
  render(items) {
    let html = items.map((item, i) => this.template(item, i)).join('');
    this.container.innerHTML = html;
  },
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
  },
  setTitle(title) {
    this.titleEl.innerHTML = title;
  }
}

var handlers = {
  queryConstructor(type, params) {
    news.setTitle(type.name);
    let query = `${apiParams.url + type.code}?`;
    if (typeof params !== 'string') {
        let startPos = params[3] === 'all' ? 0 : 3;
        for (let i = startPos; i < params.length; i ++) {
          let param = params[i];
          if ((param !== 'all')&&(param !== null)) {
              query += `${apiParams.filterItems[i].name}=${param}&`;
          };
        };
        
    } else {
      query += `q=${params}&`;
    };
    return `${query}apiKey=${apiParams.apiKey}`;
  },
  fetcher(url) {
    return fetch(url)
      .then((response, reject) => {
        return response.ok ? response.json() : reject(response);
      }).then(res => {
        if (res.sources) {
          return res.sources;
        } else if (res.articles) {
          return res.articles;
        }
      }).catch( e => {
        console.error(e.status + ' ' + (e.status === 429 ? 'Requests limit has been reached': 'Nothing to show'));
      });
  },
  getNews(type, params) {
    this.fetcher(this.queryConstructor(type, params)).then(newsItems => news.render(newsItems));
  }
}

var mainInit = {
  init() {
    search.init();
    filter.init(apiParams.filterItems);
    handlers.getNews(apiParams.queryTypes[0],apiParams.defaultParams);
  }
}

mainInit.init();