import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TalkingHead?: any;
    newTalkingHeadSpeak?: (text: string) => void;
    testNewTalkingHead?: () => void;
    testMorphTargets?: () => void;
    newTalkingHeadReady?: boolean;
    __th_new?: any;
    applyMorphTarget?: (target: string, intensity: number) => void;
  }
}

interface NewTalkingHeadAvatarProps {
  width?: number;
  height?: number;
  isSpeaking?: boolean;
}

const NewTalkingHeadAvatar: React.FC<NewTalkingHeadAvatarProps> = ({ 
  width = 346, 
  height = 193, 
  isSpeaking 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    const uniqueId = 'new-th-' + Math.random().toString(36).slice(2);
    const avatarNodeId = uniqueId + '-avatar';
    const loadingNodeId = uniqueId + '-loading';

    const initializeNewTalkingHead = async () => {
      console.log('🆕 NewTalkingHead: Starting initialization...');
      const container = containerRef.current;
      if (!container) {
        console.error('🆕 NewTalkingHead: Container ref not available.');
        return;
      }

      // Create mount nodes
      const avatarNode = document.createElement('div');
      avatarNode.id = avatarNodeId;
      avatarNode.style.cssText = 'display: block; width: 100%; height: 100%; position: relative; z-index: 1;';
      container.appendChild(avatarNode);

      const loadingNode = document.createElement('div');
      loadingNode.id = loadingNodeId;
      loadingNode.style.cssText = 'position: absolute; left: 8px; bottom: 8px; font: 12px system-ui, sans-serif; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.6); z-index: 2; pointer-events: none;';
      loadingNode.textContent = 'Loading New Avatar...';
      container.appendChild(loadingNode);

      // Add es-module-shims for better import map support
      const esModuleShims = document.createElement('script');
      esModuleShims.src = 'https://cdn.jsdelivr.net/npm/es-module-shims@1.7.1/dist/es-module-shims.js';
      esModuleShims.async = true;
      document.head.appendChild(esModuleShims);
      
      // Wait for es-module-shims to be processed
      await new Promise(resolve => setTimeout(resolve, 500));

      // Module script to init TalkingHead
      const moduleScript = document.createElement('script');
      moduleScript.type = 'module';
      moduleScript.textContent = `
        // Import map for Three.js and TalkingHead
        const importMap = document.createElement('script');
        importMap.type = 'importmap';
        importMap.textContent = JSON.stringify({
          imports: {
            "three": "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js/+esm",
            "three/examples/": "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/"
          }
        });
        document.head.appendChild(importMap);
        
        // Wait for import map to be processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test if Three.js is working
        console.log('🆕 NewTalkingHead: Testing Three.js availability...');
        let THREE;
        try {
          THREE = await import('three');
          console.log('🆕 NewTalkingHead: Three.js imported successfully:', THREE);
          
          // Test basic Three.js functionality
          const testScene = new THREE.Scene();
          const testCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
          console.log('🆕 NewTalkingHead: Three.js basic functionality test passed');
        } catch (threeError) {
          console.error('🆕 NewTalkingHead: Three.js test failed:', threeError);
          throw new Error('Three.js not available - import map may not be working');
        }

        // Check if TalkingHead module file exists
        console.log('🆕 NewTalkingHead: Checking TalkingHead module availability...');
        let moduleAccessible = false;
        try {
          const moduleCheck = await fetch('/TalkingHead3DAvatar/modules/talkinghead.mjs', { method: 'HEAD' });
          moduleAccessible = moduleCheck.ok;
          console.log('🆕 NewTalkingHead: Module file accessible:', moduleAccessible);
        } catch (e) {
          console.warn('🆕 NewTalkingHead: Module file check failed:', e.message);
        }
        
        // Now import the TalkingHead module
        console.log('🆕 NewTalkingHead: Importing TalkingHead module...');
        let TalkingHead = null;
        
        if (moduleAccessible) {
          try {
            const { TalkingHead: TH } = await import('/TalkingHead3DAvatar/modules/talkinghead.mjs');
            TalkingHead = TH;
            console.log('🆕 NewTalkingHead: TalkingHead module imported successfully:', TalkingHead);
          } catch (importError) {
            console.error('🆕 NewTalkingHead: Failed to import TalkingHead module:', importError);
            TalkingHead = null;
          }
        }
        
        // Check if TalkingHead class is available
        if (!TalkingHead || typeof TalkingHead !== 'function') {
          console.warn('🆕 NewTalkingHead: TalkingHead class not available, will use fallback mode');
          TalkingHead = null;
        } else {
          console.log('🆕 NewTalkingHead: TalkingHead class available:', TalkingHead);
        }

        let __th_new;
        
        // Phoneme to morph target mapping using the actual avatar keys
        const PHONEME_TO_MORPH = {
          // Vowels
          'AA': 'viseme_aa',    // "ah" as in "father"
          'AE': 'viseme_aa',    // "a" as in "cat"
          'AH': 'viseme_aa',    // "u" as in "but"
          'AO': 'viseme_O',     // "aw" as in "law"
          'AW': 'viseme_O',     // "ow" as in "cow"
          'AY': 'viseme_aa',    // "ai" as in "bite"
          'EH': 'viseme_E',     // "e" as in "bed"
          'EY': 'viseme_E',     // "ay" as in "say"
          'IH': 'viseme_I',     // "i" as in "bit"
          'IY': 'viseme_I',     // "ee" as in "see"
          'OW': 'viseme_O',     // "o" as in "go"
          'OY': 'viseme_O',     // "oy" as in "boy"
          'UH': 'viseme_U',     // "oo" as in "book"
          'UW': 'viseme_U',     // "oo" as in "too"
          
          // Consonants
          'B': 'viseme_PP',     // "b" as in "boy"
          'CH': 'viseme_CH',    // "ch" as in "chair"
          'D': 'viseme_DD',     // "d" as in "day"
          'DH': 'viseme_TH',    // "th" as in "the"
          'F': 'mouthOpen',     // "f" as in "fun" (using mouthOpen as fallback)
          'G': 'viseme_kk',     // "g" as in "go"
          'HH': 'viseme_sil',   // "h" as in "hat"
          'JH': 'viseme_CH',    // "j" as in "joy"
          'K': 'viseme_kk',     // "k" as in "key"
          'L': 'viseme_RR',     // "l" as in "let"
          'M': 'viseme_PP',     // "m" as in "man"
          'N': 'viseme_nn',     // "n" as in "no"
          'NG': 'viseme_nn',    // "ng" as in "sing"
          'P': 'viseme_PP',     // "p" as in "pen"
          'R': 'viseme_RR',     // "r" as in "red"
          'S': 'viseme_SS',     // "s" as in "see"
          'SH': 'viseme_CH',    // "sh" as in "she"
          'T': 'viseme_DD',     // "t" as in "tea"
          'TH': 'viseme_TH',    // "th" as in "thin"
          'V': 'mouthOpen',     // "v" as in "van" (using mouthOpen as fallback)
          'W': 'viseme_U',      // "w" as in "we"
          'Y': 'viseme_I',      // "y" as in "yes"
          'Z': 'viseme_SS',     // "z" as in "zoo"
          'ZH': 'viseme_CH',    // "zh" as in "vision"
          
          // Silence
          'SIL': 'viseme_sil',  // Silence
          'SP': 'viseme_sil'    // Short pause
        };

        // Simple text to phoneme conversion (basic English)
        function textToPhonemes(text) {
          const words = text.toLowerCase().split(/\\s+/);
          const phonemes = [];
          
          words.forEach(word => {
            // Simple word-to-phoneme mapping for common words
            if (word === 'hello' || word === 'hi') {
              phonemes.push(['HH', 'EH', 'L', 'OW']);
            } else if (word === 'this' || word === 'that') {
              phonemes.push(['DH', 'IH', 'S']);
            } else if (word === 'is' || word === 'in') {
              phonemes.push(['IH', 'Z']);
            } else if (word === 'a' || word === 'the') {
              phonemes.push(['DH', 'AH']);
            } else if (word === 'and') {
              phonemes.push(['AE', 'N', 'D']);
            } else if (word === 'you') {
              phonemes.push(['Y', 'UW']);
            } else if (word === 'can') {
              phonemes.push(['K', 'AE', 'N']);
            } else if (word === 'see') {
              phonemes.push(['S', 'IY']);
            } else if (word === 'my') {
              phonemes.push(['M', 'AY']);
            } else if (word === 'mouth') {
              phonemes.push(['M', 'AW', 'TH']);
            } else if (word === 'moving') {
              phonemes.push(['M', 'UW', 'V', 'IH', 'NG']);
            } else if (word === 'test') {
              phonemes.push(['T', 'EH', 'S', 'T']);
            } else if (word === 'from') {
              phonemes.push(['F', 'R', 'AH', 'M']);
            } else if (word === 'new') {
              phonemes.push(['N', 'UW']);
            } else if (word === 'talking') {
              phonemes.push(['T', 'AO', 'K', 'IH', 'NG']);
            } else if (word === 'head') {
              phonemes.push(['HH', 'EH', 'D']);
            } else if (word === 'avatar') {
              phonemes.push(['AE', 'V', 'AH', 'T', 'AA', 'R']);
            } else {
              // Generic fallback: convert letters to approximate phonemes
              const letters = word.split('');
              letters.forEach(letter => {
                if ('aeiou'.includes(letter)) {
                  phonemes.push(['AA']); // Generic vowel
                } else if ('bcdfghjklmnpqrstvwxyz'.includes(letter)) {
                  phonemes.push(['P']); // Generic consonant
                }
              });
            }
          });
          
          return phonemes.flat();
        }

        // Apply morph target using TalkingHead's system
        function applyMorphTarget(targetName, intensity = 1.0) {
          if (!__th_new || !__th_new.mtAvatar) {
            console.warn('🗣️ Cannot apply morph target: TalkingHead not ready');
            return;
          }
          
          const hasTarget = Object.prototype.hasOwnProperty.call(__th_new.mtAvatar, targetName);
          if (!hasTarget) {
            console.warn('🗣️ Morph target not found:', targetName, 'Available:', Object.keys(__th_new.mtAvatar));
            return;
          }

          try {
            if (typeof __th_new.setMorphTarget === 'function') {
              __th_new.setMorphTarget(targetName, intensity);
            } else if (typeof __th_new.setMorphTargetValue === 'function') {
              __th_new.setMorphTargetValue(targetName, intensity);
            } else {
              // Fallback: attempt to write to backing map if supported by implementation
              __th_new.mtAvatar[targetName] = intensity;
              // If there is a requestRender or similar, try to trigger it
              if (typeof __th_new.requestRender === 'function') {
                __th_new.requestRender();
              }
            }
            console.log('🗣️ Applied morph target:', targetName, 'at intensity:', intensity);
          } catch (e) {
            console.warn('🗣️ Failed to apply morph target using API, using fallback map write.', e);
            try {
              __th_new.mtAvatar[targetName] = intensity;
              if (typeof __th_new.requestRender === 'function') {
                __th_new.requestRender();
              }
            } catch (e2) {
              console.error('🗣️ Fallback morph target write failed:', e2);
            }
          }
        }

        // Create lip-sync animation sequence
        function createLipsyncAnimation(text) {
          if (!__th_new || !__th_new.mtAvatar) {
            console.warn('🗣️ Cannot create lipsync: TalkingHead not ready');
            return 0;
          }
          
          const phonemes = textToPhonemes(text);
          console.log('🗣️ Text to phonemes:', text, '->', phonemes);
          
          // Calculate timing: 150ms per phoneme for natural speech
          const phonemeDuration = 150;
          const totalDuration = phonemes.length * phonemeDuration;
          
          // Reset all morph targets first
          Object.keys(__th_new.mtAvatar).forEach(target => {
            if (target.startsWith('viseme_') || target === 'mouthOpen') {
              applyMorphTarget(target, 0);
            }
          });
          
          // Create animation sequence
          phonemes.forEach((phoneme, index) => {
            const startTime = index * phonemeDuration;
            const endTime = startTime + phonemeDuration;
            
            // Get the morph target for this phoneme
            const morphTarget = PHONEME_TO_MORPH[phoneme] || 'viseme_sil';
            
            // Apply the morph target with timing
            setTimeout(() => {
              applyMorphTarget(morphTarget, 1.0);
            }, startTime);
            
            // Reset the morph target after duration
            setTimeout(() => {
              applyMorphTarget(morphTarget, 0.0);
            }, endTime);
          });
          
          console.log('🗣️ Created lipsync animation with', phonemes.length, 'phonemes, total duration:', totalDuration, 'ms');
          return totalDuration;
        }

        (async () => {
          try {
            const node = document.getElementById('${avatarNodeId}');
            const loading = document.getElementById('${loadingNodeId}');
            
            console.log('🆕 NewTalkingHead: Starting initialization...');
            console.log('🆕 NewTalkingHead: DOM nodes:', { node: !!node, loading: !!loading });

            if (TalkingHead) {
              console.log('🆕 NewTalkingHead: TalkingHead library found, creating instance...');
              loading.textContent = 'Creating TalkingHead...';
              
              try {
                // Create TalkingHead with basic configuration
                __th_new = new TalkingHead(node, {
                  ttsEndpoint: '',
                  ttsApikey: '',
                  lipsyncModules: ['en'],
                  cameraView: 'upper',
                  modelFPS: 30,
                  modelPixelRatio: 1
                });
                
                console.log('🆕 NewTalkingHead: Instance created:', __th_new);
                
                // Store reference globally for debugging
                window.__th_new = __th_new;
                
              } catch (error) {
                console.error('🆕 NewTalkingHead: Failed to create instance:', error);
                throw error;
              }

              console.log('🆕 NewTalkingHead: Loading avatar...');
              loading.textContent = 'Loading avatar...';
              
              try {
                // Load the avatar with progress callback
                await __th_new.showAvatar({
                  url: '/TalkingHead3DAvatar/avatars/brunette.glb',
                  body: 'F',
                  avatarMood: 'neutral',
                  lipsyncLang: 'en'
                }, (ev) => {
                  if (ev && ev.lengthComputable) {
                    const val = Math.min(100, Math.round(ev.loaded / ev.total * 100));
                    loading.textContent = 'Loading ' + val + '%';
                  }
                });
                
                console.log('🆕 NewTalkingHead: Avatar loaded successfully');
                
              } catch (error) {
                console.error('🆕 NewTalkingHead: Failed to load avatar:', error);
                throw error;
              }

              // Wait for full initialization
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Check if morph targets are available
              if (__th_new.mtAvatar && Object.keys(__th_new.mtAvatar).length > 0) {
                console.log('🆕 NewTalkingHead: Morph targets available:', Object.keys(__th_new.mtAvatar));
                
                // Test a morph target
                const testTarget = Object.keys(__th_new.mtAvatar)[0];
                console.log('🆕 NewTalkingHead: Testing morph target:', testTarget);
                applyMorphTarget(testTarget, 0.5);
                setTimeout(() => applyMorphTarget(testTarget, 0), 1000);
                
              } else {
                console.warn('🆕 NewTalkingHead: No morph targets available');
              }

              loading.textContent = 'Ready!';
              setTimeout(() => { loading.style.display = 'none'; }, 2000);
              
              // Set global ready state
              window.newTalkingHeadReady = true;
              
              // Expose functions globally
              window.newTalkingHeadSpeak = (text) => {
                console.log('🗣️ NewTalkingHead speak called with:', text.substring(0, 50) + '...');
                if (__th_new && __th_new.mtAvatar) {
                  createLipsyncAnimation(text);
                } else {
                  console.warn('🗣️ NewTalkingHead: Cannot speak - not ready');
                }
              };
              
              window.applyMorphTarget = applyMorphTarget;
              
              // Test function
              window.testNewTalkingHead = () => {
                console.log('🆕 NewTalkingHead: Manual test initiated.');
                if (window.newTalkingHeadSpeak) {
                  window.newTalkingHeadSpeak('Hello, this is a test from the new TalkingHead avatar. Can you see my mouth moving?');
                } else {
                  console.error('🆕 NewTalkingHead: newTalkingHeadSpeak function not available.');
                }
              };

              // Test morph targets individually
              window.testMorphTargets = () => {
                console.log('🆕 NewTalkingHead: Testing individual morph targets...');
                if (!__th_new || !__th_new.mtAvatar) {
                  console.error('🆕 NewTalkingHead: Morph targets not available');
                  return;
                }
                
                const targets = Object.keys(__th_new.mtAvatar);
                console.log('🆕 NewTalkingHead: Available morph targets:', targets);
                
                // Test each morph target for 500ms
                targets.forEach((target, index) => {
                  setTimeout(() => {
                    applyMorphTarget(target, 1.0);
                    console.log('🆕 NewTalkingHead: Testing morph target:', target);
                  }, index * 600);
                  
                  // Reset after 500ms
                  setTimeout(() => {
                    applyMorphTarget(target, 0.0);
                  }, index * 600 + 500);
                });
              };
              
              console.log('🆕 NewTalkingHead: Initialization complete');
              console.log('🆕 NewTalkingHead: Test functions available:');
              console.log('  - window.testNewTalkingHead() - Test speech with lipsync');
              console.log('  - window.testMorphTargets() - Test individual morph targets');

            } else {
              throw new Error('TalkingHead library not found');
            }

          } catch (err) {
            console.error('🆕 NewTalkingHead: Initialization failed:', err);
            const loading = document.getElementById('${loadingNodeId}');
            if (loading) {
              loading.textContent = 'Error: ' + (err.message || String(err));
              loading.style.color = 'red';
            }
            
            // Set fallback ready state
            window.newTalkingHeadReady = true;
            window.newTalkingHeadSpeak = (text) => {
              console.warn('🗣️ NewTalkingHead (error): Cannot speak, initialization failed');
            };
            window.applyMorphTarget = (target: string, intensity: number) => {
              console.warn('🗣️ NewTalkingHead (error): Cannot apply morph target, initialization failed');
            };
          }
        })();
      `;
      document.head.appendChild(moduleScript);

      // Update the React ref when the global state changes
      const checkReady = () => {
        if ((window as any).newTalkingHeadReady) {
          isReadyRef.current = true;
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();

      return () => {
        console.log('🆕 NewTalkingHead: Cleaning up...');
        try { if (moduleScript) moduleScript.remove(); } catch (_) {}
        try { if (loadingNode) loadingNode.remove(); } catch (_) {}
        try { if (avatarNode) avatarNode.remove(); } catch (_) {}
        try { (window as any).newTalkingHeadSpeak = undefined; } catch (_) {}
        try { (window as any).testNewTalkingHead = undefined; } catch (_) {}
        try { (window as any).testMorphTargets = undefined; } catch (_) {}
        try { (window as any).newTalkingHeadReady = undefined; } catch (_) {}
      };
    };

    initializeNewTalkingHead();
  }, []);

  useEffect(() => {
    console.log('🗣️ Avatar isSpeaking prop changed:', isSpeaking);
    console.log('🗣️ Avatar global state check:', {
      newTalkingHeadSpeak: typeof window.newTalkingHeadSpeak,
      newTalkingHeadReady: window.newTalkingHeadReady,
      __th_new: !!window.__th_new,
      mtAvatar: window.__th_new?.mtAvatar ? Object.keys(window.__th_new.mtAvatar) : 'not available'
    });
    
    // When isSpeaking changes, trigger lip-sync if available
    if (isSpeaking && window.newTalkingHeadSpeak && window.newTalkingHeadReady) {
      // Trigger a simple lip-sync animation when speaking starts
      console.log('🗣️ Avatar speaking state changed to true, triggering lip-sync');
      
      // Create a simple lip-sync animation
      if (window.__th_new && window.__th_new.mtAvatar) {
        console.log('🗣️ Avatar: Starting lip-sync animation with morph targets:', Object.keys(window.__th_new.mtAvatar));
        
        // Reset all morph targets first
        Object.keys(window.__th_new.mtAvatar).forEach(target => {
          if (target.startsWith('viseme_') || target === 'mouthOpen') {
            if (window.applyMorphTarget) {
              window.applyMorphTarget(target, 0);
            }
          }
        });
        
        // Create a simple speaking animation
        const speakAnimation = () => {
          if (!isSpeaking) return;
          
          // Cycle through basic visemes for natural speaking
          const visemes = ['viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U'];
          let currentIndex = 0;
          
          const animate = () => {
            if (!isSpeaking) return;
            
            // Apply current viseme
            visemes.forEach((viseme, index) => {
              const intensity = index === currentIndex ? 0.8 : 0.1;
              if (window.applyMorphTarget) {
                window.applyMorphTarget(viseme, intensity);
              }
            });
            
            // Move to next viseme
            currentIndex = (currentIndex + 1) % visemes.length;
            
            // Continue animation while speaking
            if (isSpeaking) {
              setTimeout(animate, 150); // 150ms per viseme for natural speech
            }
          };
          
          animate();
        };
        
        speakAnimation();
      } else {
        console.warn('🗣️ Avatar: Cannot start lip-sync - morph targets not available');
      }
    } else if (!isSpeaking && window.__th_new && window.__th_new.mtAvatar) {
      // Reset all morph targets when speaking stops
      console.log('🗣️ Avatar speaking stopped, resetting morph targets');
      Object.keys(window.__th_new.mtAvatar).forEach(target => {
        if (target.startsWith('viseme_') || target === 'mouthOpen') {
          if (window.applyMorphTarget) {
            window.applyMorphTarget(target, 0);
          }
        }
      });
    } else {
      console.log('🗣️ Avatar: Cannot handle speaking state change - dependencies not ready');
    }
  }, [isSpeaking]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        position: 'relative', 
        overflow: 'hidden', 
        backgroundImage: 'url(/ai-interview-agent-master/blur-focus-white-open-space-600nw-2179136893.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px'
      }}
    >
      {/* Loading indicator will be added by the script */}
    </div>
  );
};

export default NewTalkingHeadAvatar;
