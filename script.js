(function() {
    // --- PAGE NAVIGATION ---
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const page3 = document.getElementById('page3');
    const openLetterBtn = document.getElementById('openLetterBtn');
    const trashLetterBtn = document.getElementById('trashLetterBtn');
    const doneReadingBtn = document.getElementById('doneReadingBtn');

    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    }

    openLetterBtn.addEventListener('click', function() {
        showPage('page2');
        document.querySelector('.proposal-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Start background music when letter is opened
        const audio = document.getElementById('bgMusic');
        if (audio) {
            audio.play().catch(e => console.log('Audio autoplay blocked, user interaction needed'));
        }
    });

    trashLetterBtn.addEventListener('click', function() {
        showPage('page3');
        const msg = document.createElement('div');
        msg.style = 'background: #4a1a4a; padding: 8px 20px; border-radius: 40px; color: #f0ccff; border: 1px solid #b77ad6; margin: 8px 0; text-align: center; font-weight: 500;';
        msg.innerText = '💜 it\'s okay. i\'ll still ask anyway.';
        const header = document.querySelector('.proposal-header');
        header.parentNode.insertBefore(msg, header.nextSibling);
        setTimeout(() => { if (msg.parentNode) msg.remove(); }, 4000);
        document.querySelector('.proposal-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Start background music
        const audio = document.getElementById('bgMusic');
        if (audio) {
            audio.play().catch(e => console.log('Audio autoplay blocked, user interaction needed'));
        }
    });

    doneReadingBtn.addEventListener('click', function() {
        showPage('page3');
        const msg = document.createElement('div');
        msg.style = 'background: #4a1a4a; padding: 8px 20px; border-radius: 40px; color: #f0ccff; border: 1px solid #b77ad6; margin: 8px 0; text-align: center; font-weight: 500;';
        msg.innerText = '💜 okay... here goes nothing.';
        const header = document.querySelector('.proposal-header');
        header.parentNode.insertBefore(msg, header.nextSibling);
        setTimeout(() => { if (msg.parentNode) msg.remove(); }, 4000);
        document.querySelector('.proposal-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // --- HEARTS ANIMATION ---
    const heartsContainer = document.getElementById('heartsContainer');
    function spawnHearts() {
        if (!heartsContainer) return;
        heartsContainer.innerHTML = '';
        const hearts = ['💗', '💖', '💜', '💕', '💘', '💓', '🩷', '❤️‍🔥', '💟'];
        for (let i = 0; i < 18; i++) {
            const span = document.createElement('span');
            span.className = 'heart-float';
            span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            span.style.left = Math.random() * 92 + '%';
            span.style.top = Math.random() * 70 + '%';
            span.style.fontSize = (1.6 + Math.random() * 2.2) + 'rem';
            span.style.animationDuration = (2.8 + Math.random() * 3) + 's';
            span.style.animationDelay = (Math.random() * 2.5) + 's';
            span.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
            heartsContainer.appendChild(span);
        }
    }
    spawnHearts();
    setInterval(spawnHearts, 5000);

    // --- FIREWORKS SYSTEM ---
    function createFirework(x, y) {
        const colors = ['#ff6bff', '#ff44aa', '#d9a6ff', '#ff88cc', '#ff44ff', '#aa66ff', '#ff55bb', '#cc66ff'];
        const numParticles = 40 + Math.floor(Math.random() * 30);
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            const angle = Math.random() * Math.PI * 2;
            const distance = 150 + Math.random() * 250;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 50;
            const size = 6 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}66;
                --tx: ${tx}px;
                --ty: ${ty}px;
                animation-duration: ${1 + Math.random() * 0.5}s;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) particle.remove();
            }, 2000);
        }
        
        // Add sparkles
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const emojis = ['✨', '💫', '⭐', '🌟'];
            sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            sparkle.style.cssText = `
                left: ${x + (Math.random() - 0.5) * 200}px;
                top: ${y + (Math.random() - 0.5) * 200}px;
                font-size: ${1.5 + Math.random() * 2}rem;
            `;
            document.body.appendChild(sparkle);
            setTimeout(() => {
                if (sparkle.parentNode) sparkle.remove();
            }, 1500);
        }
    }

    function launchFireworks() {
        const numBursts = 12 + Math.floor(Math.random() * 8);
        for (let i = 0; i < numBursts; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.7 + 50;
                createFirework(x, y);
            }, i * 300 + Math.random() * 200);
        }
        
        // Second wave
        setTimeout(() => {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight * 0.7 + 50;
                    createFirework(x, y);
                }, i * 400 + Math.random() * 200);
            }
        }, 3000);
    }

    // --- BUTTON SCALING ---
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    let noClicks = 0;
    const MAX_CLICKS = 8;

    function updateButtons() {
        const noScale = Math.max(0.18, 1 - noClicks * 0.12);
        const yesScale = Math.min(2.1, 1 + noClicks * 0.16);
        noBtn.style.transform = `scale(${noScale})`;
        yesBtn.style.transform = `scale(${yesScale})`;
        if (noScale < 0.35) {
            noBtn.style.opacity = '0.4';
        } else {
            noBtn.style.opacity = '1';
        }
        if (noClicks >= 6) {
            noBtn.textContent = '💔';
        } else if (noClicks >= 4) {
            noBtn.textContent = '😢 really?';
        } else {
            noBtn.textContent = '💔 no';
        }
    }

    // --- YES HANDLER ---
    function handleYes() {
        // Launch fireworks immediately
        launchFireworks();
        
        // Show celebration overlay after a small delay
        setTimeout(() => {
            const old = document.querySelector('.fireworks-overlay');
            if (old) old.remove();

            const overlay = document.createElement('div');
            overlay.className = 'fireworks-overlay';
            overlay.innerHTML = `
                <div class="fireworks-content">
                    <h1>💜 YES! 💜</h1>
                    <p>you just made me the happiest person alive</p>
                    <div style="display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; margin: 12px 0;">
                        <span class="kiss-emoji">💋</span>
                        <span class="kiss-emoji" style="animation-delay: 0.2s;">💋</span>
                        <span class="kiss-emoji" style="animation-delay: 0.5s;">💋</span>
                        <span class="kiss-emoji" style="animation-delay: 0.8s;">💋</span>
                    </div>
                    <p style="font-size: 1.8rem;">🎇 i can't stop smiling 🎇</p>
                    <p style="font-size: 1.3rem; margin-top: 6px;">💕 you're incredible, you know that?</p>
                </div>
            `;
            document.body.appendChild(overlay);
            
            // Keep fireworks going
            setTimeout(() => launchFireworks(), 2000);
            setTimeout(() => launchFireworks(), 4000);
            
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
            }, 10000);
        }, 500);
    }

    // --- NO HANDLER ---
    function handleNo() {
        noClicks = Math.min(noClicks + 1, MAX_CLICKS);
        updateButtons();
        if (noClicks === 4) {
            const area = document.getElementById('buttonArea');
            const hint = document.createElement('div');
            hint.style = 'background: #4a1a4a; padding: 6px 16px; border-radius: 40px; color: #f0ccff; border: 1px solid #b77ad6; margin: 6px 0; font-weight: 500; font-size: 0.9rem; text-align: center;';
            hint.innerText = '💜 the "no" is shrinking... but "yes" keeps growing 💜';
            area.insertBefore(hint, area.children[0]);
            setTimeout(() => { if (hint.parentNode) hint.remove(); }, 3500);
        }
    }

    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
    updateButtons();

    console.log('💜 a letter for you · made with love');
})();
