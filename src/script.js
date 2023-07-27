import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


THREE.ColorManagement.enabled = false

// constants

let particles;
let positions = [], velocities = []
const count = 30000
const maxRange = 1000, minRange = maxRange/2;
const minHeight = 150;


/**
 * Base
 */


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const background = textureLoader.load('../textures/background.jpg')
const snowflake = textureLoader.load('../textures/particles/snowflake.png')

/**
 * Sphere
 */

const geometry = new THREE.SphereGeometry(40, 20, 50)
const material = new THREE.MeshBasicMaterial({
    map: background
})

const world = new THREE.Mesh(geometry, material)
world.material.side = THREE.BackSide
scene.add(world)

/**
 * Particles
 */

const particlesGeometry = new THREE.BufferGeometry()
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.8,
    sizeAttenuation: true, // to specify if distant particles should be smaller than close particles
    blending: THREE.AdditiveBlending,
    map: snowflake,
    depthTest: false,
    transparent: true,
})


const addSnowflakes = () => {
    for(let i=0; i<count * 3; i++){
        positions.push(
            Math.floor(Math.random() * maxRange - minRange), // x position fom -500 to 500
            Math.floor(Math.random() * minRange - minHeight), // y position fom -250 to 750
            Math.floor(Math.random() * maxRange - minRange) // z position fom -500 to 500
        )
        velocities.push(
            Math.floor(Math.random() * 1.7) * 0.05,
            Math.floor(Math.random() * 2) * 0.14,
            Math.floor(Math.random() * 6-3) * 0.05
        )
    
    }
}
addSnowflakes()




particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))
console.log(particlesGeometry)

// Points
particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.z = 20
camera.position.y = -4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableZoom = false
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const updateParticles = () => {
    for(let i = 0; i < count * 3; i+=3){
        particles.geometry.attributes.position.array[i] -= particles.geometry.attributes.velocity.array[i]
        particles.geometry.attributes.position.array[i+1] -= particles.geometry.attributes.velocity.array[i+1]
        particles.geometry.attributes.position.array[i+2] -= particles.geometry.attributes.velocity.array[i+2]

        if(particles.geometry.attributes.position.array[i+1] < -100){
            particles.geometry.attributes.position.array[i] =  Math.floor(Math.random() * maxRange - minRange), // x position fom -500 to 500
            particles.geometry.attributes.position.array[i+1] = Math.floor(Math.random() * minRange - minHeight), // y position fom -250 to 750
            particles.geometry.attributes.position.array[i+2] = Math.floor(Math.random() * maxRange - minRange) // z position fom -500 to 500
        }
    }
    // To let GPU know it needs to update the positions array we need to write below line
    particles.geometry.attributes.position.needsUpdate = true;
}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    updateParticles()
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()