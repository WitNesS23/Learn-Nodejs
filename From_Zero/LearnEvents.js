// 调用events模块，获取events.EventEmitter对象
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

/*
	EventEmitter.on(event, listener) 为事件注册一个监听
	参数1： event 字符串，事件名称
	参数2： 回调函数
 */
ee.on('some_event', function(){
	console.log(arguments[0] + ' emit the first event');
	// here 'this' attached to the 'ee'
});

ee.on('some_event', function(){
	setImmediate(function(){
		console.log('this emit the second event');
	});
});

console.log('one step');
ee.emit('some_event', 'the first person:');

console.log('two step');
ee.emit('some_event', 'the second person:');

/*
	the following won't be emitted
 */

ee.once('some_event', function(){
	// if use .once() function, this listener just be emitted only once.
});
