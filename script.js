// =============================================================
// 0. GLOBAL ERROR HANDLER - PREVENTS CRASHES ON ALL DEVICES
// =============================================================
window.addEventListener('error', function(e) {
    console.warn('🔴 Caught error:', e.message);
    e.preventDefault();
    return true;
});

window.addEventListener('unhandledrejection', function(e) {
    console.warn('⚠️ Unhandled rejection:', e.reason);
    e.preventDefault();
});

// =============================================================
// 1. CONFIGURATION – YOUR PHOTOS!
// =============================================================

const PHOTO_FILENAME = 'IMG_20260719_151641_886.jpg';

// 🔽 YOUR EXTRA PHOTOS FOR RAINING GALLERY
const GALLERY_PHOTOS = [
    'IMG_20260719_151641_886.jpg',
    '1784379589433.jpg',
    '1784379820586.jpg',
    'IMG_20260719_151604_829.jpg',
    'IMG_20260719_151833_036 (1).jpg'
];

// 🔽 YOUR SONG - KEEPING YOUR ORIGINAL FILENAME
const SONG_URL = 'Okello Max - Nakufa, Bensoul & Amlyoto [Official Music Video] SMS [SKIZA 5801963] to 811.mp3';

// 🔽 YOUR NAME
const YOUR_NAME = 'Uncle Lee D Papa';

const FLIRTY_MESSAGES = [
    "I'm running out of reasons not to kiss you. 💋",
    "You make my heart do that stupid flutter thing. 💓",
    "I catch myself smiling just thinking about you. 😊",
    "You're the best part of my day, every day. 🌅",
    "I'd pick you every single time. 💜"
];

// =============================================================
// 2. DOM REFS WITH SAFETY CHECKS
// =============================================================
function safeGetElement(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`⚠️ Element not found: ${id}`);
    return el;
}

const overlay = safeGetElement('overlay');
const overlayText = safeGetElement('overlayText');
const countdown = safeGetElement('countdown');
const countNum = safeGetElement('countNum');
const storyContainer = safeGetElement('storyContainer');

const sparkleCanvas = safeGetElement('sparkleCanvas');
const sCtx = sparkleCanvas ? sparkleCanvas.getContext('2d') : null;
const confettiCanvas = safeGetElement('confettiCanvas');
const cCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
const rainCanvas = safeGetElement('rainCanvas');
const rCtx = rainCanvas ? rainCanvas.getContext('2d') : null;

const playBtnOverlay = safeGetElement('playBtnOverlay');
const line1 = safeGetElement('line1');
const line2 = safeGetElement('line2');
const line3 = safeGetElement('line3');
const line4 = safeGetElement('line4');
const photoContainer = safeGetElement('photoContainer');
const herPhoto = safeGetElement('herPhoto');
const typewriterContainer = safeGetElement('typewriterContainer');
const typedOutput = safeGetElement('typedOutput');
const btnContainer = safeGetElement('btnContainer');
const yesBtn = safeGetElement('yesBtn');
const noBtn = safeGetElement('noBtn');
const foreverReveal = safeGetElement('foreverReveal');
const responseText = safeGetElement('responseText');
const voucher = safeGetElement('voucher');
const shareBtn = safeGetElement('shareBtn');
const yourNameSpan = safeGetElement('yourName');

// =============================================================
// 3. SET PHOTO & NAME WITH FALLBACK
// =============================================================
if (herPhoto) {
    herPhoto.src = PHOTO_FILENAME;
    herPhoto.onerror = function() {
        console.warn('⚠️ Main photo failed to load, using fallback');
        this.src = '';
        this.alt = '💜';
        this.style.background = 'linear-gradient(135deg, #4a0e4e, #ff2a8a)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.color = 'white';
        this.style.fontSize = '60px';
        const fallbackText = document.createElement('div');
        fallbackText.textContent = '💜';
        fallbackText.style.fontSize = '80px';
        fallbackText.style.position = 'absolute';
        fallbackText.style.top = '50%';
        fallbackText.style.left = '50%';
        fallbackText.style.transform = 'translate(-50%, -50%)';
        this.parentNode.style.position = 'relative';
        this.parentNode.appendChild(fallbackText);
    };
}

if (yourNameSpan) {
    yourNameSpan.textContent = YOUR_NAME;
}

// =============================================================
// 4. PRE-LOAD ALL IMAGES
// =============================================================
let allImagesLoaded = false;
let imagesLoadedCount = 0;
const totalImages = GALLERY_PHOTOS.length;
let preloadedImageObjects = [];

function preloadImages(callback) {
    console.log('🔄 Pre-loading images...');
    
    if (totalImages === 0) {
        allImagesLoaded = true;
        if (callback) callback();
        return;
    }
    
    GALLERY_PHOTOS.forEach((src, index) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            imagesLoadedCount++;
            preloadedImageObjects[index] = img;
            console.log(`✅ Loaded: ${src} (${imagesLoadedCount}/${totalImages})`);
            if (imagesLoadedCount === totalImages) {
                allImagesLoaded = true;
                console.log('✅ All images pre-loaded successfully!');
                if (callback) callback();
            }
        };
        
        img.onerror = () => {
            console.warn(`⚠️ Could not load: ${src} - using fallback`);
            imagesLoadedCount++;
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            const colors = ['#ff2a8a', '#d8b4fe', '#ffb3c6', '#ffd700', '#6a0dad'];
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = '#fff';
            ctx.font = '80px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💜', 100, 100);
            const fallbackImg = new Image();
            fallbackImg.src = canvas.toDataURL();
            preloadedImageObjects[index] = fallbackImg;
            
            if (imagesLoadedCount === totalImages) {
                allImagesLoaded = true;
                console.log('✅ All images loaded (some with fallbacks)');
                if (callback) callback();
            }
        };
        
        img.src = src;
    });
}

preloadImages();

// =============================================================
// 5. AUDIO SETUP - MUST PLAY TO PROCEED
// =============================================================
let audio = null;
let isPlaying = false;
let audioAvailable = false;
let audioInitialized = false;
let audioLoadAttempts = 0;
const MAX_AUDIO_ATTEMPTS = 3;

function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;
    
    try {
        audio = new Audio(SONG_URL);
        audio.loop = true;
        audio.preload = 'auto';
        
        audio.addEventListener('canplaythrough', () => {
            audioAvailable = true;
            console.log('🎵 Audio ready to play');
            updateAudioStatus('✅ Music ready!');
            // Enable the overlay to allow progression
            enableProceed();
        });
        
        audio.addEventListener('error', (e) => {
            console.warn('🎵 Audio failed to load:', e);
            audioAvailable = false;
            audioLoadAttempts++;
            if (audioLoadAttempts < MAX_AUDIO_ATTEMPTS) {
                updateAudioStatus('🔄 Retrying music...');
                setTimeout(() => {
                    audio.load();
                }, 2000);
            } else {
                updateAudioStatus('⚠️ Music unavailable - tap play to continue anyway');
                // Allow proceed even without audio after 3 attempts
                enableProceed();
            }
        });
        
        // iOS needs this
        audio.addEventListener('loadedmetadata', () => {
            console.log('🎵 Audio metadata loaded');
        });
        
    } catch (e) {
        console.warn('🎵 Audio not supported on this device');
        audioAvailable = false;
        updateAudioStatus('⚠️ Music not supported - tap play to continue');
        enableProceed();
    }
}

function updateAudioStatus(message) {
    const statusEl = document.getElementById('audioStatus');
    if (statusEl) {
        statusEl.textContent = message;
    }
}

// =============================================================
// 6. PLAY BUTTON - MUST PLAY TO PROCEED
// =============================================================
let audioPlayed = false;
let proceedEnabled = false;

function enableProceed() {
    proceedEnabled = true;
    if (overlayText) {
        overlayText.textContent = '🎵 Music ready! Tap anywhere to begin';
    }
}

if (playBtnOverlay) {
    playBtnOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        ensureAudioInitialized();
        toggleMusic();
    });
    
    playBtnOverlay.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ensureAudioInitialized();
        toggleMusic();
    });
}

function toggleMusic() {
    ensureAudioInitialized();
    
    if (!audioAvailable || !audio) {
        // Allow proceeding anyway if audio is unavailable
        if (overlayText) {
            overlayText.textContent = '💜 Tap anywhere to begin (music unavailable)';
        }
        // Still allow proceed
        if (!hasStarted) {
            overlayText.textContent = '💜 Tap anywhere to begin';
        }
        return;
    }
    
    if (isPlaying) {
        audio.pause();
        if (playBtnOverlay) playBtnOverlay.textContent = '▶️';
        isPlaying = false;
        if (overlayText) {
            overlayText.textContent = '⏸️ Music paused - tap play to resume';
        }
    } else {
        audio.play().then(() => {
            if (playBtnOverlay) playBtnOverlay.textContent = '⏸️';
            isPlaying = true;
            audioPlayed = true;
            if (overlayText) {
                overlayText.textContent = '🎵 Music is playing! Tap anywhere to begin';
            }
            // Enable proceed immediately when music starts
            enableProceed();
        }).catch((err) => {
            console.warn('Audio play error:', err);
            if (playBtnOverlay) playBtnOverlay.textContent = '▶️';
            // On iOS, we need user interaction first
            if (err.name === 'NotAllowedError') {
                if (overlayText) {
                    overlayText.textContent = '👆 Tap the play button again to start music';
                }
            } else {
                // Other errors - allow proceed anyway
                if (overlayText) {
                    overlayText.textContent = '💜 Tap anywhere to begin';
                }
                enableProceed();
            }
        });
    }
}

function ensureAudioInitialized() {
    if (!audioInitialized) {
        initAudio();
        // Add status element if it doesn't exist
        addAudioStatusElement();
    }
}

function addAudioStatusElement() {
    if (!document.getElementById('audioStatus')) {
        const statusEl = document.createElement('div');
        statusEl.id = 'audioStatus';
        statusEl.style.cssText = `
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.8rem;
            margin-top: 8px;
            transition: opacity 0.3s;
        `;
        statusEl.textContent = '🔄 Loading music...';
        const overlayContent = document.querySelector('#overlay');
        if (overlayContent) {
            overlayContent.appendChild(statusEl);
        }
    }
}

// =============================================================
// 7. TAP TO BEGIN - REQUIRES AUDIO PLAYED
// =============================================================
let hasStarted = false;

function startExperience() {
    if (hasStarted) return;
    
    ensureAudioInitialized();
    
    // Check if audio is playing or if we should proceed anyway
    if (audioAvailable && !isPlaying) {
        // Try to play audio
        if (audio) {
            audio.play().then(() => {
                if (playBtnOverlay) playBtnOverlay.textContent = '⏸️';
                isPlaying = true;
                audioPlayed = true;
                // Now proceed
                proceedToExperience();
            }).catch(() => {
                // If audio can't play, check if we should proceed anyway
                if (proceedEnabled) {
                    proceedToExperience();
                } else {
                    if (overlayText) {
                        overlayText.textContent = '👆 Please tap the play button first! 🎵';
                        // Pulse the play button
                        if (playBtnOverlay) {
                            playBtnOverlay.style.animation = 'bounce 0.5s 3';
                            setTimeout(() => { 
                                if (playBtnOverlay) playBtnOverlay.style.animation = ''; 
                            }, 1500);
                        }
                    }
                }
            });
        }
        return;
    }
    
    // If audio is playing or not available, proceed
    if (isPlaying || !audioAvailable || proceedEnabled) {
        proceedToExperience();
    } else {
        // Not playing and not enabled - show instruction
        if (overlayText) {
            overlayText.textContent = '👆 Please tap the play button first! 🎵';
        }
        if (playBtnOverlay) {
            playBtnOverlay.style.animation = 'bounce 0.5s 3';
            setTimeout(() => { 
                if (playBtnOverlay) playBtnOverlay.style.animation = ''; 
            }, 1500);
        }
    }
}

function proceedToExperience() {
    if (hasStarted) return;
    hasStarted = true;
    if (overlay) overlay.classList.add('hidden');
    showCountdown();
}

if (overlay) {
    overlay.addEventListener('click', startExperience);
    overlay.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startExperience();
    });
}

// Initialize audio on first interaction
document.addEventListener('click', ensureAudioInitialized, { once: true });
document.addEventListener('touchstart', ensureAudioInitialized, { once: true });

// =============================================================
// 8. COUNTDOWN
// =============================================================
function showCountdown() {
    if (!countdown) return;
    countdown.classList.add('show');
    let count = 3;
    if (countNum) countNum.textContent = count;

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            if (countNum) {
                countNum.textContent = count;
                countNum.style.animation = 'none';
                void countNum.offsetHeight;
                countNum.style.animation = 'countPop 0.6s ease forwards';
            }
        } else {
            clearInterval(interval);
            countdown.classList.remove('show');
            countdown.style.display = 'none';
            revealStory();
        }
    }, 800);
}

// =============================================================
// 9. REVEAL STORY
// =============================================================
function revealStory() {
    if (!storyContainer) return;
    storyContainer.classList.add('show');

    const steps = [
        { el: line1, delay: 500, duration: 2000 },
        { el: line2, delay: 3000, duration: 2000 },
        { el: line3, delay: 5000, duration: 2000 },
        { el: photoContainer, delay: 7000, duration: 2500, isPhoto: true },
        { el: line4, delay: 10000, duration: 2000 },
        { el: typewriterContainer, delay: 12000, duration: 100, isTypewriter: true }
    ];

    steps.forEach((step, index) => {
        setTimeout(() => {
            if (step.isPhoto) {
                if (step.el) step.el.classList.add('visible');
                return;
            }
            if (step.isTypewriter) {
                if (step.el) {
                    step.el.classList.add('show');
                    startTypewriter();
                }
                return;
            }
            if (index > 0) {
                const prevStep = steps[index - 1];
                if (prevStep && prevStep.el && !prevStep.isPhoto && !prevStep.isTypewriter) {
                    prevStep.el.classList.remove('visible');
                    prevStep.el.classList.add('hidden-line');
                }
            }
            if (step.el) {
                step.el.classList.add('visible');
            }
        }, step.delay);
    });

    createLoveLetters();
}

// =============================================================
// 10. LOVE LETTERS - TOUCH FRIENDLY
// =============================================================
function createLoveLetters() {
    const emojis = ['💌', '✉️', '💜', '✨', '💕'];
    for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.className = 'love-letter tappable';
        el.textContent = emojis[i % emojis.length];
        el.style.left = (Math.random() * 90 + 5) + '%';
        el.style.fontSize = (1.4 + Math.random() * 1.4) + 'rem';
        el.style.animationDuration = (20 + Math.random() * 18) + 's';
        el.style.animationDelay = (Math.random() * 12) + 's';
        const msgIndex = Math.floor(Math.random() * FLIRTY_MESSAGES.length);
        el.dataset.message = FLIRTY_MESSAGES[msgIndex];
        
        const showMessage = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showFlirtyMessage(el.dataset.message, e);
        };
        
        el.addEventListener('click', showMessage);
        el.addEventListener('touchstart', showMessage, { passive: false });
        document.body.appendChild(el);
    }
}

function showFlirtyMessage(msg, event) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed; z-index: 200;
        background: rgba(26, 11, 30, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(216, 180, 254, 0.3);
        border-radius: 20px;
        padding: 1.2rem 1.8rem;
        color: #ffb3c6;
        font-size: clamp(0.95rem, 2.5vw, 1.2rem);
        max-width: 280px;
        text-align: center;
        box-shadow: 0 0 60px rgba(255, 42, 138, 0.15);
        pointer-events: none;
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-weight: 500;
        line-height: 1.5;
    `;
    popup.textContent = msg;

    let x, y;
    if (event.touches) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY - 50;
    } else if (event.changedTouches) {
        x = event.changedTouches[0].clientX;
        y = event.changedTouches[0].clientY - 50;
    } else {
        x = event.clientX || event.pageX || window.innerWidth / 2;
        y = (event.clientY || event.pageY || window.innerHeight / 2) - 50;
    }
    
    const w = window.innerWidth;
    const h = window.innerHeight;
    const popW = 280;
    const popH = 90;
    x = Math.max(10, Math.min(w - popW - 10, x - popW / 2));
    y = Math.max(10, Math.min(h - popH - 10, y));
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1)';
    });
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.8) translateY(-20px)';
        setTimeout(() => popup.remove(), 500);
    }, 2200);
}

// =============================================================
// 11. TYPEWRITER
// =============================================================
const proposalText = "So, I have to ask... Will you be my girlfriend? 💜";
let typewriterComplete = false;

function startTypewriter() {
    if (typewriterComplete) return;
    let index = 0;
    if (typedOutput) typedOutput.textContent = '';
    const cursor = document.querySelector('.cursor-blink');

    function type() {
        if (index < proposalText.length) {
            if (typedOutput) {
                typedOutput.textContent += proposalText.charAt(index);
            }
            index++;
            setTimeout(type, 55 + Math.random() * 40);
        } else {
            if (cursor) cursor.style.display = 'none';
            typewriterComplete = true;
            if (btnContainer) btnContainer.classList.add('show');
        }
    }
    setTimeout(type, 400);
}

// =============================================================
// 12. "NO" BUTTON CHASE - TOUCH FRIENDLY
// =============================================================
const noBtnEl = document.getElementById('noBtn');
const noMessages = ["Nice try. 😏", "Not a chance. 💜", "You know you want to. 😘", "Keep dreaming. ✨", "I'm not going anywhere. 😉"];
let noClickCount = 0;

function moveNoButton() {
    if (!noBtnEl || !btnContainer) return;
    const containerRect = btnContainer.getBoundingClientRect();
    const btnRect = noBtnEl.getBoundingClientRect();
    const maxX = containerRect.width - btnRect.width - 10;
    const maxY = containerRect.height - btnRect.height - 10;
    noBtnEl.style.position = 'relative';
    noBtnEl.style.left = Math.random() * Math.max(0, maxX) + 'px';
    noBtnEl.style.top = Math.random() * Math.max(0, maxY) + 'px';
    noBtnEl.style.transition = 'all 0.2s ease';
    noClickCount = (noClickCount + 1) % noMessages.length;
    noBtnEl.textContent = noMessages[noClickCount];
}

if (noBtnEl) {
    noBtnEl.addEventListener('click', (e) => { e.preventDefault(); moveNoButton(); });
    noBtnEl.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); }, { passive: false });
    noBtnEl.addEventListener('mouseenter', moveNoButton);
}

// =============================================================
// 13. "YES" BUTTON
// =============================================================
let hasSaidYes = false;

if (yesBtn) {
    yesBtn.addEventListener('click', () => { if (!hasSaidYes) { hasSaidYes = true; sayYes(); } });
    yesBtn.addEventListener('touchstart', (e) => { 
        e.preventDefault(); 
        if (!hasSaidYes) { hasSaidYes = true; sayYes(); } 
    }, { passive: false });
}

function sayYes() {
    if (btnContainer) btnContainer.style.display = 'none';
    if (typewriterContainer) typewriterContainer.style.opacity = '0';
    if (foreverReveal) foreverReveal.classList.add('show');
    
    setTimeout(() => {
        if (responseText) responseText.classList.add('show');
    }, 600);
    
    setTimeout(() => {
        if (voucher) voucher.classList.add('show');
        if (shareBtn) shareBtn.classList.add('show');
        startRainingPhotos();
    }, 1400);
    
    launchConfetti();
    
    // Ensure music is playing
    ensureAudioInitialized();
    if (audio && audioAvailable && !isPlaying) {
        audio.play().then(() => {
            if (playBtnOverlay) playBtnOverlay.textContent = '⏸️';
            isPlaying = true;
        }).catch(() => {});
    }
}

// =============================================================
// 14. RAINING PHOTOS - PERFORMANCE OPTIMIZED
// =============================================================
let rainingPhotos = [];
let rainAnimationRunning = false;
let rainSpawnInterval = null;

function startRainingPhotos() {
    if (rainAnimationRunning || GALLERY_PHOTOS.length === 0) return;
    rainAnimationRunning = true;

    const canvas = rainCanvas;
    if (!canvas) return;
    const ctx = rCtx;
    if (!ctx) return;
    
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const images = [];
    GALLERY_PHOTOS.forEach((src, index) => {
        if (preloadedImageObjects[index] && preloadedImageObjects[index].complete && preloadedImageObjects[index].naturalWidth > 0) {
            images.push(preloadedImageObjects[index]);
        } else {
            const img = new Image();
            img.src = src;
            images.push(img);
        }
    });

    for (let i = 0; i < 20; i++) spawnPhoto(images);

    if (rainSpawnInterval) clearInterval(rainSpawnInterval);
    rainSpawnInterval = setInterval(() => {
        if (!rainAnimationRunning || !hasSaidYes) { 
            clearInterval(rainSpawnInterval);
            rainSpawnInterval = null;
            return; 
        }
        spawnPhoto(images);
    }, 300);

    function spawnPhoto(imgs) {
        const img = imgs[Math.floor(Math.random() * imgs.length)];
        const size = 60 + Math.random() * 80;
        rainingPhotos.push({
            img: img,
            x: Math.random() * (w - size),
            y: -size - Math.random() * 100,
            size: size,
            speed: 1.5 + Math.random() * 2.5,
            rotation: (Math.random() - 0.5) * 20,
            rotSpeed: (Math.random() - 0.5) * 2,
            opacity: 0.7 + Math.random() * 0.3,
            swing: 0.5 + Math.random() * 1.5,
            swingOffset: Math.random() * Math.PI * 2,
            loaded: img.complete && img.naturalWidth > 0
        });
    }

    function animateRain() {
        if (!rainAnimationRunning || !hasSaidYes) {
            ctx.clearRect(0, 0, w, h);
            rainingPhotos = [];
            rainAnimationRunning = false;
            if (rainSpawnInterval) {
                clearInterval(rainSpawnInterval);
                rainSpawnInterval = null;
            }
            return;
        }
        ctx.clearRect(0, 0, w, h);
        for (let i = rainingPhotos.length - 1; i >= 0; i--) {
            const p = rainingPhotos[i];
            p.y += p.speed;
            p.rotation += p.rotSpeed;
            p.x += Math.sin(p.y / 100 + p.swingOffset) * p.swing * 0.3;
            if (p.y > h + p.size) { rainingPhotos.splice(i, 1); continue; }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.shadowColor = 'rgba(255, 42, 138, 0.2)';
            ctx.shadowBlur = 20;

            const radius = 12;
            const s = p.size;
            ctx.beginPath();
            ctx.moveTo(-s/2 + radius, -s/2);
            ctx.lineTo(s/2 - radius, -s/2);
            ctx.quadraticCurveTo(s/2, -s/2, s/2, -s/2 + radius);
            ctx.lineTo(s/2, s/2 - radius);
            ctx.quadraticCurveTo(s/2, s/2, s/2 - radius, s/2);
            ctx.lineTo(-s/2 + radius, s/2);
            ctx.quadraticCurveTo(-s/2, s/2, -s/2, s/2 - radius);
            ctx.lineTo(-s/2, -s/2 + radius);
            ctx.quadraticCurveTo(-s/2, -s/2, -s/2 + radius, -s/2);
            ctx.closePath();
            ctx.clip();

            if (p.loaded && p.img && p.img.complete && p.img.naturalWidth > 0) {
                ctx.drawImage(p.img, -s/2, -s/2, s, s);
            } else {
                ctx.fillStyle = '#4a0e4e';
                ctx.fillRect(-s/2, -s/2, s, s);
                ctx.fillStyle = '#ff2a8a';
                ctx.font = `${s/2}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💜', 0, 0);
            }

            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(216, 180, 254, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-s/2, -s/2, s, s);
            ctx.restore();
        }
        requestAnimationFrame(animateRain);
    }
    animateRain();
}

// =============================================================
// 15. CONFETTI - PERFORMANCE OPTIMIZED
// =============================================================
let confettiPieces = [];
let confettiRunning = false;
let confettiRespawnInterval = null;

function launchConfetti() {
    if (confettiRunning) return;
    confettiRunning = true;
    const canvas = confettiCanvas;
    if (!canvas) return;
    const ctx = cCtx;
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    const colors = ['#ff2a8a', '#d8b4fe', '#ffb3c6', '#ffd700', '#ff6b9d', '#b388ff', '#ff4081'];
    
    for (let i = 0; i < 200; i++) {
        confettiPieces.push({
            x: Math.random() * w, y: Math.random() * h - h,
            w: 6 + Math.random() * 10, h: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 6, vy: 2 + Math.random() * 6,
            rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 12,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }
    
    let frame = 0;
    
    function animateConfetti() {
        if (!confettiRunning || !hasSaidYes) {
            ctx.clearRect(0, 0, w, h);
            confettiPieces = [];
            confettiRunning = false;
            if (confettiRespawnInterval) {
                clearInterval(confettiRespawnInterval);
                confettiRespawnInterval = null;
            }
            return;
        }
        ctx.clearRect(0, 0, w, h);
        let alive = false;
        confettiPieces.forEach(p => {
            p.x += p.vx + Math.sin(frame / 60 + p.y / 100) * 0.5;
            p.y += p.vy; p.rot += p.rotSpeed; p.vy += 0.04;
            if (p.y < h + 20) alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.globalAlpha = Math.min(1, (h - p.y) / 100 + 0.2);
            if (p.shape === 'rect') {
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(-p.w / 4, -p.h / 4, p.w / 3, p.h / 3);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(-1, -1, p.w / 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.fill();
            }
            ctx.restore();
        });
        frame++;
        if (alive || confettiPieces.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, w, h);
            confettiPieces = [];
            confettiRunning = false;
            if (confettiRespawnInterval) {
                clearInterval(confettiRespawnInterval);
                confettiRespawnInterval = null;
            }
        }
    }
    animateConfetti();
    
    let respawns = 0;
    if (confettiRespawnInterval) clearInterval(confettiRespawnInterval);
    confettiRespawnInterval = setInterval(() => {
        if (respawns > 6 || !hasSaidYes) { 
            clearInterval(confettiRespawnInterval);
            confettiRespawnInterval = null;
            return; 
        }
        for (let i = 0; i < 50; i++) {
            confettiPieces.push({
                x: Math.random() * w, y: -20 - Math.random() * 40,
                w: 5 + Math.random() * 8, h: 5 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 5, vy: 2 + Math.random() * 5,
                rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 10,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
        respawns++;
    }, 1500);
}

// =============================================================
// 16. SPARKLE SYSTEM - PERFORMANCE OPTIMIZED
// =============================================================
let sparkles = [];

function initSparkleCanvas() {
    const canvas = sparkleCanvas;
    if (!canvas) return;
    const ctx = sCtx;
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    function createSparkleBurst(x, y) {
        const count = 15 + Math.floor(Math.random() * 12);
        const colors = ['#ffd700', '#ffb3c6', '#ff2a8a', '#d8b4fe', '#ffffff', '#ff6b9d'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4;
            const size = 4 + Math.random() * 10;
            sparkles.push({
                x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.5,
                life: 1, decay: 0.012 + Math.random() * 0.025, size: size,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.5 ? 'star' : 'heart',
                rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 8
            });
        }
    }

    function handleTap(e) {
        const target = e.target;
        if (!target) return;
        if (target.closest('button') || target.closest('.btn') || target.closest('.btn-yes') || 
            target.closest('.btn-no') || target.closest('#yesBtn') || target.closest('#noBtn') ||
            target.closest('.play-btn') || target.closest('.love-letter')) {
            return;
        }
        let x, y;
        if (e.touches) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else if (e.changedTouches) {
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
        } else {
            x = e.clientX || e.pageX || window.innerWidth / 2;
            y = e.clientY || e.pageY || window.innerHeight / 2;
        }
        createSparkleBurst(x, y);
    }

    document.addEventListener('click', handleTap);
    document.addEventListener('touchstart', handleTap, { passive: true });

    function animateSparkles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, w, h);
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.vx *= 0.99;
            s.life -= s.decay; s.rot += s.rotSpeed;
            if (s.life <= 0) { sparkles.splice(i, 1); continue; }
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate((s.rot * Math.PI) / 180);
            ctx.globalAlpha = s.life;
            const size = s.size * (0.4 + 0.6 * s.life);
            if (s.shape === 'heart') {
                ctx.font = `${size}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = s.color;
                ctx.fillText('❤️', 0, 0);
            } else {
                ctx.fillStyle = s.color;
                ctx.shadowColor = s.color;
                ctx.shadowBlur = 12;
                ctx.beginPath();
                for (let j = 0; j < 8; j++) {
                    const angle = (j / 8) * Math.PI * 2;
                    const rad = j % 2 === 0 ? size : size * 0.35;
                    if (j === 0) ctx.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
                    else ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
                }
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            ctx.restore();
        }
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();
}

initSparkleCanvas();

// =============================================================
// 17. SHARE BUTTON - CROSS-DEVICE
// =============================================================
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const shareText = '💜 She said yes! ✨ Forever starts now. 💕';
        if (navigator.share) {
            navigator.share({ 
                title: '💜 She said yes!', 
                text: shareText, 
                url: window.location.href 
            }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('📋 Copied to clipboard! Share it with the world! ✨');
            }).catch(() => {
                fallbackCopy(shareText);
            });
        } else {
            fallbackCopy(shareText);
        }
    });
    
    shareBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        shareBtn.click();
    }, { passive: false });
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('📋 Copied to clipboard! Share it with the world! ✨');
    } catch (e) {
        prompt('Copy this message:', text);
    }
    document.body.removeChild(textarea);
}

// =============================================================
// 18. HANDLE RESIZE - PERFORMANCE OPTIMIZED
// =============================================================
let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (sparkleCanvas) { sparkleCanvas.width = w; sparkleCanvas.height = h; }
        if (confettiCanvas) { confettiCanvas.width = w; confettiCanvas.height = h; }
        if (rainCanvas) { rainCanvas.width = w; rainCanvas.height = h; }
    }, 250);
});

// =============================================================
// 19. KEYBOARD SHORTCUT
// =============================================================
document.addEventListener('keydown', (e) => {
    if ((e.key === 'y' || e.key === 'Y') && !hasSaidYes && btnContainer && btnContainer.classList.contains('show')) {
        sayYes();
    }
});

// =============================================================
// 20. DEVICE DETECTION
// =============================================================
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(navigator.userAgent);
const isMobile = isIOS || isAndroid || window.innerWidth < 768;

console.log(`📱 Device: ${isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Mobile' : 'Desktop'}`);
console.log('💜 She\'s about to say yes... ✨');
console.log('💕 Made with love for Uncle Lee D Papa');
console.log(`📸 Looking for ${totalImages} images...`);

// Special iOS instruction
if (isIOS && overlayText) {
    overlayText.textContent = '🎵 Tap play, then tap anywhere to begin';
}

console.log('✅ Script loaded successfully on', navigator.userAgent);
