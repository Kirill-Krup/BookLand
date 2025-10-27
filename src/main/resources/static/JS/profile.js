document.addEventListener("DOMContentLoaded", () => {
  toggleUserMenu();
  setupEventListeners();
  loadUserCart();
});

async function toggleUserMenu(){
  try{
    const response = await fetch("/profile/getAllProfileInfo",{
      method: "GET",
      credentials: "include"
    });

    if(!response.ok){
      throw new Error("Не удалось получить информацию о профиле")
    }
    const profile = await response.json();
    setInfo(profile);

  }catch(err){
    console.error(err);
  }
}

function setInfo(profile){
  document.getElementById('profileAvatar').src = profile.photoPath;
  document.getElementById('profileName').textContent = profile.login;
  document.getElementById('profileEmail').textContent = profile.email;
  document.getElementById('balanceAmount').textContent = profile.wallet + " BYN";

  document.getElementById('userBalance').textContent = profile.wallet + " BYN";
  document.getElementById('userName').textContent = profile.login;
  document.getElementById('userAvatar').src = profile.photoPath;

  document.getElementById('firstName').value = profile.firstName || '';
  document.getElementById('lastName').value = profile.lastName || '';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('address').value = profile.deliveryAddress || '';

  document.getElementById("stat-number-orders").textContent = profile.orders ? profile.orders.length : 0;
  document.getElementById("stat-number-days").textContent = calculateDaysSinceRegistration(profile.registrationDate);

  renderActivities(profile.activities);
}

async function loadUserCart() {
  try {
    const response = await fetch("/api/cart/getUserCart", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить корзину пользователя");
    }

    const cart = await response.json();
    renderCart(cart);
    updateCartCount(cart);

  } catch (err) {
    console.error("Ошибка загрузки корзины:", err);
    document.querySelector('.cart-list').innerHTML = '<p class="no-items">Не удалось загрузить корзину</p>';
    updateCartCount(0);
  }
}

function renderCart(cart) {
  const cartContainer = document.querySelector('.cart-list');

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    cartContainer.innerHTML = '<p class="no-items">Корзина пуста</p>';
    updateCartSummary(0);
    return;
  }

  const cartHTML = cart.cartItems.map(item => `
    <div class="cart-item" data-book-id="${item.book.id}">
      <div class="cart-image">
        ${item.book.coverImageUrl ?
      `<img src="${item.book.coverImageUrl}" alt="${item.book.title}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">` :
      `<i class="fas fa-book"></i>`
  }
      </div>
      <div class="cart-info">
        <h4 class="cart-name">${item.book.title}</h4>
        <p class="cart-description">${item.book.authorName || 'Автор неизвестен'}</p>
        <div class="cart-quantity">
          <button class="quantity-btn" data-action="decrease" data-book-id="${item.book.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" data-action="increase" data-book-id="${item.book.id}">+</button>
        </div>
      </div>
      <div class="cart-price">${formatPrice(item.book.price)} BYN</div>
      <button class="remove-btn" data-book-id="${item.book.id}" title="Удалить">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  cartContainer.innerHTML = cartHTML;

  const total = cart.cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  updateCartSummary(total, cart.id);
}

function updateCartCount(cart) {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    let totalItems = 0;

    if (cart && cart.cartItems) {
      totalItems = cart.cartItems.reduce((count, item) => count + item.quantity, 0);
    }

    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function updateCartSummary(total, cartId) {
  const summaryContainer = document.querySelector('.cart-summary');
  if (summaryContainer) {
    const formattedTotal = formatPrice(total);
    summaryContainer.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">Книги:</span>
        <span class="summary-value">${formattedTotal} BYN</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Доставка:</span>
        <span class="summary-value">Бесплатно</span>
      </div>
      <div class="summary-row total">
        <span class="summary-label">Итого:</span>
        <span class="summary-value">${formattedTotal} BYN</span>
      </div>
      <button class="checkout-btn" id="checkoutBtn" ${total === 0 ? 'disabled' : ''}>
        <i class="fas fa-credit-card"></i>
        Оформить заказ
      </button>
    `;

    // Добавляем обработчик для кнопки оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn && !checkoutBtn.disabled) {
      checkoutBtn.addEventListener('click', async function() {
        try {
          await createOrder(cartId);
        } catch (error) {
          console.error('Ошибка при оформлении заказа:', error);
        }
      });
    }
  }
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

async function addToCart(bookId) {
  try {
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
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    await loadUserCart();

  } catch (error) {
    console.error('Ошибка при добавлении в корзину:', error);
  }
}

async function removeFromCart(bookId) {
  try {
    const deleteFromCartDTO = {
      bookId: bookId
    };

    const response = await fetch("/api/cart/removeItem", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deleteFromCartDTO),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    await loadUserCart();

  } catch (error) {
    console.error('Ошибка при удалении из корзины:', error);
  }
}

async function deleteFromCart(bookId) {
  try {
    const deleteFromCartDTO = {
      bookId: bookId
    };

    const response = await fetch("/api/cart/deleteItem", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deleteFromCartDTO),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    await loadUserCart();

  } catch (error) {
    console.error('Ошибка при удалении книги из корзины:', error);
  }
}

async function deleteCart(cartId) {
  try {
    const response = await fetch(`/api/cart/deleteCart/${cartId}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    console.log("Корзина успешно удалена");
    return true;

  } catch (error) {
    console.error('Ошибка при удалении корзины:', error);
    throw error;
  }
}

async function createOrder(cartId) {
  try {
    // Получаем текущую корзину
    const response = await fetch("/api/cart/getUserCart", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить корзину");
    }

    const cart = await response.json();

    // Проверяем, что корзина не пуста
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      showNotification("Корзина пуста", "error");
      return;
    }

    // Рассчитываем общую сумму заказа
    const totalAmount = cart.cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

    // Получаем информацию о пользователе для проверки баланса
    const profileResponse = await fetch("/profile/getAllProfileInfo", {
      method: "GET",
      credentials: "include"
    });

    if (!profileResponse.ok) {
      throw new Error("Не удалось получить информацию о профиле");
    }

    const profile = await profileResponse.json();

    // Проверяем достаточно ли средств на балансе
    if (profile.wallet < totalAmount) {
      showNotification("Недостаточно средств на балансе", "error");
      return;
    }

    // Получаем адрес доставки из профиля
    const shippingAddress = profile.deliveryAddress || '';

    // Создаем список элементов заказа в правильном формате
    const allItems = cart.cartItems.map(item => ({
      book: {
        id: item.book.id,
        title: item.book.title,
        authorName: item.book.authorName,
        price: item.book.price,
        coverImageUrl: item.book.coverImageUrl
        // Добавьте другие необходимые поля из BookSimpleDTO
      },
      quantity: item.quantity,
      unitPrice: item.book.price,
      subtotal: item.book.price * item.quantity
    }));

    // Создаем данные для заказа в соответствии с DTO
    const orderData = {
      shippingAddress: shippingAddress,
      totalAmount: totalAmount,
      paymentMethod: "PURSE", // Используем PURSE как указано в DTO
      allItems: allItems
      // orderDate и status устанавливаются автоматически на сервере
      // trackingNumber будет сгенерирован на сервере
    };

    console.log('Отправляемые данные заказа:', orderData);

    const orderResponse = await fetch("/api/orders/newOrder", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      throw new Error(`Ошибка сервера: ${orderResponse.status}. ${errorText}`);
    }

    const result = await orderResponse.json();
    showNotification("Заказ успешно оформлен!", "success");

    if (cartId) {
      try {
        await deleteCart(cartId);
        console.log("Корзина удалена после оформления заказа");
      } catch (error) {
        console.error("Ошибка при удалении корзины:", error);
      }
    }

    await toggleUserMenu();
    await loadUserCart();

    return result;

  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
    showNotification("Ошибка при оформлении заказа: " + error.message, "error");
    throw error;
  }
}

async function updateUserProfile(profileData) {
  try {
    const response = await fetch("/profile/update", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error("Не удалось обновить профиль");
    }

    const updatedProfile = await response.json();
    showNotification("Профиль успешно обновлен", "success");
    return updatedProfile;

  } catch (err) {
    console.error("Ошибка обновления профиля:", err);
    showNotification("Ошибка при обновлении профиля", "error");
    throw err;
  }
}

async function loadActiveOrders() {
  try {
    const response = await fetch("/api/orders/getAllMyActiveOrders", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить активные заказы");
    }

    const orders = await response.json();
    renderActiveOrders(orders);

  } catch (err) {
    console.error("Ошибка загрузки активных заказов:", err);
    document.querySelector('.orders-list').innerHTML = '<p class="no-items">Не удалось загрузить активные заказы</p>';
  }
}

function renderActiveOrders(orders) {
  const ordersContainer = document.querySelector('.orders-list');

  if (!orders || orders.length === 0) {
    ordersContainer.innerHTML = '<p class="no-items">Нет активных заказов</p>';
    return;
  }

  const ordersHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div class="order-info">
          <h3 class="order-number">Заказ #${order.id}</h3>
          <span class="order-date">${formatDate(order.orderDate)}</span>
        </div>
        <div class="order-status status-${getOrderStatusClass(order.status)}">
          <i class="${getOrderStatusIcon(order.status)}"></i>
          ${getOrderStatusText(order.status)}
        </div>
      </div>
      <div class="order-items">
        ${order.orderItems ? order.orderItems.map(item => `
          <div class="order-item">
            <div class="item-image">
              ${item.bookCover ?
      `<img src="${item.bookCover}" alt="${item.bookTitle}" style="width: 40px; height: 60px; object-fit: cover; border-radius: 4px;">` :
      `<i class="fas fa-book"></i>`
  }
            </div>
            <div class="item-info">
              <h4 class="item-name">${item.bookTitle || 'Название книги'}</h4>
              <p class="item-description">${item.author || 'Автор неизвестен'}</p>
              <div class="item-quantity">Количество: ${item.quantity || 1}</div>
            </div>
            <div class="item-price">${formatPrice(item.unitPrice || item.price || 0)} BYN</div>
          </div>
        `).join('') : ''}
      </div>
      <div class="order-footer">
        <div class="order-total">
          <span class="total-label">Итого:</span>
          <span class="total-amount">${formatPrice(order.totalAmount)} BYN</span>
        </div>
        <div class="order-actions">
          ${order.status === 'processing' ? `
            <button class="btn btn-secondary" onclick="cancelOrder(${order.id})">Отменить</button>
          ` : ''}
          <button class="btn btn-primary" onclick="viewOrderDetails(${order.id})">Подробнее</button>
          ${order.trackingNumber ? `
            <button class="btn btn-primary" onclick="trackOrder('${order.trackingNumber}')">Отследить</button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  ordersContainer.innerHTML = ordersHTML;
}

// Функция для загрузки истории заказов
async function loadOrderHistory() {
  try {
    const response = await fetch("/api/orders/getMyOrdersHistory", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить историю заказов");
    }

    const history = await response.json();
    renderOrderHistory(history);

  } catch (err) {
    console.error("Ошибка загрузки истории заказов:", err);
    document.querySelector('.history-list').innerHTML = '<p class="no-items">Не удалось загрузить историю заказов</p>';
  }
}

// Функция для отрисовки истории заказов
function renderOrderHistory(history) {
  const historyContainer = document.querySelector('.history-list');

  if (!history || history.length === 0) {
    historyContainer.innerHTML = '<p class="no-items">История заказов пуста</p>';
    return;
  }

  const historyHTML = history.map(order => `
    <div class="history-item" data-category="${order.category || 'all'}">
      <div class="history-image">
        ${order.bookCover ?
      `<img src="${order.bookCover}" alt="${order.bookTitle}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">` :
      `<i class="fas fa-book"></i>`
  }
      </div>
      <div class="history-info">
        <h4 class="history-name">${order.bookTitle || 'Название книги'}</h4>
        <p class="history-description">${order.author || 'Автор неизвестен'}</p>
        <span class="history-date">${formatDate(order.orderDate || order.purchaseDate)}</span>
        <div class="order-number">Заказ #${order.orderId || order.id}</div>
      </div>
      <div class="history-price">${formatPrice(order.unitPrice || order.price || 0)} BYN</div>
      <div class="history-status status-${getOrderStatusClass(order.status)}">
        <i class="${getOrderStatusIcon(order.status)}"></i>
        ${getOrderStatusText(order.status)}
      </div>
    </div>
  `).join('');

  historyContainer.innerHTML = historyHTML;
}

function renderActiveOrders(orders) {
  const ordersContainer = document.querySelector('.orders-list');

  if (!orders || orders.length === 0) {
    ordersContainer.innerHTML = '<p class="no-items">Нет активных заказов</p>';
    return;
  }

  const ordersHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div class="order-info">
          <h3 class="order-number">Заказ #${order.id}</h3>
          <span class="order-date">${formatDate(order.orderDate)}</span>
        </div>
        <div class="order-status status-${getOrderStatusClass(order.status)}">
          <i class="${getOrderStatusIcon(order.status)}"></i>
          ${getOrderStatusText(order.status)}
        </div>
      </div>
      <div class="order-items">
        ${order.orderItems ? order.orderItems.map(item => `
          <div class="order-item">
            <div class="item-image">
              ${item.book && item.book.coverImageUrl ?
      `<img src="${item.book.coverImageUrl}" alt="${item.book.title}" style="width: 40px; height: 60px; object-fit: cover; border-radius: 4px;">` :
      `<i class="fas fa-book"></i>`
  }
            </div>
            <div class="item-info">
              <h4 class="item-name">${item.book ? item.book.title : 'Название книги'}</h4>
              <p class="item-description">${item.book ? (item.book.authorName || 'Автор неизвестен') : 'Автор неизвестен'}</p>
              <div class="item-quantity">Количество: ${item.quantity || 1}</div>
            </div>
            <div class="item-price">${formatPrice(item.unitPrice || 0)} BYN</div>
          </div>
        `).join('') : ''}
      </div>
      <div class="order-footer">
        <div class="order-total">
          <span class="total-label">Итого:</span>
          <span class="total-amount">${formatPrice(order.totalAmount)} BYN</span>
        </div>
        <div class="order-actions">
          ${order.status === 'PROCESSING' || order.status === 'PENDING' ? `
            <button class="btn btn-secondary" onclick="cancelOrder(${order.id})">Отменить</button>
          ` : ''}
          <button class="btn btn-primary" onclick="viewOrderDetails(${order.id})">Подробнее</button>
          ${order.trackingNumber ? `
            <button class="btn btn-primary" onclick="trackOrder('${order.trackingNumber}')">Отследить</button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  ordersContainer.innerHTML = ordersHTML;
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} ${pluralize(diffYears, 'год', 'года', 'лет')} назад`;
  } else if (diffMonths > 0) {
    return `${diffMonths} ${pluralize(diffMonths, 'месяц', 'месяца', 'месяцев')} назад`;
  } else if (diffDays > 0) {
    return `${diffDays} ${pluralize(diffDays, 'день', 'дня', 'дней')} назад`;
  } else if (diffHours > 0) {
    return `${diffHours} ${pluralize(diffHours, 'час', 'часа', 'часов')} назад`;
  } else if (diffMins > 0) {
    return `${diffMins} ${pluralize(diffMins, 'минуту', 'минуты', 'минут')} назад`;
  } else {
    return 'только что';
  }
}

function pluralize(number, one, two, five) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}

function calculateDaysSinceRegistration(registrationDate) {
  const regDate = new Date(registrationDate);
  const currentDate = new Date();
  const timeDiff = currentDate - regDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getOrderStatusText(status) {
  const statusMap = {
    'DELIVERED': 'Доставлено',
    'SHIPPED': 'Отправлен',
    'PROCESSING': 'Обрабатывается',
    'CANCELLED': 'Отменен',
    'PENDING': 'Ожидает обработки'
  };
  return statusMap[status] || 'Обрабатывается';
}

function getOrderStatusClass(status) {
  const statusClassMap = {
    'PROCESSING': 'processing',
    'SHIPPED': 'shipped',
    'DELIVERED': 'delivered',
    'CANCELLED': 'cancelled',
    'PENDING': 'processing'
  };
  return statusClassMap[status] || 'processing';
}

function getOrderStatusIcon(status) {
  const statusIconMap = {
    'PROCESSING': 'fas fa-clock',
    'SHIPPED': 'fas fa-truck',
    'DELIVERED': 'fas fa-check-circle',
    'CANCELLED': 'fas fa-times-circle',
    'PENDING': 'fas fa-clock'
  };
  return statusIconMap[status] || 'fas fa-clock';
}

function getActivityIcon(activityType) {
  const iconMap = {
    'BOOK_ADDED_TO_CART': 'fas fa-shopping-cart',
    'REVIEW_ADDED': 'fas fa-star',
    'BALANCE_TOP_UP': 'fas fa-credit-card',
    'BOOK_PURCHASED': 'fas fa-shopping-bag',
    'PROFILE_UPDATED': 'fas fa-user-edit'
  };
  return iconMap[activityType] || 'fas fa-bell';
}

function getActivityTitle(activityType) {
  const titleMap = {
    'BOOK_ADDED_TO_CART': 'Добавлена книга в корзину',
    'REVIEW_ADDED': 'Оставлен отзыв',
    'BALANCE_TOP_UP': 'Пополнен баланс',
    'BOOK_PURCHASED': 'Книга приобретена',
    'PROFILE_UPDATED': 'Профиль обновлен'
  };
  return titleMap[activityType] || 'Новая активность';
}

function getPaymentMethodEnum(paymentMethod) {
  const paymentMap = {
    'card': 'DEBIT_CARD',
    'wallet': 'ELECTRONICS_PURCHASE'
  };
  return paymentMap[paymentMethod] || 'DEBIT_CARD';
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 4px;
    z-index: 1000;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

async function cancelOrder(orderId) {
  if (confirm('Вы уверены, что хотите отменить заказ?')) {
    try {
      const response = await fetch(`/api/orders/deleteOrder/${orderId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Не удалось отменить заказ");
      }

      showNotification("Заказ успешно отменен", "success");
      await loadActiveOrders();

    } catch (error) {
      console.error("Ошибка при отмене заказа:", error);
      showNotification("Ошибка при отмене заказа", "error");
    }
  }
}

function viewOrderDetails(orderId) {
  console.log("Просмотр деталей заказа:", orderId);
  showNotification("Функция просмотра деталей заказа в разработке", "info");
}

function trackOrder(trackingNumber) {
  console.log("Отслеживание заказа:", trackingNumber);
  showNotification("Функция отслеживания заказа в разработке", "info");
}

// Функция для фильтрации истории заказов
function filterOrderHistory(filter) {
  const historyItems = document.querySelectorAll('.history-item');

  historyItems.forEach(item => {
    const category = item.getAttribute('data-category');

    if (filter === 'all' || category === filter) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function setupEventListeners() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.profile-section');

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));

      this.classList.add('active');
      const targetSection = this.getAttribute('data-section');
      document.getElementById(targetSection).classList.add('active');

      if (targetSection === 'cart') {
        loadUserCart();
      } else if (targetSection === 'history') {
        loadOrderHistory();
      } else if (targetSection === 'orders') {
        loadActiveOrders();
      }
    });
  });

  // Добавляем обработчики для фильтров истории заказов
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      filterOrderHistory(filter);
    });
  });

  const customAmountInput = document.getElementById('customAmount');
  if (customAmountInput) {
    customAmountInput.addEventListener('input', function() {
      if (this.value) {
        amountBtns.forEach(btn => btn.classList.remove('active'));
      }
    });
  }

  const settingsForm = document.getElementById("saveInfo");
  if (settingsForm) {
    settingsForm.addEventListener('click', async (e) => {
      e.preventDefault();

      const profileData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        deliveryAddress: document.getElementById('address').value
      };

      try {
        await updateUserProfile(profileData);
      } catch (error) {
        console.error('Ошибка обновления профиля:', error);
      }
    });
  }

  const topupBtn = document.getElementById('topupBtn');
  const modal = document.getElementById('topupModal');
  const modalClose = document.getElementById('modalClose');
  const cancelTopup = document.getElementById('cancelTopup');
  const confirmTopup = document.getElementById('confirmTopup');

  if (topupBtn) {
    topupBtn.addEventListener('click', function() {
      modal.style.display = 'flex';
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  if (cancelTopup) {
    cancelTopup.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  const amountBtns = document.querySelectorAll('.amount-btn');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      amountBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  if (confirmTopup) {
    confirmTopup.addEventListener('click', async function() {
      const selectedAmountBtn = document.querySelector('.amount-btn.active');
      const customAmountInput = document.getElementById('customAmount');
      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

      let amount = 0;

      if (selectedAmountBtn) {
        amount = parseFloat(selectedAmountBtn.getAttribute('data-amount'));
      } else if (customAmountInput.value) {
        amount = parseFloat(customAmountInput.value);
      }

      if (amount <= 0 || isNaN(amount)) {
        showNotification("Пожалуйста, выберите или введите корректную сумму", "error");
        return;
      }

      if (amount < 5) {
        showNotification("Минимальная сумма пополнения - 5 BYN", "error");
        return;
      }

      try {
        const paymentMethodEnum = getPaymentMethodEnum(paymentMethod);
        await createReplenishment(amount, paymentMethodEnum);
        modal.style.display = 'none';
        amountBtns.forEach(btn => btn.classList.remove('active'));
        customAmountInput.value = '';
      } catch (error) {
        console.error('Ошибка при пополнении:', error);
      }
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quantity-btn')) {
      const action = e.target.getAttribute('data-action');
      const bookId = e.target.getAttribute('data-book-id');

      if (action === 'increase') {
        addToCart(parseInt(bookId));
      } else if (action === 'decrease') {
        removeFromCart(parseInt(bookId));
      }
    }

    if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
      const removeBtn = e.target.classList.contains('remove-btn') ? e.target : e.target.closest('.remove-btn');
      const bookId = removeBtn.getAttribute('data-book-id');
      deleteFromCart(parseInt(bookId));
    }
  });
}

document.getElementById('logoutBtn').addEventListener('click', function() {
  if (confirm('Вы уверены, что хотите выйти?')) {
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
});

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hash === '#cart') {
    const cartNavItem = document.getElementById('navCartItem');
    if (cartNavItem) {
      cartNavItem.click();
    }
  }

  const headerCartBtn = document.getElementById('headerCartBtn');
  if (headerCartBtn) {
    headerCartBtn.addEventListener('click', function() {
      const cartNavItem = document.getElementById('navCartItem');
      if (cartNavItem) {
        cartNavItem.click();
      }
    });
  }
});

async function createReplenishment(amount, paymentMethod) {
  try {
    const replenishmentData = {
      amount: amount,
      paymentMethod: paymentMethod
    };

    console.log('Отправляемые данные пополнения:', replenishmentData);

    const response = await fetch("/api/replenishments/newReplenishment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(replenishmentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка сервера: ${response.status}. ${errorText}`);
    }

    const result = await response.json();
    showNotification("Баланс успешно пополнен!", "success");

    await toggleUserMenu();

    return result;

  } catch (error) {
    console.error("Ошибка при пополнении баланса:", error);
    showNotification("Ошибка при пополнении баланса: " + error.message, "error");
    throw error;
  }
}