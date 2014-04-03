Cube = function () {
	var modelMatrix = mat4.create(),
		image1Ready = false,
		indexBuffer,
		texture;

	this.lights = true;
	this.name = 'cube';

	this.indices = [
		 0, 1, 2,   0, 2, 3,    // front
		 4, 5, 6,   4, 6, 7,    // right
		 8, 9,10,   8,10,11,    // up
		12,13,14,  12,14,15,    // left
		16,17,18,  16,18,19,    // down
		20,21,22,  20,22,23     // back
	];

	this.cubeVertices = [   // Coordinates
		 1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1, //front
		 1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1, //right
		 1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1, //up
		-1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1, //left
		-1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1, //down
		 1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1  //back
	];

	this.texCoords = [   // Coordinates
	 1.0, 1.0,		     0.0, 1.0,		     0.0, 0.0,		     1.0, 0.0,
	 1.0, 1.0,		     0.0, 1.0,		     0.0, 0.0,		     1.0, 0.0,
	 1.0, 1.0,		     0.0, 1.0,		     0.0, 0.0,		     1.0, 0.0,
	 1.0, 1.0,		     0.0, 1.0,		     0.0, 0.0,		     1.0, 0.0,
	 1.0, 1.0,		     0.0, 1.0,		     0.0, 0.0,		     1.0, 0.0,
	 1.0, 1.0,		     0.0, 1.0,		     0.0, 0.0,		     1.0, 0.0
	];

	// vertex
	this.vertexSource = '\
		attribute vec3 aPosition;\
		attribute vec3 aNormal;\
		attribute vec2 aTexCoords;\
\
		uniform bool uUseLighting;\
\
		uniform mat4 uModel;\
		uniform mat4 uView;\
		uniform mat4 uProjection;\
		uniform mat4 uNormal;\
\
		uniform vec4 uLightDiffuse;\
		uniform vec3 uLightDirection;\
		uniform vec4 uLightAmbient;\
\
		uniform vec4 uMaterialDiffuse;\
		uniform vec4 uMaterialAmbient;\
\
		varying vec2 vTexCoords;\
		varying vec4 vColor ;\
		void main() {\
			gl_Position = uProjection * uView * uModel * vec4(aPosition,1);\
			vec3 corrected_aNormal = vec3(uNormal * vec4(aNormal, 1.0));\
			vec3 normalized_aNormal = normalize(corrected_aNormal);\
			vec3 normalized_lightDirection = normalize(uLightDirection);\
			float lambertCoefficient = max(dot(-normalized_lightDirection,normalized_aNormal), 0.0);\
\
			vec4 ambientColor = uLightAmbient * uMaterialAmbient;\
			vec4 diffuseColor = uLightDiffuse * uMaterialDiffuse * lambertCoefficient;\
\
			if (uUseLighting) {\
				vColor  = ambientColor + diffuseColor;\
			} else {\
				vColor = uMaterialDiffuse;\
			}\
\
			vTexCoords = aTexCoords;\
		}';

	// fragment
	this.fragmentSource = '\
		precision mediump float;\
		uniform sampler2D uSampler;\
		varying vec2 vTexCoords;\
		varying vec4 vColor ;\
		void main() {\
			gl_FragColor = vColor  * texture2D(uSampler, vTexCoords);\
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
		}
		return this;
	};

	this.convertProperties = function () {
		this.materialDiffuseRGB = util.hexToRGBN(this.materialDiffuse);
		this.materialDiffuseRGBA = util.hexToRGBAN(this.materialDiffuse);
	};

	this.render = function (gl, program) {
		var temp = gl.getAttribLocation(program, 'aPosition');

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(temp, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(temp);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		 // 1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
		 // 1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
		 // 1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
		// -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
		// -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
		 // 1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1, -1
		    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // front
		    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // right
		    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // up
		   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // left
		    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // down
		    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // back
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(temp = gl.getAttribLocation(program, 'aNormal'), 3, gl.FLOAT, false,0,0);
		gl.enableVertexAttribArray(temp);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer = gl.createBuffer());
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		texture = gl.createTexture();

		gl.uniform1i(gl.getUniformLocation(program, 'uUseLighting'), true);
		if (this.textureSrc) {

			gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
			gl.vertexAttribPointer(temp = gl.getAttribLocation(program, 'aTexCoords'), 2, gl.FLOAT, false, 0,0);
			gl.enableVertexAttribArray(temp);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			temp = new Image(),
			temp.onload = function () {
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.bindTexture(gl.TEXTURE_2D, null);
				image1Ready = true;
			};
			temp.src = 'images/textures/' + this.textureSrc;
		} else {
			this.convertProperties();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
			image1Ready = true;
		}

		this.rotateX && mat4.rotateX(modelMatrix, modelMatrix, glMatrix.toRadian(this.rotateX));
		this.rotateY && mat4.rotateY(modelMatrix, modelMatrix, glMatrix.toRadian(this.rotateY));
		this.rotateZ && mat4.rotateZ(modelMatrix, modelMatrix, glMatrix.toRadian(this.rotateZ));
		mat4.scale(modelMatrix, modelMatrix, this.dimension);
		mat4.translate(modelMatrix, modelMatrix, this.position);
		gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModel'), false, modelMatrix);

		mat4.invert(temp = mat4.create(), modelMatrix);
		mat4.transpose(temp,temp);
		gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormal'), false, temp);

		gl.uniform4f(gl.getUniformLocation(program, 'uLightDiffuse'), 1, 1, 1, 1);
		gl.uniform4f(gl.getUniformLocation(program, 'uLightAmbient'), 0.4, 0.4, 0.4, 1.0);
		gl.uniform4f(gl.getUniformLocation(program, 'uMaterialAmbient'), 0.8, 0.8, 0.8, 1.0);
		gl.uniform4f(gl.getUniformLocation(program, 'uMaterialDiffuse'), 1, 1, 1, 1);
	};

	this.animate = function (gl, program) {
		if (this.textureSrc) {
			gl.uniform4f(gl.getUniformLocation(program, 'uMaterialDiffuse'), 1, 1, 1, 1);
			gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aTexCoords'));
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), 0);
		}
		else {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform4f.apply(gl, [gl.getUniformLocation(program, 'uMaterialDiffuse')].concat(this.materialDiffuseRGBA));
			gl.disableVertexAttribArray(gl.getAttribLocation(program, 'aTexCoords'));
		}
		if (image1Ready) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
		}
	};
};
