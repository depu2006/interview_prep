import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  Stars, 
  OrbitControls,
  PerspectiveCamera,
  Points,
  PointMaterial,
  Line,
  Text
} from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import './LandingPage.css'

const SkillPlanet = ({ radius, speed, color, name, size = 0.4 }) => {
  const ref = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.5) * 2, // Slight vertical wave
      Math.sin(t) * radius
    )
  })

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[size, 32, 32]}>
          <MeshDistortMaterial 
            color={color} 
            distort={0.3} 
            speed={2} 
            emissive={color} 
            emissiveIntensity={1}
          />
        </Sphere>
        <Text
          position={[0, size + 0.3, 0]}
          fontSize={0.2}
          color="white"
          font="https://fonts.gstatic.com/s/inter/v12/UcCOjAk9ooc48pW2E455Yw.woff"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </Float>
    </group>
  )
}

const SkillGalaxy = () => {
  const skills = [
    { name: "React", radius: 5, speed: 0.5, color: "#61dafb" },
    { name: "Python", radius: 7, speed: 0.3, color: "#ffd43b" },
    { name: "Node.js", radius: 9, speed: 0.2, color: "#68a063" },
    { name: "AWS", radius: 11, speed: 0.15, color: "#ff9900" },
    { name: "Machine Learning", radius: 13, speed: 0.1, color: "#ec4899" }
  ]

  return (
    <group position={[4, 0, 0]}>
      {/* Orbiting Skill Planets */}
      {skills.map((skill, i) => (
        <SkillPlanet key={i} {...skill} />
      ))}

      {/* Subtle Orbital Rings */}
      {skills.map((skill, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[skill.radius - 0.05, skill.radius + 0.05, 128]} />
          <meshBasicMaterial color="white" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

const ParticleField = () => {
  const points = useMemo(() => {
    const p = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40
      p[i * 3 + 1] = (Math.random() - 0.5) * 40
      p[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return p
  }, [])

  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20
    ref.current.rotation.y -= delta / 30
  })

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.3}
      />
    </Points>
  )
}

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#06b6d4" />
      <Stars radius={150} depth={50} count={10000} factor={4} saturation={0} fade speed={2} />
      <ParticleField />
      <SkillGalaxy />
    </>
  )
}

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="canvas-container">
        <Canvas dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="content-overlay">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-badge">Decision Intelligence — Module 1</div>
          
          <h1 className="hero-title">
            The Science of <br />
            <span className="gradient-text-hero">Rejection.</span>
          </h1>
          
          <p className="hero-desc">
            Your skills are a galaxy. We use AI to map the exact trajectory <br />
            between where you are and your target role.
          </p>
          
          <motion.button 
            className="cta-button shimmer"
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(139, 92, 246, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
          >
            Launch Neural Engine
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage
