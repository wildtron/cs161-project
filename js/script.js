(function () {
	console.time('whole');

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
						.at(0, 0, 0)
						.using({textureSrc : 'wood-floor.png'}),
					// front stairs floor
					new Cube()
						.withDimension(unit * 2, wallThickness, unit * 2)
						.at(unit * 5, 0, unit * 26)
						.using({textureSrc : 'wood-floor.png'}),
					// void
					new Cube()
						.withDimension(unit * 4, wallThickness, unit * 20)
						.at(0, 10, 0)
						.using({materialDiffuse : '#000', solid : true}),
					// emergency exit floor
					new Cube()
						.withDimension(unit * 2, wallThickness, unit * 2)
						.at(-unit * 0, 0, -unit * 26)
						.using({materialDiffuse : '#F00', solid : true}),
					// mens cr
					new Cube()
						.withDimension(unit * 6, wallThickness, unit * 3)
						.at(-unit * 22, 10, unit * 23)
						.using({textureSrc: 'cr-floor.png'}),
					// womens cr
					new Cube()
						.withDimension(unit * 6, wallThickness, unit * 3)
						.at(unit * 22, 10, unit * 23)
						.using({textureSrc: 'cr-floor.png'}),
				],
				walls = [
					// vertical walls
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 22)
						.at(-worldWidth + wallThickness, wallHeight, -unit * 2),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 20)
						.at(-unit * 26, wallHeight, 0),
					new Cube()
						.withDimension(wallThickness, wallHeight, unit * 15)
						.at(-unit * 8, wallHeight, unit * 5),
					new Cube()
						.withDimension(wallThickness, wallHeight / 2, unit * 20)
						.at(-unit * 4, wallHeight / 2, 0),
					new Cube()
						.withDimension(wallThickness, wallHeight / 2, unit * 20)
						.at(unit * 4, wallHeight / 2, 0),
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
						.withDimension(wallThickness, wallHeight / 2, unit * 3)
						.at(unit * 20, wallHeight / 2, unit * 13),
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
						.withDimension(unit * 4, wallHeight / 2, wallThickness)
						.at(0, wallHeight / 2, -unit * 20),
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
				doors = [
					// womens cr
					new Cube()
						.at(unit * 16, 500, unit * 22).using({rotateY : -90}),
					// mens cr
					new Cube()
						.at(-unit * 16, 500, unit * 22).using({rotateY : -90}),
					// patio out door
					new Cube()
						.at(-unit * 14, 500, -unit * 16).using({rotateY : -90}),
					// the other door
					new Cube()
						.at(unit * 8, 500, -unit * 16).using({rotateY : -90}),
					// horizontal doors
					new Cube().at(-unit * 18, 500, -unit * 10),
					new Cube().at(unit * 16, 500, -unit * 10),
					new Cube().at(-unit * 16, 500, 0),
					new Cube().at(unit * 16, 500, 0),
					new Cube().at(-unit * 16, 500, unit * 10),
					new Cube().at(unit * 16, 500, unit * 10),
					new Cube().at(-unit * 12, 500, unit * 20),
					new Cube().at(unit * 12, 500, unit * 20),
					// emergency door
					new Cube().at(0, 500, -unit * 24),
				],
				i = floors.length;

			while (i--) {
				scene.addObject(floors[i]);
			}
			i = walls.length;
			while (i--) {
				scene.addObject(walls[i].using({textureSrc : 'wall.png'}));
			}
			i = doors.length;
			while (i--) {
				scene.addObject(doors[i].withDimension(unit * 2, 500, wallThickness + 10).using({materialDiffuse : '#bdc3c7', solid : true}));
			}
			for (i = 0; i < 10; i++) {
				scene.addObject(
					new Cube()
						.withDimension(unit, 50, unit * 2)
						.at(-unit * 6 + (unit * i), (unit / 2) * i - ((unit / 2) * 10), unit * 26)
						.using({materialDiffuse : '#95a5a6', solid : true})
				);
				scene.addObject(
					new Cube()
						.withDimension(unit, 50, unit * 2)
						.at(-unit * 12 + (unit * i), (unit / 2) * i - ((unit / 2) * 10), -unit * 26)
						.using({materialDiffuse : '#F00', solid : true})
				);
			}
		},

		drawPatio = function () {
			var ratio = unit - 4,
				xoffset = -unit * 20,
				yoffset = unit * 0.2,
				zoffset = -unit * 14,
				boardCarpet = new Cube()
					.withDimension(6*ratio, 0.1*ratio, 4*ratio)
					.at(0+xoffset, (0.02*ratio)+yoffset, (-1.1*ratio)+zoffset)
					.using({textureSrc : 'carpet.jpg'}),

				boardAirconL = new Cube()
					.withDimension(3*ratio, 0.3*ratio, 0.3*ratio)
					.at(-3*ratio+xoffset, 5*ratio+yoffset, 3.5*ratio+zoffset)
					.using({textureSrc : 'aircon1.jpg'}),

				boardAirconR = new Cube()
					.withDimension(3*ratio, 0.3*ratio, 0.3*ratio)
					.at(-3*ratio+xoffset, 5*ratio+yoffset, -5.5*ratio+zoffset)
					.using({textureSrc : 'aircon1.jpg'}),

				boardTV = new Cube()
					.withDimension(0.01*ratio, 1*ratio, 1.3*ratio)
					.at(-5.5*ratio+xoffset, 3*ratio+yoffset, -1*ratio+zoffset)
					.using({textureSrc : 'leather2.jpg'}),

				boardTable = new Cube()
					.withDimension(2.5*ratio, 0.1*ratio, 1.5*ratio)
					.at(0+xoffset, 1*ratio+yoffset, -0.8*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				boardTableLeg1 = new Cube()
					.withDimension(0.1*ratio, 0.4*ratio, 1.5*ratio)
					.at(2*ratio+xoffset, 0.6*ratio+yoffset, -0.75*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				boardTableLeg2 = new Cube()
					.withDimension(0.1*ratio, 0.4*ratio, 1.5*ratio)
					.at(-2*ratio+xoffset, 0.6*ratio+yoffset, -0.75*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				shelf1 = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(-5.5*ratio+xoffset, 3.4*ratio+yoffset, -3.8*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				shelf2 = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(-5.5*ratio+xoffset, 2.6*ratio+yoffset, -3.8*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				shelf3 = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(-5.5*ratio+xoffset, 3.4*ratio+yoffset, 2*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				shelf4 = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(-5.5*ratio+xoffset, 2.6*ratio+yoffset, 2*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				pShelf1t = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(7.1*ratio+xoffset, 1.6*ratio+yoffset, 1.9*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				pShelf1b = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(7.1*ratio+xoffset, 0.2*ratio+yoffset, 1.9*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				pShelf1l = new Cube()
					.withDimension(0.4*ratio, 0.7*ratio, 0.1*ratio)
					.at(7.1*ratio+xoffset, 1.0*ratio+yoffset, 3.05*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				pShelf1r = new Cube()
					.withDimension(0.4*ratio, 0.7*ratio, 0.1*ratio)
					.at(7.1*ratio+xoffset, 1*ratio+yoffset, 0.7*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),
				
				pShelf2t = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(7.1*ratio+xoffset, 1.6*ratio+yoffset, -5.9*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				pShelf2b = new Cube()
					.withDimension(0.4*ratio, 0.1*ratio, 1.3*ratio)
					.at(7.1*ratio+xoffset, 0.2*ratio+yoffset, -5.9*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				pShelf2l = new Cube()
					.withDimension(0.4*ratio, 0.7*ratio, 0.1*ratio)
					.at(7.1*ratio+xoffset, 1.0*ratio+yoffset, -4.7*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),

				pShelf2r = new Cube()
					.withDimension(0.4*ratio, 0.7*ratio, 0.1*ratio)
					.at(7.1*ratio+xoffset, 1*ratio+yoffset, -7.1*ratio+zoffset)
					.using({textureSrc : 'wood.jpg'}),
				
				ptable1 = new Cube()
					.withDimension(1*ratio, 0.4*ratio, 1*ratio)
					.at(11*ratio+xoffset, 0.6*ratio+yoffset, -6*ratio+zoffset)
					.using({textureSrc : 'drawer.jpg'}),

					
				pchair2 = new Cube()
					.withDimension(1*ratio, 0.4*ratio, 1.2*ratio)
					.at(8.8*ratio+xoffset, 0.6*ratio+yoffset, 2.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair2b = new Cube()
					.withDimension(1*ratio, 0.6*ratio, 0.2*ratio)
					.at(8.8*ratio+xoffset, 1*ratio+yoffset, 3.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair2c = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(7.9*ratio+xoffset, 1*ratio+yoffset, 2.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair2d = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(9.7*ratio+xoffset, 1*ratio+yoffset, 2.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair4 = new Cube()
					.withDimension(1*ratio, 0.4*ratio, 1.2*ratio)
					.at(11.3*ratio+xoffset, 0.6*ratio+yoffset, 2.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair4b = new Cube()
					.withDimension(1*ratio, 0.6*ratio, 0.2*ratio)
					.at(11.3*ratio+xoffset, 1*ratio+yoffset, 3.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair4c = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(10.4*ratio+xoffset, 1*ratio+yoffset, 2.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair4d = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(12.2*ratio+xoffset, 1*ratio+yoffset, 2.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

					
				pchair3 = new Cube()
					.withDimension(1*ratio, 0.4*ratio, 1.2*ratio)
					.at(8.8*ratio+xoffset, 0.6*ratio+yoffset, -6.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair3b = new Cube()
					.withDimension(1*ratio, 0.6*ratio, 0.2*ratio)
					.at(8.8*ratio+xoffset, 1*ratio+yoffset, -7.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair3c = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(7.9*ratio+xoffset, 1*ratio+yoffset, -6.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair3d = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(9.7*ratio+xoffset, 1*ratio+yoffset, -6.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),
	
				pchair1 = new Cube()
					.withDimension(1*ratio, 0.4*ratio, 1.2*ratio)
					.at(11.5*ratio+xoffset, 0.6*ratio+yoffset, -6.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair1b = new Cube()
					.withDimension(1*ratio, 0.6*ratio, 0.2*ratio)
					.at(11.5*ratio+xoffset, 1*ratio+yoffset, -7.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair1c = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(10.6*ratio+xoffset, 1*ratio+yoffset, -6.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pchair1d = new Cube()
					.withDimension(0.16*ratio, 0.4*ratio, 1*ratio)
					.at(12.4*ratio+xoffset, 1*ratio+yoffset, -6.1*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				pcarpet = new Cube()
					.withDimension(2.5*ratio, 0.1*ratio, 1.2*ratio)
					.at(8*ratio+xoffset, 0.02*ratio+yoffset,-2*ratio+zoffset)
					.using({textureSrc : 'carpet.jpg'});

					//Cube room
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
			//scene.addObject(ptable1);
			scene.addObject(pchair1);
			scene.addObject(pchair1b);
			scene.addObject(pchair1c);
			scene.addObject(pchair1d);
			scene.addObject(pchair2);
			scene.addObject(pchair2b);
			scene.addObject(pchair2c);
			scene.addObject(pchair2d);
			scene.addObject(pchair3);
			scene.addObject(pchair3b);
			scene.addObject(pchair3c);
			scene.addObject(pchair3d);
			scene.addObject(pchair4);
			scene.addObject(pchair4b);
			scene.addObject(pchair4c);
			scene.addObject(pchair4d);
			scene.addObject(pcarpet);
		},

		drawKitchen = function(){
			var ratio = unit-4,
				xoffset = unit * 23,
				yoffset = unit * 0.2,
				zoffset = unit * 10,

				floor = new Cube()
					.withDimension(3*ratio, 0.1*ratio, 5*ratio)
					.at(0+xoffset, 0+yoffset, (5*ratio)+zoffset)
					.using({textureSrc : 'tile6.jpg'}),

				kWallLeft = new Cube()
					.withDimension(0.1*ratio, 1.6*ratio, 3*ratio)
					.at(-3*ratio+xoffset, (1.6*ratio)+yoffset, 3*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				kWallTop = new Cube()
					.withDimension(3*ratio, 1.6*ratio, 0.1*ratio)
					.at(0*ratio+xoffset, 1.6*ratio+yoffset, 0*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				kWallRight = new Cube()
					.withDimension(0.1*ratio, 1.6*ratio, 5*ratio)
					.at(3*ratio+xoffset, 1.6*ratio+yoffset, 5*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				kCounter1 = new Cube()
					.withDimension(0.8*ratio, 0.8*ratio, 2*ratio)
					.at(2.1*ratio+xoffset, 0.9*ratio+yoffset, 2.3*ratio+zoffset)
					.using({textureSrc : 'tile2.jpg'}),

				kSink = new Cube()
					.withDimension(0.8*ratio, 0.2*ratio, 0.8*ratio)
					.at(0.5*ratio+xoffset, 1.4*ratio+yoffset, 1*ratio+zoffset)
					.using({textureSrc : 'tile7.jpg'}),

				kFaucet = new Cube()
					.withDimension(0.1*ratio, 0.1*ratio, 0.2*ratio)
					.at(0.5*ratio+xoffset, 1.9*ratio+yoffset, 0.6*ratio+zoffset)
					.using({textureSrc : 'chair2.jpg'}),

				kCounter2 = new Cube()
					.withDimension(1.27*ratio, 0.8*ratio, 0.8*ratio)
					.at(-1.6*ratio+xoffset, 0.9*ratio+yoffset, 1*ratio+zoffset)
					.using({textureSrc : 'tile2.jpg'}),

				kRefBottom = new Cube()
					.withDimension(0.8*ratio, 1.2*ratio, 0.7*ratio)
					.at(2.1*ratio+xoffset, 0.9*ratio+yoffset, 5*ratio+zoffset)
					.using({textureSrc : 'ref2.png'}),

				kRefTop = new Cube()
					.withDimension(0.8*ratio, 0.5*ratio, 0.7*ratio)
					.at(2.1*ratio+xoffset, 2.6*ratio+yoffset, 5*ratio+zoffset)
					.using({textureSrc : 'ref2.png'}),

				kCounter3 = new Cube()
					.withDimension(0.8*ratio, 0.8*ratio, 0.8*ratio)
					.at(2.1*ratio+xoffset, 0.9*ratio+yoffset, 6.5*ratio+zoffset)
					.using({textureSrc : 'dwasher2.jpg'}),

				kOven = new Cube()
					.withDimension(0.5*ratio, 0.3*ratio, 0.5*ratio)
					.at(2.1*ratio+xoffset, 2*ratio+yoffset, 3.4*ratio+zoffset)
					.using({textureSrc : 'oven1.jpg'});

			scene.addObject(floor);
			scene.addObject(kCounter1);
			scene.addObject(kCounter2);
			scene.addObject(kCounter3);
			scene.addObject(kSink);
			scene.addObject(kFaucet);
			scene.addObject(kRefBottom);
			scene.addObject(kRefTop);
			scene.addObject(kOven);
		},
		drawPeople = function () {
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
		};

	drawStructure();
	drawPatio();
	drawKitchen();
	drawPeople();

	// append the canvas element
	document.body.appendChild(renderer.domElement);

	// render the graphics
	renderer.render(scene, camera, 16);

	// listen for events
	console.timeEnd('whole');
}());