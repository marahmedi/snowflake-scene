import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

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

const geometry = new THREE.SphereGeometry(30, 64, 64)
const material = new THREE.MeshBasicMaterial({
    map: background
})

const mesh = new THREE.Mesh(geometry, material)
mesh.material.side = THREE.BackSide
scene.add(mesh)

/**
 * Particles
 */

const particlesGeometry = new THREE.BufferGeometry()
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true // to specify if distant particles should be smaller than close particles
})
const count = 5000

const positions = new Float32Array(count * 3)

for(let i=0; i<count * 3; i++){
    positions[i] = (Math.random()- 0.5) * 50
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()