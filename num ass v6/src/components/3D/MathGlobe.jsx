import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MathGlobe() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 3

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0f172a, 0.1)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create geometric sphere core
    const geometry = new THREE.IcosahedronGeometry(1, 4)
    const material = new THREE.MeshPhongMaterial({
      color: 0x00d9ff,
      wireframe: false,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.3,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1)
    light.position.set(5, 5, 5)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0x00d9ff, 0.5)
    scene.add(ambientLight)

    // Math symbols as particles around globe
    const mathSymbols = ['Σ', 'π', '∫', 'e', 'Lₙ', '∞', '√', 'φ', 'δ', 'λ']
    const particleGroup = new THREE.Group()
    scene.add(particleGroup)

    mathSymbols.forEach((symbol, i) => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#00d9ff'
      ctx.font = 'bold 120px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(symbol, 128, 128)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      
      const angle = (i / mathSymbols.length) * Math.PI * 2
      sprite.position.x = Math.cos(angle) * 2.5
      sprite.position.y = Math.sin(angle) * 2.5
      sprite.position.z = Math.cos(angle * 0.5) * 1.5
      sprite.scale.set(0.6, 0.6, 0.6)
      
      particleGroup.add(sprite)
    })

    // Animation loop
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Rotate globe
      globe.rotation.x += 0.0005
      globe.rotation.y += 0.001

      // Rotate particles
      particleGroup.rotation.x += 0.0002
      particleGroup.rotation.y += 0.0005

      // Pulsing glow
      material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.001) * 0.15

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 1 
      }} 
    />
  )
}
