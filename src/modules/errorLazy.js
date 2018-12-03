import { apiParams } from '../params';

class ErrorLazy {
	getModule() {
		return import(/* webpackChunkName: "error" */ './error').then(module => this.module = module.default);
	}
	show(msg) {
		this.getModule()
			.then(() => this.module.show(msg))
			.catch(e => alert(msg.text));
		apiParams.errorIsVisible = true;
	}
	hide() {
		this.getModule()
			.then(() => this.module.hide())
			.catch(e => console.log('err module is not loaded'));
		apiParams.errorIsVisible = false;
	}
}

export default new ErrorLazy();