import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

function main() {
	// Set up canvas and renderer
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({antialias: true, canvas});


	const fov = 75;
	const aspect = 2;
	const near = 0.1;
	const far = 10;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	camera.position.z = 8;

	const scene = new THREE.Scene();

	// Creating and adding lighting to the scene
	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

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
	const radius = 2;
	const widthSegments = 20;
	const heightSegments = 20;
	const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

	// load textures
	const loader = new THREE.TextureLoader();
	function loadColorTexture(path) {
		const texture = loader.load(path);
		texture.colorSpace = THREE.SRGBColorSpace;
		return texture;
	}

	const background = loadColorTexture('resources/images/forest.jpg');
	scene.background = background;


	function makeInstance(geometry, texture, xPos, yPos) {
		// Create matrial from a color
		const material = new THREE.MeshBasicMaterial({map: texture});

		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		cube.position.x = xPos;
		cube.position.y = yPos;

		return cube;
	}


	function makeInstanceShapes(geometry, colorHex, xPos, yPos) {
		const material = new THREE.MeshPhongMaterial({color: colorHex});
		const shape = new THREE.Mesh(geometry, material);
		scene.add(shape);
		shape.position.x = xPos;
		shape.position.y = yPos;
		return shape;
	}

	// Add cube to the scene, then render it
	const shapes = [
		makeInstance(geometry, loadColorTexture('/resources/images/purplehaze.jpg'), 0, 1),
		makeInstanceShapes(cylinderGeometry, 0x7edea1, 5, 2),
		makeInstanceShapes(sphereGeometry, 0xd9d2e9, -4, 3)
	];

	{
		const mtlLoader = new MTLLoader;

		mtlLoader.load('resources/models/Umbreon.mtl', (mtl) => {
			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials(mtl);
			objLoader.load('resources/models/Umbreon.obj', (root) => {
				root.position.y = -3;
				root.rotation.y = 45;
				scene.add(root);
			})
		})
	}

	

	
	function render(time) {
		time *= 0.001; // convert time to seconds

		shapes.forEach( (cube, ndx) => {
			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;
		});

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

}



main();
