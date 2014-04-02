double-dragon
=============

Sprite library for old skool stop frame animation made from a sequence of images

Used for when a single sprite sheet is not an option.

## installation

```
$ component install binocarlos/double-dragon
```

## usage

```js
var dd = require('double-dragon');

var sprite = dd();

// triggered when all images have pre-loaded
sprite.on('loaded', function(){

	// render the sprite
	sprite.render(document.getElementById('spriteholder'));

	// set the frames per second
	sprite.fps(15);

	// play it once
	sprite.playOnce(function(){

		// it has finished playing

		// play repeatedly for 5 seconds
		sprite.play();

		setTimeout(function(){
			sprite.stop();
		}, 5000)
	})
})

// will load 16 images from '/spriteimgs/sprite1.png' -> '/spriteimgs/sprite16.png'
sprite.load({
	imagepath:function(number){
		return '/spriteimgs/sprite' + number + '.png';
	},
	from:1,
	to:16
})
```

## api

### var sprite = dd()

create a new sprite object

### sprite.load(opts)

load the images for the sprite - opts is an object:

 * imagepath - a function that is passed the image index and should return the path to the image#
 * from - the starting index for the sequence
 * to - the ending index for the sequence

### sprite.fps(frames_per_second)

set the frames per second for the playback

### sprite.playOnce(done)

play the animation once and trigger the callback when finished

### sprite.play()

repeatedly play the animation

### sprite.stop()

stop the animation

## events

### sprite.on('progress', function(percent){})

'progress' is emitted as the images are loaded - it will tell you the percentage complete

### sprite.on('loaded', function(){})

'loaded' is emitted once all images are loaded

### sprite.on('render', function(){})

'render' is emitted once the sprite has been rendered to a document element

### sprite.on('play', function(){})

'play' is emitted whenever the sprite beings to play

### sprite.on('begin', function(){})

'begin' is emitted whenever the sprite hits frame 1

### sprite.on('frame', function(index){})

'frame' is emitted whenever the sprite changes frame

### sprite.on('stop', function(){})

'stop' is emitted whenever the sprite stops playing

## license

MIT