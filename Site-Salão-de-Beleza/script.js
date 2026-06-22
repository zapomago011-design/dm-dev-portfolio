// script.js - JavaScript para interatividade do site do salão

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    });

    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Toggle active state
            this.classList.toggle('active');
            
            // Rotate icon
            if (icon) {
                icon.textContent = this.classList.contains('active') ? '−' : '+';
            }
            
            // Slide toggle answer
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Hero typing effect (optional)
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 500);
    }

    // Animate stats on scroll
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = stat.textContent;
            let count = 0;
            const increment = target.includes('+') ? 100 : parseInt(target);
            const duration = 2000;
            const step = increment / (duration / 16);

            function updateCount() {
                count += step;
                if (count < increment) {
                    stat.textContent = Math.floor(count) + (target.includes('+') ? '+' : '') + (target.includes('★') ? '★' : '');
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            }
            updateCount();
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger stats animation when hero-stats comes into view
                if (entry.target.classList.contains('hero-stats')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.hero-stats, .sobre-features .feature, .servicos-grid, .beneficios-grid, .depoimentos-grid').forEach(el => {
        observer.observe(el);
    });

    // WhatsApp button floating effect
    const whatsappBtn = document.querySelector('.btn-whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        whatsappBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            let backToTop = document.querySelector('.back-to-top');
            if (!backToTop) {
                backToTop = document.createElement('button');
                backToTop.innerHTML = '↑';
                backToTop.className = 'back-to-top';
                document.body.appendChild(backToTop);
            }
            backToTop.style.opacity = '1';
        } else {
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) {
                backToTop.style.opacity = '0';
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('back-to-top')) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    // Preload hero images for better performance
    const heroImages = [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80',
        'https://images.unsplash.com/photo-1522332140-8baeececf3df?w=600&q=80'
    ];
    heroImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

