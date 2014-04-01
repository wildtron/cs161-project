// (function (root) {
	root = this;
	var doc = root.document,


	Renderer = function (width, height) {
		var createCanvas = function (width, height) {
				var canvas = doc.createElement('canvas');
				canvas.setAttribute('width', width + 'px');
				canvas.setAttribute('height', height - 5 + 'px');
				return canvas;
			},
			getGL = function (canvas) {
				var contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'],
					i = contexts.length,
					gl;
				while (i--) {
					gl = canvas.getContext(contexts[i]);
					if (gl) {
						gl.width = width;
						gl.height = height;
						return gl;
					}
					console.log('failed on :', contexts[i]);
				}
				throw new Error('WebGL not available :((');
			},
			compileShadersAndGetProgram = function (gl, object) {
				var program = gl.createProgram(),
					compileAndAttachShader = function (source, shader_type, program, gl) {
						var shader = gl.createShader(shader_type);
						gl.shaderSource(shader, source);
						gl.compileShader(shader);
						if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
							throw new Error(gl.getShaderInfoLog(shader));
						}
						gl.attachShader(program, shader);
					};

				console.time('renderer : compileShadersAndGetProgram');

				compileAndAttachShader(object.fragmentSource, gl.FRAGMENT_SHADER, program, gl);
				compileAndAttachShader(object.vertexSource, gl.VERTEX_SHADER, program, gl);

				gl.linkProgram(program);
				gl.useProgram(program);

				if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
					throw new Error('Shaders cannot be initialized');
				}

				console.timeEnd('renderer : compileShadersAndGetProgram');
				return program;
			};

		console.time('renderer : initializing');

		this.width = width || 500;
		this.height = height || 500;
		this.cachedPrograms = {};
		this.background = '#000';
		this.domElement = createCanvas(this.width, this.height);
		this.GL = getGL(this.domElement);

		this.drawObjects = function () {
			var objects = this.scene.objects,
				i = objects.length,
				gl = this.GL,
				program;
			while (i--) {
				if (!(program = this.cachedPrograms[objects[i].name])) {
					program =  compileShadersAndGetProgram(gl, objects[i]);
					console.log('Cached', objects[i].name, ' program');
					this.cachedPrograms[objects[i].name] = program;
				}
				objects[i].draw(gl, program, this.camera);
			}
		};

		this.render = function (scene, camera) {
			var gl = this.GL;
			console.time('renderer : render');
			this.scene = scene || this.scene;
			this.camera = camera || this.camera;
			gl.clearColor.apply(gl, util.hexToRGBA(this.background));
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			this.drawObjects();
			console.timeEnd('renderer : render');
		};

		console.timeEnd('renderer : initializing');
	},



	Scene = function () {
		this.objects = [];
		this.addObject = function (obj) {
			this.objects.push(obj);
		};
	},



	Camera = function (mode) {
		this.mode = mode;
		this.eyePosition = [0, 3, 0.001];
		this.lookAtPosition = [0, 0, 0];
		this.upVector = [0, 0.1, 0];
		this.render = function (gl, program) {
			var matrix = mat4.create();
			if (mode === 'ortho') {
				mat4.ortho(matrix, -4, 4, -4, 4, -2, 2);
			}
		  	else {
				// matrix, field of view, aspect, near, far
				mat4.perspective(matrix, glMatrix.toRadian(45), gl.width / gl.height, 0.5, 100);
			}
		  	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjection'), false, matrix);
		  	mat4.lookAt(matrix = mat4.create(), this.eyePosition, this.lookAtPosition, this.upVector);
		  	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uView'), false, matrix);
		};

		this.move = function (e) {
			switch (e.keyCode) {
				// left
				case 37:	return this.lookAtPosition[0] -= 0.02;
				// up
				case 38:	return this.lookAtPosition[1] += 0.02;
				// right
				case 39:	return this.lookAtPosition[0] += 0.02;
				// down
				case 40:	return this.lookAtPosition[1] -= 0.02;
				// W
				case 87:	this.eyePosition[2] -= 0.01;
							return this.lookAtPosition[2] -= 0.01;
				// S
				case 83:	this.eyePosition[2] += 0.01;
							return this.lookAtPosition[2] -= 0.01;
				// A
				case 65:	this.eyePosition[0] -= 0.01;
							return this.lookAtPosition[0] -= 0.01;
				// D
				case 68:	this.eyePosition[0] += 0.01;
							return this.lookAtPosition[0] += 0.01;
			}
			if (e.deltaY > 0) return this.eyePosition[2] += 0.05;
			if (e.deltaY < 0) return this.eyePosition[2] -= 0.05;
		};
	};


// }(this));
