let isLoggedIn = false;

function smoothScrollTo(targetId, duration = 1000) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const targetPosition = target.offsetTop - 80; // Учитываем высоту хедера
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

// Функция easing для плавности
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

// Функция для обновления активного пункта навигации
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

// Функция для создания индикатора прогресса скролла
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
            if (element.classList.contains('book-card') || element.classList.contains('category-card') || 
                element.classList.contains('review-card') || element.classList.contains('advantage-card')) {
                element.classList.add('card-scroll-animate');
            } else if (element.classList.contains('section-title')) {
                element.classList.add('title-scroll-animate');
            } else {
                element.classList.add('fade-in-scale');
            }
        }
    });
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
        console.log(profile.wallet);
        document.getElementById('userLogin').textContent = profile.login;
        document.getElementById('userBalance').textContent = profile.wallet;
        document.getElementById('userAvatar').src = profile.photoPath;

        document.getElementById('guestMenu').style.display = "none";
        document.getElementById('userProfile').style.display = "flex";

    }catch(err){
        console.error(err);
        document.getElementById('guestMenu').style.display = "flex";
        document.getElementById('userProfile').style.display = "none";
    }
}

async function getNewBooks(){
    try{
        const response = await fetch("/books/threeNewBooks",{
            method: "GET",
            credentials: "include"
        });

        if(!response.ok){
            throw new Error("Не удалось получить информацию о профиле")
        }
        const books = await response.json();


    }catch(err){
        console.error(err);
        document.getElementById('guestMenu').style.display = "flex";
        document.getElementById('userProfile').style.display = "none";
    }
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

    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Добавляем анимацию клика
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Плавный скролл к секции
            smoothScrollTo(targetId, 50);
            
            setTimeout(() => {
                updateActiveNavLink();
            }, 100);
        });
    });
    
    // Добавляем обработчики для кнопок в героическом баннере
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId, 1000);
        });
    });
    
    // Обработчик кнопки выхода
    document.getElementById('logoutBtn').addEventListener('click', function() {
        isLoggedIn = false;
        toggleUserMenu();
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Показываем уведомление об успешной отправке
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
    
    // Обработчик корзины
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.getElementById('cartCount');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            // Анимация клика
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Переход в корзину (profile.html)
            window.location.href = 'profile.html';
        });
    }
    
    // Функция для обновления счетчика корзины
    function updateCartCount(newCount) {
        if (cartCount) {
            cartCount.textContent = newCount;
            cartCount.classList.add('updated');
            setTimeout(() => {
                cartCount.classList.remove('updated');
            }, 500);
        }
    }
    
    // Симуляция добавления товара в корзину (для демонстрации)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-small') && e.target.textContent.includes('В корзину')) {
            e.preventDefault();
            const currentCount = parseInt(cartCount.textContent);
            updateCartCount(currentCount + 1);
            
            // Анимация кнопки
            e.target.textContent = 'Добавлено!';
            e.target.style.background = '#10b981';
            setTimeout(() => {
                e.target.textContent = 'В корзину';
                e.target.style.background = '';
            }, 1500);
        }
    });
});

// Анимация при прокрутке
window.addEventListener('scroll', function() {
    animateOnScroll();
    updateActiveNavLink();
});

// Мобильное меню
document.getElementById('mobileMenuToggle').addEventListener('click', function() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-active');
    
    // Анимация иконки гамбургера
    const icon = this.querySelector('i');
    if (nav.classList.contains('mobile-active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Закрытие мобильного меню при клике на ссылку
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

// Дополнительные эффекты для улучшения UX (упрощенные)
function addHoverEffects() {
    // Упрощенный эффект для карточек книг
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

    // Упрощенный эффект для категорий
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

// Функция для добавления эффекта печатания для заголовков
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

// Инициализация дополнительных эффектов
document.addEventListener('DOMContentLoaded', function() {
    addHoverEffects();
    addTypingEffect();
});



// ЗАГРУЗКА ТРЁХ НОВИНОК
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
                <button class="btn btn-primary btn-small" onclick="addToCart(${book.id})">В корзину</button>
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

function addToCart(bookId) {
    console.log('Добавление в корзину книги с ID:', bookId);

}