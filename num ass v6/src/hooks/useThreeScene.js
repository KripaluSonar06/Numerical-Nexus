import { useEffect, useRef } from 'react'

export function useThreeScene(setupFn) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !setupFn) return

    const cleanup = setupFn(containerRef.current, {
      scene: sceneRef,
      renderer: rendererRef,
      camera: cameraRef
    })

    return cleanup
  }, [setupFn])

  return containerRef
}
