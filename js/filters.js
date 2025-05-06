class ProductFilter {
    constructor() {
        this.products = document.querySelectorAll('.product-card-alt');
        this.setupFilters();
    }

    setupFilters() {
        const categories = ['All', 'Fresh Juice', 'Ice Cream', 'Smoothie'];
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-button';
            button.textContent = category;
            button.addEventListener('click', () => this.filterProducts(category));
            filterContainer.appendChild(button);
        });

        const productsSection = document.querySelector('.featured-products-alt .container');
        productsSection.insertBefore(filterContainer, productsSection.firstChild);
    }

    filterProducts(category) {
        this.products.forEach(product => {
            const productCategory = product.querySelector('.product-category').textContent;
            if (category === 'All' || category === productCategory) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
}