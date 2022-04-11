import { Component, OnInit } from '@angular/core';
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AnimationMixer,
  PlaneGeometry,
  MeshStandardMaterial,
  AmbientLight,
  DirectionalLight,
  PCFSoftShadowMap
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    /**
    * Base
    */
    // Debug
    // const gui = new dat.GUI()

    // Canvas
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

    // Scene
    const scene = new Scene()

    /**
     * Models
     */

    const gltfLoader = new GLTFLoader()

    let mixer!: AnimationMixer

    gltfLoader.load(
      '/assets/models/spaceship/scene.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.01, 0.01, 0.01)
        scene.add(gltf.scene)

        // Animation
        // mixer = new AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[0])
        // action.play()
      }
    )

    /**
     * Lights
     */
    const ambientLight = new AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 0.6)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = - 7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = - 7
    directionalLight.position.set(- 5, 5, 0)
    scene.add(directionalLight)

    /**
     * Sizes
     */
    const sizes = {
      width: 1000,
      height: 800
    }

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = 800
      sizes.height = 800

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
    const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0, 5, 10)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 0.75, 0)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new WebGLRenderer({
      canvas: canvas,
      alpha: true
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */
    const clock = new Clock()
    let previousTime = 0

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime

      camera.position.x = 10 * Math.sin(elapsedTime)
      // camera.position.y = 5*Math.cos(elapsedTime)
      // Model animation
      // if (mixer) {
      //   mixer.update(deltaTime)
      // }

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()
  }

}
