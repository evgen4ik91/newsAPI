export let apiParams = {
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
  