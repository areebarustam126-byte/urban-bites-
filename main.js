/* ============================================================
   main.js — Shared UI Logic for URBAN BITES
   (Nav scroll, mobile menu, scroll-reveal, toast, theme toggle)
============================================================ */

/* ---- Theme: Apply saved preference immediately to avoid flash ---- */
(function () {
    const saved = localStorage.getItem('ubTheme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();


document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Sticky Nav & Soft Parallax ---- */
    const nav = document.querySelector('.nav');
    const heroBg = document.querySelector('.hero-bg');
    const promoBg = document.querySelector('.promo-bg');
    const storyHeroImg = document.querySelector('.story-hero-img');
    const pageHeroBg = document.querySelector('.page-hero-bg');

    let ticking = false;
    const onScroll = () => {
        const scrollY = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', scrollY > 40);

        if (!prefersReducedMotion) {
            if (heroBg && scrollY < window.innerHeight * 1.5) {
                heroBg.style.setProperty('--hero-parallax', `${(scrollY * 0.22).toFixed(1)}px`);
            }
            if (promoBg) {
                const rect = promoBg.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (window.innerHeight - rect.top) * 0.08;
                    const promoImg = promoBg.querySelector('.promo-img');
                    if (promoImg) promoImg.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.04)`;
                }
            }
            if (storyHeroImg && scrollY < window.innerHeight * 1.5) {
                storyHeroImg.style.transform = `translate3d(0, ${(scrollY * 0.18).toFixed(1)}px, 0)`;
            }
            if (pageHeroBg && scrollY < window.innerHeight * 1.5) {
                pageHeroBg.style.transform = `translate3d(0, ${(scrollY * 0.18).toFixed(1)}px, 0)`;
            }
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---- Mobile Menu ---- */
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.nav-mobile');

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            const isOpen = toggle.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---- Scroll-Reveal (IntersectionObserver) ---- */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => observer.observe(el));
    }

    /* ---- Active Nav Link ---- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    /* ---- Smooth Anchor Scrolling & Button Actions ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                e.preventDefault();
                const ariaLabel = this.getAttribute('aria-label') || 'Urban Bites';
                showToast(`Connecting with ${ariaLabel}…`, '🔥');
                return;
            }
            if (targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    /* ---- Hero Background Image Slider (2s Auto-Rotation) ---- */
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.hero-slide');
        if (slides.length > 1) {
            // JS Preload: cache all slide images so there's zero flicker on first show
            slides.forEach(slide => {
                const imgEl = slide.querySelector('.hero-slide-img');
                if (imgEl && imgEl.src) {
                    const preImg = new Image();
                    preImg.src = imgEl.src;
                }
            });

            let currentSlide = 0;
            const SLIDE_INTERVAL = 2000; // 2 seconds

            const nextHeroSlide = () => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            };

            let sliderTimer = setInterval(nextHeroSlide, SLIDE_INTERVAL);

            // Pause when tab is inactive to save resources
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    clearInterval(sliderTimer);
                } else {
                    sliderTimer = setInterval(nextHeroSlide, SLIDE_INTERVAL);
                }
            });
        }
    }

    /* ---- Cart Badge Init ---- */
    if (typeof updateCartBadges === 'function') updateCartBadges();

    /* ---- Dark / Light Theme Toggle ---- */
    const THEME_KEY = 'ubTheme';
    const DARK = 'dark';
    const LIGHT = 'light';

    function applyTheme(theme) {
        if (theme === LIGHT) {
            document.documentElement.setAttribute('data-theme', LIGHT);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        // Update aria-label on all toggle buttons
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.setAttribute('aria-label',
                theme === LIGHT ? 'Switch to Dark Mode' : 'Switch to Light Mode');
        });
    }

    // Apply on load (also done inline before DOMContentLoaded to avoid FOUC)
    applyTheme(localStorage.getItem(THEME_KEY) || DARK);

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const current = localStorage.getItem(THEME_KEY) || DARK;
            const next = current === DARK ? LIGHT : DARK;
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
        });
    });

});

/* ============================================================
   Toast Helper
============================================================ */
function showToast(msg, icon = '🍔') {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">${icon}</span> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================================
   Global Image Error Fallback Handler
============================================================ */
document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
        const alt = (e.target.alt || '').toLowerCase();
        let fallback = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80';
        if (alt.includes('pizza')) fallback = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80';
        else if (alt.includes('pasta')) fallback = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80';
        else if (alt.includes('chicken')) fallback = 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80';
        else if (alt.includes('fries')) fallback = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80';
        else if (alt.includes('wrap')) fallback = 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80';
        else if (alt.includes('drink') || alt.includes('shake') || alt.includes('lemonade')) fallback = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80';
        else if (alt.includes('ahmed') || alt.includes('sana') || alt.includes('bilal') || e.target.closest('.testi-author')) {
            fallback = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80';
        }
        if (e.target.dataset.failedOnce) return;
        e.target.dataset.failedOnce = 'true';
        e.target.src = fallback;
    }
}, true);
