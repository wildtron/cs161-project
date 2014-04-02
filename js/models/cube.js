Cube = function (options) {
	var modelMatrix = mat4.create(),
		image1Ready = false,
		indexBuffer,
		texture,
		indices;

	this.name = 'cube';

	this.withDimension = function (x, y, z) {
		this.dimension = util.pixelToN([x, y, z]);
		return this;
	};

	this.at = function (x, y, z) {
		this.position = util.pixelToN([x, y, z]);
		return this;
	};

	this.using = function (objs) {
		var i;
		for (i in objs) {
			this[i] = objs[i];
		}
		return this;
	};

	// vertex
	this.vertexSource = '\
		attribute vec3 aPosition;\
		attribute vec2 aTexCoords;\
		uniform mat4 uModel;\
		uniform mat4 uView;\
		uniform mat4 uProjection;\
		varying vec2 vTexCoords;\
		void main() {\
			gl_Position = uProjection * uView * uModel * vec4(aPosition,1.0);\
			vTexCoords = aTexCoords;\
		}';

	// fragment
	this.fragmentSource = '\
		precision mediump float;\
		uniform sampler2D uSampler;\
		varying vec2 vTexCoords;\
		void main() {\
			gl_FragColor = texture2D(uSampler, vTexCoords);\
		}';

	this.render = function (gl, program) {
		var aPosition = gl.getAttribLocation(program, 'aPosition'),
			cube_vertices = [   // Coordinates
				 1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, //front
				 1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, //right
				 1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, //up
				-1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, //left
				-1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, //down
				 1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  //back
			];

		//buffer creation
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);

		//attribute variable mapping to buffer
		gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(aPosition);

		//unbind buffer to ARRAY_BUFFER POINTER
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Indices of the vertices
		indices = [
		 0, 1, 2,   0, 2, 3,    // front
		 4, 5, 6,   4, 6, 7,    // right
		 8, 9,10,   8,10,11,    // up
		12,13,14,  12,14,15,    // left
		16,17,18,  16,18,19,    // down
		20,21,22,  20,22,23     // back
		];
		//buffer creation
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer = gl.createBuffer());
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		//unbind buffer to gl.ELEMENT_ARRAY_BUFFER POINTER
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		var tex_coords = [   // Coordinates
		 0.0, 0.0,
		 0.0, 0.0,
		 0.0, 0.0,
		 0.0, 0.0,

		 1.0, 1.0,
		 0.0, 1.0,
		 0.0, 0.0,
		 1.0, 0.0,

		 1.0, 1.0,
		 0.0, 1.0,
		 0.0, 0.0,
		 1.0, 0.0,

		 1.0, 1.0,
		 0.0, 1.0,
		 0.0, 0.0,
		 1.0, 0.0,

		 1.0, 1.0,
		 0.0, 1.0,
		 0.0, 0.0,
		 1.0, 0.0,

		 1.0, 1.0,
		 0.0, 1.0,
		 0.0, 0.0,
		 1.0, 0.0
		];
		//buffer creation
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);

		//attribute variable mapping to buffer
		var aTexCoords = gl.getAttribLocation(program,'aTexCoords');
		gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, false, 0,0);
		gl.enableVertexAttribArray(aTexCoords);
		//unbind buffer to ARRAY_BUFFER POINTER
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		mat4.scale(modelMatrix, modelMatrix, this.dimension);
		mat4.translate(modelMatrix, modelMatrix, this.position);

		if (!image1Ready) {
			var image = new Image();
			texture = gl.createTexture();
			image.onload = function () {
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.bindTexture(gl.TEXTURE_2D, null);
				image1Ready = true;
			};
			image.src = 'images/textures/' + this.textureSrc;
		}

	};

	this.animate = function (gl, program) {
		gl.uniformMatrix4fv(gl.getUniformLocation(program,'uModel'), false, modelMatrix);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), 0);
		if (image1Ready) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		}
	};
};
