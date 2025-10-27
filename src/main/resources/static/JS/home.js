let isLoggedIn = false;
let currentCartCount = 0;

function smoothScrollTo(targetId, duration = 1000) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const targetPosition = target.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('scroll-active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('scroll-active');
        }
    });
}

function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateProgress);
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.book-card, .category-card, .section-title, .review-card, .advantage-card, .contact-method');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    toggleUserMenu();
    animateOnScroll();
    createScrollProgress();
    getPopularBooks();

    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            smoothScrollTo(targetId, 50);

            setTimeout(() => {
                updateActiveNavLink();
            }, 100);
        });
    });

    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId, 1000);
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Отправлено!';
            submitBtn.style.background = '#10b981';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                this.reset();
            }, 2000);
        });
    }

    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            window.location.href = 'profile.html#cart';
        });
    }
});

window.addEventListener('scroll', function() {
    animateOnScroll();
    updateActiveNavLink();
});

document.getElementById('mobileMenuToggle').addEventListener('click', function() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-active');

    const icon = this.querySelector('i');
    if (nav.classList.contains('mobile-active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

const mobileNavLinks = document.querySelectorAll('.nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        const nav = document.querySelector('.nav');
        const toggle = document.getElementById('mobileMenuToggle');
        const icon = toggle.querySelector('i');

        nav.classList.remove('mobile-active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

function addHoverEffects() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        setTimeout(typeWriter, 350);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    addHoverEffects();
    addTypingEffect();
});

async function getNewBooks(){
    try{
        const response = await fetch("/books/threeNewBooks",{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const books = await response.json();

        displayNewBooks(books);

    }catch(err){
        console.error("Ошибка при загрузке новых книг:", err);
        showBooksError();
    }
}

function displayNewBooks(books) {
    const booksGrid = document.querySelector('.new-books .books-grid');
    if (!booksGrid) {
        console.error('Контейнер для книг не найден');
        return;
    }

    booksGrid.innerHTML = '';

    books.forEach((book, index) => {
        const bookCard = createBookCard(book, index);
        booksGrid.appendChild(bookCard);
    });
}

function createBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.bookId = book.id;

    const gradients = ['book-gradient-5', 'book-gradient-6', 'book-gradient-7', 'book-gradient-8'];
    const gradientClass = gradients[index % gradients.length];

    const price = book.price % 1 === 0 ? Math.floor(book.price) : book.price.toFixed(2);

    card.innerHTML = `
        <div class="book-image">
            ${book.coverImageUrl ?
        `<img src="${book.coverImageUrl}" alt="${book.title}" class="book-cover-image" onerror="this.style.display='none'">` :
        ''
    }
            <div class="book-gradient ${gradientClass} ${book.coverImageUrl ? 'hidden' : ''}">
                <div class="book-spine"></div>
                <div class="book-pages"></div>
                <div class="book-title-overlay">${book.title}</div>
            </div>
            <div class="book-badge">Новинка</div>
            <div class="book-overlay">
                <button class="btn btn-primary btn-small add-to-cart-btn" data-book-id="${book.id}">В корзину</button>
            </div>
        </div>
        <div class="book-info">
            <h3 class="book-title" title="${book.title}">${book.title}</h3>
            <p class="book-author">${book.authorName || 'Автор неизвестен'}</p>
            <div class="book-rating">
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                </div>
                <span class="rating-text">4.5 (10)</span>
            </div>
            <div class="book-price">${price} руб.</div>
        </div>
    `;

    return card;
}

function showBooksError() {
    const booksGrid = document.querySelector('.new-books .books-grid');
    if (booksGrid) {
        booksGrid.innerHTML = `
            <div class="books-error" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                <p>Не удалось загрузить новые книги</p>
                <button class="btn btn-secondary" onclick="getNewBooks()">Попробовать снова</button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    getNewBooks();
});

async function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        localStorage.clear();
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Ошибка при выходе:', error);
        localStorage.clear();
        window.location.href = '/';
    });
}

async function addToCart(bookId) {
    try {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Добавляем...';
        button.disabled = true;

        const addToCartDTO = {
            bookId: bookId,
            quantity: 1
        };

        const response = await fetch("/api/cart/addItem", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addToCartDTO),
            credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Необходимо авторизоваться');
            }
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const cartData = await response.json();

        updateCartCountFromResponse(cartData);

        showSuccessMessage('Книга добавлена в корзину!');

        button.textContent = 'Добавлено!';
        button.style.background = '#10b981';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Ошибка при добавлении в корзину:', error);

        handleAddToCartError(error, bookId);

        button.textContent = 'В корзину';
        button.disabled = false;

        await getCartCount();
    }
}

function updateCartCount(newCount) {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.style.transform = 'scale(1.3)';
        cartCount.textContent = newCount;
        currentCartCount = newCount;

        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);

        cartCount.classList.add('updated');
        setTimeout(() => {
            cartCount.classList.remove('updated');
        }, 600);
    }
}

function handleAddToCartError(error, bookId) {
    let errorMessage = 'Не удалось добавить книгу в корзину';

    if (error.message.includes('Необходимо авторизоваться')) {
        errorMessage = 'Для добавления в корзину необходимо войти в систему';
        showLoginPrompt(errorMessage, bookId);
    } else if (error.message.includes('404')) {
        errorMessage = 'Книга не найдена';
        showErrorMessage(errorMessage);
    } else {
        showErrorMessage(errorMessage);
    }
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function showLoginPrompt(message, bookId) {
    const loginPrompt = document.createElement('div');
    loginPrompt.className = 'login-prompt';
    loginPrompt.innerHTML = `
        <div class="login-prompt-content">
            <p>${message}</p>
            <div class="login-prompt-buttons">
                <button class="btn btn-outline" onclick="this.closest('.login-prompt').remove()">Отмена</button>
                <button class="btn btn-primary" onclick="redirectToLogin(${bookId})">Войти</button>
            </div>
        </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.appendChild(loginPrompt);

    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    loginPrompt.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function redirectToLogin(bookId) {
    if (bookId) {
        sessionStorage.setItem('pendingCartItem', bookId);
    }
    window.location.href = 'Authentication/login.html';
}

async function getCartCount() {
    try {
        console.log('Запрашиваем корзину...');
        const response = await fetch("/api/cart/getUserCart", {
            method: "GET",
            credentials: "include"
        });

        console.log('Статус ответа:', response.status);

        if (response.ok) {
            const cartData = await response.json();
            console.log('Данные корзины:', cartData);
            updateCartCountFromResponse(cartData);
        } else {
            console.log('Ошибка получения корзины, статус:', response.status);
            updateCartCount(0);
        }
    } catch (error) {
        console.error('Ошибка при получении корзины:', error);
        updateCartCount(0);
    }
}

function updateCartCountFromResponse(cartData) {
    console.log('Обновляем счетчик из данных:', cartData);

    if (cartData && cartData.cartItems) {
        const totalItems = cartData.cartItems.reduce((total, item) => total + item.quantity, 0);
        console.log('Общее количество товаров:', totalItems);
        updateCartCount(totalItems);
    } else {
        console.log('Корзина пустая или нет cartItems');
        updateCartCount(0);
    }
}

function checkPendingCartItems() {
    const pendingItem = sessionStorage.getItem('pendingCartItem');
    if (pendingItem && isLoggedIn) {
        addToCart(parseInt(pendingItem));
        sessionStorage.removeItem('pendingCartItem');
    }
}

async function toggleUserMenu(){
    try{
        const response = await fetch("/profile/getProfile",{
            method: "GET",
            credentials: "include"
        });

        if(!response.ok){
            throw new Error("Не удалось получить информацию о профиле")
        }
        const profile = await response.json();

        document.getElementById('userLogin').textContent = profile.login;
        document.getElementById('userBalance').textContent = profile.wallet;
        document.getElementById('userAvatar').src = profile.photoPath;

        document.getElementById('guestMenu').style.display = "none";
        document.getElementById('userProfile').style.display = "flex";

        isLoggedIn = true;

        await getCartCount();

        checkPendingCartItems();

        if (profile.role === 'ADMIN' || profile.role === 'ROLE_ADMIN') {
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
            return;
        }

    }catch(err){
        console.error(err);
        document.getElementById('guestMenu').style.display = "flex";
        document.getElementById('userProfile').style.display = "none";
        isLoggedIn = false;
        updateCartCount(0);
        disableAddToCartButtons();
    }
}

function disableAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .btn-small');
    addToCartButtons.forEach(button => {
        if (button.textContent.includes('В корзину')) {
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
            button.title = 'Войдите в систему для добавления в корзину';
        }
    });
}

function enableAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .btn-small');
    addToCartButtons.forEach(button => {
        if (button.textContent.includes('В корзину')) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
            button.title = '';
        }
    });
}

document.addEventListener('click', function(e) {
    if ((e.target.classList.contains('btn-small') || e.target.classList.contains('add-to-cart-btn')) &&
        e.target.textContent.includes('В корзину')) {

        e.preventDefault();

        if (!isLoggedIn) {
            showLoginPrompt('Для добавления в корзину необходимо войти в систему');
            return;
        }

        let bookId;
        if (e.target.classList.contains('add-to-cart-btn')) {
            bookId = parseInt(e.target.dataset.bookId);
        } else {
            const bookCard = e.target.closest('.book-card');
            bookId = getBookIdFromCard(bookCard);
        }

        if (bookId) {
            addToCart(bookId);
        }
    }
});

function getBookIdFromCard(bookCard) {
    if (bookCard.dataset.bookId) {
        return parseInt(bookCard.dataset.bookId);
    }
    return Math.floor(Math.random() * 1000) + 1;
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-count.updated {
        animation: subtle-pulse 0.6s ease-in-out;
    }
    
    /* Полностью убрать анимацию с баджей */
    .book-badge {
        animation: none !important;
    }
    
    @keyframes subtle-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: 12px;
    }
    
    .login-prompt-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 16px;
    }
    
    .modal-overlay {
        backdrop-filter: blur(4px);
    }
    
    .add-to-cart-btn:disabled {
        opacity: 0.6 !important;
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style);


async function getPopularBooks(){
    try{
        const response = await fetch("/books/fivePopularBooks",{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const books = await response.json();

        displayPopularBooks(books);

    }catch(err){
        console.error("Ошибка при загрузке популярных книг:", err);
        showPopularBooksError();
    }
}

function displayPopularBooks(books) {
    const booksGrid = document.querySelector('.featured-books .books-grid');
    if (!booksGrid) {
        console.error('Контейнер для популярных книг не найден');
        return;
    }

    booksGrid.innerHTML = '';

    books.forEach((book, index) => {
        const bookCard = createPopularBookCard(book, index);
        booksGrid.appendChild(bookCard);
    });
}

function createPopularBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.bookId = book.id;

    const gradients = ['book-gradient-1', 'book-gradient-2', 'book-gradient-3', 'book-gradient-4'];
    const gradientClass = gradients[index % gradients.length];

    const price = typeof book.price === "number"
        ? (book.price % 1 === 0 ? Math.floor(book.price) : book.price.toFixed(2))
        : book.price;

    card.innerHTML = `
        <div class="book-image">
            ${book.coverImageUrl ?
        `<img src="${book.coverImageUrl}" alt="${book.title}" class="book-cover-image" onerror="this.style.display='none'">` :
        ''
    }
            <div class="book-gradient ${gradientClass} ${book.coverImageUrl ? 'hidden' : ''}">
                <div class="book-spine"></div>
                <div class="book-pages"></div>
                <div class="book-title-overlay">${book.title}</div>
            </div>
            <div class="book-badge popular-badge">Популярная</div>
            <div class="book-overlay">
                <button class="btn btn-primary btn-small add-to-cart-btn" data-book-id="${book.id}">В корзину</button>
            </div>
        </div>
        <div class="book-info">
            <h3 class="book-title" title="${book.title}">${book.title}</h3>
            <p class="book-author">${book.authorName || 'Автор неизвестен'}</p>
            ${book.genre ? `<p class="book-genre">${book.genre}</p>` : ''}
            <div class="book-rating">
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                </div>
                <span class="rating-text">4.5 (10)</span>
            </div>
            <div class="book-price">${price} руб.</div>
        </div>
    `;

    return card;
}

function showPopularBooksError() {
    const booksGrid = document.querySelector('.featured-books .books-grid');
    if (booksGrid) {
        booksGrid.innerHTML = `
            <div class="books-error" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                <p>Не удалось загрузить популярные книги</p>
                <button class="btn btn-secondary" onclick="getPopularBooks()">Попробовать снова</button>
            </div>
        `;
    }
}

