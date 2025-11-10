import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GaussLegendreViz() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 20, 30)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0f172a, 0.05)
    containerRef.current.appendChild(renderer.domElement)

    // Analytical curve (smooth cyan)
    const analyticalCurve = new THREE.BufferGeometry()
    const analyticalPoints = []
    for (let x = -Math.PI; x <= Math.PI; x += 0.1) {
      const y = Math.sin(x) * Math.cos(x / 2)
      analyticalPoints.push(x, y, 0)
    }
    analyticalCurve.setAttribute('position', new THREE.BufferAttribute(new Float32Array(analyticalPoints), 3))
    const analyticalLine = new THREE.Line(
      analyticalCurve,
      new THREE.LineBasicMaterial({ color: 0x00d9ff, linewidth: 3 })
    )
    scene.add(analyticalLine)

    // Numerical solution (dotted magenta)
    const numericalCurve = new THREE.BufferGeometry()
    const numericalPoints = []
    for (let x = -Math.PI; x <= Math.PI; x += 0.3) {
      const y = Math.sin(x) * Math.cos(x / 2) + (Math.random() - 0.5) * 0.1
      numericalPoints.push(x, y, 0)
    }
    numericalCurve.setAttribute('position', new THREE.BufferAttribute(new Float32Array(numericalPoints), 3))
    const numericalLine = new THREE.Line(
      numericalCurve,
      new THREE.LineBasicMaterial({ 
        color: 0xff00ff, 
        linewidth: 2 
      })
    )
    scene.add(numericalLine)

    // Error overlay text
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 217, 255, 0.8)'
    ctx.font = 'bold 40px Arial'
    ctx.fillText('Error(t) = 0.00023', 50, 100)
    
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material)
    mesh.position.y = 5
    scene.add(mesh)

    // Camera orbit
    let angle = 0
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      angle += 0.0005
      camera.position.x = Math.sin(angle) * 30
      camera.position.z = Math.cos(angle) * 30
      camera.lookAt(0, 0, 0)
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
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
}
