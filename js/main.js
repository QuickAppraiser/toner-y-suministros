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

            const url = `https://wa.me/573122541254?text=${encodeURIComponent(text)}`;
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


/* ==========================================================================
   FEATURE: TONER SEARCH BY PRINTER MODEL
   ========================================================================== */

(function() {
  'use strict';

  const tonerDatabase = [
    {
      models: ['HP LaserJet P1102', 'HP LaserJet P1102w', 'HP P1102', 'P1102', 'P1102w'],
      toner: 'HP 85A (CE285A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 45000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['HP LaserJet Pro M125', 'HP LaserJet Pro M127', 'HP M125', 'HP M127', 'M125', 'M127'],
      toner: 'HP 83A (CF283A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 45000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['HP LaserJet P1005', 'HP LaserJet P1006', 'HP P1005', 'HP P1006', 'P1005', 'P1006'],
      toner: 'HP 35A (CB435A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 42000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['HP LaserJet P1505', 'HP LaserJet M1522', 'HP P1505', 'HP M1522', 'P1505', 'M1522'],
      toner: 'HP 36A (CB436A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 42000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['HP LaserJet Pro M201', 'HP LaserJet Pro M225', 'HP M201', 'HP M225', 'M201', 'M225'],
      toner: 'HP 83X (CF283X)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 55000 },
        { type: 'Recarga', price: 40000 }
      ]
    },
    {
      models: ['HP LaserJet 1010', 'HP LaserJet 1012', 'HP LaserJet 1015', 'HP LaserJet 1020', 'HP 1020', 'HP 1010', '1020', '1010', '1012', '1015'],
      toner: 'HP 12A (Q2612A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 42000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['HP LaserJet Pro M1536', 'HP LaserJet P1606', 'HP M1536', 'HP P1606', 'M1536', 'P1606'],
      toner: 'HP 78A (CE278A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 45000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['HP LaserJet Pro M402', 'HP LaserJet Pro M426', 'HP M402', 'HP M426', 'M402', 'M426'],
      toner: 'HP 26A (CF226A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 65000 },
        { type: 'Recarga', price: 50000 }
      ]
    },
    {
      models: ['HP LaserJet Pro M404', 'HP LaserJet Pro M428', 'HP M404', 'HP M428', 'M404', 'M428'],
      toner: 'HP 58A (CF258A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 75000 }
      ]
    },
    {
      models: ['HP LaserJet P4015', 'HP LaserJet P4515', 'HP P4015', 'HP P4515', 'P4015', 'P4515'],
      toner: 'HP 64A (CC364A)',
      brand: 'HP',
      options: [
        { type: 'Compatible', price: 89000 }
      ]
    },
    {
      models: ['Samsung ML-2160', 'Samsung ML-2165', 'Samsung ML2160', 'Samsung ML2165', 'ML-2160', 'ML-2165'],
      toner: 'Samsung MLT-D101S',
      brand: 'Samsung',
      options: [
        { type: 'Compatible', price: 48000 },
        { type: 'Recarga', price: 40000 }
      ]
    },
    {
      models: ['Samsung SCX-3400', 'Samsung SCX-3405', 'Samsung SCX3400', 'Samsung SCX3405', 'SCX-3400', 'SCX-3405'],
      toner: 'Samsung MLT-D101S',
      brand: 'Samsung',
      options: [
        { type: 'Compatible', price: 48000 },
        { type: 'Recarga', price: 40000 }
      ]
    },
    {
      models: ['Samsung SL-M2020', 'Samsung SL-M2070', 'Samsung M2020', 'Samsung M2070', 'SL-M2020', 'SL-M2070', 'M2020', 'M2070'],
      toner: 'Samsung MLT-D111S',
      brand: 'Samsung',
      options: [
        { type: 'Compatible', price: 52000 },
        { type: 'Recarga', price: 45000 }
      ]
    },
    {
      models: ['Samsung ML-1660', 'Samsung ML-1665', 'Samsung ML1660', 'Samsung ML1665', 'ML-1660', 'ML-1665'],
      toner: 'Samsung MLT-D104S',
      brand: 'Samsung',
      options: [
        { type: 'Compatible', price: 48000 },
        { type: 'Recarga', price: 40000 }
      ]
    },
    {
      models: ['Samsung ML-1910', 'Samsung ML-2525', 'Samsung ML1910', 'Samsung ML2525', 'ML-1910', 'ML-2525'],
      toner: 'Samsung MLT-D105S',
      brand: 'Samsung',
      options: [
        { type: 'Compatible', price: 48000 },
        { type: 'Recarga', price: 40000 }
      ]
    },
    {
      models: ['Brother HL-1110', 'Brother HL-1112', 'Brother HL1110', 'Brother HL1112', 'HL-1110', 'HL-1112'],
      toner: 'Brother TN-1060',
      brand: 'Brother',
      options: [
        { type: 'Compatible', price: 42000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['Brother HL-L2320', 'Brother HL-L2360', 'Brother HLL2320', 'Brother HLL2360', 'HL-L2320', 'HL-L2360'],
      toner: 'Brother TN-2370 / TN-660',
      brand: 'Brother',
      options: [
        { type: 'Compatible', price: 55000 },
        { type: 'Recarga', price: 42000 }
      ]
    },
    {
      models: ['Brother MFC-L2700', 'Brother MFC-L2740', 'Brother MFCL2700', 'Brother MFCL2740', 'MFC-L2700', 'MFC-L2740'],
      toner: 'Brother TN-2370',
      brand: 'Brother',
      options: [
        { type: 'Compatible', price: 55000 },
        { type: 'Recarga', price: 42000 }
      ]
    },
    {
      models: ['Brother HL-L2350', 'Brother HL-L2390', 'Brother HLL2350', 'Brother HLL2390', 'HL-L2350', 'HL-L2390'],
      toner: 'Brother TN-760',
      brand: 'Brother',
      options: [
        { type: 'Compatible', price: 58000 },
        { type: 'Recarga', price: 45000 }
      ]
    },
    {
      models: ['Canon imageClass MF3010', 'Canon MF3010', 'MF3010'],
      toner: 'Canon 128',
      brand: 'Canon',
      options: [
        { type: 'Compatible', price: 45000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['Canon imageClass D530', 'Canon D530', 'D530'],
      toner: 'Canon 128',
      brand: 'Canon',
      options: [
        { type: 'Compatible', price: 45000 },
        { type: 'Recarga', price: 35000 }
      ]
    },
    {
      models: ['Kyocera ECOSYS M2040', 'Kyocera M2040', 'M2040', 'ECOSYS M2040'],
      toner: 'Kyocera TK-1175',
      brand: 'Kyocera',
      options: [
        { type: 'Compatible', price: 75000 }
      ]
    },
    {
      models: ['Kyocera ECOSYS P2040', 'Kyocera P2040', 'P2040', 'ECOSYS P2040'],
      toner: 'Kyocera TK-1162',
      brand: 'Kyocera',
      options: [
        { type: 'Compatible', price: 72000 }
      ]
    },
    {
      models: ['Kyocera ECOSYS M2640', 'Kyocera M2640', 'M2640', 'ECOSYS M2640'],
      toner: 'Kyocera TK-1172',
      brand: 'Kyocera',
      options: [
        { type: 'Compatible', price: 75000 }
      ]
    },
    {
      models: ['Epson L3210', 'Epson L3250', 'L3210', 'L3250'],
      toner: 'Epson T504 (tinta)',
      brand: 'Epson',
      options: [
        { type: 'Original', price: 32000 },
        { type: 'Compatible', price: 12000 }
      ]
    },
    {
      models: ['Epson L4260', 'Epson L6270', 'L4260', 'L6270'],
      toner: 'Epson T504 (tinta)',
      brand: 'Epson',
      options: [
        { type: 'Original', price: 32000 },
        { type: 'Compatible', price: 12000 }
      ]
    },
    {
      models: ['Epson L1250', 'Epson L1210', 'L1250', 'L1210'],
      toner: 'Epson T544 (tinta)',
      brand: 'Epson',
      options: [
        { type: 'Original', price: 28000 },
        { type: 'Compatible', price: 12000 }
      ]
    },
    {
      models: ['HP DeskJet 2775', 'HP DeskJet 2720', 'HP 2775', 'HP 2720', 'DeskJet 2775', 'DeskJet 2720'],
      toner: 'HP 667 (cartucho tinta)',
      brand: 'HP',
      options: [
        { type: 'Original', price: 38000 },
        { type: 'Recarga', price: 18000 }
      ]
    },
    {
      models: ['HP DeskJet 3515', 'HP DeskJet 3545', 'HP 3515', 'HP 3545', 'DeskJet 3515', 'DeskJet 3545'],
      toner: 'HP 662 (cartucho tinta)',
      brand: 'HP',
      options: [
        { type: 'Original', price: 35000 },
        { type: 'Recarga', price: 18000 }
      ]
    },
    {
      models: ['Canon PIXMA G3110', 'Canon PIXMA G3160', 'Canon G3110', 'Canon G3160', 'G3110', 'G3160', 'PIXMA G3110', 'PIXMA G3160'],
      toner: 'Canon GI-190 (tinta)',
      brand: 'Canon',
      options: [
        { type: 'Original', price: 30000 },
        { type: 'Compatible', price: 12000 }
      ]
    }
  ];

  function formatPrice(price) {
    return '$' + price.toLocaleString('es-CO');
  }

  function getTypeClass(type) {
    if (type === 'Original') return 'type-original';
    if (type === 'Compatible') return 'type-compatible';
    if (type === 'Recarga') return 'type-recarga';
    return '';
  }

  function searchModels(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    const seen = new Set();

    tonerDatabase.forEach(function(entry) {
      entry.models.forEach(function(model) {
        if (model.toLowerCase().includes(q) && !seen.has(entry.toner + entry.models[0])) {
          seen.add(entry.toner + entry.models[0]);
          results.push({
            displayModel: entry.models[0],
            toner: entry.toner,
            brand: entry.brand,
            options: entry.options,
            allModels: entry.models
          });
        }
      });
    });

    return results;
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
  }

  function renderSuggestions(results, query) {
    var suggestionsEl = document.getElementById('searchSuggestions');
    if (!results.length) {
      suggestionsEl.innerHTML = '';
      suggestionsEl.classList.remove('active');
      return;
    }

    var html = '';
    results.forEach(function(r, i) {
      html += '<div class="suggestion-item" data-index="' + i + '">';
      html += '<i class="fas fa-print"></i> ';
      html += '<span>' + highlightMatch(r.displayModel, query) + ' <span style="color:var(--text-muted);font-size:0.82rem;">&rarr; ' + r.toner + '</span></span>';
      html += '</div>';
    });

    suggestionsEl.innerHTML = html;
    suggestionsEl.classList.add('active');
  }

  function renderResult(result) {
    var resultsEl = document.getElementById('searchResults');
    var popularEl = document.getElementById('popularModels');

    var optionsHtml = '';
    result.options.forEach(function(opt) {
      optionsHtml += '<div class="result-option">';
      optionsHtml += '<span class="result-option-type ' + getTypeClass(opt.type) + '">' + opt.type + '</span>';
      optionsHtml += '<span class="result-option-price">' + formatPrice(opt.price) + '</span>';
      optionsHtml += '</div>';
    });

    var waText = encodeURIComponent('Hola, estoy interesado en el toner ' + result.toner + ' para mi impresora ' + result.displayModel + '. Quisiera cotizarlo.');

    var html = '<div class="result-card">';
    html += '<div class="result-header">';
    html += '<h3 class="result-printer-model"><i class="fas fa-print"></i> ' + result.displayModel + '</h3>';
    html += '<span class="result-toner-ref"><i class="fas fa-box"></i> ' + result.toner + '</span>';
    html += '</div>';
    html += '<div class="result-options">' + optionsHtml + '</div>';
    html += '<div class="result-cta">';
    html += '<a href="https://wa.me/573122541254?text=' + waText + '" class="btn-whatsapp-result" target="_blank" rel="noopener">';
    html += '<i class="fab fa-whatsapp"></i> Cotizar por WhatsApp';
    html += '</a>';
    html += '</div>';
    html += '</div>';

    resultsEl.innerHTML = html;
    popularEl.style.display = 'none';
  }

  function renderNoResults(query) {
    var resultsEl = document.getElementById('searchResults');
    var waText = encodeURIComponent('Hola, busco toner para mi impresora ' + query + '. No lo encontre en la pagina. Pueden ayudarme?');

    resultsEl.innerHTML = '<div class="result-card"><div class="no-results">' +
      '<i class="fas fa-search"></i>' +
      '<p>No encontramos resultados para "<strong>' + query + '</strong>"</p>' +
      '<p>Preguntanos directamente por WhatsApp, tenemos mas modelos disponibles.</p>' +
      '<a href="https://wa.me/573122541254?text=' + waText + '" target="_blank" rel="noopener">' +
      '<i class="fab fa-whatsapp"></i> Consultar disponibilidad' +
      '</a></div></div>';
  }

  function initSearch() {
    var input = document.getElementById('printerSearchInput');
    var clearBtn = document.getElementById('clearSearchBtn');
    var suggestionsEl = document.getElementById('searchSuggestions');
    var resultsEl = document.getElementById('searchResults');
    var popularEl = document.getElementById('popularModels');

    if (!input) return;

    var currentResults = [];
    var activeIndex = -1;

    input.addEventListener('input', function() {
      var val = this.value.trim();
      clearBtn.style.display = val.length > 0 ? 'flex' : 'none';

      if (val.length < 2) {
        suggestionsEl.classList.remove('active');
        suggestionsEl.innerHTML = '';
        currentResults = [];
        return;
      }

      currentResults = searchModels(val);
      activeIndex = -1;

      if (currentResults.length > 0) {
        renderSuggestions(currentResults, val);
      } else {
        suggestionsEl.classList.remove('active');
        suggestionsEl.innerHTML = '';
      }
    });

    input.addEventListener('keydown', function(e) {
      var items = suggestionsEl.querySelectorAll('.suggestion-item');
      if (!items.length) {
        if (e.key === 'Enter' && this.value.trim().length >= 2) {
          var res = searchModels(this.value.trim());
          if (res.length > 0) {
            renderResult(res[0]);
            suggestionsEl.classList.remove('active');
          } else {
            renderNoResults(this.value.trim());
            suggestionsEl.classList.remove('active');
          }
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items.forEach(function(item, i) { item.classList.toggle('active', i === activeIndex); });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items.forEach(function(item, i) { item.classList.toggle('active', i === activeIndex); });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && currentResults[activeIndex]) {
          renderResult(currentResults[activeIndex]);
          input.value = currentResults[activeIndex].displayModel;
          suggestionsEl.classList.remove('active');
        } else if (currentResults.length > 0) {
          renderResult(currentResults[0]);
          input.value = currentResults[0].displayModel;
          suggestionsEl.classList.remove('active');
        }
      } else if (e.key === 'Escape') {
        suggestionsEl.classList.remove('active');
      }
    });

    suggestionsEl.addEventListener('click', function(e) {
      var item = e.target.closest('.suggestion-item');
      if (!item) return;
      var idx = parseInt(item.getAttribute('data-index'));
      if (currentResults[idx]) {
        renderResult(currentResults[idx]);
        input.value = currentResults[idx].displayModel;
        suggestionsEl.classList.remove('active');
      }
    });

    clearBtn.addEventListener('click', function() {
      input.value = '';
      clearBtn.style.display = 'none';
      suggestionsEl.classList.remove('active');
      resultsEl.innerHTML = '';
      popularEl.style.display = '';
      input.focus();
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-wrapper')) {
        suggestionsEl.classList.remove('active');
      }
    });

    var popularTags = document.querySelectorAll('.popular-tag');
    popularTags.forEach(function(tag) {
      tag.addEventListener('click', function() {
        var model = this.getAttribute('data-model');
        input.value = model;
        clearBtn.style.display = 'flex';
        var res = searchModels(model);
        if (res.length > 0) {
          renderResult(res[0]);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();


/* ==========================================================================
   FEATURE: PROMOTIONAL BANNER WITH COUNTDOWN
   ========================================================================== */

(function() {
  'use strict';

  var promotions = [
    {
      text: 'Recarga de toner HP 85A por solo <strong>$30.000</strong>',
      waText: 'Hola, quiero aprovechar la promo de recarga HP 85A por $30.000'
    },
    {
      text: '2x1 en recargas Samsung: lleva dos por <strong>$70.000</strong>',
      waText: 'Hola, quiero aprovechar la promo 2x1 en recargas Samsung'
    },
    {
      text: 'Toner compatible Brother TN-1060 por solo <strong>$38.000</strong>',
      waText: 'Hola, quiero aprovechar la promo del toner Brother TN-1060 por $38.000'
    },
    {
      text: 'Tinta Epson T504 compatible: 4 colores por <strong>$40.000</strong>',
      waText: 'Hola, quiero aprovechar la promo de tintas Epson T504 por $40.000'
    }
  ];

  function getNextSunday() {
    var now = new Date();
    var dayOfWeek = now.getDay();
    var daysUntilSunday = (7 - dayOfWeek) % 7;
    if (daysUntilSunday === 0) daysUntilSunday = 7;
    var nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59, 999);
    return nextSunday;
  }

  function updateCountdown() {
    var target = getNextSunday();
    var now = new Date();
    var diff = target - now;

    if (diff <= 0) diff = 0;

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    var daysEl = document.getElementById('countDays');
    var hoursEl = document.getElementById('countHours');
    var minutesEl = document.getElementById('countMinutes');
    var secondsEl = document.getElementById('countSeconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    if (minutesEl) minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  function initPromoBanner() {
    var banner = document.getElementById('promoBanner');
    var closeBtn = document.getElementById('promoCloseBtn');
    var promoTextEl = document.getElementById('promoText');
    var promoCta = banner ? banner.querySelector('.promo-cta') : null;

    if (!banner) return;

    if (sessionStorage.getItem('promoBannerDismissed') === 'true') {
      return;
    }

    var weekNumber = Math.ceil((new Date().getTime() / (1000 * 60 * 60 * 24 * 7)));
    var promoIndex = weekNumber % promotions.length;
    var currentPromo = promotions[promoIndex];

    if (promoTextEl) promoTextEl.innerHTML = currentPromo.text;
    if (promoCta) promoCta.href = 'https://wa.me/573122541254?text=' + encodeURIComponent(currentPromo.waText);

    setTimeout(function() {
      banner.style.display = 'block';
    }, 3000);

    updateCountdown();
    setInterval(updateCountdown, 1000);

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        banner.classList.add('closing');
        setTimeout(function() {
          banner.style.display = 'none';
          banner.classList.remove('closing');
        }, 400);
        sessionStorage.setItem('promoBannerDismissed', 'true');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPromoBanner);
  } else {
    initPromoBanner();
  }
})();


/* ==========================================================================
   FEATURE: SAVINGS CALCULATOR
   ========================================================================== */

(function() {
  'use strict';

  var brandData = {
    hp: {
      name: 'HP',
      originalPrice: 130000,
      compatiblePrice: 48000,
      recargaPrice: 37000,
      yield: 1600
    },
    samsung: {
      name: 'Samsung',
      originalPrice: 150000,
      compatiblePrice: 49000,
      recargaPrice: 42000,
      yield: 1500
    },
    brother: {
      name: 'Brother',
      originalPrice: 125000,
      compatiblePrice: 52000,
      recargaPrice: 40000,
      yield: 1600
    },
    epson: {
      name: 'Epson',
      originalPrice: 30000,
      compatiblePrice: 12000,
      recargaPrice: null,
      yield: 4500
    },
    canon: {
      name: 'Canon',
      originalPrice: 30000,
      compatiblePrice: 12000,
      recargaPrice: 35000,
      yield: 3000
    },
    kyocera: {
      name: 'Kyocera',
      originalPrice: 180000,
      compatiblePrice: 74000,
      recargaPrice: null,
      yield: 3000
    }
  };

  function formatCOP(amount) {
    return '$' + Math.round(amount).toLocaleString('es-CO');
  }

  function animateValue(element, start, end, duration) {
    if (start === end) {
      element.textContent = formatCOP(end);
      return;
    }
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (end - start) * eased);
      element.textContent = formatCOP(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function initCalculator() {
    var brandSelect = document.getElementById('calcBrand');
    var pagesSlider = document.getElementById('calcPages');
    var pagesValue = document.getElementById('calcPagesValue');
    var calcBtn = document.getElementById('calcButton');
    var resultsDiv = document.getElementById('calcResults');

    if (!brandSelect || !pagesSlider || !calcBtn) return;

    pagesSlider.addEventListener('input', function() {
      pagesValue.textContent = parseInt(this.value).toLocaleString('es-CO');
    });

    brandSelect.addEventListener('change', function() {
      calcBtn.disabled = !this.value;
    });

    calcBtn.addEventListener('click', function() {
      var brand = brandSelect.value;
      var pages = parseInt(pagesSlider.value);

      if (!brand || !brandData[brand]) return;

      var data = brandData[brand];
      var tonersPerYear = (pages * 12) / data.yield;

      var costOriginal = tonersPerYear * data.originalPrice;
      var costCompatible = tonersPerYear * data.compatiblePrice;
      var costRecarga = data.recargaPrice ? tonersPerYear * data.recargaPrice : null;

      var savingsCompatible = costOriginal - costCompatible;
      var savingsRecarga = costRecarga !== null ? costOriginal - costRecarga : null;

      resultsDiv.style.display = 'block';

      var origEl = document.getElementById('costOriginal');
      var compEl = document.getElementById('costCompatible');
      var recEl = document.getElementById('costRecarga');

      animateValue(origEl, 0, costOriginal, 800);
      animateValue(compEl, 0, costCompatible, 800);

      if (costRecarga !== null) {
        animateValue(recEl, 0, costRecarga, 800);
      } else {
        recEl.textContent = 'N/A';
      }

      var tonersText = tonersPerYear.toFixed(1) + ' toners/ano';
      document.getElementById('costOriginalDetail').textContent = tonersText + ' x ' + formatCOP(data.originalPrice);
      document.getElementById('costCompatibleDetail').textContent = tonersText + ' x ' + formatCOP(data.compatiblePrice);
      document.getElementById('costRecargaDetail').textContent = costRecarga !== null
        ? tonersText + ' x ' + formatCOP(data.recargaPrice)
        : 'No disponible para ' + data.name;

      var savCompEl = document.getElementById('savingsCompatible');
      var savRecEl = document.getElementById('savingsRecarga');

      animateValue(savCompEl, 0, savingsCompatible, 1000);

      if (savingsRecarga !== null) {
        animateValue(savRecEl, 0, savingsRecarga, 1000);
      } else {
        savRecEl.textContent = 'N/A';
      }

      var waBtn = document.getElementById('calcWhatsAppBtn');
      var bestSaving = savingsRecarga !== null ? formatCOP(savingsRecarga) : formatCOP(savingsCompatible);
      var waText = encodeURIComponent(
        'Hola! Segun la calculadora de su pagina, puedo ahorrar hasta ' + bestSaving +
        ' al ano con mi impresora ' + data.name + '. Quiero mas informacion sobre toners compatibles/recargas.'
      );
      waBtn.href = 'https://wa.me/573122541254?text=' + waText;

      setTimeout(function() {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
})();


/* ==========================================================================
   FEATURE: HERO SLIDER
   ========================================================================== */

(function() {
  'use strict';

  function initHeroSlider() {
    var slides = document.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.slider-dot');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');

    if (!slides.length) return;

    var currentSlide = 0;
    var totalSlides = slides.length;
    var autoplayInterval;
    var isTransitioning = false;

    function goToSlide(index) {
      if (isTransitioning || index === currentSlide) return;
      isTransitioning = true;

      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');

      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;

      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');

      setTimeout(function() { isTransitioning = false; }, 800);
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); resetAutoplay(); });

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { goToSlide(i); resetAutoplay(); });
    });

    // Touch/swipe support
    var startX = 0;
    var slider = document.getElementById('heroSlider');
    if (slider) {
      slider.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
      slider.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide(); else prevSlide();
          resetAutoplay();
        }
      }, { passive: true });
    }

    // Pause autoplay on hover for better UX
    var heroEl = document.getElementById('heroSlider');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', function() { clearInterval(autoplayInterval); });
      heroEl.addEventListener('mouseleave', function() { startAutoplay(); });
    }

    startAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  } else {
    initHeroSlider();
  }
})();


/* ==========================================================================
   FEATURE: SHOPPING CART WITH NEQUI QR
   ========================================================================== */

(function() {
  'use strict';

  var cart = [];
  var PHONE = '573122541254';

  // Real scannable QR code for Nequi payment
  function generateNequiQR() {
    var container = document.getElementById('nequiQr');
    if (!container) return;

    // Remove old canvas if exists
    var oldCanvas = document.getElementById('nequiQrCanvas');
    if (oldCanvas) oldCanvas.remove();

    // Generate real QR code using qrcodejs library
    if (typeof QRCode !== 'undefined') {
      new QRCode(container, {
        text: 'nequi://pay?phone=3122541254',
        width: 160,
        height: 160,
        colorDark: '#1e293b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }

  function formatPrice(price) {
    return '$' + price.toLocaleString('es-CO');
  }

  function updateCartUI() {
    var countEl = document.getElementById('cartCount');
    var itemsEl = document.getElementById('cartItems');
    var emptyEl = document.getElementById('cartEmpty');
    var footerEl = document.getElementById('cartFooter');
    var totalEl = document.getElementById('cartTotal');

    var totalItems = 0;
    var totalPrice = 0;

    cart.forEach(function(item) {
      totalItems += item.qty;
      totalPrice += item.price * item.qty;
    });

    // Update count badge
    if (countEl) {
      countEl.textContent = totalItems;
      countEl.classList.toggle('has-items', totalItems > 0);
    }

    if (!itemsEl) return;

    if (cart.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
      if (footerEl) footerEl.style.display = 'none';
      // Remove all cart items except empty state
      var existingItems = itemsEl.querySelectorAll('.cart-item');
      existingItems.forEach(function(el) { el.remove(); });
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = '';
    if (totalEl) totalEl.textContent = formatPrice(totalPrice);

    // Rebuild items
    var existingItems = itemsEl.querySelectorAll('.cart-item');
    existingItems.forEach(function(el) { el.remove(); });

    cart.forEach(function(item, index) {
      var el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML =
        '<div class="cart-item-icon"><i class="fas fa-box"></i></div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-price">' + (item.price > 0 ? formatPrice(item.price) : 'Consultar') + '</div>' +
        '</div>' +
        '<div class="cart-item-qty">' +
          '<button class="cart-qty-minus" data-index="' + index + '">-</button>' +
          '<span>' + item.qty + '</span>' +
          '<button class="cart-qty-plus" data-index="' + index + '">+</button>' +
        '</div>' +
        '<button class="cart-item-remove" data-index="' + index + '"><i class="fas fa-trash-alt"></i></button>';

      itemsEl.appendChild(el);
    });

    // Bind qty/remove buttons
    itemsEl.querySelectorAll('.cart-qty-minus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.dataset.index);
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
        updateCartUI();
      });
    });

    itemsEl.querySelectorAll('.cart-qty-plus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.dataset.index);
        cart[idx].qty++;
        saveCart();
        updateCartUI();
      });
    });

    itemsEl.querySelectorAll('.cart-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.dataset.index);
        cart.splice(idx, 1);
        saveCart();
        updateCartUI();
      });
    });
  }

  function saveCart() {
    try {
      localStorage.setItem('tys_cart', JSON.stringify(cart));
    } catch (e) {}
  }

  function loadCart() {
    try {
      var saved = localStorage.getItem('tys_cart');
      if (saved) cart = JSON.parse(saved);
    } catch (e) {}
  }

  function showNotification() {
    var notif = document.getElementById('cartNotification');
    if (!notif) return;
    notif.classList.add('show');
    setTimeout(function() { notif.classList.remove('show'); }, 2500);
  }

  function addToCart(name, price) {
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) { existing = cart[i]; break; }
    }

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name: name, price: price, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification();
  }

  function initCart() {
    loadCart();

    var cartToggle = document.getElementById('cartToggle');
    var cartSidebar = document.getElementById('cartSidebar');
    var cartOverlay = document.getElementById('cartOverlay');
    var cartClose = document.getElementById('cartClose');
    var cartCheckout = document.getElementById('cartCheckout');

    function openCart() {
      if (cartSidebar) cartSidebar.classList.add('active');
      if (cartOverlay) cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCart() {
      if (cartSidebar) cartSidebar.classList.remove('active');
      if (cartOverlay) cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var card = this.closest('.product-card');
        if (!card) return;

        var name = card.querySelector('.product-name').textContent;
        var priceAttr = card.getAttribute('data-product-price');
        var price = priceAttr ? parseInt(priceAttr) : 0;

        addToCart(name, price);

        // Visual feedback
        this.classList.add('added');
        var self = this;
        setTimeout(function() { self.classList.remove('added'); }, 600);
      });
    });

    // WhatsApp checkout
    if (cartCheckout) {
      cartCheckout.addEventListener('click', function() {
        if (cart.length === 0) return;

        var totalPrice = 0;
        var lines = ['Hola! Quiero hacer el siguiente pedido:\n'];

        cart.forEach(function(item, i) {
          var line = (i + 1) + '. ' + item.name + ' (x' + item.qty + ')';
          if (item.price > 0) {
            line += ' - ' + formatPrice(item.price) + ' c/u';
            totalPrice += item.price * item.qty;
          } else {
            line += ' - Consultar precio';
          }
          lines.push(line);
        });

        if (totalPrice > 0) {
          lines.push('\nTotal estimado: ' + formatPrice(totalPrice));
        }

        lines.push('\nPor favor confirmen disponibilidad y precio final. Gracias!');

        var text = encodeURIComponent(lines.join('\n'));
        window.open('https://wa.me/' + PHONE + '?text=' + text, '_blank');
      });
    }

    // Generate QR code
    generateNequiQR();

    // Update UI with loaded cart
    updateCartUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {
    initCart();
  }
})();
