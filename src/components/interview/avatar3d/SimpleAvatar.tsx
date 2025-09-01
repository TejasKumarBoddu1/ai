import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface SimpleAvatarProps {
  width?: number;
  height?: number;
  isSpeaking?: boolean;
  visemeHint?: string;
}

type SkinnedOrMesh = (THREE.SkinnedMesh | THREE.Mesh) & {
  morphTargetDictionary?: { [name: string]: number };
  morphTargetInfluences?: number[];
};

function useRpmMorphController(root: THREE.Object3D | null) {
  const meshesRef = useRef<SkinnedOrMesh[]>([]);
  const hasMorphsRef = useRef(false);

  useEffect(() => {
    meshesRef.current = [];
    hasMorphsRef.current = false;
    if (!root) return;
    
    console.log('🔍 Scanning for morph targets in model...');
    root.traverse((child) => {
      const mesh = child as SkinnedOrMesh;
      if (
        (mesh as any).isMesh &&
        mesh.morphTargetInfluences &&
        mesh.morphTargetDictionary
      ) {
        console.log('✅ Found mesh with morphs:', mesh.name);
        console.log('📋 Available morph targets:', Object.keys(mesh.morphTargetDictionary));
        console.log('🔢 Morph target count:', mesh.morphTargetInfluences.length);
        meshesRef.current.push(mesh);
        hasMorphsRef.current = true;
      }
    });
    
    if (hasMorphsRef.current) {
      console.log('🎯 Total meshes with morphs:', meshesRef.current.length);
    } else {
      console.warn('⚠️ No meshes with morph targets found!');
    }
  }, [root]);

  const setMorph = (name: string, value: number) => {
    if (!hasMorphsRef.current) {
      console.warn('❌ No morph targets available');
      return;
    }
    
    let applied = false;
    meshesRef.current.forEach((mesh) => {
      const dict = mesh.morphTargetDictionary!;
      const idx = dict[name];
      if (idx !== undefined && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[idx] = value;
        applied = true;
        console.log(`✅ Applied morph target: ${name} = ${value} on mesh: ${mesh.name}`);
      }
    });
    
    if (!applied) {
      console.warn(`❌ Morph target "${name}" not found in any mesh`);
      console.log('🔍 Available targets:', meshesRef.current.map(m => Object.keys(m.morphTargetDictionary!)).flat());
    }
  };

  const resetMouth = () => {
    // Only reset the morph targets that actually exist in the model
    const availableTargets = ['mouthOpen', 'mouthSmile'];
    availableTargets.forEach((k) => setMorph(k, 0));
    console.log('🔄 Reset all mouth morph targets');
  };

  return { setMorph, resetMouth };
}

function BackgroundImage() {
  const texture = useTexture('/ai-interview-agent-master/blur-focus-white-open-space-600nw-2179136893.webp');
  
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function GLBModel({ url }: { url: string }) {
  const sanitizedUrl = useMemo(() => encodeURI(url), [url]);
  const gltf = useGLTF(sanitizedUrl);
  const rootRef = useRef<THREE.Group>(null);
  const { setMorph, resetMouth } = useRpmMorphController(rootRef.current);

  // Expose minimal global helpers for quick testing
  useEffect(() => {
    (window as any).rpmSetMorph = (name: string, value: number) => {
      setMorph(name, Math.max(0, Math.min(1, value)));
    };
    (window as any).rpmResetMouth = () => resetMouth();
  }, [setMorph, resetMouth]);

  // Simple idle micro-movement on mouthClose to keep face alive (very subtle)
  const tRef = useRef(0);
  useFrame((_, delta) => {
    tRef.current += delta;
    const subtle = 0.02 * (1 + Math.sin(tRef.current * 1.2)) * 0.5; // 0..0.02
    setMorph('mouthClose', subtle);
  });

  return <primitive ref={rootRef as any} object={gltf.scene} />;
}

useGLTF.preload(encodeURI('/avatar/r3f-virtual-girlfriend-frontend-main/public/models/6895887a79ea9df733057f4d (1).glb'));

const SimpleAvatar: React.FC<SimpleAvatarProps> = ({ width = 346, height = 193, isSpeaking, visemeHint }) => {
  const modelUrl = '/avatar/r3f-virtual-girlfriend-frontend-main/public/models/6895887a79ea9df733057f4d (1).glb';
  
  // Animation state refs
  const fallbackAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up all animations
  const stopAllAnimations = () => {
    if (fallbackAnimationRef.current) {
      clearTimeout(fallbackAnimationRef.current);
      fallbackAnimationRef.current = null;
    }
    if (idleAnimationRef.current) {
      clearTimeout(idleAnimationRef.current);
      idleAnimationRef.current = null;
    }
  };

  // Start natural idle movements
  const startIdleAnimations = () => {
    if (idleAnimationRef.current) return; // Already running
    
    const idleAnimation = () => {
      if (isSpeaking) {
        // Don't run idle animations while speaking
        return;
      }
      
      // Random subtle movements for natural look
      const movements = [
        // Subtle eye movements and blinking
        () => {
          if ((window as any).rpmSetMorph && !isSpeaking) {
            // Simulate natural blinking
            const shouldBlink = Math.random() > 0.8;
            if (shouldBlink) {
              console.log('👁️ Idle: Blinking');
              // Apply subtle eye movement if available
              // Note: Would need eye morph targets for full effect
            }
          }
        },
        // Subtle mouth movements (micro-expressions)
        () => {
          if ((window as any).rpmSetMorph && !isSpeaking) {
            const microExpression = Math.random();
            if (microExpression > 0.9) {
              // Very subtle smile
              console.log('😊 Idle: Micro-smile');
              (window as any).rpmSetMorph('mouthSmile', 0.1);
              setTimeout(() => {
                if (!isSpeaking) {
                  (window as any).rpmSetMorph('mouthSmile', 0.0);
                }
              }, 200);
            }
          }
        },
        // Breathing simulation using mouthOpen
        () => {
          if ((window as any).rpmSetMorph && !isSpeaking) {
            const time = Date.now() * 0.002; // Slower breathing
            const breathIntensity = 0.05 + Math.sin(time) * 0.03; // Very subtle
            console.log('🫁 Idle: Breathing movement');
            (window as any).rpmSetMorph('mouthOpen', breathIntensity);
          }
        },
        // Subtle head movements (if rotation morphs available)
        () => {
          if ((window as any).rpmSetMorph && !isSpeaking) {
            const headMovement = Math.random();
            if (headMovement > 0.95) {
              console.log('🔄 Idle: Subtle head adjustment');
              // Note: Would need head rotation morph targets for full effect
            }
          }
        },
        // Body micro-movements
        () => {
          if ((window as any).rpmSetMorph && !isSpeaking) {
            const bodyMovement = Math.random();
            if (bodyMovement > 0.98) {
              console.log('🔄 Idle: Body micro-adjustment');
              // Note: Would need body morph targets for full effect
            }
          }
        }
      ];
      
      // Pick a random movement
      const randomMovement = movements[Math.floor(Math.random() * movements.length)];
      randomMovement();
      
      // Schedule next idle movement
      if (!isSpeaking) {
        idleAnimationRef.current = setTimeout(idleAnimation, 1500 + Math.random() * 2500); // 1.5-4 seconds
      }
    };
    
    // Start idle animation
    idleAnimation();
  };

  // Watch for visemeHint changes (real-time TTS phoneme data)
  useEffect(() => {
    console.log('🔍 SimpleAvatar: visemeHint changed to:', visemeHint);
    
    if (visemeHint && isSpeaking) {
      console.log('🎯 TTS Viseme received:', visemeHint);
      
      // Map Google TTS visemes to our available morph targets
      const visemeToMorph = (viseme: string) => {
        const visemeLower = viseme.toLowerCase();
        
        // Vowel sounds - open mouth
        if (['a', 'aa', 'ah', 'ay', 'e', 'eh', 'ey', 'i', 'ih', 'iy', 'o', 'ow', 'oy', 'u', 'uh', 'uw'].includes(visemeLower)) {
          return { open: 0.9, smile: 0.0 };
        }
        
        // Consonant sounds - varying mouth positions
        if (['b', 'p', 'm'].includes(visemeLower)) {
          return { open: 0.2, smile: 0.0 }; // Closed lips
        }
        
        if (['f', 'v'].includes(visemeLower)) {
          return { open: 0.1, smile: 0.0 }; // Very small opening
        }
        
        if (['k', 'g', 'ng'].includes(visemeLower)) {
          return { open: 0.4, smile: 0.0 }; // Medium opening
        }
        
        if (['s', 'z', 'sh', 'zh'].includes(visemeLower)) {
          return { open: 0.3, smile: 0.1 }; // Small opening with slight smile
        }
        
        if (['l', 'r'].includes(visemeLower)) {
          return { open: 0.5, smile: 0.0 }; // Medium opening
        }
        
        if (['t', 'd', 'n'].includes(visemeLower)) {
          return { open: 0.3, smile: 0.0 }; // Small opening
        }
        
        // Default - moderate opening
        return { open: 0.6, smile: 0.0 };
      };
      
      const morphState = visemeToMorph(visemeHint);
      console.log(`🎭 Applying TTS viseme: ${visemeHint} -> mouthOpen=${morphState.open}, mouthSmile=${morphState.smile}`);
      
      // Apply the morph targets immediately
      if ((window as any).rpmSetMorph) {
        (window as any).rpmSetMorph('mouthOpen', morphState.open);
        (window as any).rpmSetMorph('mouthSmile', morphState.smile);
      }
    }
  }, [visemeHint, isSpeaking]);

  // Watch for isSpeaking changes and trigger lip-sync
  useEffect(() => {
    console.log('🔍 SimpleAvatar: isSpeaking prop changed to:', isSpeaking);
    console.log('🔍 SimpleAvatar: rpmSetMorph available:', !!(window as any).rpmSetMorph);
    console.log('🔍 SimpleAvatar: rpmResetMouth available:', !!(window as any).rpmResetMouth);
    
    if (isSpeaking) {
      console.log('🗣️ Ava is speaking - starting fallback animation while waiting for TTS visemes...');
      
      // Stop idle animations while speaking
      if (idleAnimationRef.current) {
        clearTimeout(idleAnimationRef.current);
        idleAnimationRef.current = null;
      }
      
      // Start fallback animation if no TTS visemes are coming
      const fallbackAnimation = () => {
        if (!isSpeaking) {
          console.log('🛑 Fallback animation stopped - isSpeaking is now false');
          return;
        }
        
        // Only run fallback if no TTS visemes are being received
        if (!visemeHint) {
          console.log('🔄 Running fallback animation (no TTS visemes)');
          
          // Cycle through mouth movements for natural speaking
          const mouthStates = [
            { open: 0.8, smile: 0.0 },
            { open: 0.4, smile: 0.1 },
            { open: 0.9, smile: 0.0 },
            { open: 0.3, smile: 0.2 },
            { open: 0.7, smile: 0.0 }
          ];
          
          let currentIndex = 0;
          
          const animate = () => {
            if (!isSpeaking) {
              console.log('🛑 Fallback animation frame stopped - isSpeaking is now false');
              return;
            }
            
            // If we now have TTS visemes, stop fallback
            if (visemeHint) {
              console.log('🎯 TTS visemes detected - stopping fallback animation');
              return;
            }
            
            const state = mouthStates[currentIndex];
            console.log(`🎭 Fallback animation frame ${currentIndex}: mouthOpen=${state.open}, mouthSmile=${state.smile}`);
            
            // Apply current mouth state
            if ((window as any).rpmSetMorph) {
              console.log(`✅ Applying fallback morph targets: mouthOpen=${state.open}, mouthSmile=${state.smile}`);
              (window as any).rpmSetMorph('mouthOpen', state.open);
              (window as any).rpmSetMorph('mouthSmile', state.smile);
            } else {
              console.warn('❌ rpmSetMorph not available during fallback animation');
            }
            
            // Move to next state
            currentIndex = (currentIndex + 1) % mouthStates.length;
            
            // Continue animation while speaking and no TTS visemes
            if (isSpeaking && !visemeHint) {
              fallbackAnimationRef.current = setTimeout(animate, 150); // 150ms per frame for natural speech rhythm
            }
          };
          
          animate();
        }
      };
      
      // Start fallback animation after a short delay to see if TTS visemes arrive
      fallbackAnimationRef.current = setTimeout(fallbackAnimation, 100);
      
    } else {
      console.log('🔇 Ava stopped speaking - stopping all animations and resetting mouth');
      
      // Stop all speaking animations
      stopAllAnimations();
      
      // Reset mouth when not speaking
      if ((window as any).rpmResetMouth) {
        (window as any).rpmResetMouth();
      } else {
        console.warn('❌ rpmResetMouth not available');
      }
      
      // Start natural idle movements after a short delay
      setTimeout(() => {
        if (!isSpeaking) {
          console.log('🌱 Starting natural idle movements');
          startIdleAnimations();
        }
      }, 500);
    }
  }, [isSpeaking, visemeHint]);

  // Start idle animations when component mounts
  useEffect(() => {
    if (!isSpeaking) {
      setTimeout(() => {
        if (!isSpeaking) {
          console.log('🌱 Initial idle movements started');
          startIdleAnimations();
        }
      }, 1000);
    }
    
    // Cleanup on unmount
    return () => {
      stopAllAnimations();
    };
  }, []);

  // Minimal text->viseme lipsync approximator for Ready Player Me/ARKit mappings
  useEffect(() => {
    // Updated mapping based on ACTUAL available morph targets in the model
    const PHONEME_TO_MORPH: Record<string,string> = {
      // Vowels - map to mouthOpen for open mouth sounds
      AA:'mouthOpen', AE:'mouthOpen', AH:'mouthOpen', AY:'mouthOpen',
      EH:'mouthOpen', EY:'mouthOpen',
      IH:'mouthOpen', IY:'mouthOpen', Y:'mouthOpen',
      AO:'mouthOpen', OW:'mouthOpen', OY:'mouthOpen',
      UH:'mouthOpen', UW:'mouthOpen', W:'mouthOpen',
      
      // Consonants - map to mouthOpen for most sounds, mouthSmile for some
      B:'mouthOpen', P:'mouthOpen', M:'mouthOpen',
      F:'mouthOpen', V:'mouthOpen',
      K:'mouthOpen', G:'mouthOpen',
      N:'mouthOpen', NG:'mouthOpen',
      L:'mouthOpen', R:'mouthOpen',
      S:'mouthOpen', Z:'mouthOpen',
      TH:'mouthOpen', DH:'mouthOpen',
      SH:'mouthOpen', CH:'mouthOpen', JH:'mouthOpen', ZH:'mouthOpen',
      T:'mouthOpen', D:'mouthOpen',
      
      // Silence - no mouth movement
      SIL:'mouthOpen', SP:'mouthOpen'
    };

    // Very lightweight phonemizer
    const textToPhonemes = (text: string) => {
      const words = text.toLowerCase().split(/\s+/);
      const out: string[] = [];
      for (const w of words) {
        if (!w) continue;
        if (w === 'hello' || w === 'hi') { out.push('HH','EH','L','OW'); continue; }
        if (w === 'this' || w === 'that') { out.push('DH','IH','S'); continue; }
        if (w === 'is' || w === 'in') { out.push('IH','Z'); continue; }
        if (w === 'a' || w === 'the') { out.push('DH','AH'); continue; }
        if (w === 'and') { out.push('AE','N','D'); continue; }
        if (w === 'you') { out.push('Y','UW'); continue; }
        if (w === 'can') { out.push('K','AE','N'); continue; }
        if (w === 'see') { out.push('S','IY'); continue; }
        if (w === 'my') { out.push('M','AY'); continue; }
        if (w === 'mouth') { out.push('M','AW','TH'); continue; }
        if (w === 'moving') { out.push('M','UW','V','IH','NG'); continue; }
        if (w === 'test') { out.push('T','EH','S','T'); continue; }
        if (w === 'from') { out.push('F','R','AH','M'); continue; }
        if (w === 'new') { out.push('N','UW'); continue; }
        if (w === 'talking') { out.push('T','AO','K','IH','NG'); continue; }
        if (w === 'head') { out.push('HH','EH','D'); continue; }
        if (w === 'avatar') { out.push('AE','V','AH','T','AA','R'); continue; }
        
        // Generic fallback for unknown words
        const letters = w.split('');
        for (const c of letters) {
          if ('aeiou'.includes(c)) out.push('AA'); 
          else if ('bcdfghjklmnpqrstvwxyz'.includes(c)) out.push('P');
        }
        out.push('SP');
      }
      return out;
    };

    // Drive visemes via the global rpmSetMorph hook created above
    const speak = (text: string) => {
      const setMorph = (window as any).rpmSetMorph as ((k:string,v:number)=>void) | undefined;
      const reset = (window as any).rpmResetMouth as (()=>void) | undefined;
      if (!setMorph || !reset) { 
        console.warn('❌ rpmSetMorph or rpmResetMouth not ready'); 
        return; 
      }
      
      console.log('🗣️ Starting speech animation for:', text);
      const phonemes = textToPhonemes(text);
      console.log('🔤 Phonemes generated:', phonemes);
      
      const dur = 140; // ms per phoneme
      
      // Reset all mouth shapes first
      reset();
      
      // Create viseme animation sequence with HIGHER INTENSITY
      phonemes.forEach((ph, i) => {
        const vis = PHONEME_TO_MORPH[ph] || 'mouthOpen';
        const start = i * dur;
        const end = start + dur;
        
        console.log(`🎭 Phoneme ${i}: ${ph} -> ${vis} at ${start}ms`);
        
        // Apply morph target with HIGHER intensity (1.0 = full open)
        window.setTimeout(() => {
          console.log(`🎯 Applying ${vis} = 1.0`);
          setMorph(vis, 1.0);
        }, start);
        
        window.setTimeout(() => {
          console.log(`🔄 Resetting ${vis} = 0.0`);
          setMorph(vis, 0.0);
        }, end);
        
        // Add subtle smile for some phonemes to make it more expressive
        if (ph === 'EH' || ph === 'IY' || ph === 'EY') {
          window.setTimeout(() => {
            console.log(`😊 Adding smile for ${ph}`);
            setMorph('mouthSmile', 0.3);
          }, start);
          
          window.setTimeout(() => {
            setMorph('mouthSmile', 0.0);
          }, end);
        }
      });
      
      console.log(`⏱️ Speech animation duration: ${phonemes.length * dur}ms`);
      return phonemes.length * dur;
    };

    // Enhanced morph target control with actual available targets
    const setMorphTarget = (name: string, value: number) => {
      const setMorph = (window as any).rpmSetMorph as ((k:string,v:number)=>void) | undefined;
      if (!setMorph) { console.warn('rpmSetMorph not ready'); return; }
      
      // Clamp value between 0 and 1
      const clampedValue = Math.max(0, Math.min(1, value));
      setMorph(name, clampedValue);
    };

    // Expose enhanced controls globally
    (window as any).rpmSpeak = speak;
    (window as any).rpmSetMorph = setMorphTarget;
    (window as any).rpmSetMouthOpen = (value: number) => setMorphTarget('mouthOpen', value);
    (window as any).rpmSetMouthSmile = (value: number) => setMorphTarget('mouthSmile', value);
    
    // Test function for quick morph target testing
    (window as any).rpmTestMorphs = () => {
      console.log('🧪 Testing available morph targets...');
      const testTargets = ['mouthOpen', 'mouthSmile'];
      
      testTargets.forEach((target, index) => {
        setTimeout(() => {
          console.log(`Testing: ${target}`);
          setMorphTarget(target, 1.0);
        }, index * 1000);
        
        setTimeout(() => {
          setMorphTarget(target, 0.0);
        }, index * 1000 + 800);
      });
    };

    console.log('✅ Avatar ready with actual morph targets: mouthOpen, mouthSmile');
  }, []);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px'
      }}
    >
      <Canvas dpr={[1, 2]} shadows>
        {/* Camera positioned directly in front of face, horizontal to head level */}
        <PerspectiveCamera makeDefault fov={28} position={[0, 0.85, 2.6]} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />

        {/* Background image */}
        <BackgroundImage />

        {/* Lights for a clean, neutral look */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 3]} intensity={1.0} castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.4} />

        <Suspense fallback={null}>
          {/* Model positioned so head is centered in frame */}
          <group position={[-0.10, -1.06, 1.5]}>
            <GLBModel url={modelUrl} />
          </group>
        </Suspense>
      </Canvas>
      
      {/* Test button for debugging */}
      <button
        onClick={() => {
          console.log('🧪 Testing lip-sync...');
          if ((window as any).rpmSpeak) {
            (window as any).rpmSpeak('Hello, this is a test of the Ready Player Me avatar!');
          } else {
            console.warn('❌ rpmSpeak not available');
          }
        }}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        Test Lip-Sync
      </button>
    </div>
  );
};

export default SimpleAvatar;


