/**
	reference: http://learningwebgl.com/lessons/lesson10/index.html
 */
var Camera = function () {
	var currentlyPressedKeys = {},
		mvMatrix = _mat4.create(),
		pMatrix = _mat4.create(),
		joggingAngle = 0,
		binded = false,
		pitchRate = 0,
		lastTime = 0,
		yawRate = 0,
		// pitch = 1,
		pitch = -90,
		// zPos = 15,
		zPos = 0,
		speed = 0,
		// stage = 0.2,
		// yPos = 1,
		stage = 15,
		yPos = 20,
		xPos = 0,
		yaw = 0;

	this.animate = function (gl, program) {
		this.handleKeys();

		_mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.01, 100.0, pMatrix);
		gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjection'), false, pMatrix);

		_mat4.identity(mvMatrix);
		_mat4.rotate(mvMatrix, util.degToRad(-pitch), [1, 0, 0]);
		_mat4.rotate(mvMatrix, util.degToRad(-yaw), [0, 1, 0]);
		_mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
		gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uView'), false, mvMatrix);

		if (program.lights) {
			// gl.uniform3f(gl.getUniformLocation(program, 'uLightDirection'), -1.0,-2.5,-5);
			gl.uniform3f(gl.getUniformLocation(program, 'uLightDirection'), -xPos, -yPos, -zPos);
		}

		this.update();
	};

	this.render = this.animate;

	this.bindEvents = function () {
		if (binded) return;
		binded = true;

		window.addEventListener('keydown', function (e) {
			currentlyPressedKeys[e.keyCode] = true;
		}, true);

		window.addEventListener('keyup', function (e) {
			currentlyPressedKeys[e.keyCode] = false;
		}, true);
	};

	this.handleKeys = function () {
		yawRate = pitchRate = speed = 0;

		if (currentlyPressedKeys[36]) { // Home
			stage += 0.01;
			yPos = stage;
		}
		else if (currentlyPressedKeys[35]){ // End
			stage -= 0.01;
			yPos = stage;
		}

		if (currentlyPressedKeys[33]) // Page Up
			pitchRate = 0.1;
		else if (currentlyPressedKeys[34]) // Page Down
			pitchRate = -0.1;

		if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) // Left cursor key or A
			yawRate = 0.1;
		else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) // Right cursor key or D
			yawRate = -0.1;

		if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) // Up cursor key or W
			speed = 0.003;
		else if (currentlyPressedKeys[40] || currentlyPressedKeys[83])	// Down cursor key
			speed = -0.003;
	};

	this.update = function () {
		var timeNow = new Date().getTime(),
			elapsed;
		if (lastTime != 0) {
			elapsed = timeNow - lastTime;
			if (speed != 0) {
				xPos -= Math.sin(util.degToRad(yaw)) * speed * elapsed;
				zPos -= Math.cos(util.degToRad(yaw)) * speed * elapsed;
				joggingAngle += elapsed * 0.6;
				yPos = stage + Math.sin(util.degToRad(joggingAngle)) / 20 + 0.4
			}
			yaw += yawRate * elapsed;
			pitch += pitchRate * elapsed;
		}
		lastTime = timeNow;
	};
};
