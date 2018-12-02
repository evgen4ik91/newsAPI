class ErrorLazy {
	constructor() {
		this.module = null;
	}
	show(msg) {
		if (this.module == null) {
			import(/* webpackChunkName: "error" */ './error')
				.then(module => {
					this.module = module.default;
					this.module.show(msg);
				}).catch(e => {
					alert(msg.text);
				});
		} else {
			this.module.show(msg);
		}
	}
	hide() {
		if (this.module == null) this.module.show(msg);
	}
}

export default new ErrorLazy();