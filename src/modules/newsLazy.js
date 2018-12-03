import errorModule from './errorLazy';

class NewsLazy {
	getModule() {
		return import(/* webpackChunkName: "news" */ './news')
			.then(module => {
				return module.default;
			})
			.catch(e => {
				errorModule.show(apiParams.errorMessages.newsNotLoaded);
				throw new Error('news module load failed');
			});
	}
}

export default new NewsLazy();