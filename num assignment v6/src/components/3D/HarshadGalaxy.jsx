import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HarshadGalaxy() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0f172a, 0.05)
    containerRef.current.appendChild(renderer.domElement)

    // Function to check Harshad number
    const isHarshad = (num) => {
      const digitSum = num.toString().split('').reduce((a, b) => a + parseInt(b), 0)
      return num % digitSum === 0
    }

    // Create spiral galaxy
    const group = new THREE.Group()
    scene.add(group)

    for (let i = 1; i <= 200; i++) {
      const angle = (i / 20) * Math.PI
      const radius = i * 0.5
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 10

      const geometry = new THREE.SphereGeometry(0.3, 8, 8)
      const material = new THREE.MeshPhongMaterial({
        color: isHarshad(i) ? 0x00d9ff : 0xff6b6b,
        emissive: isHarshad(i) ? 0x00d9ff : 0xff3333,
        emissiveIntensity: 0.6,
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(x, y, z)
      
      group.add(sphere)
    }

    // Mouse rotation
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    document.addEventListener('mousemove', onMouseMove)

    // Animation
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      group.rotation.x += mouseY * 0.0005
      group.rotation.y += mouseX * 0.0005
      group.rotation.z += 0.0002
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
}
