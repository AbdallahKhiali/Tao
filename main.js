import * as THREE from 'three' // ThreeJS
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // Orbit controls
// import * as dat from 'dat.gui' // Interface controller
import gsap from 'gsap' // Animation library
// import image from './image.jpg' // Texture
import vertexShader from './shaders/vertexShader.glsl' // A shader that handles the processing of individual vertices
import fragmentShader from './shaders/fragmentShader.glsl' // A shader that handles the processing of colors
import roma from "./assets/roma.jpg"
import alger from "./assets/alger.jpg"
import berlin from "./assets/berlin.jpg"
import * as dat from 'dat.gui';

/** Create an interface controller */
// const gui = new dat.GUI({ closed: true })
const data = {
  mouse: { x: 0, y: 0, k: 0.01 },
  progress: 0,
  speed: 0.0,
}



// gui.add(data, 'progress', 0, 1, 0.1)

/** Create a renderer */
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true })
renderer.setPixelRatio(window.devicePixelRatio) // Set device pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // Resize renderer
renderer.setClearColor('#0F111A', 1) // WebGL background color
renderer.physicallyCorrectLights = true // Use physically correct lighting mode
renderer.outputEncoding = THREE.sRGBEncoding // Output encoding

/** Setup a perspective camera */
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000)
camera.position.set(0, 0, 4)
/** Setup an orthographic camera */
// const frustum = 3
// const aspect = window.innerWidth / window.innerHeight
// const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000)
// camera.position.set(0, 0, -5)

/** Setup a camera controller */
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.dampingFactor = 0.05

/** Setup a scene */
const scene = new THREE.Scene()


/** Generate a plane geometry */


// const geometry = new THREE.PlaneBufferGeometry(1, 1, 32)
const geometry = new THREE.CylinderGeometry(10, 10, 30, 30, 1, 1, 0, Math.PI);




/** Generate a sphere geometry */
// const geometry = new THREE.SphereGeometry(1, 32, 32)

/** Load a texture */



let textures = [
  new THREE.TextureLoader().load(alger),
  new THREE.TextureLoader().load(berlin),
  new THREE.TextureLoader().load(roma),
]




let speed = 0;
let position = 0;

const textureLength = textures.length


let currentSlide = ((Math.floor(position) - 1) % textureLength + textureLength) % textureLength
let nextSlide = ((currentSlide + 1) % textureLength + textureLength) % textureLength


// const texture = new THREE.TextureLoader().load(image, t => {  })
// texture.minFilter = THREE.LinearFilter // Prevent image resizing

/** Create a material rendered with custom shaders */

// const texture = new THREE.TextureLoader().load(image)
// const texture2 = new THREE.TextureLoader().load(image2)


const videos = [
  document.createElement('video'),
  document.createElement('video'),
  document.createElement('video')
];

videos[1].src = './assets/video2.mp4';
videos[0].src = './assets/video3.mp4';
videos[2].src = './assets/video1.mp4';
// videos[1].src = 'path/to/video1.mp4';
// videos[2].src = 'path/to/video1.mp4';

videos.forEach((video) => {
  video.autoplay = true;
  video.load();
  video.loop = true;
  document.body.appendChild(video);
});


const playVideos = () => {
  videos.forEach(video => {
    video.play()
  });
  // document.removeEventListener('click', playVideos);
}


document.addEventListener('click', playVideos);



// console.log(document.querySelector(video))

const vids = videos.map((video) => {
  return new THREE.VideoTexture(video);
});


const material = new THREE.ShaderMaterial({
  extensions: {
    derivatives: '#extention GL_OES_standard_derivatives : enable'
  },
  uniforms: {
    uAspectRatio: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(data.mouse.x, data.mouse.y) },
    uProgress: { value: data.progress },
    uTime: { value: 0.0 },
    // uTexture1: { value: textures[0] },
    uTexture1: { value: vids[0] },
    // uTexture2: { value: textures[1] },
    uTexture2: { value: vids[1] },
    uResolution: { value: new THREE.Vector2(window.innerHeight, window.innerWidth) },
    // uTime: { value: 0 }
  },
  side: THREE.DoubleSide,
  // wireframe: true,
  // transparent: true,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
})

/** Setup a triangular polygon mesh */
const mesh = new THREE.Mesh(geometry, material)



mesh.rotation.y = Math.PI / 2


scene.add(mesh)

/** Window resize event handler */
const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)

  camera.aspect = window.innerWidth / window.innerHeight
  // camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * camera.position.z)) // Move the camera to fit a mesh to the screen
  // camera.fov = 2 * Math.atan((window.innerHeight / 2) / camera.position.z) * (180 / Math.PI) // Make the dimensions of the canvas the same as the document (1 === 1px)
  camera.updateProjectionMatrix()

  /** Scale the mesh to fit the screen */
  // if (window.innerWidth / window.innerHeight > 1) {
  //   mesh.scale.x = camera.aspect
  // } else {
  //   mesh.scale.y = 1 / camera.aspect
  // }

  /** Scale the mesh to fit the screen */
  // if (window.innerWidth / window.innerHeight > 1) {
  //   mesh.scale.x = mesh.scale.y = window.innerWidth / window.innerHeight
  // }

  /** Calculate aspect ratio */
  const imageAspectRatio = 1024 / 1920 // texture.image.width / texture.image.height
    // console.log(videos[position])
  // const imageAspectRatio = texture.image.width / texture.image.height


  const viewPortAspect = window.innerHeight / window.innerWidth
  if (viewPortAspect > imageAspectRatio) {
    material.uniforms.uAspectRatio.value.x = 1
    material.uniforms.uAspectRatio.value.y = viewPortAspect / imageAspectRatio
  } else {
    material.uniforms.uAspectRatio.value.x = imageAspectRatio / viewPortAspect
    material.uniforms.uAspectRatio.value.y = 1
  }
}
resize()
window.addEventListener('resize', resize)





/** Get mouse position */
window.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
  // From -1 to 1
  // data.mouse.x = x / window.innerWidth * 2 - 1
  // data.mouse.y = y / window.innerHeight * 2 - 1
  // From 0 to 1
  data.mouse.x = x / window.innerWidth
  data.mouse.y = y / window.innerHeight
})



document.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.0002
})



/** Main loop */
void function animate() {
  requestAnimationFrame(animate)



  position += speed

  speed *= 0.7

  let i = Math.round(position)

  let diff = i - position

  position += diff * 0.025

  if (Math.abs(i - position) < 0.001) {
    position = i;

  }


  let currentSlide = ((Math.floor(position) - 1) % textures.length + textures.length) % textures.length
  let nextSlide = ((currentSlide + 1) % textures.length + textures.length) % textures.length



  material.uniforms.uTime.value += 0.01



  /** Update uniform values */

  // console.log(textures[currentSlide])


  material.uniforms.uTexture1.value = vids[currentSlide]
  // material.uniforms.uTexture1.value = textures[currentSlide]
  // material.uniforms.uTexture2.value = textures[nextSlide]
  material.uniforms.uTexture2.value = vids[nextSlide]

  material.uniforms.uProgress.value = position

  material.uniforms.uMouse.value.x += (data.mouse.x - material.uniforms.uMouse.value.x) * data.mouse.k
  material.uniforms.uMouse.value.y += (data.mouse.y - material.uniforms.uMouse.value.y) * data.mouse.k


  // controls.update()
  renderer.render(scene, camera)
}()

