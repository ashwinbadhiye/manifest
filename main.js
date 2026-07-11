document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.querySelector('.close-modal');
    
    // Header scroll effect (only for blog page or if home scrolls)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const affirmations = [
            "I am manifesting my dreams.",
            "I am finding clarity in my thoughts.",
            "I am growing more mindful every day.",
            "I am attracting positive energy.",
            "I am in control of my future."
        ];
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const current = affirmations[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === current.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % affirmations.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };
        type();
    }

    // Particle System (Stardust)
    const particleContainer = document.getElementById('particles-js');
    if (particleContainer) {
        const createParticle = () => {
            const p = document.createElement('div');
            p.style.position = 'absolute';
            p.style.width = Math.random() * 3 + 'px';
            p.style.height = p.style.width;
            p.style.background = 'white';
            p.style.borderRadius = '50%';
            p.style.opacity = Math.random() * 0.5;
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.filter = 'blur(1px)';
            p.style.boxShadow = '0 0 10px white';
            
            const duration = Math.random() * 10 + 10;
            p.style.transition = `all ${duration}s linear`;
            
            particleContainer.appendChild(p);

            setTimeout(() => {
                p.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
                p.style.opacity = 0;
            }, 100);

            setTimeout(() => p.remove(), duration * 1000);
        };

        setInterval(createParticle, 500);
        for(let i=0; i<20; i++) createParticle();
    }

    // Modal Content
    const contents = {
        terms: `
            <h2 class="serif">Terms of Service</h2>
            <p style="margin: 1.5rem 0">By using the Manifest app, you agree to our terms. This application is designed for personal growth and journaling purposes. AI reflections are generated based on your inputs and should be used as a tool for self-reflection, not professional advice.</p>
            <p>We reserve the right to update these terms as our services evolve.</p>
        `,
        privacy: `
            <h2 class="serif">Privacy Policy</h2>
            <p style="margin: 1.5rem 0">Your privacy is our priority. Your journals and manifestation goals are encrypted and stored securely. We do not sell your personal data to third parties.</p>
            <p>We use AI to provide insights, but your data is anonymized during processing where possible.</p>
        `
    };

    // Modal and Scroll triggers
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId) return;

            if (targetId.startsWith('#')) {
                const type = targetId.substring(1);
                if (contents[type]) {
                    e.preventDefault();
                    modalContent.innerHTML = contents[type];
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else if (type && document.getElementById(type)) {
                    // In-page navigation (About, Features, etc.)
                    e.preventDefault();
                    document.getElementById(type).scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const handleClose = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeModal) closeModal.addEventListener('click', handleClose);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) handleClose();
    });

    // Parallax Blobs
    const blobs = document.querySelectorAll('.blob');
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.02;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Screenshots gallery — smooth momentum wheel + drag to scroll
    const scroller = document.querySelector('.screens-scroller');
    if (scroller) {
        let targetX = null;
        let rafId = null;
        const ease = 0.15;

        const maxScroll = () => scroller.scrollWidth - scroller.clientWidth;

        const animate = () => {
            const cur = scroller.scrollLeft;
            const diff = targetX - cur;
            if (Math.abs(diff) < 0.5) {
                scroller.scrollLeft = targetX;
                targetX = null;
                rafId = null;
                return;
            }
            scroller.scrollLeft = cur + diff * ease;
            rafId = requestAnimationFrame(animate);
        };

        // Vertical wheel → smooth horizontal, released to the page at the edges
        scroller.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal (trackpad)
            const max = maxScroll();
            const base = targetX == null ? scroller.scrollLeft : targetX;
            if ((e.deltaY < 0 && base <= 0) || (e.deltaY > 0 && base >= max - 1)) return; // let page scroll
            e.preventDefault();
            targetX = Math.max(0, Math.min(max, base + e.deltaY));
            if (rafId == null) rafId = requestAnimationFrame(animate);
        }, { passive: false });

        // Pointer drag to scroll (desktop click-drag + touch), direct 1:1
        let isDown = false, startX = 0, startScroll = 0;
        scroller.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            isDown = true;
            if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; targetX = null; }
            startX = e.clientX;
            startScroll = scroller.scrollLeft;
            try { scroller.setPointerCapture(e.pointerId); } catch (err) {}
        });
        scroller.addEventListener('pointermove', (e) => {
            if (!isDown) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 4) scroller.classList.add('dragging');
            scroller.scrollLeft = startScroll - dx;
        });
        const endDrag = () => {
            isDown = false;
            scroller.classList.remove('dragging');
        };
        scroller.addEventListener('pointerup', endDrag);
        scroller.addEventListener('pointercancel', endDrag);
        scroller.addEventListener('pointerleave', endDrag);
    }

    // Reveal sections on scroll
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }
});
