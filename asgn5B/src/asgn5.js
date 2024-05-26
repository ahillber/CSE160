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
	const far = 100;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	camera.position.set(8, 3, 17);


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
	pointLight.position.set(-4.3, 1, -11.5)
	scene.add( pointLight );
	
	// point light for umbreon eyes
	const colorPoint2 = 0x1fdaff;
	const intensityPoint2 = 100;
	const pointLight2 = new THREE.PointLight(colorPoint2, intensityPoint2);
	pointLight2.position.set(0, -2, 8)
	scene.add( pointLight2 );

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


	// Creating skyBox geometry
	const skyBoxWidth = 50;
	const skyBoxHeight = 50;
	const skyBoxDepth = 50;
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
	const radius = 0.75;
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

	function makeSkyBox(geometry, texture, xPos, yPos) {
		const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});

		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		cube.position.x = xPos;
		cube.position.y = yPos;

		return cube;
	}
	makeSkyBox(skyBoxGeometry, loadColorTexture('../lib/resources/images/night.jpg'), 0, 0);

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
	makeGroundPlane(planeGeometry, loadColorTexture('../lib/resources/images/ground.jpg'), 0, -4.3);


	function makeInstance(geometry, texture, xPos, yPos, zPos) {
		// Create matrial from a color
		const material = new THREE.MeshPhongMaterial({map: texture});

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
		makeInstance(sphereGeometry, loadColorTexture('../lib/resources/images/purplehaze.jpg'), 2, -1.5, 5.5),
		makeInstance(sphereGeometry, loadColorTexture('../lib/resources/images/purplehaze.jpg'), -.25, -1.5, 5.5),
		makeInstance(sphereGeometry, loadColorTexture('../lib/resources/images/purplehaze.jpg'), -3, -1.5, 5.5),
	];
	function columnCandles() {
		for (let i=0; i<6; i++) {
			const candle = makeInstanceShapes(octoGeometry, 0x25b2ef, -20, 1, i*8 - 20);
			const candle2 = makeInstanceShapes(octoGeometry, 0x25b2ef, 20, 1, i*8 - 20); 
			shapes.push(candle);
			shapes.push(candle2);
		}
	}

	columnCandles();
	
	function staircase() {
		const texture = loadColorTexture('../lib/resources/images/ground.jpg');
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(2, 2);
		const material = new THREE.MeshPhongMaterial({map: texture});
		const base = new THREE.Mesh(new THREE.BoxGeometry(12,0.5,12), material);
		base.position.x = -1.5;
		base.position.y = -1;
		base.position.z = -6.5;
		scene.add(base);

		const stair = new THREE.Mesh(new THREE.BoxGeometry(13,0.5,13), material);
		stair.position.x = -1.5;
		stair.position.y = -1.5;
		stair.position.z = -6.5;
		scene.add(stair);

		const stair2 = new THREE.Mesh(new THREE.BoxGeometry(14,0.5,14), material);
		stair2.position.x = -1.5;
		stair2.position.y = -2;
		stair2.position.z = -6.5;
		scene.add(stair2);

		const stair3 = new THREE.Mesh(new THREE.BoxGeometry(15,0.5,15), material);
		stair3.position.x = -1.5;
		stair3.position.y = -2.5;
		stair3.position.z = -6.5;
		scene.add(stair3);

		const stair4 = new THREE.Mesh(new THREE.BoxGeometry(16,0.5,16), material);
		stair4.position.x = -1.5;
		stair4.position.y = -3;
		stair4.position.z = -6.5;
		scene.add(stair4);

		const stair5 = new THREE.Mesh(new THREE.BoxGeometry(17,0.5,17), material);
		stair5.position.x = -1.5;
		stair5.position.y = -3.5;
		stair5.position.z = -6.5;
		scene.add(stair5);

	}
	
	staircase();
	

	{
		const mtlLoader = new MTLLoader;

		mtlLoader.load('../lib/resources/models/Umbreon.mtl', (mtl) => {
			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials(mtl);
			objLoader.load('../lib/resources/models/Umbreon.obj', (root) => {
				root.position.set(0, -3, 10);
				root.rotation.y = degreesToRadians(180);
				scene.add(root);
			})
		})
	}

	{
		const loader = new GLTFLoader();
		loader.load( '../lib/resources/models/trainer/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			model.rotation.x = degreesToRadians(-10);
			model.position.set(0, -0.3, -8);
			scene.add( gltf.scene );


		}, undefined, function ( error ) {

			console.error( error );

		} );

		loader.load( '../lib/resources/models/column/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			//model.rotation.x = degreesToRadians(-10);
			model.position.set(0, -4.2, -2);
			model.scale.setScalar(0.02);
			//scene.add( gltf.scene );

			for (let i=0; i<6; i++) {
				const dup = model.clone();
				const dup2 = model.clone();
				dup.position.set(-20, -4.2,  i*8 - 20);
				dup2.position.set(20, -4.2, i*8 - 20);
				scene.add(dup);
				scene.add(dup2);
			}

		}, undefined, function ( error ) {

			console.error( error );

		} );

		loader.load('../lib/resources/models/charizard/scene.gltf', function ( gltf ) {
			const model = gltf.scene;
			model.position.set(-4,-0.3,-6);
			scene.add(model);
		} , undefined, function ( error ) {

			console.error( error );

		} );
	}
	

	
	function render(time) {
		time *= 0.001; // convert time to seconds

		
		shapes.forEach( (cube, ndx) => {
			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;
		});
		
		{
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

}



main();
