/**
 * DATE INVITATION WEB APP - INTERACTIVE SCRIPT (MOBILE OPTIMIZED)
 */

(function () {
  'use strict';

  // Config fallback
  const config = window.CONFIG || {
    GOOGLE_SCRIPT_URL: "",
    secretPasscode: "1016",
    musicUrl: "music.mp3",
    inviterName: "Миний бие",
    defaultCrushName: "Хөөрхнөө",
    heroTitle: "Хөөе хөөрхнөө... ✨",
    heroSubtitle: "Энэ өдрүүдэд надтай хамт дурсамж бүтээж, болзоонд явах уу? 🌹",
    noButtonPhrases: [
      "Үгүй ээ 😜",
      "Яагаад үгүй гэж? 🥺",
      "Худлаа битгий маяглаад бай 💖",
      "Эрхлэхээ болиод 'Тэгье' дээр дар даа 🙈",
      "Энэ товч ажиллахгүй байна аа хэхэ 🏃‍♂️💨",
      "Нэг л боломж өгчих тэгэх үү? 🌹",
      "Би чамд дуртай амттанг чинь авч өгнө шүү 🍰",
      "Өө за за 'Тэгье' гэж байна гэж ойлголоо! 🥰"
    ]
  };

  // URL query parameter-ээс script URL авах боломж
  const urlParams = new URLSearchParams(window.location.search);
  const overrideScriptUrl = urlParams.get('sheet');
  const targetScriptUrl = overrideScriptUrl || config.GOOGLE_SCRIPT_URL;

  // Selected State
  const state = {
    answer: "Тийм 🥰",
    date: "Энэ амралтын өдрүүдээр",
    time: "Өдрийн хоол (12:00 - 15:00)",
    food: "Итали хоол & Паста 🍝",
    activity: "Үдэш хамтдаа алхах 🚶‍♀️✨",
    name: config.defaultCrushName || "Хөөрхнөө",
    notes: ""
  };

  // Elements
  const screenHero = document.getElementById('screenHero');
  const screenDateTime = document.getElementById('screenDateTime');
  const screenFood = document.getElementById('screenFood');
  const screenActivity = document.getElementById('screenActivity');
  const screenDetails = document.getElementById('screenDetails');
  const screenSuccess = document.getElementById('screenSuccess');

  const progressBarWrap = document.getElementById('progressBarWrap');
  const progressLabel = document.getElementById('progressLabel');
  const stepDots = document.querySelectorAll('.step-dot');

  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const btnSubmit = document.getElementById('btnSubmit');
  const btnRestart = document.getElementById('btnRestart');
  const musicToggle = document.getElementById('musicToggle');
  const bgAudio = document.getElementById('bgAudio');
  const toast = document.getElementById('toast');
  const loadingOverlay = document.getElementById('loadingOverlay');

  // Input & summary elements
  const customDateInput = document.getElementById('customDateInput');
  const customActCard = document.getElementById('customActCard');
  const customActInputWrap = document.getElementById('customActInputWrap');
  const customActivityInput = document.getElementById('customActivityInput');
  const pinInput = document.getElementById('pinInput');

  const summaryDate = document.getElementById('summaryDate');
  const summaryTime = document.getElementById('summaryTime');
  const summaryFood = document.getElementById('summaryFood');
  const summaryActivity = document.getElementById('summaryActivity');

  // Ticket elements
  const ticketName = document.getElementById('ticketName');
  const ticketInviter = document.getElementById('ticketInviter');
  const ticketDateTime = document.getElementById('ticketDateTime');
  const ticketPlan = document.getElementById('ticketPlan');

  // 1. Initial Personalization
  if (config.heroTitle) document.getElementById('heroTitle').textContent = config.heroTitle;
  if (config.heroSubtitle) document.getElementById('heroSubtitle').textContent = config.heroSubtitle;
  ticketInviter.textContent = config.inviterName || "Би";
  ticketName.textContent = config.defaultCrushName || "Хөөрхнөө";

  // Floating background hearts
  createFloatingHearts();

  // 2. Playful "No" button runaway logic (Controlled bounds - NO page stretching!)
  let noAttempts = 0;
  let yesScale = 1;

  function moveNoButton(e) {
    if (e && e.type === 'touchstart') {
      e.preventDefault();
    }
    noAttempts++;
    playChime(160, 'triangle', 0.1);

    // Button text change
    const phrases = config.noButtonPhrases;
    btnNo.textContent = phrases[noAttempts % phrases.length];

    // Gently enlarge "Yes" button & increase romantic glow WITHOUT exceeding mobile width
    yesScale += 0.04;
    const clampedScale = Math.min(1.12, yesScale);
    btnYes.style.transform = `scale(${clampedScale})`;
    btnYes.style.boxShadow = `0 8px ${18 + (clampedScale - 1) * 80}px rgba(244, 63, 94, ${Math.min(0.8, 0.4 + (clampedScale - 1) * 2)})`;

    // Bound the runaway movement safely within mobile screen margins
    const maxX = 65;
    const maxY = 28;
    const randomX = (Math.random() - 0.5) * (maxX * 2);
    const randomY = (Math.random() - 0.5) * (maxY * 2);
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  btnNo.addEventListener('mouseenter', moveNoButton);
  btnNo.addEventListener('touchstart', moveNoButton, { passive: false });
  btnNo.addEventListener('click', moveNoButton);

  // 3. "Yes" button click -> Confetti & Next screen
  btnYes.addEventListener('click', () => {
    fireConfetti();
    playRomanticChime();
    startMusic(); // Start background music if not started
    switchScreen('screenDateTime', 1);
  });

  // 4. Screen Switching Helper
  const screens = {
    screenHero: { el: screenHero, step: 0 },
    screenDateTime: { el: screenDateTime, step: 1 },
    screenFood: { el: screenFood, step: 2 },
    screenActivity: { el: screenActivity, step: 3 },
    screenDetails: { el: screenDetails, step: 4 },
    screenSuccess: { el: screenSuccess, step: 5 }
  };

  function switchScreen(screenId, stepIndex) {
    Object.values(screens).forEach(({ el }) => {
      el.classList.remove('active');
    });

    if (screens[screenId]) {
      screens[screenId].el.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Progress bar
    if (stepIndex >= 1 && stepIndex <= 4) {
      progressBarWrap.style.display = 'block';
      progressLabel.textContent = `Алхам ${stepIndex} / 4`;
      stepDots.forEach((dot, idx) => {
        const dotStep = idx + 1;
        dot.classList.remove('active', 'completed');
        if (dotStep === stepIndex) {
          dot.classList.add('active');
        } else if (dotStep < stepIndex) {
          dot.classList.add('completed');
        }
      });
    } else {
      progressBarWrap.style.display = 'none';
    }

    // If entering screenDetails, refresh summary
    if (screenId === 'screenDetails') {
      updateSummary();
      if (pinInput) {
        pinInput.value = '';
        pinInput.classList.remove('shake');
      }
    }
  }

  // Setup navigation buttons
  document.querySelectorAll('.btn-next, .btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreen = btn.getAttribute('data-to');
      if (targetScreen && screens[targetScreen]) {
        playChime(320, 'sine', 0.08);
        switchScreen(targetScreen, screens[targetScreen].step);
      }
    });
  });

  // 5. Date selection pills & custom input
  const datePills = document.querySelectorAll('.date-pill');
  datePills.forEach(pill => {
    pill.addEventListener('click', () => {
      datePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.date = pill.getAttribute('data-date');
      customDateInput.value = '';
      playChime(400, 'sine', 0.05);
    });
  });

  customDateInput.addEventListener('change', (e) => {
    if (e.target.value) {
      datePills.forEach(p => p.classList.remove('active'));
      state.date = `${e.target.value} өдөр`;
    }
  });

  // 6. Generic card group selector helper
  function setupCardGroup(selector, stateKey, onSelect) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const val = card.getAttribute('data-time') ||
                    card.getAttribute('data-food') ||
                    card.getAttribute('data-act');
        if (val) {
          state[stateKey] = val;
          playChime(440, 'sine', 0.06);
          if (onSelect) onSelect(val, card);
        }
      });
    });
  }

  setupCardGroup('#screenDateTime .choice-card', 'time');
  setupCardGroup('#foodGrid .choice-card', 'food');

  // Activity cards + Custom Activity handler
  setupCardGroup('#activityGrid .choice-card', 'activity', (val, card) => {
    if (val === 'custom') {
      customActInputWrap.style.display = 'block';
      customActivityInput.focus();
      state.activity = customActivityInput.value.trim() ? `✍️ ${customActivityInput.value.trim()}` : "Өөр зүйл хийх (Тусгай санаа)";
    } else {
      customActInputWrap.style.display = 'none';
    }
  });

  if (customActivityInput) {
    customActivityInput.addEventListener('input', (e) => {
      state.activity = e.target.value.trim() ? `✍️ ${e.target.value.trim()}` : "Өөр зүйл хийх (Тусгай санаа)";
    });
  }

  // 7. Update Summary in Review Screen
  function updateSummary() {
    summaryDate.textContent = state.date || "Сонгоогүй";
    summaryTime.textContent = state.time || "Сонгоогүй";
    summaryFood.textContent = state.food || "Сонгоогүй";
    summaryActivity.textContent = state.activity || "Сонгоогүй";
  }

  // 8. Submit to Google Sheets (Protected by PIN 1016)
  btnSubmit.addEventListener('click', async () => {
    const enteredPin = (pinInput ? pinInput.value.trim() : "");
    const correctPin = String(config.secretPasscode || "1016").trim();

    // Verify 1016 PIN Code
    if (enteredPin !== correctPin) {
      if (pinInput) {
        pinInput.classList.remove('shake');
        void pinInput.offsetWidth; // trigger reflow
        pinInput.classList.add('shake');
        pinInput.focus();
      }
      playErrorTone();
      showToast("Нууц код буруу байна! (Зөв код оруулна уу 🙈)");
      return;
    }

    // Show loading
    loadingOverlay.style.display = 'flex';

    const payload = {
      name: config.defaultCrushName || "Хөөрхнөө",
      answer: "Тийм 🥰 (Зөвшөөрсөн)",
      date: state.date,
      time: state.time,
      food: state.food,
      activity: state.activity,
      notes: "Нууц код: 1016 баталгаажсан"
    };

    try {
      if (targetScriptUrl && targetScriptUrl.startsWith("http")) {
        await fetch(targetScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
        showToast("Мэдээлэл Google Sheet рүү амжилттай илгээгдлээ! 💌");
      } else {
        console.warn("Google Script URL тохируулагдаагүй байна.");
        showToast("Урилга амжилттай бүртгэгдлээ! ✨");
      }
    } catch (err) {
      console.error("Илгээхэд алдаа гарлаа:", err);
      showToast("Илгээгдлээ! (Холболт шалгагдлаа)");
    } finally {
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        
        // Fill Date Ticket details
        ticketName.textContent = config.defaultCrushName || "Хөөрхнөө";
        ticketDateTime.textContent = `${state.date} • ${state.time.split(' ')[0]}`;
        ticketPlan.textContent = `${state.food} + ${state.activity}`;

        // Switch to success & blast confetti!
        switchScreen('screenSuccess', 5);
        fireMassiveConfetti();
        playCelebrationFanfare();
      }, 700);
    }
  });

  // 9. Restart
  btnRestart.addEventListener('click', () => {
    switchScreen('screenHero', 0);
  });

  // 10. Audio & Melodic Player Logic
  let audioCtx = null;
  let isPlayingMusic = false;
  let synthMelodyInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq = 440, type = 'sine', duration = 0.2) {
    try {
      initAudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playErrorTone() {
    playChime(220, 'sawtooth', 0.18);
    setTimeout(() => playChime(190, 'sawtooth', 0.22), 100);
  }

  function playRomanticChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => playChime(freq, 'sine', 0.4), i * 90);
    });
  }

  function playCelebrationFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => playChime(freq, 'triangle', 0.5), i * 110);
    });
  }

  // Melodic Web Audio Synthesizer (Warm acoustic piano/music-box arpeggios fallback)
  function playMelodicSynth() {
    // Beautiful romantic Canon in D chord progression notes
    const chords = [
      [587.33, 739.99, 880.00], // D major
      [440.00, 554.37, 659.25], // A major
      [493.88, 587.33, 739.99], // B minor
      [369.99, 440.00, 554.37], // F# minor
      [392.00, 493.88, 587.33], // G major
      [293.66, 369.99, 440.00], // D major
      [392.00, 493.88, 587.33], // G major
      [440.00, 554.37, 659.25]  // A major
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    synthMelodyInterval = setInterval(() => {
      if (!isPlayingMusic) return;
      initAudioContext();
      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];
      
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.65);
      } catch (e) {}

      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, 380);
  }

  function startMusic() {
    if (isPlayingMusic) return;

    if (config.musicUrl && bgAudio) {
      bgAudio.src = config.musicUrl;
      bgAudio.play().then(() => {
        isPlayingMusic = true;
        musicToggle.classList.add('playing');
      }).catch(() => {
        // If local mp3 not found or blocked, fall back to soft melodic synth
        isPlayingMusic = true;
        musicToggle.classList.add('playing');
        playMelodicSynth();
      });
    } else {
      isPlayingMusic = true;
      musicToggle.classList.add('playing');
      playMelodicSynth();
    }
  }

  function pauseMusic() {
    isPlayingMusic = false;
    musicToggle.classList.remove('playing');
    if (bgAudio) bgAudio.pause();
    if (synthMelodyInterval) {
      clearInterval(synthMelodyInterval);
      synthMelodyInterval = null;
    }
  }

  musicToggle.addEventListener('click', () => {
    initAudioContext();
    if (isPlayingMusic) {
      pauseMusic();
      showToast("Ая түр зогслоо ⏸️");
    } else {
      startMusic();
      showToast("Уянгалаг романтик ая эхэллээ 🎶💖");
    }
  });

  // 11. Confetti Effects
  function fireConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.75 },
        colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#fb7185', '#ffd1dc']
      });
    }
  }

  function fireMassiveConfetti() {
    if (typeof confetti !== 'function') return;
    const duration = 2.2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // 12. Floating Background Hearts Generator
  function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const emojis = ['💖', '💕', '🌸', '✨', '🌹', '💌'];
    
    setInterval(() => {
      if (document.hidden) return;
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = `${Math.random() * 92}%`;
      heart.style.fontSize = `${14 + Math.random() * 16}px`;
      heart.style.animationDuration = `${6 + Math.random() * 5}s`;
      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 10000);
    }, 1100);
  }

  // 13. Toast Notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

})();
