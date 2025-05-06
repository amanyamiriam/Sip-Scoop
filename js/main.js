const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            cart: {
                items: JSON.parse(localStorage.getItem('cart')) || [],
                total: 0
            },
            filters: {
                categories: ['All', 'Fresh Juice', 'Ice Cream', 'Smoothie'],
                selected: 'All'
            },
            newsletter: {
                email: '',
                message: ''
            }
        }
    },
    methods: {
        addToCart(product) {
            const existingItem = this.cart.items.find(item => 
                item.name === product.name && 
                item.category === product.category
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.items.push({
                    ...product,
                    quantity: 1,
                    price: parseFloat(product.price.replace('$', ''))
                });
            }

            this.saveCart();
            this.showNotification(`${product.name} added to cart!`);
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart.items));
            this.updateCartTotal();
        },

        updateCartTotal() {
            this.cart.total = this.cart.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
        },

        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 3000);
        },

        filterProducts(category) {
            this.filters.selected = category;
        },

        submitNewsletter() {
            if (this.validateEmail(this.newsletter.email)) {
                this.showNotification('Thank you for subscribing!');
                this.newsletter.email = '';
                this.newsletter.message = '';
            } else {
                this.newsletter.message = 'Please enter a valid email address';
            }
        },

        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    },
    computed: {
        cartCount() {
            return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        },
        filteredProducts() {
            const products = document.querySelectorAll('.product-card-alt');
            products.forEach(product => {
                const category = product.querySelector('.product-category').textContent;
                product.style.display = 
                    this.filters.selected === 'All' || 
                    category === this.filters.selected ? 'block' : 'none';
            });
        }
    },
    mounted() {
        this.updateCartTotal();
        
        // Setup animations
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
});

app.mount('#app');