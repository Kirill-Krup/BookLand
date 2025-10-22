document.addEventListener("DOMContentLoaded", () => {
  toggleUserMenu();
  setupEventListeners();
});

// Основная функция загрузки профиля
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
  // Основная информация профиля
  document.getElementById('profileAvatar').src = profile.photoPath;
  document.getElementById('profileName').textContent = profile.login;
  document.getElementById('profileEmail').textContent = profile.email;
  document.getElementById('balanceAmount').textContent = profile.wallet + " BYN";

  document.getElementById('userBalance').textContent = profile.wallet + " BYN";
  document.getElementById('userName').textContent = profile.login;
  document.getElementById('userAvatar').src = profile.photoPath;

  // Настройки профиля
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
    const response = await fetch("/cart/getUserCart", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить корзину пользователя");
    }

    const cart = await response.json();
    renderCart(cart);

  } catch (err) {
    console.error("Ошибка загрузки корзины:", err);
    document.querySelector('.cart-list').innerHTML = '<p class="no-items">Не удалось загрузить корзину</p>';
  }
}

function renderCart(cart) {
  const cartContainer = document.querySelector('.cart-list');

  if (!cart || !cart.items || cart.items.length === 0) {
    cartContainer.innerHTML = '<p class="no-items">Корзина пуста</p>';
    updateCartSummary(0);
    return;
  }

  const cartHTML = cart.items.map(item => `
    <div class="cart-item" data-book-id="${item.bookId}">
      <div class="cart-image">
        <img src="${item.bookCover || '../images/book-placeholder.jpg'}" alt="${item.bookTitle}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
      </div>
      <div class="cart-info">
        <h4 class="cart-name">${item.bookTitle}</h4>
        <p class="cart-description">${item.author}</p>
        <div class="cart-quantity">
          <button class="quantity-btn" data-action="decrease" data-book-id="${item.bookId}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" data-action="increase" data-book-id="${item.bookId}">+</button>
        </div>
      </div>
      <div class="cart-price">${item.price} BYN</div>
      <button class="remove-btn" data-book-id="${item.bookId}" title="Удалить">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  cartContainer.innerHTML = cartHTML;

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  updateCartSummary(total);

  updateCartCount(cart.items.reduce((count, item) => count + item.quantity, 0));
}

function updateCartSummary(total) {
  const summaryContainer = document.querySelector('.cart-summary');
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">Книги:</span>
        <span class="summary-value">${total} BYN</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Доставка:</span>
        <span class="summary-value">Бесплатно</span>
      </div>
      <div class="summary-row total">
        <span class="summary-label">Итого:</span>
        <span class="summary-value">${total} BYN</span>
      </div>
      <button class="checkout-btn" ${total === 0 ? 'disabled' : ''}>
        <i class="fas fa-credit-card"></i>
        Оформить заказ
      </button>
    `;
  }
}

function updateCartCount(count) {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
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

// 3. Функция для получения истории покупок
async function loadPurchaseHistory() {
  try {
    const response = await fetch("/orders/history", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить историю покупок");
    }

    const history = await response.json();
    renderPurchaseHistory(history);

  } catch (err) {
    console.error("Ошибка загрузки истории покупок:", err);
    document.querySelector('.history-list').innerHTML = '<p class="no-items">Не удалось загрузить историю покупок</p>';
  }
}

// Рендер истории покупок
function renderPurchaseHistory(history) {
  const historyContainer = document.querySelector('.history-list');

  if (!history || history.length === 0) {
    historyContainer.innerHTML = '<p class="no-items">История покупок пуста</p>';
    return;
  }

  const historyHTML = history.map(order => `
    <div class="history-item" data-category="${order.category || 'fiction'}">
      <div class="history-image">
        <img src="${order.bookCover || '../images/book-placeholder.jpg'}" alt="${order.bookTitle}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">
      </div>
      <div class="history-info">
        <h4 class="history-name">${order.bookTitle}</h4>
        <p class="history-description">${order.author}</p>
        <span class="history-date">${formatDate(order.purchaseDate)}</span>
      </div>
      <div class="history-price">${order.price} BYN</div>
      <div class="history-status status-delivered">
        <i class="fas fa-check-circle"></i>
        ${getOrderStatusText(order.status)}
      </div>
    </div>
  `).join('');

  historyContainer.innerHTML = historyHTML;
}

function renderActivities(activities) {
  const activitiesContainer = document.getElementById('activity-list');
  if (!activities || activities.length === 0) {
    activitiesContainer.innerHTML = '<p class="no-activities">Активности не найдены</p>';
    return;
  }

  const activitiesHTML = activities.map(activity => {
    const iconClass = getActivityIcon(activity.type);
    const title = getActivityTitle(activity.type);
    const timeAgo = getTimeAgo(activity.createdAt);

    return `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="${iconClass}"></i>
        </div>
        <div class="activity-content">
          <h4 class="activity-title">${title}</h4>
          <p class="activity-description">${activity.description || ''}</p>
          <span class="activity-time">${timeAgo}</span>
        </div>
      </div>
    `;
  }).join('');

  activitiesContainer.innerHTML = activitiesHTML;
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

// Вспомогательная функция для склонения слов
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

// Вспомогательные функции
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
    'delivered': 'Доставлено',
    'shipped': 'Отправлен',
    'processing': 'Обрабатывается',
    'cancelled': 'Отменен'
  };
  return statusMap[status] || 'Обрабатывается';
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

      // Загружаем данные для активного раздела
      if (targetSection === 'cart') {
        loadUserCart();
      } else if (targetSection === 'history') {
        loadPurchaseHistory();
      }
    });
  });

  const settingsForm = document.querySelector('.settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
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
}