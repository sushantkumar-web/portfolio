(function() {
            // ── DOM Elements ──────────────────
            const navbar = document.getElementById('navbar');
            const hamburger = document.getElementById('hamburger');
            const mobileOverlay = document.getElementById('mobileOverlay');
            const mobileLinks = document.querySelectorAll('.mobile-link');
            const themeToggleDesktop = document.getElementById('themeToggleDesktop');
            const themeToggleMobile = document.getElementById('themeToggleMobile');
            const body = document.body;
            const currentYearSpan = document.getElementById('currentYear');
            const fadeElements = document.querySelectorAll('.fade-in');

            // ── Set current year ─────────────
            if (currentYearSpan) {
                currentYearSpan.textContent = new Date().getFullYear();
            }

            // ── Navbar scroll effect ──────────
            function handleScroll() {
                if (window.scrollY > 20) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // initial check

            // ── Mobile menu ───────────────────
            function openMobileMenu() {
                hamburger.classList.add('active');
                mobileOverlay.classList.add('active');
                body.style.overflow = 'hidden';
            }

            function closeMobileMenu() {
                hamburger.classList.remove('active');
                mobileOverlay.classList.remove('active');
                body.style.overflow = '';
            }

            hamburger.addEventListener('click', function() {
                if (hamburger.classList.contains('active')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });

            mobileLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    closeMobileMenu();
                });
            });

            // Close mobile menu on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && hamburger.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            // ── Theme management ──────────────
            const THEME_KEY = 'sushant-portfolio-theme';

            function getSavedTheme() {
                try {
                    return localStorage.getItem(THEME_KEY);
                } catch (e) {
                    return null;
                }
            }

            function saveTheme(theme) {
                try {
                    localStorage.setItem(THEME_KEY, theme);
                } catch (e) {
                    // localStorage not available
                }
            }

            function applyTheme(theme) {
                const isDark = theme === 'dark';
                if (isDark) {
                    body.classList.add('dark-mode');
                } else {
                    body.classList.remove('dark-mode');
                }
                updateThemeIcons(isDark);
            }

            function updateThemeIcons(isDark) {
                const iconClass = isDark ? 'fa-sun' : 'fa-moon';
                const allToggles = [themeToggleDesktop, themeToggleMobile];
                allToggles.forEach(function(toggle) {
                    if (toggle) {
                        const icon = toggle.querySelector('i');
                        if (icon) {
                            icon.className = 'fa-solid ' + iconClass;
                        }
                    }
                });
            }

            function toggleTheme() {
                const isDark = body.classList.contains('dark-mode');
                const newTheme = isDark ? 'light' : 'dark';
                applyTheme(newTheme);
                saveTheme(newTheme);
            }

            // Initialize theme
            const savedTheme = getSavedTheme();
            if (savedTheme === 'dark') {
                applyTheme('dark');
            } else if (savedTheme === 'light') {
                applyTheme('light');
            } else {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark ? 'dark' : 'light');
            }

            // Theme toggle listeners
            if (themeToggleDesktop) {
                themeToggleDesktop.addEventListener('click', toggleTheme);
            }
            if (themeToggleMobile) {
                themeToggleMobile.addEventListener('click', toggleTheme);
            }

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                const saved = getSavedTheme();
                if (!saved) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });

            // ── Scroll-triggered fade-in ──────
            function checkFadeElements() {
                const windowHeight = window.innerHeight;
                const triggerOffset = windowHeight * 0.88;

                fadeElements.forEach(function(el) {
                    const rect = el.getBoundingClientRect();
                    const elementTop = rect.top;

                    if (elementTop < triggerOffset) {
                        el.classList.add('visible');
                    }
                });
            }

            // Use IntersectionObserver if available for better performance
            if ('IntersectionObserver' in window) {
                const observerOptions = {
                    root: null,
                    rootMargin: '0px 0px -40px 0px',
                    threshold: 0.1
                };

                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                fadeElements.forEach(function(el) {
                    observer.observe(el);
                });
            } else {
                // Fallback
                window.addEventListener('scroll', checkFadeElements, { passive: true });
                checkFadeElements(); // initial check
            }

            // ── Smooth scroll for anchor links ─
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#') return;
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const navHeight = navbar.offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset -
                            navHeight - 10;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            console.log('%c Sushant Kumar Portfolio %c thesushant.in ',
                'background:#1a3355;color:#fff;padding:6px 12px;border-radius:4px 0 0 4px;font-weight:700;',
                'background:#fafaf8;color:#1a3355;padding:6px 12px;border-radius:0 4px 4px 0;font-weight:600;');
            console.log('%c Built with HTML, CSS, and vanilla JavaScript. No frameworks needed. ',
                'color:#7d7c78;font-style:italic;');
        })();
