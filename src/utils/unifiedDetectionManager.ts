export type DetectionSnapshot = {
  now: number;
  isInterviewStarted: boolean;
  phoneDetected: boolean;
  peopleCount: number; // count of detections with class person/human
};

export type WarningType = 'phone' | 'multiplePeople';

export type DetectionManagerCallbacks = {
  onWarning: (type: WarningType, nextCount: number, message: string) => void;
  onResume: () => void;
  onTerminate: (type: WarningType, finalCount: number, message: string) => void;
};

export type DetectionManagerConfig = {
  pauseMs?: number; // default 5000
};

export function createDetectionManager(cb: DetectionManagerCallbacks, cfg: DetectionManagerConfig = {}) {
  const pauseMs = typeof cfg.pauseMs === 'number' ? cfg.pauseMs : 5000;

  // Persistent counters
  let phoneCount = 0;
  let peopleCountWarnings = 0;

  // Pause state
  let pauseUntil = 0;

  // Cooldowns
  let lastPhoneWarning = 0;
  let lastPeopleWarning = 0;

  // Duplicate suppression for people by count+second
  let lastPeopleHash = '';

  const isPaused = (now: number) => now < pauseUntil;

  const startPause = (now: number) => {
    pauseUntil = now + pauseMs;
  };

  const process = (snap: DetectionSnapshot) => {
    const { now, isInterviewStarted, phoneDetected, peopleCount } = snap;
    if (!isInterviewStarted) return;
    if (isPaused(now)) return;

    // Single-person only (and no phone): do nothing
    if (!phoneDetected && (peopleCount === 0 || peopleCount === 1)) return;

    // Phone flow
    if (phoneDetected) {
      // cooldown 5s, single warning per event
      if (now - lastPhoneWarning < pauseMs) return;
      phoneCount += 1;
      lastPhoneWarning = now;
      const msg = `⚠️ Mobile phone detected. This is Warning ${phoneCount}/3. Continued violation will result in interview termination.`;
      cb.onWarning('phone', phoneCount, msg);
      startPause(now);
      // Auto resume handled by caller after pause window; we notify resume when pause elapses
      // Termination on 3rd
      if (phoneCount >= 3) {
        cb.onTerminate('phone', phoneCount, '🚫 Interview terminated due to repeated violations.');
      }
      return; // do not process people in same frame
    }

    // Multiple people flow
    if (peopleCount > 1) {
      const hash = `${peopleCount}-${Math.floor(now / 1000)}`;
      if (hash === lastPeopleHash) return; // duplicate within same second
      if (now - lastPeopleWarning < pauseMs) return; // cooldown

      lastPeopleHash = hash;
      peopleCountWarnings += 1;
      lastPeopleWarning = now;
      const msg = `⚠️ Multiple people detected. This is Warning ${peopleCountWarnings}/3. Continued violation will result in interview termination.`;
      cb.onWarning('multiplePeople', peopleCountWarnings, msg);
      startPause(now);
      if (peopleCountWarnings >= 3) {
        cb.onTerminate('multiplePeople', peopleCountWarnings, '🚫 Interview terminated due to repeated violations.');
      }
      return;
    }
  };

  const tick = (now: number) => {
    if (!isPaused(now)) return;
    if (now >= pauseUntil) {
      pauseUntil = 0;
      cb.onResume();
    }
  };

  const reset = () => {
    phoneCount = 0;
    peopleCountWarnings = 0;
    pauseUntil = 0;
    lastPhoneWarning = 0;
    lastPeopleWarning = 0;
    lastPeopleHash = '';
  };

  return {
    process,
    tick,
    isPaused,
    reset,
    getCounts: () => ({ phone: phoneCount, multiplePeople: peopleCountWarnings })
  };
}


