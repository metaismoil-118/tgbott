document.addEventListener('DOMContentLoaded', () => {
    // --- 1. NAVBAR SCROLL & MOBILE MENU ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        // Navbar background toggle
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    });

    // Mobile Hamburger Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 2. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // --- 3. ANIMATED COUNTERS (Performance Section) ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const statsSection = document.getElementById('performance');

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || counted) return;
            
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const decimal = stat.getAttribute('data-decimal');
                const hasPlus = stat.getAttribute('data-plus');
                let current = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16);

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = decimal ? current.toFixed(1) : Math.floor(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = decimal ? target.toFixed(1) : target + (hasPlus ? '+' : '');
                    }
                };
                updateCount();
            });

            counted = true;
            observer.unobserve(entry.target);
        });
    };

    const statsObserver = new IntersectionObserver(startCounters, { threshold: 0.4 });
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- 4. HERO PARALLAX EFFECT ---
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (heroBg && scrollY <= window.innerHeight) {
            heroBg.style.transform = `scale(${1.05 + scrollY * 0.0003}) translateY(${scrollY * 0.3}px)`;
        }
    });

    // --- 5. GALLERY LIGHTBOX ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const caption = item.getAttribute('data-caption');
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // --- 6. CONTACT FORM VALIDATION & TELEGRAM INTEGRATION ---
    const porscheForm = document.getElementById('porscheForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const formFeedback = document.getElementById('formFeedback');

    // CONFIGURATION PLACEHOLDERS FOR TELEGRAM BOT API
    // Note: In production, never expose bot tokens on the client-side.
    const TELEGRAM_BOT_TOKEN = '9047866363:AAH7I7p55ap5TmMT2OXRAV0xkDcG1JMZTjc';
    const TELEGRAM_CHAT_ID = '7091881942';

    porscheForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formFeedback.textContent = '';
        formFeedback.className = 'form-feedback';

        // Basic Validation
        let isValid = true;
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const modelSelect = document.getElementById('modelSelect');
        const message = document.getElementById('message');

        const validateField = (field) => {
            const group = field.parentElement;
            if (!field.value.trim() || (field.tagName === 'SELECT' && field.value === "")) {
                group.classList.add('error');
                isValid = false;
            } else {
                group.classList.remove('error');
            }
        };

        validateField(fullName);
        validateField(email);
        validateField(phone);
        validateField(modelSelect);

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.parentElement.classList.add('error');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        submitBtn.querySelector('.btn-text').style.opacity = '0';
        spinner.style.display = 'block';
        submitBtn.disabled = true;

        const formDataMessage = `🚗 *New Porsche Inquiry* 🚗\n\n` +
            `👤 *Name:* ${fullName.value}\n` +
            `📧 *Email:* ${email.value}\n` +
            `📞 *Phone:* ${phone.value}\n` +
            `🏎️ *Model:* ${modelSelect.value}\n` +
            `💬 *Message:* ${message.value || 'None'}`;

        // Check if placeholders are configured
        if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
            // Simulate successful API submission if placeholders remain unchanged
            setTimeout(() => {
                successState("Inquiry successfully transmitted. Our concierge will contact you shortly.");
            }, 1500);
            return;
        }

        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: formDataMessage,
                    parse_mode: 'Markdown'
                })
            });

            const data = await response.json();

            if (data.ok) {
                successState("Inquiry successfully received. Welcome to the Porsche family.");
                porscheForm.reset();
            } else {
                throw new Error(data.description || 'Telegram API Error');
            }
        } catch (error) {
            errorState("Transmission failed. Please verify network connection or call our concierge directly.");
            console.error('Telegram Error:', error);
        }
    });

    function successState(msg) {
        spinner.style.display = 'none';
        submitBtn.querySelector('.btn-text').style.opacity = '1';
        submitBtn.disabled = false;
        formFeedback.textContent = msg;
        formFeedback.className = 'form-feedback success';
    }

    function errorState(msg) {
        spinner.style.display = 'none';
        submitBtn.querySelector('.btn-text').style.opacity = '1';
        submitBtn.disabled = false;
        formFeedback.textContent = msg;
        formFeedback.className = 'form-feedback error';
    }
});