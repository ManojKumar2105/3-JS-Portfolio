import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { RGB_ETCr1_Format, TextureLoader } from 'three'
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const textureloader=new THREE.TextureLoader()
const texture=textureloader.load('/Fire.jpg')
const space=textureloader.load('/bluespace.webp')
const photo=textureloader.load('/MANOJ.jpeg')
const particle=textureloader.load('https://www.google.com/imgres?imgurl=https://img.freepik.com/free-vector/space-background-with-abstract-shape-stars_189033-30.jpg?w%3D2000&imgrefurl=https://www.freepik.com/free-photos-vectors/space-background&docid=VLLpHOFwWx0GwM&tbnid=S4YHmRC_diErgM&vet=1&w=2000&h=1133&hl=en-US&source=sh/x/im')
scene.background=space
const ambientlight=new THREE.AmbientLight('blue',1)
ambientlight.position.set(3,3,6)
const directionallight=new THREE.DirectionalLight('lightgreen',0.3)
directionallight.position.set(-5,0,3)
const fontloader=new THREE.FontLoader()
fontloader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textgeo=new THREE.TextBufferGeometry(
            'MANOJ KUMAR',
            {
                font:font,
                size:0.5,
                height:0.2,
                curveSegments:5,
                bevelEnabled:true,
                bevelThickness:0.03,
                bevelSize:0.02,
                bevelOffset:0,
                bevelSegments:4
            }
        )
        textgeo.center()
        const textmat=new THREE.MeshNormalMaterial({map:texture})
        const textmesh=new THREE.Mesh(textgeo,textmat)
        scene.add(textmesh)
    }

)
const particlegeo=new THREE.BufferGeometry()
const count=30000
const positions=new Float32Array(count*3)
const colors=new Float32Array(count*3)
for(let i=0;i<count*3;i++)
{
    positions[i]=(Math.random()-0.5)*20
    colors[i]=Math.random()
}
particlegeo.setAttribute('position',new THREE.BufferAttribute(positions,3))
particlegeo.setAttribute('color',new THREE.BufferAttribute(colors,3))
const pmat=new THREE.PointsMaterial()
pmat.size=0.2
pmat.sizeAttenuation=true
pmat.alphaMap=particle
pmat.depthWrite=false
pmat.blending=THREE.AdditiveBlending
pmat.vertexColors=true
const particles=new THREE.Points(particlegeo,pmat)
scene.add(particles)
const cube=new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1),new THREE.MeshBasicMaterial({map:photo}))
cube.position.x=4
scene.add(cube)
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    controls.update()
   particles.rotation.y=elapsedTime*0.2
   gsap.to(camera.position,{duration:1,delay:1,z:4})
    cube.rotation.y+=0.005
    camera.position.z+=Math.cos(elapsedTime*0.2)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)   
}
tick()