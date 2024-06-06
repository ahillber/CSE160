import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MinMaxGUIHelper, ColorGUIHelper } from './helpers.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function degreesToRadians(degrees) {
	return degrees * (Math.PI / 180);
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
	const folder = gui.addFolder(name);
	folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
	folder.add(vector3, 'y', -10, 10).onChange(onChangeFn);
	folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
	folder.open();
}

function main() {
	// Set up canvas and renderer
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({antialias: true, canvas});


	const fov = 75;
	const aspect = 2;
	const near = 0.1;
	const far = 200;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	camera.position.set(-8.541391470347774, 1.169085769562606, -22.199559240301955);


	const gui = new GUI();
	gui.add( camera, 'fov', 1, 180 ).onChange;
	const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
	gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' );
	gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' );

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 0, 0);
	controls.update();

	const scene = new THREE.Scene();

	// Creating and adding lighting to the scene

	//Ambient light to give a little lighting to entire scene
	const ambientColor = 0xFFFFFF;
	const ambientColorIntensity = 1;
	const ambientlight = new THREE.AmbientLight(ambientColor, ambientColorIntensity);
	scene.add(ambientlight);

	const color = 0xFFFFFF;
	const intensity = 3;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( - 1, 4, 15 );
	scene.add( light );

	// Creating a point light for charizard (model) tail
	const colorPoint = 0xEE7744;
	const intensityPoint = 100;
	const pointLight = new THREE.PointLight(colorPoint, intensityPoint);
	pointLight.position.set(-19, 6.5, 40);
	scene.add( pointLight );
	
	// point light for espeon eyes
	//const colorPoint2 = 0x1fdaff;
	const colorPoint2 = 0xc51fd1;
	const intensityPoint2 = 15;
	const pointLight2 = new THREE.PointLight(colorPoint2, intensityPoint2);
	pointLight2.position.set(-8, 1, -18);
	scene.add( pointLight2 );

	/*

	// Helpers for lights
	const helper = new THREE.DirectionalLightHelper(light);
	scene.add(helper);

	const helperPoint = new THREE.PointLightHelper(pointLight);
	scene.add(helperPoint);

	const helperPoint2 = new THREE.PointLightHelper(pointLight2);
	scene.add(helperPoint2);

	function updateLight() {
		//light.target.updateMatrixWorld();
		helper.update();
		helperPoint.update();
	  }
	updateLight();

	gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
	gui.add(light, 'intensity', 0, 10, 0.01);

	makeXYZGUI(gui, light.position, 'position', updateLight);
	makeXYZGUI(gui, light.target.position, 'target', updateLight);
	makeXYZGUI(gui, pointLight.position, 'position', updateLight);
	*/


	// Creating skyBox geometry
	const skyBoxWidth = 100;
	const skyBoxHeight = 100;
	const skyBoxDepth = 100;
	const skyBoxGeometry = new THREE.BoxGeometry(skyBoxWidth, skyBoxHeight, skyBoxDepth);

	// Creating box geometry (holds data for a box). 
	const boxWidth = 2.5;
	const boxHeight = 2.5;
	const boxDepth = 2.5;
	const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

	// Creating cylinder geometry
	const radiusTop = 1;
	const radiusBottom = 1;
	const height = 2;
	const radialSegments = 20;
	const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);

	// Creating sphere geometry
	const radius = 0.25;
	const widthSegments = 10;
	const heightSegments = 10;
	const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

	// Geometry for Plane
	const planeGeometry = new THREE.PlaneGeometry(50, 50);

	// Geometry for column/torch lights
	const octoGeometry = new THREE.OctahedronGeometry( 0.5 );


	// load textures
	const loader = new THREE.TextureLoader();
	function loadColorTexture(path) {
		const texture = loader.load(path);
		texture.colorSpace = THREE.SRGBColorSpace;
		return texture;
	}

	const skyMaterials = [
		new THREE.MeshBasicMaterial({map: loadColorTexture('../lib/resources/images/blizzard/blizzard_ft.jpg'), side: THREE.BackSide}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('../lib/resources/images/blizzard/blizzard_bk.jpg'), side: THREE.BackSide}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('../lib/resources/images/blizzard/blizzard_up.jpg'), side: THREE.BackSide}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('../lib/resources/images/blizzard/blizzard_dn.jpg'), side: THREE.BackSide}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('../lib/resources/images/blizzard/blizzard_rt.jpg'), side: THREE.BackSide}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('../lib/resources/images/blizzard/blizzard_lf.jpg'), side: THREE.BackSide}),
	];

	function makeSkyBox(geometry, materials, xPos, yPos) {
		//const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});

		const cube = new THREE.Mesh(geometry, materials);
		scene.add(cube);

		cube.position.x = xPos;
		cube.position.y = yPos;

		return cube;
	}
	makeSkyBox(skyBoxGeometry, skyMaterials, 0, 0);

	function makeGroundPlane(geometry, texture, xPos, yPos) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(10, 10);
		const material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

		const plane = new THREE.Mesh(geometry, material);
		scene.add(plane);

		plane.position.x = xPos;
		plane.position.y = yPos;

		plane.rotation.x = -Math.PI / 2;

		return plane;
	}
	//makeGroundPlane(planeGeometry, loadColorTexture('../lib/resources/images/ground.jpg'), 0, -4.3);


	function makeInstance(geometry, colorHex, xPos, yPos, zPos) {
		// Create matrial from a color
		const material = new THREE.MeshToonMaterial({color: colorHex});

		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		cube.position.x = xPos;
		cube.position.y = yPos;
		cube.position.z = zPos;

		return cube;
	}


	function makeInstanceShapes(geometry, colorHex, xPos, yPos, zPos) {
		const material = new THREE.MeshPhongMaterial({color: colorHex});
		const shape = new THREE.Mesh(geometry, material);
		shape.position.x = xPos;
		shape.position.y = yPos;
		shape.position.z =  zPos; 
		scene.add(shape);
		return shape;
	}

	

	// Add cube to the scene, then render it
	
	const shapes = [
		//makeInstance(geometry, loadColorTexture('../lib/resources/images/purplehaze.jpg'), 0, 1),
		//makeInstanceShapes(cylinderGeometry, 0x7edea1, 5, 2),
		//makeInstanceShapes(sphereGeometry, 0xd9d2e9, - 1, 2, 0)
		makeInstance(sphereGeometry, 0xc51fd1 , -8, 1, -18),
		makeInstance(sphereGeometry, 0xc51fd1, -7.25, 1, -18),
		makeInstance(sphereGeometry, 0xc51fd1, -8.75, 1, -18),
	];
	
	
	{
		const mtlLoader = new MTLLoader();

		mtlLoader.load('../lib/resources/models/tree/t1.mtl', (mtl) => {
			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials(mtl);
			objLoader.load('../lib/resources/models/tree/t1.obj', (root) => {
				root.position.set(-15, -8, -2);
				root.scale.setScalar(0.003);
				//root.rotation.y = degreesToRadians(180);
				scene.add(root);

				const dup = root.clone();
				const dup2 = root.clone();
				const dup3 = root.clone();
				const dup4 = root.clone();
				const dup5 = root.clone();
				const dup6 = root.clone();
				const dup7 = root.clone();
				const dup8 = root.clone();
				const dup9 = root.clone();
				const dup10 = root.clone();
				const dup11 = root.clone();
				const dup12 = root.clone();
				const dup13 = root.clone();
				const dup14 = root.clone();
				const dup15 = root.clone();

				//First group of trees
				dup.position.set(8, -9, 7);
				dup2.position.set(11, -9, -4);
				dup3.position.set(18, -9, 3);
				dup4.position.set(18, -8, -6);

				//Second group
				dup5.position.set(-5, -8, 13);
				dup6.position.set(-12, -6, 19);
				dup7.position.set(-25, -7, 15);
				dup8.position.set(-34, -7, 17);

				//Third Group
				dup9.position.set(-42, -8, -6);
				dup10.position.set(-36, -8, -14);

				//Fourth Group
				dup11.position.set(42, -8, -30);
				dup12.position.set(30, -8, -20);

				//Fifth Group
				dup13.position.set(28, -5, 20);
				dup14.position.set(23, -5, 15);
				dup15.position.set(32, -5, 10);

				scene.add(dup);
				scene.add(dup2);
				scene.add(dup3);
				scene.add(dup4);
				scene.add(dup5);
				scene.add(dup6);
				scene.add(dup7);
				scene.add(dup8);
				scene.add(dup9);
				scene.add(dup10);
				scene.add(dup11);
				scene.add(dup12);
				scene.add(dup13);
				scene.add(dup14);
				scene.add(dup15);
			})
		})
	}

	{
		const loader = new GLTFLoader();

		loader.load( '../lib/resources/models/espeon/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			model.position.set(-8, 0, -20);
			//model.rotation.y = degreesToRadians(180);
			model.scale.setScalar(0.5);
			scene.add( gltf.scene );


		}, undefined, function ( error ) {

			console.error( error );

		} );

		loader.load( '../lib/resources/models/trainer/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			model.rotation.x = degreesToRadians(10);
			model.rotation.y = degreesToRadians(-180);
			//model.rotation.x = degreesToRadians(180);
			model.position.set(-16, 6.3, 37);
			model.scale.setScalar(0.5);
			scene.add( gltf.scene );


		}, undefined, function ( error ) {

			console.error( error );

		} );

		loader.load( '../lib/resources/models/trainer2/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			//model.rotation.x = degreesToRadians(10);
			model.rotation.y = degreesToRadians(-15);
			//model.rotation.x = degreesToRadians(180);
			model.position.set(-9.5, 0, -20);
			model.scale.setScalar(0.5);
			scene.add( gltf.scene );


		}, undefined, function ( error ) {

			console.error( error );

		} );


		loader.load('../lib/resources/models/charizard/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			model.rotation.y = degreesToRadians(-180);
			model.position.set(-19, 6.5, 37);
			model.scale.setScalar(0.5);
			scene.add(model);
		} , undefined, function ( error ) {

			console.error( error );

		} );

		loader.load('../lib/resources/models/mountain/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			model.scale.setScalar(100);
			scene.add(model);
		} , undefined, function ( error ) {

			console.error( error );

		} );
	}
	
	var pos = true;
	function htmlActions() {
		document.getElementById('pov').onclick = function () {if (pos === true) {
				camera.position.set(-17.590200738996458, 8.176077856242784, 39.586827529501065);
				controls.target.set(0, 0, 0);
				controls.update();
				pos = false;
			} else {
				camera.position.set(-8.541391470347774, 1.169085769562606, -22.199559240301955);
				controls.target.set(0, 0, 0);
				controls.update();
				pos = true;
			}
		};
	}

	let snowflakes;
	let positions = [];
	let velocities = [];

	const numSnowflakes = 2500;

	const maxRange = 100;
	const minRange = maxRange/2;
	const minHeight = -10;

	const buffGeometry = new THREE.BufferGeometry();
	//const textureLoader = new TH
	// Watched this tutorial:
	// https://www.youtube.com/watch?v=OXpl8durSjA
	function addSnow() {
		for(let i=0; i<numSnowflakes; i++) {
			positions.push(
				Math.floor(Math.random() * maxRange - minRange),
				Math.floor(Math.random() * minRange + minHeight),
				Math.floor(Math.random() * maxRange - minRange)
			);

			velocities.push(
				Math.floor(Math.random() * 6 - 3) * 0.01,
				Math.floor(Math.random() * 5 + 0.12) * 0.04,
				Math.floor(Math.random() * 6 -3) * 0.01
			);
		}
		buffGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		buffGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

		const snowflakeMaterial = new THREE.PointsMaterial({
			size: 0.5,
			map: loader.load('../lib/resources/images/snowflake.png'),
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			opacity: 0.7,
		});
		snowflakes = new THREE.Points(buffGeometry, snowflakeMaterial);
		scene.add(snowflakes);
	}
	addSnow();

	function updateSnow() {
		const positions = snowflakes.geometry.attributes.position.array;
		const velocities = snowflakes.geometry.attributes.velocity.array;
	
		for (let i = 0; i < numSnowflakes*3 ; i += 3) {
			positions[i] -= velocities[i];   // Update positions based on velocities
			positions[i + 1] -= velocities[i + 1];
			positions[i + 2] -= velocities[i + 2];
	
			// Reset position when snowflake falls below a certain y-level
			if (positions[i + 1] < minHeight) {
				positions[i] = (Math.random() * maxRange) - minRange;
				positions[i + 1] = (Math.random() * minRange) + minHeight; // Reset y to the top
				positions[i + 2] = (Math.random() * maxRange) - minRange;
			}
		}
	
		snowflakes.geometry.attributes.position.needsUpdate = true; // Correctly mark positions as needing an update
	}
	
	let count = true;
	function render(time) {
		time *= 0.001; // convert time to seconds

		updateSnow();

		const sin = Math.sin(time);
		const cos = Math.cos(time);

		pointLight.intensity = 125 + Math.sin(time * 2) * 100;
		
		shapes.forEach( (cube, ndx) => {
			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

			if (count === 0) {
				cube.position.y = 1 + sin * 0.25;
				count++;
			} else if (count === 1) {
				cube.position.y = 1 + sin * 0.25;
				count++;
			} else {
				cube.position.y = 1 + cos * 0.25;
				count = 0;
			}
		});

		htmlActions();
		
		{
			camera.updateProjectionMatrix();
		}

		
		//console.log("x",camera.position.x);
		//console.log("YYYY",camera.position.y);
		//console.log("z",camera.position.z);

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

}


// Camera values x: -10.05 y:0.9355 z: -21.576 
main();
