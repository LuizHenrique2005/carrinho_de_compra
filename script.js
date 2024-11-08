document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const sideCart = document.getElementById('side-cart');
    const closeCartButton = document.getElementById('close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');

    // Função para abrir o carrinho
    const openCart = () => {
        sideCart.classList.add('open');
    };

    // Função para fechar o carrinho
    const closeCart = () => {
        sideCart.classList.remove('open');
    };

    // Função para salvar o carrinho no localStorage
    const saveCart = () => {
        const cartItems = [];
        const cartItemsElements = cartItemsContainer.querySelectorAll('.cart-item');
        cartItemsElements.forEach(item => {
            const product = item.querySelector('.product-name').textContent;
            const quantity = item.querySelector('.quantity').textContent.replace('(', '').replace('x)', ''); // Extrai a quantidade
            cartItems.push({ product, quantity });
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Salva no localStorage
    };

    // Função para carregar o carrinho do localStorage
    const loadCart = () => {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItemsContainer.innerHTML = ''; // Limpa o carrinho antes de carregar
        savedCartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            const productName = document.createElement('span');
            productName.classList.add('product-name');
            productName.textContent = item.product;
            const quantitySpan = document.createElement('span');
            quantitySpan.classList.add('quantity');
            quantitySpan.textContent = `(${item.quantity}x)`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Excluir';
            removeButton.classList.add('remove-item');
            removeButton.addEventListener('click', () => {
                removeItem(cartItem, item.product);
            });
            cartItem.appendChild(productName);
            cartItem.appendChild(quantitySpan);
            cartItem.appendChild(removeButton);
            cartItemsContainer.appendChild(cartItem);
        });
    };

    // Função para remover item do carrinho
    const removeItem = (cartItem, product) => {
        cartItem.remove(); // Remove o item da tela
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = savedCartItems.filter(item => item.product !== product); // Remove o item do array
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Atualiza o localStorage
    };

    // Abre o carrinho ao clicar no botão
    cartButton.addEventListener('click', openCart);

    // Fecha o carrinho ao clicar no botão de fechar
    closeCartButton.addEventListener('click', closeCart);

    // Adiciona produtos ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingProduct = savedCartItems.find(item => item.product === product); // Verifica se o produto já está no carrinho

            if (existingProduct) {
                // Se o produto já existe, aumenta a quantidade
                existingProduct.quantity = parseInt(existingProduct.quantity) + 1;
            } else {
                // Se o produto não existe, adiciona um novo
                savedCartItems.push({ product, quantity: 1 });
            }

            // Salva no localStorage
            localStorage.setItem('cartItems', JSON.stringify(savedCartItems));
            loadCart(); // Atualiza a exibição
        });
    });

    // Fecha o carrinho ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!sideCart.contains(event.target) && !cartButton.contains(event.target)) {
            closeCart();
        }
    });

    // Carrega os itens do carrinho ao carregar a página
    loadCart();
});