import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Materials with subtle colors
    const materials = [
      new THREE.MeshLambertMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.1 }),
      new THREE.MeshLambertMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.08 }),
      new THREE.MeshLambertMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.12 }),
      new THREE.MeshLambertMaterial({ color: 0x10b981, transparent: true, opacity: 0.09 }),
    ];

    // Create geometric shapes
    const shapes: THREE.Mesh[] = [];

    // Cubes
    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const cube = new THREE.Mesh(geometry, materials[i % materials.length]);
      cube.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(cube);
      shapes.push(cube);
    }

    // Spheres
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const sphere = new THREE.Mesh(geometry, materials[(i + 1) % materials.length]);
      sphere.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      scene.add(sphere);
      shapes.push(sphere);
    }

    // Torus
    for (let i = 0; i < 2; i++) {
      const geometry = new THREE.TorusGeometry(0.6, 0.2, 8, 16);
      const torus = new THREE.Mesh(geometry, materials[(i + 2) % materials.length]);
      torus.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      torus.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(torus);
      shapes.push(torus);
    }

    // Octahedrons
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.OctahedronGeometry(0.7);
      const octahedron = new THREE.Mesh(geometry, materials[(i + 3) % materials.length]);
      octahedron.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      octahedron.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(octahedron);
      shapes.push(octahedron);
    }

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate shapes slowly
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.002 + index * 0.0005;
        shape.rotation.y += 0.003 + index * 0.0003;
        shape.rotation.z += 0.001 + index * 0.0007;

        // Gentle floating motion
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Dispose geometries and materials
      shapes.forEach(shape => {
        shape.geometry.dispose();
        if (Array.isArray(shape.material)) {
          shape.material.forEach(material => material.dispose());
        } else {
          shape.material.dispose();
        }
      });
      
      materials.forEach(material => material.dispose());
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full -z-10"
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)'
      }}
    />
  );
}