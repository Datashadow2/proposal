// =============================================================
// 1. CONFIGURATION – EDIT THESE!
// =============================================================

// 🔽 REPLACE WITH YOUR PHOTO FILENAME
const PHOTO_FILENAME = 'her-photo.jpg'; // <-- CHANGE THIS

// 🔽 REPLACE WITH HER FAVORITE SONG (MP3 URL or local file path)
const SONG_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // <-- CHANGE THIS

// 🔽 REPLACE WITH YOUR NAME (for the voucher)
const YOUR_NAME = 'Uncle Lee D Papa'; // <-- CHANGE THIS

// 🔽 FLIRTY MESSAGES FOR LOVE LETTERS
const FLIRTY_MESSAGES = [
    "I'm running out of reasons not to kiss you. 💋",
    "You make my heart do that stupid flutter thing. 💓",
    "I catch myself smiling just thinking about you. 😊",
    "You're the best part of my day, every day. 🌅",
    "I'd pick you every single time. 💜",
    "You're my favorite distraction. ✨"
];

// =============================================================
// 2. DOM REFS
// =============================================================
const overlay = document.getElementById('overlay');
const countdown = document.getElementById('countdown');
const countNum = document.getElementById('countNum');
const storyContainer = document.getElementById('storyContainer');

const sparkleCanvas = document.getElementById('sparkleCanvas');
const sCtx = sparkleCanvas.getContext('2d');

const confettiCanvas = document.getElementById('confettiCanvas');
const cCtx = confettiCanvas.getContext('2d');

const visualizer = document.getElementById('visualizer');
const bars = document.querySelectorAll('#visualizer .bar');

const playBtn = document.getElementById('playBtn');
const trackName = document.getElementById('trackName');

const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
const photoContainer = document.getElementById('photoContainer');
const herPhoto = document.getElementById('herPhoto');

const typewriterContainer = document.getElementById('typewriterContainer');
const typedOutput = document.getElementById('typedOutput');
const btnContainer = document.getElementById('btnContainer');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const foreverReveal = document.getElementById('foreverReveal');
const foreverText = document.getElementById('foreverText');
const responseText = document.getElementById('responseText');
const voucher = document.getElementById('voucher');
const shareBtn = document.getElementById('shareBtn');
const yourNameSpan = document.getElementById('yourName');

// =============================================================
// 3. SET PHOTO & NAME
// =============================================================
herPhoto.src = PHOTO_FILENAME;
yourNameSpan.textContent = YOUR_NAME;

// =============================================================
// 4. AUDIO SETUP
// =============================================================
const audio = new Audio(SONG_URL);
audio.loop = true;
audio.preload = 'auto';

let isPlaying = false;

playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶️';
        visualizer.classList.remove('active');
        isPlaying = false;
    } else {
        audio.play().then(() => {
            playBtn.textContent = '⏸️';
            visualizer.classList.add('active');
            isPlaying = true;
        }).catch(() => {
            alert('Tap play again to start the music! 🎵');
        });
    }
});

trackName.textContent = '🎵 Her Song';

// =============================================================
// 5. AUDIO VISUALIZER
// =============================================================
if (window.AudioContext || window.webkitAudioContext) {
    let audioCtx;
    let analyser;
    let dataArray;
    let isVisualizerSetup = false;

    function setupVisualizer() {
        if (isVisualizerSetup) return;
        try {
            const ctx = new(window.AudioContext || window.webkitAudioContext)();
            const src = ctx.createMediaElementSource(audio);
            analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            src.connect(analyser);
            analyser.connect(ctx.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            isVisualizerSetup = true;
            audioCtx = ctx;
            updateBars();
        } catch (e) {}
    }

    function updateBars() {
        if (!isVisualizerSetup || !analyser) {
            requestAnimationFrame(updateBars);
            return;
        }
        analyser.getByteFrequencyData(dataArray);
        const maxBarHeight = 32;
        bars.forEach((bar, i) => {
            const val = dataArray[i] || 0;
            const height = Math.max(2, (val / 255) * maxBarHeight);
            bar.style.height = height + 'px';
        });
        requestAnimationFrame(updateBars);
    }

    audio.addEventListener('play', () => {
        if (!isVisualizerSetup) setupVisualizer();
    });
}

// =============================================================
// 6. TAP TO BEGIN
// =============================================================
let hasStarted = false;

function startExperience() {
    if (hasStarted) return;
    hasStarted = true;
    overlay.classList.add('hidden');
    showCountdown();
}

overlay.addEventListener('click', startExperience);
overlay.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startExperience();
});

// =============================================================
// 7. COUNTDOWN
// =============================================================
function showCountdown() {
    countdown.classList.add('show');
    let count = 3;
    countNum.textContent = count;

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countNum.textContent = count;
            countNum.style.animation = 'none';
            void countNum.offsetHeight;
            countNum.style.animation = 'countPop 0.6s ease forwards';
        } else {
            clearInterval(interval);
            countdown.classList.remove('show');
            countdown.style.display = 'none';
            revealStory();
        }
    }, 800);
}

// =============================================================
// 8. REVEAL STORY SEQUENCE
// =============================================================
function revealStory() {
    storyContainer.classList.add('show');

    // Show line 1 after 0.5s
    setTimeout(() => {
        line1.classList.add('visible');
    }, 500);

    // Show line 2 after 2.5s
    setTimeout(() => {
        line1.classList.remove('visible');
        line1.classList.add('hidden-line');
        line2.classList.add('visible');
    }, 2500);

    // Show photo after 4.5s
    setTimeout(() => {
        line2.classList.remove('visible');
        line2.classList.add('hidden-line');
        photoContainer.classList.add('visible');
    }, 4500);

    // Show line 3 after 7s
    setTimeout(() => {
        photoContainer.classList.remove('visible');
        line3.classList.add('visible');
    }, 7000);

    // Show typewriter after 9s
    setTimeout(() => {
        line3.classList.remove('visible');
        line3.classList.add('hidden-line');
        typewriterContainer.classList.add('show');
        startTypewriter();
    }, 9000);

    // Create floating love letters
    createLoveLetters();
}

// =============================================================
// 9. FLOATING LOVE LETTERS
// =============================================================
function createLoveLetters() {
    const emojis = ['💌', '✉️', '💜', '✨', '💕'];
    const container = document.body;

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

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            showFlirtyMessage(el.dataset.message, e);
        });
        el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showFlirtyMessage(el.dataset.message, e);
        });

        container.appendChild(el);
    }
}

function showFlirtyMessage(msg, event) {
    const popup = document.createElement('div');
    popup.style.cssText = `
                position: fixed;
                z-index: 200;
                background: rgba(26, 11, 30, 0.92);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(216, 180, 254, 0.3);
                border-radius: 20px;
                padding: 1.2rem 1.8rem;
                color: #ffb3c6;
                font-size: clamp(0.95rem, 2.5vw, 1.3rem);
                max-width: 300px;
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
    } else {
        x = event.clientX || event.pageX;
        y = (event.clientY || event.pageY) - 50;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const popW = 300;
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
// 10. TYPEWRITER EFFECT
// =============================================================
const proposalText = "So, I have to ask... Will you be my girlfriend? 💜";

function startTypewriter() {
    let index = 0;
    typedOutput.textContent = '';
    const cursor = document.querySelector('.cursor-blink');

    function type() {
        if (index < proposalText.length) {
            typedOutput.textContent += proposalText.charAt(index);
            index++;
            setTimeout(type, 55 + Math.random() * 40);
        } else {
            cursor.style.display = 'none';
            btnContainer.classList.add('show');
        }
    }

    setTimeout(type, 400);
}

// =============================================================
// 11. "NO" BUTTON CHASE
// =============================================================
const noBtnEl = document.getElementById('noBtn');
const noMessages = [
    "Nice try. 😏",
    "Not a chance. 💜",
    "You know you want to. 😘",
    "Keep dreaming. ✨",
    "I'm not going anywhere. 😉",
    "Try again, cutie. 💕"
];
let noClickCount = 0;

function moveNoButton() {
    const containerRect = btnContainer.getBoundingClientRect();
    const btnRect = noBtnEl.getBoundingClientRect();

    const maxX = containerRect.width - btnRect.width - 10;
    const maxY = containerRect.height - btnRect.height - 10;

    const newX = Math.random() * Math.max(0, maxX);
    const newY = Math.random() * Math.max(0, maxY);

    noBtnEl.style.position = 'relative';
    noBtnEl.style.left = newX + 'px';
    noBtnEl.style.top = newY + 'px';
    noBtnEl.style.transition = 'all 0.2s ease';

    noClickCount = (noClickCount + 1) % noMessages.length;
    noBtnEl.textContent = noMessages[noClickCount];

    const hue = 280 + Math.random() * 40;
    noBtnEl.style.borderColor = `hsla(${hue}, 70%, 70%, 0.3)`;
}

noBtnEl.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

noBtnEl.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

noBtnEl.addEventListener('mouseenter', () => {
    if (noBtnEl.style.position !== 'relative') {
        noBtnEl.style.position = 'relative';
    }
    moveNoButton();
});

// =============================================================
// 12. "YES" BUTTON – CONFETTI + FOREVER
// =============================================================
let hasSaidYes = false;

yesBtn.addEventListener('click', () => {
    if (hasSaidYes) return;
    hasSaidYes = true;
    sayYes();
});

yesBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (hasSaidYes) return;
    hasSaidYes = true;
    sayYes();
});

function sayYes() {
    btnContainer.style.display = 'none';
    typewriterContainer.style.opacity = '0';

    // Show forever reveal
    foreverReveal.classList.add('show');

    setTimeout(() => {
        responseText.classList.add('show');
    }, 600);

    setTimeout(() => {
        voucher.classList.add('show');
        shareBtn.classList.add('show');
    }, 1400);

    launchConfetti();

    visualizer.classList.add('active');
    if (!isPlaying) {
        audio.play().then(() => {
            playBtn.textContent = '⏸️';
            isPlaying = true;
        }).catch(() => {});
    }
}

// =============================================================
// 13. CONFETTI SYSTEM
// =============================================================
let confettiPieces = [];
let confettiRunning = false;

function launchConfetti() {
    if (confettiRunning) return;
    confettiRunning = true;

    const canvas = confettiCanvas;
    const ctx = cCtx;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const colors = ['#ff2a8a', '#d8b4fe', '#ffb3c6', '#ffd700', '#ff6b9d', '#b388ff', '#ff4081'];
    const pieces = 350;

    for (let i = 0; i < pieces; i++) {
        confettiPieces.push({
            x: Math.random() * w,
            y: Math.random() * h - h,
            w: 6 + Math.random() * 10,
            h: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 6,
            vy: 2 + Math.random() * 6,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
    }

    let frame = 0;

    function animateConfetti() {
        ctx.clearRect(0, 0, w, h);
        let alive = false;

        confettiPieces.forEach(p => {
            p.x += p.vx + Math.sin(frame / 60 + p.y / 100) * 0.5;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            p.vy += 0.04;

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

        if (alive) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, w, h);
            confettiPieces = [];
            confettiRunning = false;
        }
    }

    animateConfetti();

    let respawns = 0;
    const respawnInterval = setInterval(() => {
        if (respawns > 6 || !hasSaidYes) {
            clearInterval(respawnInterval);
            return;
        }
        for (let i = 0; i < 60; i++) {
            confettiPieces.push({
                x: Math.random() * w,
                y: -20 - Math.random() * 40,
                w: 5 + Math.random() * 8,
                h: 5 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 5,
                vy: 2 + Math.random() * 5,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
            });
        }
        respawns++;
    }, 1200);
}

// =============================================================
// 14. SPARKLE SYSTEM (Tap anywhere → burst of stars)
// =============================================================
let sparkles = [];

function initSparkleCanvas() {
    const canvas = sparkleCanvas;
    const ctx = sCtx;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    function createSparkleBurst(x, y) {
        const count = 18 + Math.floor(Math.random() * 14);
        const colors = ['#ffd700', '#ffb3c6', '#ff2a8a', '#d8b4fe', '#ffffff', '#ff6b9d'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4;
            const size = 4 + Math.random() * 10;
            sparkles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                life: 1,
                decay: 0.012 + Math.random() * 0.025,
                size: size,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.5 ? 'star' : 'heart',
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8,
            });
        }
    }

    function handleTap(e) {
        let x, y;
        if (e.touches) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
            e.preventDefault();
        } else {
            x = e.clientX || e.pageX;
            y = e.clientY || e.pageY;
        }
        createSparkleBurst(x, y);
    }

    document.addEventListener('click', handleTap);
    document.addEventListener('touchstart', handleTap, { passive: false });

    function animateSparkles() {
        ctx.clearRect(0, 0, w, h);

        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.05;
            s.vx *= 0.99;
            s.life -= s.decay;
            s.rot += s.rotSpeed;

            if (s.life <= 0) {
                sparkles.splice(i, 1);
                continue;
            }

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

                const half = size / 2;
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
// 15. SHARE BUTTON
// =============================================================
shareBtn.addEventListener('click', () => {
    const shareData = {
        title: '💜 She said yes!',
        text: '💜 She said yes! ✨ Forever starts now. 💕',
        url: window.location.href,
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => {});
    } else {
        const text = `💜 She said yes! ✨ Forever starts now. 💕`;
        navigator.clipboard.writeText(text).then(() => {
            alert('📋 Copied to clipboard! Share it with the world! ✨');
        }).catch(() => {
            prompt('Copy this message:', text);
        });
    }
});

// =============================================================
// 16. HANDLE RESIZE
// =============================================================
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    sparkleCanvas.width = w;
    sparkleCanvas.height = h;
    confettiCanvas.width = w;
    confettiCanvas.height = h;
});

// =============================================================
// 17. KEYBOARD SHORTCUT (Easter egg)
// =============================================================
document.addEventListener('keydown', (e) => {
    if ((e.key === 'y' || e.key === 'Y') && !hasSaidYes) {
        if (btnContainer.classList.contains('show')) {
            sayYes();
        }
    }
});

console.log('💜 She\'s about to say yes... ✨');
console.log('💕 Made with love for someone special.');
