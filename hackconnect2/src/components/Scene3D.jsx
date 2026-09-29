import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function DistortShape({ position, scale, color }) {
  const ref = useRef()
  const baseY = position[1]
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.x = t * 0.12
      ref.current.rotation.y = t * 0.09
      ref.current.position.y = baseY + Math.sin(t * 0.6) * 0.2
    }
  })
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} transparent opacity={0.55} />
    </mesh>
  )
}

function WireShape({ position, scale, color, speed }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.x = t * speed * 0.2
      ref.current.rotation.y = t * speed * 0.15
    }
  })
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.25} />
    </mesh>
  )
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.3} color="#818CF8" />
      <pointLight position={[-5, -3, 3]} intensity={0.9} color="#22D3EE" />
      <DistortShape position={[-2.3, 1.1, -1]} scale={1} color="#6366F1" />
      <DistortShape position={[2.5, -1.3, -1.5]} scale={0.65} color="#22D3EE" />
      <WireShape position={[-2, -1.6, -2]} scale={0.8} color="#818CF8" speed={0.6} />
      <WireShape position={[2.2, 1.5, -2]} scale={0.55} color="#38BDF8" speed={0.8} />
    </Canvas>
  )
}