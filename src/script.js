import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

//Texture Loader
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('/9.png');
const earthMapTexture = textureLoader.load('/earth.jpg');
const earthNormalTexture = textureLoader.load('/earthNormal.png');
const moonMapTexture = textureLoader.load('/moon.png');

// Objects
const fullearth = new THREE.Group();
scene.add(fullearth);
//earth
const earthGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthMapTexture });
earthMaterial.normalMap = earthNormalTexture;
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// scene.add(earth);

const earthOrbitGeometry = new THREE.TorusGeometry(2, 0.005, 16, 200, 6.3);
const earthOrbitMaterial = new THREE.MeshBasicMaterial({ color: '#333' });

const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
earthOrbit.rotation.x = Math.PI * 0.5;
// scene.add(earthOrbit);

const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonMapTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// scene.add(moon);
fullearth.add(earth, moon, earthOrbit);
fullearth.position.x = 1.5;
//star
const count = 10000;
const pointsArray = new Float32Array(count * 3);
const pointGeometry = new THREE.BufferGeometry();
for (let i = 0; i < count; i++) {
	let i3 = i * 3;
	pointsArray[i3] = (Math.random() - 0.5) * 30;
	pointsArray[i3 + 1] = (Math.random() - 0.5) * 30;
	pointsArray[i3 + 2] = (Math.random() - 1.5) * 5;
}

pointGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(pointsArray, 3)
);

const pointMaterial = new THREE.PointsMaterial({
	size: 0.1,
});
pointMaterial.transparent = true;
pointMaterial.alphaMap = starTexture;
pointMaterial.alphaTest = 0.1;
const points = new THREE.Points(pointGeometry, pointMaterial);
scene.add(points);
// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.set(0, 0.5, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	earth.rotation.y = elapsedTime * 0.1;
	points.rotation.z = elapsedTime * 0.02;

	//moon
	moon.position.x = Math.sin(elapsedTime) * 2;
	moon.position.z = Math.cos(elapsedTime) * 2;
	// Update Orbital Controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
