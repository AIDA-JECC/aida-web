import React,{useState,useRef,Suspense} from 'react'
import { Canvas,useFrame } from '@react-three/fiber'
import { Points,PointMaterial,Preload } from '@react-three/drei'

import './Stars.css'

const Stars = (props) => {
  const ref=useRef();
  // Generate points and validate them to ensure no NaN values
  // Manual random point generation to ensure validity
  const generateSpherePoints = (count, radius) => {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.cbrt(Math.random()) * radius;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      points[i * 3] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    }
    return points;
  };

  const [sphere] = useState(() => generateSpherePoints(5000, 1.2));

  useFrame((state,delta)=>{
    ref.current.rotation.x -=delta/20;
    ref.current.rotation.y -=delta/25;
  })

  return (
    <group rotation={[0,0,Math.PI/4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
         transparent
         color='#f272c8'
         size={0.002}
         sizeAttenuation={true}
         depthWrite={false}
        />
      </Points>
    </group>
  )
}

const StarsCanvas=()=>{
  return(
  <div className='star_alignment'>
      <Canvas camera={{position:[0,0,1]}}>
        <Suspense fallback={null}>
          <Stars/>
        </Suspense>
      </Canvas>
  </div>
 
  )
}

export default StarsCanvas;