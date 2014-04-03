(function () {
	console.time('whole');

	// create objects
	// width, height, length
	var renderer = new Renderer(window.innerWidth, window.innerHeight),
		camera = new Camera(),
		scene = new Scene(),
		unit = 200,

		drawPeople= function(){

			var ratio = unit-4,
				xoffset = unit * 23,
				yoffset = unit * 0.2,
				zoffset = unit * 10,

				person = new Person()
					.withDimension(ratio, ratio, ratio)
					.at(0+xoffset, 0+yoffset, 0+zoffset)
					.using({textureSrc : 'minecraftman.png'}),
				person2 = new Person()
					.withDimension(ratio, ratio, ratio)
					.at(0+xoffset, 0+yoffset, (5*ratio)+zoffset)
					.using({textureSrc : 'finn.png'}),
				person3 = new Person()
					.withDimension(ratio, ratio, ratio)
					.at(0+xoffset, 0+yoffset, (10*ratio)+zoffset)
					.using({textureSrc : 'spiderman.png'});
		
			scene.addObject(person);
			scene.addObject(person2);
			scene.addObject(person3);

		}

	//drawStructure();
	//drawPatio();
	//drawKitchen();
	drawPeople();

	// append the canvas element
	document.body.appendChild(renderer.domElement);

	// render the graphics
	renderer.render(scene, camera, 16);

	// listen for events
	console.timeEnd('whole');
}());