class AnimationManager {
    constructor() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.product-card-alt, .category-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupHoverEffects() {
        document.querySelectorAll('.product-card-alt').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.querySelector('.quick-actions').style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', () => {
                card.querySelector('.quick-actions').style.opacity = '0';
            });
        });
    }
}