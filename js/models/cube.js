Cube = function () {
	var modelMatrix = mat4.create(),
		image1Ready = false,
		indexBuffer,
		texture,
		indices = [
			 0, 1, 2,   0, 2, 3,    // front
			 4, 5, 6,   4, 6, 7,    // right
			 8, 9,10,   8,10,11,    // up
			12,13,14,  12,14,15,    // left
			16,17,18,  16,18,19,    // down
			20,21,22,  20,22,23     // back
		];

	this.name = 'cube';
	this.lights = true;

	// vertex
	this.vertexSource = '\
	attribute vec3 aPosition; \
	attribute vec3 aNormal;\
	uniform mat4 uModel;\
	uniform mat4 uView;\
	uniform mat4 uProjection;\
	uniform mat4 uNormal;\
	uniform vec3 uMaterialDiffuse;\
	uniform vec3 uLightDiffuse;\
	uniform vec3 uLightDirection;\
	varying vec4 vColor;\
	void main() {\
		gl_Position = uProjection * uView * uModel * vec4(aPosition, 1);\
		vec3 corrected_aNormal = vec3(uNormal * vec4(aNormal, 1));\
		vec3 normalized_aNormal = normalize(corrected_aNormal);\
		vec3 normalized_uLightDirection = normalize(uLightDirection);\
		float lambertCoefficient = max(dot(-normalized_uLightDirection,normalized_aNormal), 0.0);\
		vec3 diffuseColor =  uLightDiffuse * uMaterialDiffuse * lambertCoefficient;\
		vColor = vec4(diffuseColor,1);\
	}';

	// fragment
	this.fragmentSource = '\
	precision mediump float; \
	varying vec4 vColor;	\
	void main() {\
		gl_FragColor = vColor;\
	}';

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
			if (i === 'textureSrc') {
				this.useTexture();
			}
			else if (i === 'solid') {
				this.useSolid();
			}
		}
		return this;
	};

	this.convertProperties = function () {
		this.materialDiffuseRGB = util.hexToRGBN(this.materialDiffuse);
	};

	this.useTexture = function () {
		this.lights = false;
		// vertex
		this.vertexSource = '\
			attribute vec3 aPosition;\
			attribute vec2 aTexCoords;\
			uniform mat4 uModel;\
			uniform mat4 uView;\
			uniform mat4 uProjection;\
			varying vec2 vTexCoords;\
			void main() {\
				gl_Position = uProjection * uView * uModel * vec4(aPosition,1);\
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
	};

	this.useSolid = function () {
		this.solid = true;
		this.vertexSource = '\
		attribute vec3 aPosition; \
		uniform mat4 uModel;\
		uniform mat4 uView;\
		uniform mat4 uProjection;\
		uniform vec3 uMaterialDiffuse;\
		varying vec4 vColor;\
		void main() {\
			gl_Position = uProjection * uView * uModel * vec4(aPosition, 1);\
			vColor = vec4(uMaterialDiffuse,1);\
		}';
	};

	this.render = function (gl, program) {
		var temp = gl.getAttribLocation(program, 'aPosition');

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([   // Coordinates
			 1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1, //front
			 1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1, //right
			 1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1, //up
			-1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1, //left
			-1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1, //down
			 1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1  //back
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(temp, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(temp);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer = gl.createBuffer());
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		this.rotateX && mat4.rotateX(modelMatrix, modelMatrix, glMatrix.toRadian(this.rotateX));
		this.rotateY && mat4.rotateY(modelMatrix, modelMatrix, glMatrix.toRadian(this.rotateY));
		this.rotateZ && mat4.rotateZ(modelMatrix, modelMatrix, glMatrix.toRadian(this.rotateZ));
		mat4.scale(modelMatrix, modelMatrix, this.dimension);
		mat4.translate(modelMatrix, modelMatrix, this.position);
		gl.uniformMatrix4fv(gl.getUniformLocation(program,'uModel'), false, modelMatrix);

		if (this.textureSrc) {
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([   // Coordinates
				 0, 0,				 0, 0,				 0, 0,				 0, 0,
				 1, 1,				 0, 1,				 0, 0,				 1, 0,
				 1, 1,				 0, 1,				 0, 0,				 1, 0,
				 1, 1,				 0, 1,				 0, 0,				 1, 0,
				 1, 1,				 0, 1,				 0, 0,				 1, 0,
				 1, 1,				 0, 1,				 0, 0,				 1, 0
			]), gl.STATIC_DRAW);

			gl.vertexAttribPointer(temp = gl.getAttribLocation(program, 'aTexCoords'), 2, gl.FLOAT, false, 0,0);
			gl.enableVertexAttribArray(temp);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			texture = gl.createTexture();
			temp = new Image(),
			temp.onload = function () {
				gl.bindTexture(gl.TEXTURE_2D, texture);
				// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, temp);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.bindTexture(gl.TEXTURE_2D, null);
				image1Ready = true;


				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), 0);
			};
			temp.src = 'images/textures/' + this.textureSrc;
		}
		else {
			this.convertProperties();

			if (!this.solid) {
				gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
				 1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
				 1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
				 1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
				-1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
				-1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
				 1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1, -1
				]), gl.STATIC_DRAW);
				gl.vertexAttribPointer(temp = gl.getAttribLocation(program, 'aNormal'), 3, gl.FLOAT, false,0,0);
				gl.enableVertexAttribArray(temp);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);

				mat4.invert(temp = mat4.create(), modelMatrix);
				mat4.transpose(temp, temp);
				gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormal'), false, temp);

				gl.uniform3f(gl.getUniformLocation(program, 'uLightDiffuse'), 1, 1, 1);
			}
		}
	};

	this.animate = function (gl, program) {
		if (this.textureSrc) {
			if (image1Ready) {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
				gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
			}
		} else {
			gl.uniform3f.apply(gl, [gl.getUniformLocation(program, 'uMaterialDiffuse')].concat(this.materialDiffuseRGB));
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		}
	};
};
