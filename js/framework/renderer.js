var Renderer = function (width, height) {
	var createCanvas = function (width, height) {
			var canvas = document.createElement('canvas');
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
					gl.viewportWidth = canvas.width;
					gl.viewportHeight = canvas.height;
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
						throw new Error(gl.getShaderInfoLog(shader) + source);
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
	this.fps = 16;
	this.cachedPrograms = {};
	this.background = '#000';
	this.domElement = createCanvas(this.width, this.height);
	this.GL = getGL(this.domElement);

	this.render = function (scene, camera, fps) {
		this.fps = fps || this.fps;
		this.scene = scene;
		this.camera = camera;
		this.camera.bindEvents();
		this.drawObjects();
		this.animate();
		console.timeEnd('render');
	};

	this.drawObjects = function () {
		var objects = this.scene.objects,
			i = objects.length,
			gl = this.GL,
			program;
		while (i--) {
			if (!(program = this.cachedPrograms[objects[i].name])) {
				program = compileShadersAndGetProgram(gl, objects[i]);
				if (objects[i].lights)
					program.lights = objects[i].lights;
				this.cachedPrograms[objects[i].name] = program;
				console.log('Cached', objects[i].name, ' program');
			}
			gl.useProgram(program);
			this.camera.render(gl, program);
			objects[i].render(gl, program);
		}
	};

	this.animate = function () {
		var objects = this.scene.objects,
			i = objects.length,
			gl = this.GL,
			self = this,
			program;
		console.time('render');
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
		gl.clearColor.apply(gl, util.hexToRGBA(this.background));
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		while (i--) {
			program = this.cachedPrograms[objects[i].name];
			gl.useProgram(program);
			objects[i].animate(gl, program);
			this.camera.animate(gl, program);
		}
		setTimeout(function () {
			requestAnimFrame(function () {
				self.animate();
			});
		}, 1000 / this.fps);
		console.timeEnd('render');
	}

	console.timeEnd('renderer : initializing');
};
