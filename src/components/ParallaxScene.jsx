import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxScene() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const shapesRef = useRef([])
  const parallaxGroupsRef = useRef([])
  const scrollYRef = useRef(0)
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0a0a0a, 1)

    // Camera position
    camera.position.z = 15

    // Parallax groups for different layer speeds
    const parallaxGroups = [
      new THREE.Group(), // Foreground - fastest
      new THREE.Group(), // Mid-ground
      new THREE.Group(), // Background - slowest
    ]

    parallaxGroups.forEach((group) => scene.add(group))
    parallaxGroupsRef.current = parallaxGroups

    // Materials - bright wireframes for dark mode
    const brightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    })

    const accentMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })

    const dustMaterial = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })

    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    })

    // Create geometric shapes
    function createGeometry(type, size, material) {
      let geometry

      switch (type) {
        case 'sphere':
          geometry = new THREE.SphereGeometry(size, 16, 16)
          break
        case 'box':
          geometry = new THREE.BoxGeometry(size, size, size)
          break
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(size)
          break
        case 'tetrahedron':
          geometry = new THREE.TetrahedronGeometry(size)
          break
        case 'torus':
          geometry = new THREE.TorusGeometry(size, size * 0.3, 8, 16)
          break
        default:
          geometry = new THREE.SphereGeometry(size, 12, 12)
      }

      return new THREE.Mesh(geometry, material)
    }

    // Populate parallax layers
    const shapes = []
    const shapeTypes = ['sphere', 'box', 'octahedron', 'tetrahedron', 'torus']
    const materials = [brightMaterial, accentMaterial, highlightMaterial]

    // Layer 1 - Foreground (fastest parallax)
    for (let i = 0; i < 20; i++) {
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const material = materials[Math.floor(Math.random() * materials.length)]
      const shape = createGeometry(type, Math.random() * 1.2 + 0.6, material)

      shape.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35,
        Math.random() * 10 + 5
      )

      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      parallaxGroups[0].add(shape)
      shapes.push({
        mesh: shape,
        layer: 0,
        speed: Math.random() * 0.6 + 0.9,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        initialY: shape.position.y,
      })
    }

    // Layer 2 - Mid-ground
    for (let i = 0; i < 30; i++) {
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const shape = createGeometry(type, Math.random() * 1.5 + 0.8, brightMaterial)

      shape.position.set(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 45,
        Math.random() * 15 - 5
      )

      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      parallaxGroups[1].add(shape)
      shapes.push({
        mesh: shape,
        layer: 1,
        speed: Math.random() * 0.4 + 0.5,
        rotationSpeed: (Math.random() - 0.5) * 0.018,
        initialY: shape.position.y,
      })
    }

    // Layer 3 - Background (slowest parallax)
    for (let i = 0; i < 40; i++) {
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const shape = createGeometry(type, Math.random() * 2.0 + 0.5, dustMaterial)

      shape.position.set(
        (Math.random() - 0.5) * 90,
        (Math.random() - 0.5) * 60,
        Math.random() * 20 - 20
      )

      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      parallaxGroups[2].add(shape)
      shapes.push({
        mesh: shape,
        layer: 2,
        speed: Math.random() * 0.25 + 0.15,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        initialY: shape.position.y,
      })
    }

    shapesRef.current = shapes

    // Mouse movement
    const handleMouseMove = (event) => {
      mouseXRef.current = (event.clientX / window.innerWidth) * 2 - 1
      mouseYRef.current = -(event.clientY / window.innerHeight) * 2 + 1
    }

    document.addEventListener('mousemove', handleMouseMove)

    // Scroll tracking
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollYRef.current = self.progress
      },
    })

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)

      const parallaxGroups = parallaxGroupsRef.current
      const shapes = shapesRef.current

      // Parallax movement based on scroll
      parallaxGroups[0].position.y = scrollYRef.current * 25 // Fastest
      parallaxGroups[1].position.y = scrollYRef.current * 15 // Medium
      parallaxGroups[2].position.y = scrollYRef.current * 8 // Slowest

      // Mouse parallax
      parallaxGroups[0].rotation.x = mouseYRef.current * 0.12
      parallaxGroups[0].rotation.y = mouseXRef.current * 0.12
      parallaxGroups[1].rotation.x = mouseYRef.current * 0.06
      parallaxGroups[1].rotation.y = mouseXRef.current * 0.06
      parallaxGroups[2].rotation.x = mouseYRef.current * 0.03
      parallaxGroups[2].rotation.y = mouseXRef.current * 0.03

      // Individual shape animations
      shapes.forEach((shapeData) => {
        const { mesh, rotationSpeed } = shapeData

        // Rotation
        mesh.rotation.x += rotationSpeed
        mesh.rotation.y += rotationSpeed * 0.8
        mesh.rotation.z += rotationSpeed * 0.5

        // Floating motion
        mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.position.x) * 0.015

        // Wrap around effect for continuous scrolling
        if (mesh.position.y < -40) {
          mesh.position.y = 40
        } else if (mesh.position.y > 40) {
          mesh.position.y = -40
        }
      })

      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    animate()

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      renderer.dispose()
    }
  }, [])

  return <canvas id="canvas" ref={canvasRef} />
}

