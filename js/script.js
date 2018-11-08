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

let handlers = {
  queryConstructor(type, params) {
    let query = CONST.url + type.code + '?';
    if (typeof params !== 'string') {
        let startPos = params[3] === 'all' ? 0 : 3;
        for (let i = startPos; i < params.length; i ++) {
            let param = params[i];
            if ((param !== 'all')&&(param !== null)) {
                query += `${CONST.filterItems[i].name}=${param}&`;
            };
        };
    } else {
        query += `q=${params}&`;
    };
    return query + 'apiKey=' + CONST.apiKey;
  },
  fetcher(url) {
    let self = this;
    return new Promise ((resolve,reject)=>{
      fetch(url)
        .then( response => {
            return response.ok ? response.json() : reject(response);
        }).then(res => {
        if (res.sources) {
            resolve(res.sources);
        } else if (res.articles) {
            resolve(res.articles);
        }
      }).catch( e => {
        //console.error(e);
      });
    }).catch( e => {
        this.setState({
            errorMsg: e.status + ' ' + (e.status === 429 ? 'Requests limit has been reached': 'Nothing to show')
        })
    });
  }
}