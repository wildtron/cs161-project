(function () {
	console.time('whole');

	// create objects
	// width, height, length
	var renderer = new Renderer(window.innerWidth, window.innerHeight),
		camera = new Camera(),
		scene = new Scene(),
		unit = 200,

		drawStructure = function () {
			var wallThickness = 40,
				worldLength = unit * 30,
				worldWidth = unit * 30,
				wallHeight = 600,
				floors = [
					new Cube()
						.withDimension(worldWidth, wallThickness, unit * 24)
						.at(0, 0, 0),
					new Cube()
						.withDimension(worldWidth, wallThickness, unit * 24)
						.at(0, 0, 0),
				],
				walls = [
					// vertical walls
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 22)
						.at(-worldWidth + wallThickness, wallHeight + wallThickness / 2, -unit * 2),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 20)
						.at(-unit * 26, wallHeight + wallThickness / 2, 0),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 15)
						.at(-unit * 8, wallHeight + wallThickness / 2, unit * 5),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 20)
						.at(-unit * 4, wallHeight + wallThickness / 2, 0),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 20)
						.at(unit * 4, wallHeight + wallThickness / 2, 0),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 20)
						.at(unit * 8, wallHeight, 0),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 20)
						.at(unit * 26, wallHeight, 0),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 22)
						.at(unit * 30 - wallThickness, wallHeight, -unit * 2),
					// patio
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 5)
						.at(-unit * 14, wallHeight, -(unit * 15)),
					// kitchen corner
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 3)
						.at(unit * 20, wallHeight, unit * 13),
					//mens cr
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 3)
						.at(-unit * 28, wallHeight, unit * 23),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 3)
						.at(-unit * 16, wallHeight, unit * 23),
					//womens cr
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 3)
						.at(unit * 28, wallHeight, unit * 23),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 3)
						.at(unit * 16, wallHeight, unit * 23),

					// horizontal walls
					new Cube()
						.withDimension(worldWidth, wallHeight, wallThickness)
						.at(0, wallHeight, -unit * 24),
					new Cube()
						.withDimension(unit * 6, wallHeight, wallThickness)
						.at(-unit * 20, wallHeight, -unit * 20),
					new Cube()
						.withDimension(unit * 4, wallHeight, wallThickness)
						.at(0, wallHeight, -unit * 20),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(unit * 17, wallHeight, -unit * 20),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(-unit * 17, wallHeight, -unit * 10),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(unit * 17, wallHeight, -unit * 10),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(-unit * 17, wallHeight, -unit * 10),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(unit * 17, wallHeight, -unit * 10),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(-unit * 17, wallHeight, 0),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(unit * 17, wallHeight, 0),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(-unit * 17, wallHeight, unit * 10),
					new Cube()
						.withDimension(unit * 9, wallHeight, wallThickness)
						.at(unit * 17, wallHeight, unit * 10),
					new Cube()
						.withDimension(worldWidth, wallHeight, wallThickness)
						.at(0, wallHeight, unit * 20),
					new Cube()
						.withDimension(unit * 6, wallHeight, wallThickness)
						.at(-unit * 22, wallHeight, unit * 26),
					new Cube()
						.withDimension(unit * 6, wallHeight, wallThickness)
						.at(unit * 22, wallHeight, unit * 26),
				],
				i = walls.length;

			i = floors.length;
			while (i--) {
				floors[i].using({textureSrc : 'floor.png'});
				scene.addObject(floors[i]);
			}
			i = walls.length;
			while (i--) {
				walls[i].using({textureSrc : 'wall.png'});
				scene.addObject(walls[i]);
			}
		},

		drawPatio = function () {
			var ratio = unit,
				xoffset = -unit * 20,
				yoffset = 20,
				zoffset = -unit * 14,
				boardCarpet = new Board()
					.withDimension(4*ratio, 0.1*ratio, 6*ratio)
					.at(0+xoffset, (0.02*ratio)+yoffset, (0*ratio)+zoffset)
					.using({materialDiffuse : '#7c2121'}),

				boardAirconL = new Board()
					.withDimension(0.3*ratio, 0.3*ratio, 3*ratio)
					.at(-4.5*ratio+xoffset, 2.8*ratio+yoffset, 0*ratio+zoffset)
					.using({materialDiffuse : '#EEE'})

				boardAirconR = new Board()
					.withDimension(0.3*ratio, 0.3*ratio, 3*ratio)
					.at(4.5*ratio+xoffset, 2.8*ratio+yoffset, 0*ratio+zoffset)
					.using({materialDiffuse : '#EEE'}),

				boardDoor = new Board()
					.withDimension(1.3*ratio, 1.5*ratio, 0.2*ratio)
					.at(0+xoffset, 1.5*ratio+yoffset, 6*ratio+zoffset)
					.using({materialDiffuse : '#895511'}),

				boardTV = new Board()
					.withDimension(1.3*ratio, 1*ratio, 0.01*ratio)
					.at(0+xoffset, 2*ratio+yoffset, -5*ratio+zoffset)
					.using({materialDiffuse : '#000'}),

				boardTable = new Board()
					.withDimension(1.5*ratio, 0.1*ratio, 2.5*ratio)
					.at(0+xoffset, 1*ratio+yoffset, 0+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				boardTableLeg1 = new Board()
					.withDimension(1.5*ratio, 0.4*ratio, 0.1*ratio)
					.at(0*ratio+xoffset, 0.6*ratio+yoffset, 2*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				boardTableLeg2 = new Board()
					.withDimension(1.5*ratio, 0.4*ratio, 0.1*ratio)
					.at(0*ratio+xoffset, 0.6*ratio+yoffset, -2*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				shelf1 = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(-3.1*ratio+xoffset, 2.4*ratio+yoffset, -5.7*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				shelf2 = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(-3.1*ratio+xoffset, 1.6*ratio+yoffset, -5.7*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				shelf3 = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(3.1*ratio+xoffset, 2.4*ratio+yoffset, -5.7*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				shelf4 = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(3.1*ratio+xoffset, 1.6*ratio+yoffset, -5.7*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf1t = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(3.1*ratio+xoffset, 1.6*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf1b = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(3.1*ratio+xoffset, 0.2*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf1l = new Board()
					.withDimension(0.1*ratio, 0.7*ratio, 0.4*ratio)
					.at(1.9*ratio+xoffset, 1.0*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf1r = new Board()
					.withDimension(0.1*ratio, 0.7*ratio, 0.4*ratio)
					.at(4.3*ratio+xoffset, 1*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf2t = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(-3.1*ratio+xoffset, 1.6*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf2b = new Board()
					.withDimension(1.3*ratio, 0.1*ratio, 0.4*ratio)
					.at(-3.1*ratio+xoffset, 0.2*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf2l = new Board()
					.withDimension(0.1*ratio, 0.7*ratio, 0.4*ratio)
					.at(-1.9*ratio+xoffset, 1.0*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pShelf2r = new Board()
					.withDimension(0.1*ratio, 0.7*ratio, 0.4*ratio)
					.at(-4.3*ratio+xoffset, 1*ratio+yoffset, 6.3*ratio+zoffset)
					.using({materialDiffuse : '#4f3f17'}),

				pchair1 = new Board()
					.withDimension(1.2*ratio, 0.4*ratio, 1*ratio)
					.at(-4.3*ratio+xoffset, 0.6*ratio+yoffset, 10.5*ratio+zoffset)
					.using({materialDiffuse : '#000'}),

				pchair2 = new Board()
					.withDimension(1.2*ratio, 0.4*ratio, 1*ratio)
					.at(-4.3*ratio+xoffset, 0.6*ratio+yoffset, 12.7*ratio+zoffset)
					.using({materialDiffuse : '#000'}),

				pchair3 = new Board()
					.withDimension(1.2*ratio, 0.4*ratio, 1*ratio)
					.at(-4.3*ratio+xoffset, 0.6*ratio+yoffset, 8.3*ratio+zoffset)
					.using({materialDiffuse : '#000'}),

				pchair4 = new Board()
					.withDimension(1.2*ratio, 0.4*ratio, 1*ratio)
					.at(4.3*ratio+xoffset, 0.6*ratio+yoffset, 10.5*ratio+zoffset)
					.using({materialDiffuse : '#000'}),

				pchair5 = new Board()
					.withDimension(1.2*ratio, 0.4*ratio, 1*ratio)
					.at(4.3*ratio+xoffset, 0.6*ratio+yoffset, 12.7*ratio+zoffset)
					.using({materialDiffuse : '#000'}),

				pchair6 = new Board()
					.withDimension(1.2*ratio, 0.4*ratio, 1*ratio)
					.at(4.3*ratio+xoffset, 0.6*ratio+yoffset, 8.3*ratio+zoffset)
					.using({materialDiffuse : '#000'}),

				pcarpet = new Board()
					.withDimension(1.2*ratio, 0.1*ratio, 4.5*ratio)
					.at(0*ratio+xoffset, 0.02*ratio+yoffset,11*ratio+zoffset)
					.using({materialDiffuse : '#7c2121'}),

				pdispenser = new Board()
					.withDimension(0.7*ratio, 1.3*ratio, 0.8*ratio)
					.at(-4*ratio+xoffset, 1.2*ratio+yoffset, 14.8*ratio+zoffset)
					.using({materialDiffuse : '#F00'});

			scene.addObject(boardDoor);

			//board room
			scene.addObject(boardCarpet);
			scene.addObject(boardTV);
			scene.addObject(boardAirconL);
			scene.addObject(boardAirconR);

			scene.addObject(boardTable);
			scene.addObject(boardTableLeg1);
			scene.addObject(boardTableLeg2);

			scene.addObject(shelf1);
			scene.addObject(shelf2);
			scene.addObject(shelf3);
			scene.addObject(shelf4);

			//patio
			scene.addObject(pShelf1t);
			scene.addObject(pShelf1b);
			scene.addObject(pShelf1l);
			scene.addObject(pShelf1r);
			scene.addObject(pShelf2t);
			scene.addObject(pShelf2b);
			scene.addObject(pShelf2l);
			scene.addObject(pShelf2r);
			scene.addObject(pchair1);
			scene.addObject(pchair2);
			scene.addObject(pchair3);
			scene.addObject(pchair4);
			scene.addObject(pchair5);
			scene.addObject(pchair6);
			scene.addObject(pcarpet);
			scene.addObject(pdispenser);
		};

	drawPatio();
	drawStructure();

	// append the canvas element
	document.body.appendChild(renderer.domElement);

	console.log(scene.objects.length);

	// render the graphics
	renderer.render(scene, camera, 60);

	// listen for events
	console.timeEnd('whole');
}());