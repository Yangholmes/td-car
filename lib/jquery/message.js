
/**
 * td-alert
 */
jQuery.tdAlert = function(msg, callback, title){
	var tdAlert = new MessageBox(0, title?title:'注意', msg, callback);
	return true;
};
/**
 * td-confirm
 */
jQuery.tdConfirm = function(msg, callback, title) {
	var tdConfirm = new MessageBox(1, title?title:'提示', msg, callback);
	return true;
};

/**
 * Message Class
 */
function MessageBox(type, title, message, callback){
	this.type = type;
	this.setTitleContext( title );
	this.setContextContext( message );
	this.setCallback( callback );
	this._render();
}
MessageBox.prototype = {

	/**
	 * 0=>alert
	 * 1=>comfirm
	 * 2=>prompt
	 * @type {Number}
	 */
	type: 0,

	/**
	 * [覆盖住整个页面的半透明遮罩]
	 * @type {[DOM]}
	 */
	$mask: {},
	maskHTML: `<div class="translucent-mask"></div>`,
	maskStyle: { width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, background: 'rgba(10, 0, 0, .5)', 'z-index': 100 },
	_renderMask () {
		var self = this;
		this.$mask = $(this.maskHTML).css(this.maskStyle)
		.on('touchstart', function(e){
			self.$mask.fadeOut(100);
			self.$frame.fadeOut(100);
		})
		.appendTo($('body'));
	},

	/**
	 * [messageBox框架]
	 * @type {[DOM]}
	 */
	$frame: {},
	frameHTML: `<div class="message-box-frame"></div>`,
	frameStyle: { width: 'calc( 100% - 60px )', height: 'auto', position: 'fixed', background: 'white', 'z-index': 101, left: 'calc( 0px + 30px )', top: '30%', 'border-radius': '5px', 'box-shadow': 'rgb(125, 125, 125) 1px 1px 10px 0px', 'font-family': '"Microsoft Yahei", "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif' },
	_renderFrame () {
		this._renderMessage(); this._renderButton();
		this.$frame =
			$(this.frameHTML).css(this.frameStyle)
			.append(this.$message).append(this.$button)
			.appendTo($('body'));
	},

	/**
	 * [messageBox消息部分]
	 * @type {[DOM]}
	 */
	$message: {},
	messageHTML: `<div class="message-box-msg"></div>`,
	messageStyle: { padding: '2em 1.5em', 'color': 'rgba(50, 50, 50, 1)', 'border-bottom': '1px solid rgba(150, 150, 150, .2)', 'max-height': '10em', overflow: 'scroll' },
	_renderMessage () {
		this._renderTitle(); this._renderContext();
		this.$message =
			$(this.messageHTML).css(this.messageStyle)
			.append(this.$title).append(this.$context);
	},

	/**
	 * [messageBox消息标题]
	 * @type {[DOM]}
	 */
	$title: {},
	titleHTML: `<div class="message-box-msg-title"></div>`,
	titleStyle: { 'text-align': 'center', 'margin-bottom': '1em' },
	titleContext: '提示',
	setTitleContext (msg) { this.titleContext = msg ? this._filter(msg): this.titleContext },
	// get titleContext () { return this._titleContext },
	_renderTitle () {
		this.$title = $(this.titleHTML).css(this.titleStyle).html(this.titleContext);
	},

	/**
	 * [messageBox消息内容]
	 * @type {[DOM]}
	 */
	$context: {},
	contextHTML: `<div class="message-box-msg-context"></div>`,
	contextStyle: {},
	contextContext: '',
	setContextContext (msg) { this.contextContext = msg ?  this._filter(msg) : this.contextContext },
	// get contextContext () { return this.contextContext },
	_renderContext () {
		this.$context = $(this.contextHTML).css(this.contextStyle).html(this.contextContext);
	},

	/**
	 * [messageBox按钮]
	 * @type {[DOM]}
	 */
	$button: {},
	buttonHTML: `<div class="message-box-button"></div>`,
	buttonStyle: { 'text-align': 'center', height: 'auto', '-webkit-user-select': 'none', 'color': 'rgba(13, 128, 226, 1)', display: 'flex' },
	callback () { console.log(arguments) },
	setCallback (callback) {
		if( typeof callback != 'function' )
	 		return false;
		this.callback = callback;
		},
	_renderButton () {
		var self = this;
		this._renderConfirm();
		if( this.type !== 0 )
			this._renderCancel();
		this.$button =
			$(this.buttonHTML).css(this.buttonStyle)
			.append(this.$cancel).append(this.$confirm)
			.on('touchstart', function(e){
				$(e.target).css({
						background: 'rgba(200, 200, 200, 0.3)',
				});
			})
			.on('touchend', function(e){
		    $(e.target).css({
		      background: '',
		    });
		    self.$frame.fadeOut(100);
		    self.$mask.fadeOut(100);
				// self._callback( e.target );
				self.callback(/message-box-button-confirm/.test(e.target.outerHTML));
		  });
	},

	/**
	 * [messageBox取消按钮]
	 * @type {[DOM]}
	 */
	$cancel: {},
	cancelHTML: `<div class="message-box-button-cancel"></div>`,
	cancelStyle: { 'text-align': 'center', width: '100%', height: '2em', 'line-height': '2em', padding: '.2em', 'border-right': '1px solid rgba(150, 150, 150, 0.2)' },
	cancelText: '不',
	_renderCancel () {
		this.$cancel =
			$(this.cancelHTML).css(this.cancelStyle).html(this.cancelText);
	},

	/**
	 * [messageBox确定按钮]
	 * @type {[DOM]}
	 */
	$confirm: {},
	confirmHTML: `<div class="message-box-button-confirm"></div>`,
	confirmStyle: { 'text-align': 'center', width: '100%', height: '2em', 'line-height': '2em', padding: '.2em' },
	confirmText: '嗯',
	_renderConfirm () {
		this.$confirm =
			$(this.confirmHTML).css(this.confirmStyle).html(this.confirmText);
	},

	/**
	 * [message filter]
	 * @param  {[String]} message [description]
	 * @return {[String]}         [description]
	 */
	_filter (message) {
		return message.toString().replace(/(\n)/, '<br>');
	},

	/**
	 * [render funcition]
	 * @return {[function]} [description]
	 */
	_render () {
		// this._filter(titleContext); this._filter(contextContext);
		this._renderMask(); this._renderFrame();
	}
};
