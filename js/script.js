/* ==================== 
   CISH - JavaScript
   Interactividad del sitio
   ==================== */

// === HEADER SCROLL EFFECT ===
const header = document.getElementById('header');

function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);
handleScroll();

// ===  MENU MOBIL ===
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// === SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {

        const href = this.getAttribute('href');

        if (!href || href === '#' || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});


// === ANIMATED COUNTERS ===
const statNumbers = document.querySelectorAll('.stat-number');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
    
    countersAnimated = true;
}

// Observer for stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// === SCROLL ANIMATIONS ===
const animatedElements = document.querySelectorAll(
    '.about-card, .service-card, .anexo-feature, .contact-item, .stat-item'
);

const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    elementObserver.observe(el);
});

// === CONTACT FORM ===
// 1. Inicialización con reintentos automáticos

document.addEventListener('DOMContentLoaded', () => {

    emailjs.init("NWeqBTjIZUOmNGNKF");
    console.log("✅ EmailJS inicializado");

    const contactForm = document.getElementById('contactForm');
    const btn = document.getElementById('button');
    const telInput = document.getElementById('telefono');

    if (!contactForm) return;

    telInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 10) this.value = this.value.slice(0, 10);
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const telefono = telInput.value;

        if (!email.includes('@')) {
            showNotification('El correo debe ser válido (@)', 'error');
            return;
        }

        if (telefono.length !== 10) {
            showNotification('El teléfono debe tener 10 dígitos', 'error');
            return;
        }

        btn.innerText = 'Enviando...';
        btn.disabled = true;

        emailjs.sendForm(
            'service_2gahwtr',
            'template_ownd4ov',
            this
        ).then(() => {
            showNotification('¡Mensaje enviado con éxito!', 'success');
            contactForm.reset();
        }).catch(err => {
            showNotification('Error al enviar el formulario', 'error');
            console.error(err);
        }).finally(() => {
            btn.innerText = 'Enviar Mensaje';
            btn.disabled = false;
        });
    });
});

// 4. Función de Notificación Coherente
function showNotification(message, type) {
    const toast = document.getElementById('notification');
    const msgElem = document.getElementById('notification-message');
    if (!toast) return;

    toast.className = `notification show ${type}`;
    msgElem.innerText = message;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {

    const images = document.querySelectorAll('.vol-card-image img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
    });

    closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        lightbox.classList.remove('active');
        lightboxImg.src = '';
    });

});

/* === WHATSAPP TOOLTIP === */
document.addEventListener('DOMContentLoaded', () => {

    const btn = document.getElementById('whatsappBtn');
    const tooltip = document.getElementById('whatsappTooltip');

    const phone = '524494147681';

    const sections = [
        {
            selector: '.volumetricos',
            message: 'Hola, me gustaría conocer más sobre los controles volumétricos.'
        },
        {
            selector: '.proceso-verificación',
            message: 'Hola, quiero información sobre sus servicios.'
        },
        {
            selector: '.contact',
            message: 'Hola, me gustaría recibir información.'
        }
    ];

    function updateWhatsApp() {
        let message = 'Hola, me gustaría recibir información.';
        let tooltipText = '¿Te ayudamos?';

        sections.forEach(section => {
            let el;
            try {
                el = document.querySelector(section.selector);
            } catch {
                return;
            }

            if (!el) return;

            const rect = el.getBoundingClientRect();
            const middle = window.innerHeight * 0.5;

            if (rect.top <= middle && rect.bottom >= middle) {
                message = section.message;
                tooltipText = section.message;
            }
        });

        btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        tooltip.textContent = tooltipText;
    }

    window.addEventListener('scroll', updateWhatsApp);
    updateWhatsApp();
});
