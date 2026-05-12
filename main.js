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
                e.preventDefault();
                const type = targetId.substring(1);
                if (contents[type]) {
                    modalContent.innerHTML = contents[type];
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    const handleClose = () => {
        modalOverlay.classList.remove('active');
        if (!document.body.classList.contains('home')) {
            document.body.style.overflow = 'auto';
        }
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
});
