// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileClose = document.querySelector('.mobile-close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu__list a');

function toggleMenu() {
    mobileMenu.classList.toggle('active');
}

if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMenu);
}

if (mobileClose) {
    mobileClose.addEventListener('click', toggleMenu);
}

// Close menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});


// Header Scroll Effect
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


// Intersection Observer for Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.fade-in-up, .fade-in');
elementsToAnimate.forEach(el => observer.observe(el));


// Smooth scrolling for anchor links (polyfill support included in logic)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {

        // Special interaction for Service Buttons with Card Flip
        if (this.classList.contains('trigger-flip')) {
            e.preventDefault();
            const btn = this;

            // Find parent card
            const card = btn.closest('.service-card');

            // 1. Flip the card
            if (card) {
                card.classList.add('flipped');
            }

            // 2. Navigate after delay
            const targetId = this.getAttribute('href');
            setTimeout(() => {
                executeScroll(targetId);
                // Reset after navigation
                setTimeout(() => {
                    if (card) card.classList.remove('flipped');
                }, 2000);
            }, 2200); // Wait for user to read the message briefly

            return; // Stop standard flow
        }

        e.preventDefault();
        const targetId = this.getAttribute('href');
        executeScroll(targetId);
    });
});

function executeScroll(targetId) {
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// PDF Generation
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function () {
        const element = document.getElementById('pdf-content');
        
        // Add a temporary class to format elements specifically for the PDF
        document.body.classList.add('pdf-export-mode');
        
        // Disable flip animation temporarily
        const cards = element.querySelectorAll('.service-card');
        cards.forEach(card => card.style.transition = 'none');

        // Fix blank page issue and layout scaling
        const _originalScrollY = window.scrollY;
        window.scrollTo(0, 0);

        // Configure options to trick html2canvas into rendering a desktop-width view
        // This ensures grids look good and aren't squished
        const opt = {
            margin:       [15, 0, 15, 0], // top, left, bottom, right
            filename:     'Portafolio_Plano_Studio.pdf',
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                scrollY: 0, 
                windowWidth: 1200, // Force desktop width for capture
                windowHeight: document.documentElement.offsetHeight,
                letterRendering: true
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['css', 'legacy'] }
        };

        // Change button state to indicate loading
        const originalText = this.innerHTML;
        this.innerHTML = '<i data-lucide="loader" class="spin"></i> Generando PDF Premium...';
        this.disabled = true;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add a small delay so CSS can fully apply before capture
        setTimeout(() => {
            html2pdf().set(opt).from(element).save().then(() => {
                // Revert scroll and button state
                window.scrollTo(0, _originalScrollY);
                this.innerHTML = originalText;
                this.disabled = false;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                // Remove temporary formatting
                document.body.classList.remove('pdf-export-mode');
                cards.forEach(card => card.style.transition = '');
            }).catch(err => {
                console.error("Error generating PDF:", err);
                window.scrollTo(0, _originalScrollY);
                this.innerHTML = originalText;
                this.disabled = false;
                document.body.classList.remove('pdf-export-mode');
                cards.forEach(card => card.style.transition = '');
            });
        }, 500); // 500ms delay to let browser re-render with the new class
    });
}
