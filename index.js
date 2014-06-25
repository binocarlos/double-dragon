var Preloader = require('preloader');
var Emitter = require('emitter');


function DoubleDragon(){
	Emitter.call(this);
	this._imgs = [];
	this._currentindex = 0;
	this.fps(30);
}

Emitter(DoubleDragon.prototype);

DoubleDragon.prototype.fps = function(fps){
	this._fps = fps || 1;
	this._delay = 1000 / this._fps;
}

DoubleDragon.prototype.playOnce = function(direction, done){
	var self = this;
	if(arguments.length<=1){
		done = direction;
		direction = 1;
	}

	this.start(1, function(index){
		return index<=self._imgs.length;
	})
}


DoubleDragon.prototype.play = function(direction){
	direction = direction || 1;

	this.start();
}

DoubleDragon.prototype.addFrame = function(direction){
	direction = direction || 1;
	this._currentindex += direction;

	if(direction>0){
		if(this._currentindex>=this._imgs.length){
			this._currentindex = 0;
		}
	}
	else{
		if(this._currentindex<0){
			this._currentindex = this._imgs.length-1;
		}
	}
}


DoubleDragon.prototype.start = function(direction, fn){
	var self = this;

	fn = fn || function(){ return true; }
	direction = direction || 1;

	var totalcount = 0;

	function nextframe(){
		if(!fn(totalcount)){
			return;
		}

		self._animtimeout = setTimeout(function(){
			self.addFrame(direction);
			totalcount++;
			self.showFrame(self._currentindex);
			nextframe();
		}, self._delay);	
	}

	this.emit('play');

	nextframe();
	
}

DoubleDragon.prototype.stop = function(direction){
	if(this._animtimeout){
		clearTimeout(this._animtimeout);
	}

	this.emit('stop');
}

DoubleDragon.prototype.showFrame = function(index){
	
	if(this._visibleimg){
		this._visibleimg.style.opacity = 0
		//this._visibleimg.style.visibility = 'hidden';
		//this._visibleimg.style.display = 'none';
	}
	this._currentindex = index;
	this._visibleimg = this._imgs[this._currentindex];
	this._visibleimg.style.opacity = 1
	//this._visibleimg.style.visibility = 'visible';
	//this._visibleimg.style.display = 'block';

	if(index==0){
		this.emit('begin');
	}
	this.emit('frame', this._currentindex);
}

DoubleDragon.prototype.render = function(elem){

	var self = this;

	this._loader.urls.forEach(function(url){

		var img = new Image;
    img.src = url;
    img.style.position = 'absolute';
    img.style.opacity = 0
    //img.style.visibility = 'hidden';
    //img.style.display = 'none';
    self.emit('position', img);
    elem.appendChild(img);
		self._imgs.push(img);
	})

	this.emit('render', elem);

	this.showFrame(0);
	
}

DoubleDragon.prototype.load = function(opts){
	var self = this;
	opts = opts || {};
	var from = opts.from || 0;
	var to = opts.to || 0;
	var imagepath = opts.imagepath || function(num){
		return null;
	}

	this._loader = new Preloader;

	for(var i=from; i<=to; i++){
		var path = imagepath(i);
		if(path){
			this._loader.add(path);			
		}
	}

	this._loader.on('progress', function(e){
		self.emit('progress', e.percent);
	})
	
	this._loader.end(function(){
		self.emit('loaded');
	})
}

module.exports = function(){
	return new DoubleDragon();
}