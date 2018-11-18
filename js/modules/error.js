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

export default new ErrorMsg(document.getElementById('error-msg'));