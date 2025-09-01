import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface LipSyncMouthCue {
  start: number;
  end: number;
  value: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'X';
}

export interface LipSyncData {
  mouthCues: LipSyncMouthCue[];
}

export interface AvatarMessage {
  audioBase64?: string; // base64 mp3 data (without prefix)
  animation?: string; // matches animation clip name from animations.glb
  facialExpression?: string; // one of the defined expressions
  lipsync?: LipSyncData; // viseme timing for lip sync
}

export interface Avatar3DProps {
  message?: AvatarMessage | null;
  onAudioEnd?: () => void;
  audioMimeType?: string; // e.g., 'audio/mp3' or 'audio/wav'
  isSpeaking?: boolean; // fallback mouth animation when no lipsync provided
  visemeHint?: string; // optional viseme from TTS boundary events
  reactionTrigger?: number; // bump to trigger nod/tilt micro reactions
}

const corresponding: Record<string, string> = {
  A: 'viseme_PP',
  B: 'viseme_kk',
  C: 'viseme_I',
  D: 'viseme_AA',
  E: 'viseme_O',
  F: 'viseme_U',
  G: 'viseme_FF',
  H: 'viseme_TH',
  X: 'viseme_PP',
};

function BackgroundImage() {
  const texture = useTexture('/ai-interview-agent-master/blur-focus-white-open-space-600nw-2179136893.webp');
  
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

const facialExpressions: Record<string, Record<string, number>> = {
  default: {},
  cheerful: { browInnerUp: 0.2, mouthSmileLeft: 0.4, mouthSmileRight: 0.4, eyeSquintLeft: 0.2, eyeSquintRight: 0.2 },
  neutral: {},
  sad: { mouthFrownLeft: 0.7, mouthFrownRight: 0.7, browInnerUp: 0.3 },
  angry: { browDownLeft: 0.8, browDownRight: 0.8, noseSneerLeft: 0.5, noseSneerRight: 0.5 },
  surprised: { eyeWideLeft: 0.5, eyeWideRight: 0.5, jawOpen: 0.3 },
};

export const Avatar3D: React.FC<Avatar3DProps> = ({ message, onAudioEnd, audioMimeType = 'audio/mp3', isSpeaking = false, visemeHint, reactionTrigger }) => {
  // Resolve with base URL to work in dev and production builds
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const professionalAvatarFile = '6895887a79ea9df733057f4d (1).glb';
  const modelUrl = `${baseUrl}avatar/${encodeURIComponent(professionalAvatarFile)}`;
  const { scene } = useGLTF(modelUrl) as any;
  // Try to read nodes/materials if present, but render generically to avoid name coupling
  const nodes = (scene as any)?.nodes || {};
  const materials = (scene as any)?.materials || {};
  // We no longer require external animation clips; rely on subtle head motions below
  const animations: any[] = [];

  const group = useRef<THREE.Group>(null!);
  const { actions, mixer } = useAnimations(animations, group);
  const [currentAnimation, setCurrentAnimation] = useState<string>(() => {
    const idle = animations.find((a: any) => a.name === 'Idle');
    return idle ? 'Idle' : animations[0]?.name;
  });
  const [currentExpression, setCurrentExpression] = useState<string>('neutral');
  const [lipsync, setLipsync] = useState<LipSyncData | undefined>();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Heuristic bone rig references for models without morph targets
  type BoneRef = {
    bone: THREE.Bone;
    basePosition: THREE.Vector3;
    baseRotation: THREE.Euler;
  };
  const [jawBone, setJawBone] = useState<BoneRef | null>(null);
  const [mouthCornerLeft, setMouthCornerLeft] = useState<BoneRef | null>(null);
  const [mouthCornerRight, setMouthCornerRight] = useState<BoneRef | null>(null);

  // Bone-based mouth shaping helper for rigs without morph targets
  const applyBoneMouthShape = (viseme: string | null, strength = 1) => {
    const s = THREE.MathUtils.clamp(strength, 0, 1);
    const jaw = jawBone;
    const l = mouthCornerLeft;
    const r = mouthCornerRight;

    // Reset toward base pose
    if (jaw) jaw.bone.rotation.x = THREE.MathUtils.lerp(jaw.baseRotation.x, jaw.baseRotation.x, 0.5);
    if (l) {
      l.bone.position.lerp(l.basePosition, 0.3);
    }
    if (r) {
      r.bone.position.lerp(r.basePosition, 0.3);
    }

    // Map viseme to simple bone transforms
    switch (viseme) {
      case 'D': // AA (wide open)
        if (jaw) jaw.bone.rotation.x = jaw.baseRotation.x - 0.25 * s; // open
        if (l) l.bone.position.x = l.basePosition.x - 0.005 * s;
        if (r) r.bone.position.x = r.basePosition.x + 0.005 * s;
        break;
      case 'E': // O (rounded mouth)
        if (jaw) jaw.bone.rotation.x = jaw.baseRotation.x - 0.12 * s;
        if (l) {
          l.bone.position.x = l.basePosition.x + 0.01 * s; // corners in
          l.bone.position.z = l.basePosition.z + 0.006 * s; // forward/pucker
        }
        if (r) {
          r.bone.position.x = r.basePosition.x - 0.01 * s;
          r.bone.position.z = r.basePosition.z + 0.006 * s;
        }
        break;
      case 'F': // U (strong pucker)
        if (jaw) jaw.bone.rotation.x = jaw.baseRotation.x - 0.08 * s;
        if (l) {
          l.bone.position.x = l.basePosition.x + 0.012 * s;
          l.bone.position.z = l.basePosition.z + 0.01 * s;
        }
        if (r) {
          r.bone.position.x = r.basePosition.x - 0.012 * s;
          r.bone.position.z = r.basePosition.z + 0.01 * s;
        }
        break;
      case 'C': // I (smile/width)
        if (jaw) jaw.bone.rotation.x = jaw.baseRotation.x - 0.04 * s;
        if (l) l.bone.position.x = l.basePosition.x - 0.015 * s; // widen corners
        if (r) r.bone.position.x = r.basePosition.x + 0.015 * s;
        break;
      case 'B': // kk (slight open)
      case 'H': // TH (slight open)
        if (jaw) jaw.bone.rotation.x = jaw.baseRotation.x - 0.06 * s;
        break;
      case 'G': // FF (teeth on lip) – approximate with slight pucker
        if (jaw) jaw.bone.rotation.x = jaw.baseRotation.x - 0.05 * s;
        if (l) l.bone.position.z = l.basePosition.z + 0.004 * s;
        if (r) r.bone.position.z = r.basePosition.z + 0.004 * s;
        break;
      case 'A': // PP (closed)
      case 'X':
      default:
        // closed/neutral handled by reset above
        break;
    }
  };

  useEffect(() => {
    // Inspect scene for morph targets and candidate mouth bones
    const morphs = new Set<string>();
    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        Object.keys(child.morphTargetDictionary).forEach((k) => morphs.add(k));
      }
    });

    // Find candidate bones by heuristic name matching
    const candidates: THREE.Bone[] = [];
    scene.traverse((child: any) => {
      if (child.isBone) candidates.push(child);
    });

    const byName = (name: string) =>
      candidates.find((b) => (b.name || '').toLowerCase().includes(name));

    const jaw = byName('jaw') || byName('chin');
    const left =
      byName('mouthcornerleft') ||
      byName('mouth_l') ||
      byName('mouthleft') ||
      byName('lipcornerl') ||
      byName('lip_l') ||
      byName('l_mouth') ||
      candidates.find((b) => /mouth|lip/.test((b.name || '').toLowerCase()) && /l\b|left/.test((b.name || '').toLowerCase()));
    const right =
      byName('mouthcornerright') ||
      byName('mouth_r') ||
      byName('mouthright') ||
      byName('lipcornerr') ||
      byName('lip_r') ||
      byName('r_mouth') ||
      candidates.find((b) => /mouth|lip/.test((b.name || '').toLowerCase()) && /r\b|right/.test((b.name || '').toLowerCase()));

    const toBoneRef = (bone?: THREE.Bone | null): BoneRef | null =>
      bone
        ? {
            bone,
            basePosition: bone.position.clone(),
            baseRotation: bone.rotation.clone(),
          }
        : null;

    setJawBone(toBoneRef(jaw as THREE.Bone));
    setMouthCornerLeft(toBoneRef(left as THREE.Bone));
    setMouthCornerRight(toBoneRef(right as THREE.Bone));

    // Helpful diagnostics in console
    // eslint-disable-next-line no-console
    console.log('[Avatar3D] Morph targets found:', Array.from(morphs));
    // eslint-disable-next-line no-console
    console.log('[Avatar3D] Bones found:', candidates.map((b) => b.name));
    // eslint-disable-next-line no-console
    console.log('[Avatar3D] Selected bone rig:', {
      jaw: jaw?.name,
      mouthLeft: left?.name,
      mouthRight: right?.name,
    });
  }, [scene]);

  useEffect(() => {
    // If animations were provided, play selected clip; otherwise ignore
    const action = actions?.[currentAnimation];
    if (action) {
      action.reset().fadeIn(mixer?.stats?.actions?.inUse === 0 ? 0 : 0.4).play();
      return () => action.fadeOut(0.4);
    }
  }, [actions, currentAnimation, mixer]);

  useEffect(() => {
    if (!message) return;
    if (message.animation) setCurrentAnimation(message.animation);
    if (message.facialExpression) setCurrentExpression(message.facialExpression);
    setLipsync(message.lipsync);

    if (message.audioBase64) {
      const a = new Audio(`data:${audioMimeType};base64,` + message.audioBase64);
      setAudio(a);
      a.onended = () => onAudioEnd && onAudioEnd();
      a.play().catch(() => {/* ignore */});
    }
  }, [message, onAudioEnd]);

  // Build a cache of available morph target keys for heuristic mapping
  const getAvailableMorphs = (): string[] => {
    const set = new Set<string>();
    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        Object.keys(child.morphTargetDictionary).forEach((k) => set.add(k));
      }
    });
    return Array.from(set);
  };

  const resolveMorphAliases = (desired: string, available: string[]): string[] => {
    if (available.includes(desired)) return [desired];
    // Heuristic alias lists for common ARKit/Wolf3D names
    const aliasMap: Record<string, string[]> = {
      viseme_PP: ['viseme_PP', 'mouthClose', 'mouthPressLeft', 'mouthPressRight', 'lipsTogetherU'],
      viseme_kk: ['viseme_kk', 'mouthClose', 'jawOpen'],
      viseme_I: ['viseme_I', 'mouthStretchLeft', 'mouthStretchRight'],
      viseme_AA: ['viseme_AA', 'jawOpen'],
      viseme_O: ['viseme_O', 'mouthFunnel'],
      viseme_U: ['viseme_U', 'mouthPucker'],
      viseme_FF: ['viseme_FF', 'mouthFrownLeft', 'mouthFrownRight', 'mouthUpperUpLeft', 'mouthUpperUpRight'],
      viseme_TH: ['viseme_TH', 'tongueOut', 'jawOpen']
    };

    const candidates = aliasMap[desired] || [desired];
    const matched: string[] = [];
    candidates.forEach((cand) => {
      const found = available.find((k) => k === cand || k.toLowerCase().includes(cand.toLowerCase()));
      if (found) matched.push(found);
    });
    return matched.length ? matched : [];
  };

  const lerpMorphTarget = (target: string, value: number, speed = 0.2) => {
    const available = getAvailableMorphs();
    const keys = resolveMorphAliases(target, available);
    scene.traverse((child: any) => {
      if (!child.isSkinnedMesh || !child.morphTargetDictionary) return;
      keys.forEach((key) => {
        const index = child.morphTargetDictionary[key];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) return;
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      });
    });
  };

  useFrame(() => {
    // Subtle head motions for natural presence
    const t = Date.now();
    if (group.current) {
      group.current.rotation.y = 0.018 * Math.sin(t * 0.0006);
      group.current.rotation.x = 0.012 * Math.sin(t * 0.0008);
      group.current.position.x = 0.008 * Math.sin(t * 0.0007);
    }
    // Apply facial expression mapping
    const mapping = facialExpressions[currentExpression] || {};
    const availableMorphs = getAvailableMorphs();
    availableMorphs.forEach((key) => {
      if (key === 'eyeBlinkLeft' || key === 'eyeBlinkRight') return;
      const targetValue = mapping[key] ?? 0;
      if (targetValue > 0) lerpMorphTarget(key, targetValue, 0.1);
    });

    // Basic natural blink
    const blink = Math.sin(t * 0.004) > 0.98;
    lerpMorphTarget('eyeBlinkLeft', blink ? 1 : 0, 0.6);
    lerpMorphTarget('eyeBlinkRight', blink ? 1 : 0, 0.6);
    // gentle idle lips and micro jaw for natural look when not speaking
    const idleMouth = 0.02 + 0.015 * Math.sin(t * 0.0015);
    lerpMorphTarget('jawOpen', idleMouth, 0.05);

    // Lip sync visemes (precise)
    const applied: string[] = [];
    const availableMorphs2 = getAvailableMorphs();
    const hasMorphs = availableMorphs2.length > 0;
    let activeViseme: string | null = null;
    if (message && lipsync && audio) {
      const at = audio.currentTime;
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const cue = lipsync.mouthCues[i];
        if (at >= cue.start && at <= cue.end) {
          const morph = corresponding[cue.value];
          applied.push(morph);
          activeViseme = cue.value;
          if (hasMorphs) {
            lerpMorphTarget(morph, 1, 0.25);
          }
          break;
        }
      }
    } else if (isSpeaking && visemeHint && corresponding[visemeHint]) {
      // If no lipsync but we have a realtime viseme hint from TTS boundary
      const morph = corresponding[visemeHint];
      applied.push(morph);
      activeViseme = visemeHint;
      if (hasMorphs) {
        lerpMorphTarget(morph, 1, 0.25);
      }
    }
    if (hasMorphs) {
      Object.values(corresponding).forEach((morph) => {
        if (!applied.includes(morph)) lerpMorphTarget(morph, 0, 0.12);
      });
    }

    // If no morph targets exist, apply bone-based viseme shaping directly when we have an active viseme
    if (!hasMorphs && activeViseme) {
      applyBoneMouthShape(activeViseme, 1);
    }

    // Fallback mouth animation (simple jaw movement) when speaking without lipsync
    if ((!lipsync || !audio) && isSpeaking && !activeViseme) {
      // syllable-like mouth cycle for fallback speaking with complete closures
      const phase = (Math.sin(t * 0.028) + 1) / 2; // 0..1
      const closeBoost = Math.max(0, Math.sin(t * 0.7)); // pulses promote closures
      const open = 0.1 + 0.45 * phase; // 0.1..0.55
      if (hasMorphs) {
        lerpMorphTarget('jawOpen', open, 0.35);
        // alternate between O and Pucker to get clearer closures
        lerpMorphTarget('mouthFunnel', 0.12 * (1 - phase), 0.25);
        lerpMorphTarget('mouthPucker', 0.16 * (phase < 0.4 ? 1 : 0), 0.25);
        // add PP/KK style closures briefly
        if (closeBoost > 0.85) {
          lerpMorphTarget('viseme_PP', 1, 0.5);
          lerpMorphTarget('viseme_kk', 0.6, 0.5);
        }
      } else {
        // Bone fallback: cycle between AA and O/U
        const boneViseme = phase < 0.5 ? 'D' : phase < 0.8 ? 'E' : 'F';
        applyBoneMouthShape(boneViseme, 0.6);
      }
    } else {
      // return to subtle idle values
      if (hasMorphs) {
        lerpMorphTarget('mouthFunnel', 0, 0.15);
        lerpMorphTarget('mouthPucker', 0, 0.15);
      } else if (activeViseme) {
        applyBoneMouthShape(activeViseme, 1);
      }
    }

    // Micro reaction on tick change (small nod)
    if (reactionTrigger && group.current) {
      const nod = 0.05 * Math.sin(t * 0.02);
      group.current.rotation.x += nod * 0.02;
    }
  });

  return (
    <group ref={group} dispose={null} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* Background image */}
      <BackgroundImage />
      {/* Render the full scene graph from the GLB to avoid mesh name coupling */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/avatar/6895887a79ea9df733057f4d%20(1).glb');

export default Avatar3D;


