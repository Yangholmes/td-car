function messageBox(style){
	this.style = style;
	this._render();
}
messageBox.prototype = {

	/**
	 * [覆盖住整个页面的半透明遮罩]
	 * @type {[DOM]}
	 */
	maskHTML: `<div class="translucent-mask"></div>`,
	maskStyle: { width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, background: 'rgba(10, 0, 0, .5)', 'z-index': 100 },

	/**
	 * [messageBox框架]
	 * @type {[DOM]}
	 */
	frameHTML: `<div class="message-box-frame"></div>`,
	frameStyle: { width: 'calc( 100% - 60px )', height: 'auto', position: 'fixed', background: 'white', 'z-index': 101, left: 'calc( 0px + 30px )', top: '30%', 'border-radius': '5px', 'box-shadow': 'rgb(125, 125, 125) 1px 1px 10px 0px', 'font-family': '"Microsoft Yahei", "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif' },

	/**
	 * [messageBox消息部分]
	 * @type {[DOM]}
	 */
	messageHTML: `<div class="message-box-msg"></div>`,
	messageStyle: { padding: '2em 1.5em', 'color': 'rgba(50, 50, 50, 1)', 'border-bottom': '1px solid rgba(150, 150, 150, .2)', 'max-height': '10em', overflow: 'scroll' },

	/**
	 * [messageBox消息标题]
	 * @type {[DOM]}
	 */
	titleHTML: `<div class="message-box-msg-title"> ${this.titleText} </div>`,
	titleStyle: {},
	titleContext: '注意',

	/**
	 * [messageBox消息内容]
	 * @type {[DOM]}
	 */
	contextHTML: `<div class="message-box-msg-context"> ${this.contextContext} </div>`,
	contextStyle: {},
	contextContext: '',

	/**
	 * [messageBox按钮]
	 * @type {[DOM]}
	 */
	buttonHTML: `<div class="message-box-button"></div>`,
	buttonStyle: { 'text-align': 'center', padding: '0.2em .2em', height: '2em', 'line-height': '2em', '-webkit-user-select': 'none', 'color': 'rgba(13, 128, 226, 1)' },

	/**
	 * [messageBox取消按钮]
	 * @type {[DOM]}
	 */
	cancelHTML: `<div class="message-box-button-cancel"> ${this.cancelText} </div>`,
	cancelStyle: {},
	cancelText: '不',

	/**
	 * [messageBox确定按钮]
	 * @type {[DOM]}
	 */
	confirmHTML: `<div class="message-box-button-confirm"> ${this.confirmText} </div>`,
	confirmStyle: {},
	confirmText: '嗯',

	/**
	 * [render funcition]
	 * @return {[function]} [description]
	 */
	_render () {
		_renderFrame();
		_render();
	}
};
