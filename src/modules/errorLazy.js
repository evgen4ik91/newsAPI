class ErrorLazy {
	constructor() {
		this.module = null;
	}
	getModule() {
		return import(/* webpackChunkName: "error" */ './error').then(module => this.module = module.default);
	}
	show(msg) {
		if (this.module == null) {
			this.getModule
				.then(() => this.module.show(msg))
				.catch(e => alert(msg.text));
		} else {
			this.module.show(msg);
		}
	}
	hide() {
		if (this.module == null) {
			this.getModule
				.then(() => this.module.hide())
				.catch(e => console.log('err module is not loaded'));
		} else {
			this.module.hide();
		}
	}
}

export default new ErrorLazy();