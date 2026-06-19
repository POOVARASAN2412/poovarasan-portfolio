document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════════
       HERO PARTICLES
       ═══════════════════════════════════════════ */
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = particle.style.height = (2 + Math.random() * 3) + 'px';

            // Random color between violet and cyan
            const colors = ['#8b5cf6', '#06b6d4', '#a78bfa', '#22d3ee', '#c4b5fd'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            particleContainer.appendChild(particle);
        }
    }

    /* ═══════════════════════════════════════════
       SCROLL PROGRESS LINE
       ═══════════════════════════════════════════ */
    const progressFill = document.getElementById('progressFill');

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (progressFill) {
            progressFill.style.height = scrollPercent + '%';
        }
    }

    /* ═══════════════════════════════════════════
       CHAPTER NAVIGATION DOT TRACKING
       ═══════════════════════════════════════════ */
    const chapters = document.querySelectorAll('.chapter');
    const navDots = document.querySelectorAll('.chapter-dot');

    function updateActiveChapter() {
        let currentChapterId = '';
        const scrollPos = window.scrollY + window.innerHeight / 3;

        chapters.forEach(chapter => {
            if (chapter.offsetTop <= scrollPos) {
                currentChapterId = chapter.id;
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === '#' + currentChapterId) {
                dot.classList.add('active');
            }
        });
    }

    // Smooth scroll for nav dots
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ═══════════════════════════════════════════
       SCROLL REVEAL (IntersectionObserver)
       ═══════════════════════════════════════════ */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ═══════════════════════════════════════════
       SKILL CARD TILT EFFECT ON MOUSE MOVE
       ═══════════════════════════════════════════ */
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ═══════════════════════════════════════════
       STAT COUNTER ANIMATION
       ═══════════════════════════════════════════ */
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stat-counters');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 1500;
            const stepTime = Math.max(Math.floor(duration / target), 50);
            let current = 0;

            const timer = setInterval(() => {
                current++;
                num.textContent = current;
                if (current >= target) {
                    clearInterval(timer);
                    num.textContent = target;
                }
            }, stepTime);
        });
    }

    /* ═══════════════════════════════════════════
       PLANET HOVER PAUSE ORBIT
       ═══════════════════════════════════════════ */
    const planets = document.querySelectorAll('.planet');

    planets.forEach(planet => {
        const orbit = planet.closest('.orbit');

        planet.addEventListener('mouseenter', () => {
            if (orbit) {
                orbit.style.animationPlayState = 'paused';
            }
        });

        planet.addEventListener('mouseleave', () => {
            if (orbit) {
                orbit.style.animationPlayState = 'running';
            }
        });

        // Click animation
        planet.addEventListener('click', (e) => {
            const body = planet.querySelector('.planet-body');
            if (body) {
                body.style.transform = 'scale(1.4)';
                setTimeout(() => {
                    body.style.transform = '';
                }, 300);
            }
        });
    });

    /* ═══════════════════════════════════════════
       SCROLL INDICATOR FADE ON SCROLL
       ═══════════════════════════════════════════ */
    const scrollIndicator = document.getElementById('scrollIndicator');

    function handleScrollIndicator() {
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '';
                scrollIndicator.style.pointerEvents = '';
            }
        }
    }

    /* ═══════════════════════════════════════════
       SCROLL EVENT HANDLER (throttled)
       ═══════════════════════════════════════════ */
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                updateActiveChapter();
                handleScrollIndicator();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial calls
    updateProgress();
    updateActiveChapter();
    handleScrollIndicator();
});
