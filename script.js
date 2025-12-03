// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: false,
    offset: 100
});

// ===== Loader fade out =====
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 1000);
    }
});

// ===== Parallax Effect =====
window.addEventListener('scroll', function() {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && window.scrollY < window.innerHeight) {
        heroBg.style.backgroundPosition = `center ${window.scrollY * 0.5}px`;
    }
});

// ===== Skill Bar Animation =====
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const progressBar = bar.querySelector('.progress-bar');
        if (progressBar) {
            const targetWidth = progressBar.getAttribute('data-target');
            let currentWidth = 0;
            
            const interval = setInterval(() => {
                if (currentWidth >= targetWidth) {
                    clearInterval(interval);
                } else {
                    currentWidth += Math.random() * 5;
                    progressBar.style.width = Math.min(currentWidth, targetWidth) + '%';
                }
            }, 50);
        }
    });
};

// Trigger skill animation when about section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'about') {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) {
    observer.observe(aboutSection);
}

// ===== Project Card Hover Effect =====
document.querySelectorAll('.project-card').forEach(card => {
    const image = card.querySelector('.project-image img');
    const overlay = card.querySelector('.overlay');
    
    card.addEventListener('mouseenter', function() {
        if (overlay) overlay.style.opacity = '1';
        if (image) image.style.transform = 'scale(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (overlay) overlay.style.opacity = '0';
        if (image) image.style.transform = 'scale(1)';
    });
});

// ===== Typing Effect for Subtitle =====
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let index = 0;
    
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);
}

// ===== Scroll Down Indicator Animation =====
const scrollIndicator = document.querySelector('.scroll-down span');
if (scrollIndicator) {
    scrollIndicator.style.animation = 'scroll-down 2s infinite';
}

// Add scroll animation keyframe
const style = document.createElement('style');
style.innerHTML = `
    @keyframes scroll-down {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(10px);
            opacity: 0;
        }
    }
    
    .scroll-down span {
        display: block;
        width: 20px;
        height: 20px;
        border: 2px solid #ffeb00;
        border-radius: 50%;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-title {
        animation: fadeInUp 1s ease;
    }
    
    .animated-gradient {
        background: linear-gradient(90deg, #ffeb00, #ffc300);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
`;
document.head.appendChild(style);

// ===== EmailJS loader helper =====
/**
 * Ensure EmailJS is available. Returns a Promise that resolves to window.emailjs.
 */
function ensureEmailJS() {
    return new Promise((resolve, reject) => {
        if (window.emailjs) return resolve(window.emailjs);

        const src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        const existing = Array.from(document.scripts).find(s => s.src && s.src.indexOf('emailjs/browser') !== -1);
        if (existing) {
            existing.addEventListener('load', () => resolve(window.emailjs));
            existing.addEventListener('error', (e) => reject(e));
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
            if (window.emailjs) resolve(window.emailjs);
            else reject(new Error('EmailJS loaded but "emailjs" is not present'));
        };
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
    });
}

// Contact form handler (integrated working version)
document.addEventListener('DOMContentLoaded', function () {
    // 1. Ensure EmailJS library is loaded
    ensureEmailJS().then((emailjs) => {
        
        // Initialize
        emailjs.init('3lz9yN1Vp0rHCWaff'); // Your Public Key

        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');

        if (!contactForm) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get values (added phone)
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const phone = (contactForm.querySelector('[name="phone"]') || {}).value?.trim() || '';
            const subject = contactForm.querySelector('[name="subject"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();

            // Basic Validation (phone optional)
            if (!email || !message || !name) {
                if(formMessage) formMessage.innerHTML = '<div class="error-message">Please fill in all fields.</div>';
                return;
            }

            // show spinner on button (if implemented)
            setButtonLoading && setButtonLoading(true);
            if (formMessage) formMessage.innerHTML = '';

            const SERVICE_ID = 'service_2wfl8yl';
            const TEMPLATE_ADMIN = 'template_z8n4llf';
            const TEMPLATE_USER  = 'template_jpz9f6h';

            // 1. Send Notification to YOU (include phone)
            emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                // include phone at top of the message so you can contact user easily
                message: `Phone: ${phone || 'N/A'}\n\nMessage:\n${message}`
            })
            .then(() => {
                // 2. Send Auto-Reply to VISITOR (include phone if desired)
                return emailjs.send(SERVICE_ID, TEMPLATE_USER, {
                    name: name,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: `Hi ${name},\n\nThanks for reaching out. We received your message:\n\n"${message}"\n\nPhone on file: ${phone || 'N/A'}`
                });
            })
            .then(() => {
                if(formMessage) {
                    formMessage.innerHTML = '<div class="success-message">✓ Message sent successfully! Check your email for confirmation.</div>';
                    setTimeout(() => { formMessage.innerHTML = ''; }, 5000);
                }
                contactForm.reset();
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                if(formMessage) formMessage.innerHTML = '<div class="error-message">✗ Failed to send. Please try again later.</div>';
            })
            .finally(() => {
                setButtonLoading && setButtonLoading(false);
            });
        });

    }).catch(err => {
        console.error('Failed to load EmailJS:', err);
    });
});

/* Helper: toggle submit button spinner for #contactForm */
function setButtonLoading(loading) {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const btn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (!btn) return;

    if (loading) {
        if (typeof btn.dataset.orig === 'undefined') btn.dataset.orig = btn.innerHTML;
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
    } else {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        if (typeof btn.dataset.orig !== 'undefined') {
            btn.innerHTML = btn.dataset.orig;
            delete btn.dataset.orig;
        }
    }
}

// Carousel safety-init (existing)
const el = document.getElementById('certCarousel');
if (el && typeof bootstrap !== 'undefined') {
  const inst = bootstrap.Carousel.getInstance(el) || new bootstrap.Carousel(el, {
    interval: 6000,
    ride: 'carousel',
    pause: false,
    wrap: true
  });
  inst.cycle();
}