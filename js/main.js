/* ============================================
   TONER Y SUMINISTROS ARMENIA
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    // Initialize all modules
    Preloader.init();
    Navbar.init();
    Particles.init();
    Counter.init();
    ProductFilter.init();
    FAQ.init();
    ContactForm.init();
    WhatsApp.init();
    BackToTop.init();
    SmoothScroll.init();
});

/* --- Preloader --- */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 800);
        });
        // Fallback: hide after 3 seconds max
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 3000);
    }
};

/* --- Navbar --- */
const Navbar = {
    init() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Active section
            this.updateActiveLink();
        });

        // Mobile toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

/* --- Particles --- */
const Particles = {
    init() {
        const container = document.getElementById('particles');
        if (!container) return;

        const count = window.innerWidth < 768 ? 15 : 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${6 + Math.random() * 8}s`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;

            const colors = ['#0ea5e9', '#6366f1', '#ec4899', '#06b6d4'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            container.appendChild(particle);
        }
    }
};

/* --- Counter Animation --- */
const Counter = {
    init() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    animate(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(update);
    }
};

/* --- Product Filter --- */
const ProductFilter = {
    init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const products = document.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter products
                products.forEach(product => {
                    const category = product.dataset.category;

                    if (filter === 'all' || category === filter) {
                        product.classList.remove('hidden');
                        product.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        product.classList.add('hidden');
                    }
                });
            });
        });
    }
};

/* --- FAQ Accordion --- */
const FAQ = {
    init() {
        const items = document.querySelectorAll('.faq-item');

        items.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all
                items.forEach(i => i.classList.remove('active'));

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
};

/* --- Contact Form (redirect to WhatsApp) --- */
const ContactForm = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value;

            const servicioNames = {
                'toner': 'Compra de Toners/Tintas',
                'recarga': 'Recarga de Cartuchos',
                'reparacion': 'Reparación de Impresoras',
                'alquiler': 'Alquiler de Impresoras',
                'otro': 'Otro'
            };

            const text = `Hola, soy *${nombre}*.\n` +
                `📞 Tel: ${telefono}\n` +
                `🔧 Servicio: ${servicioNames[servicio] || servicio}\n` +
                `💬 Mensaje: ${mensaje}`;

            const url = `https://wa.me/573113111669?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }
};

/* --- WhatsApp Floating Button --- */
const WhatsApp = {
    init() {
        const btn = document.getElementById('whatsappBtn');
        const popup = document.getElementById('whatsappPopup');
        const closeBtn = document.getElementById('whatsappClose');

        if (!btn || !popup) return;

        let isOpen = false;

        btn.addEventListener('click', () => {
            isOpen = !isOpen;
            popup.classList.toggle('active', isOpen);
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen = false;
            popup.classList.remove('active');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.whatsapp-float')) {
                isOpen = false;
                popup.classList.remove('active');
            }
        });

        // Auto-show popup after 5 seconds
        setTimeout(() => {
            if (!isOpen) {
                popup.classList.add('active');
                isOpen = true;

                // Auto-hide after 8 seconds
                setTimeout(() => {
                    popup.classList.remove('active');
                    isOpen = false;
                }, 8000);
            }
        }, 5000);
    }
};

/* --- Back to Top --- */
const BackToTop = {
    init() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

/* --- Smooth Scroll --- */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
};

/* --- Fade In Up Animation for filtered products --- */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);
