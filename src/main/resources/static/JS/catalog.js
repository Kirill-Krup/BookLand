async function toggleUserMenu(){
    try{
        const response = await fetch("/profile/getProfile",{
            method: "GET",
            credentials: "include"
        });
        if(!response.ok){
            throw new Error("Не удалось получить информацию о профиле");
        }
        const profile = await response.json();
        document.getElementById('userLogin').textContent = profile.login;
        document.getElementById('userBalance').textContent = profile.wallet;
        document.getElementById('userAvatar').src = profile.photoPath;
        document.getElementById('guestMenu').style.display = "none";
        document.getElementById('userProfile').style.display = "flex";
    }catch(err){
        console.error(err);
        const guest = document.getElementById('guestMenu');
        const user = document.getElementById('userProfile');
        if(guest) guest.style.display = "flex";
        if(user) user.style.display = "none";
    }
}

async function getAllBooks(){
    try{
        const response = await fetch("/books/getAllBooks",{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        window.__allBooks = normalizeBooks(books);
        initGenresFromData(window.__allBooks);
        initPriceBounds(window.__allBooks);
        applySearchAndSort();
    }catch(err){
        console.error("Ошибка при загрузке книг:", err);
        showCatalogError();
    }
}

function normalizeBooks(books){
    return (books || []).map(b => {
        // Обработка author как объекта
        let authorName = '';
        if (b.author && typeof b.author === 'object') {
            authorName = b.author.name || b.author.fullName || '';
        }

        // Обработка genre как объекта
        let genreName = '';
        if (b.genre && typeof b.genre === 'object') {
            genreName = b.genre.name || '';
        }

        // Обработка inStock из quantityInStock
        const inStock = b.quantityInStock !== undefined ? b.quantityInStock > 0 : Boolean(b.inStock !== false);

        return {
            id: b.id,
            title: b.title || '',
            authorName: authorName,
            authorObject: b.author,
            genre: genreName,
            genreObject: b.genre,
            price: typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0,
            rating: typeof b.rating === 'number' ? b.rating : (parseFloat(b.rating) || 0),
            inStock: inStock,
            coverImageUrl: b.coverImageUrl,
            description: b.description || '',
            pages: b.pages || 0,
            publicationDate: b.publicationDate || '',
            publisherName: b.publisherName || '',
            quantityInStock: b.quantityInStock || 0
        };
    });
}

function renderBooks(books){
    const grid = document.getElementById('booksGrid');
    const empty = document.getElementById('catalogEmpty');
    if(!grid) return;

    grid.innerHTML = '';
    if(!books || books.length === 0){
        if(empty) empty.style.display = 'flex';
        return;
    } else if(empty){
        empty.style.display = 'none';
    }

    books.forEach((book, index) => {
        const card = createBookCard(book, index);
        grid.appendChild(card);
    });
}

function showCatalogError(){
    const grid = document.getElementById('booksGrid');
    if(grid){
        grid.innerHTML = `
            <div class="books-error" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                <p>Не удалось загрузить каталог</p>
                <button class="btn btn-outline" onclick="getAllBooks()">Попробовать снова</button>
            </div>
        `;
    }
}

function applySearchAndSort(){
    const query = (document.getElementById('catalogSearch')?.value || '').toLowerCase().trim();
    const sort = document.getElementById('sortSelect')?.value || 'new';
    const books = Array.isArray(window.__allBooks) ? [...window.__allBooks] : [];

    const state = window.__filtersState || {};
    const minPrice = state.minPrice ?? 0;
    const maxPrice = state.maxPrice ?? Number.MAX_SAFE_INTEGER;
    const selectedGenres = new Set(state.genres || []);
    const minRating = state.minRating ?? 0;
    const onlyInStock = Boolean(state.inStock);

    const filtered = books.filter(b => {
        const title = (b.title || '').toLowerCase();
        const author = (b.authorName || '').toLowerCase();
        const genre = (b.genre || '').toLowerCase();

        const queryMatch = !query ||
            title.includes(query) ||
            author.includes(query) ||
            genre.includes(query);

        const priceMatch = b.price >= minPrice && b.price <= maxPrice;
        const genreMatch = selectedGenres.size === 0 || selectedGenres.has(genre);
        const ratingMatch = (b.rating || 0) >= minRating;
        const stockMatch = !onlyInStock || b.inStock;

        return queryMatch && priceMatch && genreMatch && ratingMatch && stockMatch;
    });

    // Сортировка
    switch(sort){
        case 'priceAsc':
            filtered.sort((a,b) => (a.price || 0) - (b.price || 0));
            break;
        case 'priceDesc':
            filtered.sort((a,b) => (b.price || 0) - (a.price || 0));
            break;
        case 'title':
            filtered.sort((a,b) => (a.title || '').localeCompare(b.title || ''));
            break;
        case 'author':
            filtered.sort((a,b) => (a.authorName || '').localeCompare(b.authorName || ''));
            break;
        default:
            // По умолчанию - новые первыми (по ID или дате создания)
            filtered.sort((a,b) => (b.id || 0) - (a.id || 0));
            break;
    }

    renderBooks(filtered);
    updateActiveChips();
}

function initPriceBounds(books){
    if (!books || books.length === 0) return;

    const prices = books.map(b => b.price).filter(price => typeof price === 'number');
    if (prices.length === 0) return;

    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    const minInput = document.getElementById('priceMin');
    const maxInput = document.getElementById('priceMax');
    const minNum = document.getElementById('priceInputMin');
    const maxNum = document.getElementById('priceInputMax');
    const track = document.getElementById('priceTrack');

    if(!minInput || !maxInput || !minNum || !maxNum || !track) return;

    // Устанавливаем границы
    minInput.min = minNum.min = String(min);
    maxInput.min = String(min);
    minInput.max = maxInput.max = String(max);
    minNum.max = maxNum.max = String(max);

    // Устанавливаем начальные значения
    minInput.value = String(min);
    maxInput.value = String(max);
    minNum.value = String(min);
    maxNum.value = String(max);

    window.__filtersState = Object.assign({}, window.__filtersState, {
        minPrice: min,
        maxPrice: max
    });
    updatePriceTrack();

    const onRangeChange = () => {
        let v1 = Number(minInput.value);
        let v2 = Number(maxInput.value);
        if (v1 > v2) [v1, v2] = [v2, v1];

        minInput.value = String(v1);
        maxInput.value = String(v2);
        minNum.value = String(v1);
        maxNum.value = String(v2);

        window.__filtersState.minPrice = v1;
        window.__filtersState.maxPrice = v2;
        updatePriceTrack();
        debouncedApply();
    };

    minInput.addEventListener('input', onRangeChange);
    maxInput.addEventListener('input', onRangeChange);

    const onNumChange = () => {
        let v1 = clamp(Number(minNum.value), min, max);
        let v2 = clamp(Number(maxNum.value), min, max);
        if (v1 > v2) [v1, v2] = [v2, v1];

        minInput.value = String(v1);
        maxInput.value = String(v2);
        minNum.value = String(v1);
        maxNum.value = String(v2);

        window.__filtersState.minPrice = v1;
        window.__filtersState.maxPrice = v2;
        updatePriceTrack();
        debouncedApply();
    };

    minNum.addEventListener('change', onNumChange);
    maxNum.addEventListener('change', onNumChange);
}

function clamp(v, min, max){
    return Math.max(min, Math.min(max, isNaN(v) ? min : v));
}

function updatePriceTrack(){
    const track = document.getElementById('priceTrack');
    const minInput = document.getElementById('priceMin');
    const maxInput = document.getElementById('priceMax');
    if(!track || !minInput || !maxInput) return;

    const min = Number(minInput.min);
    const max = Number(maxInput.max);
    const v1 = Number(minInput.value);
    const v2 = Number(maxInput.value);

    const minPct = ((v1 - min) / (max - min)) * 100;
    const maxPct = ((v2 - min) / (max - min)) * 100;

    track.style.setProperty('--min', `${minPct}%`);
    track.style.setProperty('--max', `${maxPct}%`);
}

function initGenresFromData(books){
    const container = document.getElementById('genresList');
    if(!container) return;

    const genreMap = new Map();

    books.forEach(b => {
        if (b.genreObject && typeof b.genreObject === 'object' && b.genreObject.name) {
            const genreName = b.genreObject.name.trim();
            if (genreName) {
                genreMap.set(genreName.toLowerCase(), genreName);
            }
        }
    });

    const genres = Array.from(genreMap.values()).sort((a, b) => a.localeCompare(b));

    container.innerHTML = '';
    genres.forEach(genreName => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.textContent = genreName;
        chip.dataset.genreName = genreName.toLowerCase();

        chip.addEventListener('click', () => {
            const key = genreName.toLowerCase();
            const set = new Set(window.__filtersState.genres || []);
            if(set.has(key)) {
                set.delete(key);
            } else {
                set.add(key);
            }
            window.__filtersState.genres = Array.from(set);
            chip.classList.toggle('active');
            debouncedApply();
        });
        container.appendChild(chip);
    });
}

function updateActiveChips(){
    const wrap = document.getElementById('activeChips');
    if(!wrap) return;

    const state = window.__filtersState || {};
    const chips = [];

    if(state.genres && state.genres.length){
        state.genres.forEach(g => chips.push({
            type: 'genre',
            label: g.charAt(0).toUpperCase() + g.slice(1)
        }));
    }

    if(typeof state.minPrice === 'number' && typeof state.maxPrice === 'number'){
        chips.push({
            type: 'price',
            label: `${state.minPrice}–${state.maxPrice} руб.`
        });
    }

    if(state.minRating && state.minRating > 0){
        chips.push({
            type: 'rating',
            label: `${state.minRating}+ ★`
        });
    }

    if(state.inStock){
        chips.push({
            type: 'stock',
            label: 'В наличии'
        });
    }

    if(chips.length === 0){
        wrap.style.display = 'none';
        wrap.innerHTML = '';
        return;
    }

    wrap.style.display = 'flex';
    wrap.innerHTML = '';

    chips.forEach(ch => {
        const el = document.createElement('span');
        el.className = 'chip chip-removable';
        el.innerHTML = `${ch.label} <button type="button" aria-label="Удалить фильтр">×</button>`;
        el.querySelector('button').addEventListener('click', () => removeChip(ch));
        wrap.appendChild(el);
    });
}

function removeChip(ch){
    const state = window.__filtersState || {};

    switch(ch.type){
        case 'genre':
            state.genres = (state.genres || []).filter(x => x !== ch.label.toLowerCase());
            // Снимаем активный класс с соответствующего чипа
            document.querySelectorAll('#genresList .chip').forEach(chip => {
                if (chip.dataset.genreName === ch.label.toLowerCase()) {
                    chip.classList.remove('active');
                }
            });
            break;
        case 'price':
            initPriceBounds(window.__allBooks || []);
            break;
        case 'rating':
            state.minRating = 0;
            const any = document.querySelector('input[name="rating"][value="0"]');
            if(any) any.checked = true;
            break;
        case 'stock':
            state.inStock = false;
            const toggle = document.getElementById('inStockToggle');
            if(toggle) toggle.checked = false;
            break;
        default:
            break;
    }

    window.__filtersState = state;
    debouncedApply();
}

function initFiltersInteractions(){
    window.__filtersState = window.__filtersState || {
        genres: [],
        minRating: 0,
        inStock: false
    };

    const ratingRadios = document.querySelectorAll('input[name="rating"]');
    ratingRadios.forEach(r => r.addEventListener('change', () => {
        window.__filtersState.minRating = Number(
            document.querySelector('input[name="rating"]:checked')?.value || 0
        );
        debouncedApply();
    }));

    const stock = document.getElementById('inStockToggle');
    if(stock){
        stock.addEventListener('change', () => {
            window.__filtersState.inStock = Boolean(stock.checked);
            debouncedApply();
        });
    }

    const reset = document.getElementById('resetFilters');
    if(reset){
        reset.addEventListener('click', () => {
            window.__filtersState = {
                genres: [],
                minRating: 0,
                inStock: false
            };

            // Сбрасываем рейтинг
            const any = document.querySelector('input[name="rating"][value="0"]');
            if(any) any.checked = true;

            // Сбрасываем наличие
            const toggle = document.getElementById('inStockToggle');
            if(toggle) toggle.checked = false;

            // Сбрасываем жанры
            document.querySelectorAll('#genresList .chip.active').forEach(c =>
                c.classList.remove('active')
            );

            // Сбрасываем цену
            initPriceBounds(window.__allBooks || []);

            // Сбрасываем поиск и сортировку
            const search = document.getElementById('catalogSearch');
            if(search) search.value = '';

            const sort = document.getElementById('sortSelect');
            if(sort) sort.value = 'new';

            debouncedApply();
        });
    }
}

let __debounceTimer;
function debouncedApply(){
    clearTimeout(__debounceTimer);
    __debounceTimer = setTimeout(applySearchAndSort, 150);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    toggleUserMenu();
    initFiltersInteractions();
    getAllBooks();

    const search = document.getElementById('catalogSearch');
    const sort = document.getElementById('sortSelect');

    if(search){
        search.addEventListener('input', () => {
            debouncedApply();
        });
    }

    if(sort){
        sort.addEventListener('change', () => {
            debouncedApply();
        });
    }

    const mobileToggle = document.getElementById('mobileMenuToggle');
    if(mobileToggle){
        mobileToggle.addEventListener('click', function(){
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
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn){
        logoutBtn.addEventListener('click', () => toggleUserMenu());
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    await loadBooks();
    await getCartCount();
});

/* ---------------------- ЗАГРУЗКА КНИГ ---------------------- */
async function loadBooks() {
    try {
        const response = await fetch("/api/books", { credentials: "include" });
        if (!response.ok) throw new Error("Ошибка при загрузке книг");
        const books = await response.json();

        const booksContainer = document.getElementById("booksContainer");
        booksContainer.innerHTML = "";
        books.forEach((book, index) => {
            const card = createBookCard(book, index);
            booksContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Ошибка загрузки книг:", error);
        const booksContainer = document.getElementById("booksContainer");
        booksContainer.innerHTML = `<p class="error">Не удалось загрузить книги. Попробуйте позже.</p>`;
    }
}

/* ---------------------- КАРТОЧКА КНИГИ ---------------------- */
function createBookCard(book, index) {
    const card = document.createElement("div");
    card.className = "book-card";
    card.dataset.bookId = book.id;

    const gradients = ["book-gradient-5", "book-gradient-6", "book-gradient-7", "book-gradient-8"];
    const gradientClass = gradients[index % gradients.length];

    const price = typeof book.price === "number"
        ? (book.price % 1 === 0 ? Math.floor(book.price) : book.price.toFixed(2))
        : book.price;

    card.innerHTML = `
        <div class="book-image">
            ${book.coverImageUrl
        ? `<img src="${book.coverImageUrl}" alt="${book.title}" class="book-cover-image" onerror="this.style.display='none'">`
        : ""
    }
            <div class="book-gradient ${gradientClass} ${book.coverImageUrl ? "hidden" : ""}">
                <div class="book-spine"></div>
                <div class="book-pages"></div>
                <div class="book-title-overlay">${book.title}</div>
            </div>
            ${!book.inStock ? '<div class="book-badge out-of-stock">Нет в наличии</div>' : ""}
            <div class="book-overlay">
                <button class="btn btn-primary btn-small" 
                        onclick="addToCart(${book.id}, event)" 
                        ${!book.inStock ? "disabled" : ""}>
                    ${book.inStock ? "В корзину" : "Нет в наличии"}
                </button>
            </div>
        </div>
        <div class="book-info">
            <h3 class="book-title" title="${book.title}">${book.title}</h3>
            <p class="book-author">${book.authorName || "Автор неизвестен"}</p>
            ${book.genre ? `<p class="book-genre">${book.genre}</p>` : ""}
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

/* ---------------------- ДОБАВЛЕНИЕ В КОРЗИНУ ---------------------- */
async function addToCart(bookId, event) {
    const button = event?.target?.closest("button");
    const originalText = button ? button.textContent : "В корзину";

    try {
        if (button) {
            button.textContent = "Добавляем...";
            button.disabled = true;
        }

        const addToCartDTO = { bookId: bookId, quantity: 1 };

        const response = await fetch("/api/cart/addItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addToCartDTO),
            credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Необходимо авторизоваться");
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const cartData = await response.json();
        updateCartCountFromResponse(cartData);
        showSuccessMessage("Книга добавлена в корзину!");

        if (button) {
            button.textContent = "Добавлено!";
            button.style.background = "#10b981";
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = "";
                button.disabled = false;
            }, 2000);
        }
    } catch (error) {
        console.error("Ошибка при добавлении в корзину:", error);

        if (button) {
            button.textContent = originalText;
            button.disabled = false;
        }

        handleAddToCartError(error, bookId);
        await getCartCount();
    }
}

/* ---------------------- КОЛИЧЕСТВО ТОВАРОВ В КОРЗИНЕ ---------------------- */
async function getCartCount() {
    try {
        const response = await fetch("/api/cart/getUserCart", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Ошибка загрузки корзины");
        }

        const cart = await response.json();
        updateCartCount(cart);

    } catch (error) {
        console.error("Ошибка получения количества товаров в корзине:", error);
        updateCartCount(0);
    }
}

function updateCartCountFromResponse(cartData) {
    updateCartCount(cartData);
}

function updateCartCount(cart) {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;

    let totalItems = 0;

    if (cart && cart.cartItems) {
        totalItems = cart.cartItems.reduce((count, item) => count + item.quantity, 0);
    }

    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    if (totalItems > 0) {
        cartCount.style.transform = "scale(1.3)";
        setTimeout(() => {
            cartCount.style.transform = "scale(1)";
        }, 300);
    }
}

/* ---------------------- УВЕДОМЛЕНИЯ ---------------------- */
function showSuccessMessage(msg) {
    const box = document.createElement("div");
    box.className = "toast success";
    box.textContent = msg;
    document.body.appendChild(box);
    setTimeout(() => box.classList.add("visible"), 10);
    setTimeout(() => {
        box.classList.remove("visible");
        setTimeout(() => box.remove(), 300);
    }, 2000);
}

function showErrorMessage(msg) {
    const box = document.createElement("div");
    box.className = "toast error";
    box.textContent = msg;
    document.body.appendChild(box);
    setTimeout(() => box.classList.add("visible"), 10);
    setTimeout(() => {
        box.classList.remove("visible");
        setTimeout(() => box.remove(), 300);
    }, 2500);
}

/* ---------------------- ОБРАБОТКА ОШИБОК ---------------------- */
function handleAddToCartError(error) {
    if (error.message.includes("Необходимо авторизоваться")) {
        showErrorMessage("Для добавления книги нужно войти в систему");
    } else if (error.message.includes("404")) {
        showErrorMessage("Книга не найдена");
    } else {
        showErrorMessage("Не удалось добавить книгу в корзину");
    }
}
