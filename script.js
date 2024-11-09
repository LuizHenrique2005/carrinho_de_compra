document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const sideCart = document.getElementById('side-cart');
    const closeCartButton = document.getElementById('close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // Função para abrir e fechar o carrinho
    const toggleCart = (open) => {
        sideCart.classList.toggle('open', open);
    };


    // Função para salvar o carrinho no localStorage
    const saveCart = () => {
        const cartItems = [...cartItemsContainer.querySelectorAll('.cart-item')].map(item => {
            const product = item.querySelector('.product-name').textContent;
            const quantity = item.querySelector('.quantity').textContent.replace('(', '').replace('x)', '');
            return { product, quantity };
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        checkCartEmpty();
    };

    // Função para carregar o carrinho do localStorage
    const loadCart = () => {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItemsContainer.innerHTML = savedCartItems.map(item => `
            <div class="cart-item">
                <span class="product-name">${item.product}</span>
                <span class="quantity">(${item.quantity}x)</span>
                <button class="remove-item">Excluir</button>
            </div>
        `).join('');
        cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const cartItem = event.target.closest('.cart-item');
                removeItem(cartItem);
            });
        });
        checkCartEmpty();
    };

    // Função para remover item do carrinho
    const removeItem = (cartItem) => {
        cartItem.remove();
        saveCart();
    };

    // Adiciona produtos ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const existingItem = [...cartItemsContainer.querySelectorAll('.cart-item')]
                .find(item => item.querySelector('.product-name').textContent === product);
            if (existingItem) {
                const quantitySpan = existingItem.querySelector('.quantity');
                const quantity = parseInt(quantitySpan.textContent.replace('(', '').replace('x)', '')) + 1;
                quantitySpan.textContent = `(${quantity}x)`;
            } else {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <span class="product-name">${product}</span>
                    <span class="quantity">(1x)</span>
                    <button class="remove-item">Excluir</button>
                `;
                cartItem.querySelector('.remove-item').addEventListener('click', () => removeItem(cartItem));
                cartItemsContainer.appendChild(cartItem);
            }
            saveCart();
        });
    });

    // Abre o carrinho ao clicar no botão
    cartButton.addEventListener('click', () => toggleCart(true));

    // Fecha o carrinho ao clicar no botão de fechar
    closeCartButton.addEventListener('click', () => toggleCart(false));

    // Fecha o carrinho ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!sideCart.contains(event.target) && !cartButton.contains(event.target)) {
            toggleCart(false);
        }
    });

    // Evita fechamento ao clicar no próprio carrinho
    sideCart.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Carrega os itens do carrinho ao carregar a página
    loadCart();
});
