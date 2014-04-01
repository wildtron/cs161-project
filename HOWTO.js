/**
	How to create a preymwerk-compatible model:

	let's say we'll create a dog model
 */

Dog = function () {
	// preymwerk uses this for program caching
	this.name = 'dog';

	// uProjection and uView are used by the camera
	// always use them for positioning your model
	this.vertexSource = '\
		attribute vec3 aPosition;\
		uniform mat4 uModel;\
		uniform mat4 uView;\
		uniform mat4 uProjection;\
		void main() {\
			gl_Position = uProjection * uView * uModel * vec4(aPosition, 1);\
			...\
		}\
	';

	this.fragmentSource = '\
		void main() {\
			...\
		}\
	';

	// hook function, this will be called by the preymwerk.
	// gl and program will be passed
	// THIS IS IMPORTANT: Let the camera setup view matrix, and projection matrix, don't mind it
	this.draw = function (gl, program) {
		// define variables with var
		// bind buffers
		// setup model
		// normals
		// set-up light and material parameters
		// draw object
	};
};

/**
	save to js/models/dog.js
	edit test.html

	add this:
	<script type="text/javascript" src="js/models/dog.js"></script>

	edit the last script on test.html
	// create a dog object

	var dog = new Dog();

	// finally, add to scene
	scene.addObject(dog);
 */
