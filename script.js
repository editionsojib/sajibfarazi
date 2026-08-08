document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animations
    AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-quad'
    });

    // 2. Mobile Menu Toggle & Smooth Auto-Close
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 3. Project Filter Buttons Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active', 'gradient-bg', 'text-white', 'shadow-lg');
                b.classList.add('glass-card', 'text-slate-300');
            });

            // Add active class to clicked button
            btn.classList.add('active');
            btn.classList.remove('glass-card', 'text-slate-300');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. Interactive Canvas Particle Animation (Optimized for performance)
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const particleCount = Math.min(window.innerWidth / 15, 60);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        function animateCanvas() {
            if (document.hidden) {
                requestAnimationFrame(animateCanvas);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // 5. Contact Form Handler (Using Web3Forms API for instant email delivery)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // UI Loading State
            btnText.textContent = 'Sending...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin text-sm';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                // Submit to Web3Forms free API
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    formStatus.className = 'p-4 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 block';
                    formStatus.textContent = 'Thank you! Your message has been sent successfully. Sajib will get back to you soon.';
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Something went wrong. Please check your Web3Forms Access Key.');
                }
            } catch (error) {
                formStatus.className = 'p-4 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40 block';
                formStatus.textContent = `Error: ${error.message}`;
            } finally {
                btnText.textContent = 'Send Message';
                btnIcon.className = 'fa-solid fa-paper-plane text-sm';
                submitBtn.disabled = false;
            }
        });
    }
});
