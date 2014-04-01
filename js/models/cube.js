Cube = function (options) {
	this.name = 'cube';

	this.withSize = function (x, y, z) {
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
	};

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

	// hook function draw, this will be called by the preymwerk.
	// gl and program will be passed
	this.draw = function (gl, program) {
		this.convertProperties();
		var cube_vertices = [   // Coordinates
				 1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1, //front
				 1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1, //right
				 1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1, //up
				-1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1, //left
				-1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1, //down
				 1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1  //back
			],
			normals = [   // Normal of each vertex
				0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,  // front
				1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,  // right
				0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,  // up
			   -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  // left
				0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,  // down
				0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1   // back
			],
			indices = [	// Indices of the vertices
				 0, 1, 2,   0, 2, 3,    // front
				 4, 5, 6,   4, 6, 7,    // right
				 8, 9,10,   8,10,11,    // up
				12,13,14,  12,14,15,    // left
				16,17,18,  16,18,19,    // down
				20,21,22,  20,22,23     // back
			],
			aPosition = gl.getAttribLocation(program, 'aPosition'),
			aNormal = gl.getAttribLocation(program, 'aNormal'),
			modelMatrix = mat4.create(),
			indexBuffer,
			temp;

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);

		gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(aPosition);
		//unbind buffer to ARRAY_BUFFER POINTER
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		//buffer creation
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		//attribute variable mapping to buffer
		gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(aNormal);
		//unbind buffer to ARRAY_BUFFER POINTER
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		//buffer creation
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer = gl.createBuffer());
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
		//unbind buffer to gl.ELEMENT_ARRAY_BUFFER POINTER
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


		//set-up model matrix
		mat4.scale(modelMatrix, modelMatrix, this.dimension);
		mat4.translate(modelMatrix, modelMatrix, this.position);
		gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModel'), false, modelMatrix);

		//add normal matrix
		mat4.invert(temp = mat4.create(), modelMatrix);
		mat4.transpose(temp, temp);
		gl.uniformMatrix4fv(gl.getUniformLocation(program,'uNormal'), false, temp);

		//set-up light and material parameters
		gl.uniform3f.apply(gl, [gl.getUniformLocation(program, 'uMaterialDiffuse')].concat(this.materialDiffuseRGB));
		gl.uniform3f(gl.getUniformLocation(program, 'uLightDiffuse'), 1, 1, 1);
		gl.uniform3f(gl.getUniformLocation(program, 'uLightDirection'), -1, -2.5, -5.0);

		//draw object
		gl.enable(gl.DEPTH_TEST);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
	};
};
