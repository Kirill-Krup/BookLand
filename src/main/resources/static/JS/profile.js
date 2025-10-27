document.addEventListener("DOMContentLoaded", () => {
  toggleUserMenu();
  setupEventListeners();
  loadUserCart();
});

let userReviews = [];

async function toggleUserMenu() {
  try {
    const response = await fetch("/profile/getAllProfileInfo", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить информацию о профиле")
    }
    const profile = await response.json();
    setInfo(profile);

  } catch (err) {
    console.error(err);
  }
}

function setInfo(profile) {
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
    document.querySelector('.cart-list').innerHTML = '<p class="no-items">Корзина пуста</p>';
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

    await createUserActivity('BOOK_ADDED_TO_CART', `Добавлена книга в корзину`);
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

    return true;

  } catch (error) {
    console.error('Ошибка при удалении корзины:', error);
    throw error;
  }
}

async function createOrder(cartId) {
  try {
    const response = await fetch("/api/cart/getUserCart", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить корзину");
    }

    const cart = await response.json();

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      showNotification("Корзина пуста", "error");
      return;
    }

    const totalAmount = cart.cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

    const profileResponse = await fetch("/profile/getAllProfileInfo", {
      method: "GET",
      credentials: "include"
    });

    if (!profileResponse.ok) {
      throw new Error("Не удалось получить информацию о профиле");
    }

    const profile = await profileResponse.json();

    if (profile.wallet < totalAmount) {
      showNotification("Недостаточно средств на балансе", "error");
      return;
    }

    const shippingAddress = profile.deliveryAddress || '';

    const allItems = cart.cartItems.map(item => ({
      book: {
        id: item.book.id,
        title: item.book.title,
        authorName: item.book.authorName,
        price: item.book.price,
        coverImageUrl: item.book.coverImageUrl
      },
      quantity: item.quantity,
      unitPrice: item.book.price,
      subtotal: item.book.price * item.quantity
    }));

    const orderData = {
      shippingAddress: shippingAddress,
      totalAmount: totalAmount,
      paymentMethod: "PURSE",
      allItems: allItems
    };

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

    await createUserActivity('BOOK_PURCHASED', `Оформлен заказ на сумму ${totalAmount} BYN`);

    if (cartId) {
      try {
        await deleteCart(cartId);
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

    await createUserActivity('PROFILE_UPDATED', 'Профиль пользователя обновлен');
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
        </div>
      </div>
    </div>
  `).join('');

  ordersContainer.innerHTML = ordersHTML;
}

async function loadOrderHistory() {
  try {
    await loadReviews();

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

function renderOrderHistory(history) {
  const historyContainer = document.querySelector('.history-list');

  if (!history || history.length === 0) {
    historyContainer.innerHTML = '<p class="no-items">История заказов пуста</p>';
    return;
  }

  const historyHTML = history.map(order => {
    return order.orderItems.map(orderItem => {
      // Исправляем проверку отзывов для новой структуры
      const hasReview = userReviews.some(review =>
          review.book && review.book.id === orderItem.book.id
      );

      return `
      <div class="history-item" data-category="all">
        <div class="history-image">
          ${orderItem.book && orderItem.book.coverImageUrl ?
          `<img src="${orderItem.book.coverImageUrl}" alt="${orderItem.book.title}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">` :
          `<i class="fas fa-book"></i>`
      }
        </div>
        <div class="history-info">
          <h4 class="history-name">${orderItem.book ? orderItem.book.title : 'Название книги'}</h4>
          <p class="history-description">${orderItem.book ? (orderItem.book.authorName || 'Автор неизвестен') : 'Автор неизвестен'}</p>
          <span class="history-date">${formatDate(order.orderDate)}</span>
          <div class="order-number">Заказ #${order.id}</div>
          <div class="item-quantity">Количество: ${orderItem.quantity || 1}</div>
        </div>
        <div class="history-price">${formatPrice(orderItem.unitPrice || 0)} BYN</div>
        <div class="history-status-container" style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
          <div class="history-status status-${getOrderStatusClass(order.status)}">
            <i class="${getOrderStatusIcon(order.status)}"></i>
            ${getOrderStatusText(order.status)}
          </div>
          ${order.status === 'DELIVERED' && !hasReview ? `
            <button class="btn-review" onclick="showReviewModal(${orderItem.book.id}, '${orderItem.book.title}')" style="padding: 5px 10px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap;">
              Оставить отзыв
            </button>
          ` : ''}
        </div>
      </div>
    `}).join('');
  }).join('');

  historyContainer.innerHTML = historyHTML;
}

async function viewOrderDetails(orderId) {
  try {
    const response = await fetch(`/api/orders/getOrderDetails/${orderId}`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить детали заказа");
    }

    const order = await response.json();
    showOrderDetailsModal(order);

  } catch (error) {
    console.error("Ошибка при получении деталей заказа:", error);
    showNotification("Не удалось загрузить детали заказа", "error");
  }
}

function showOrderDetailsModal(order) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;

  const orderDate = formatDate(order.orderDate);
  const paymentMethod = getPaymentMethodText(order.paymentMethod);

  modalContent.innerHTML = `
    <div class="order-details-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
      <h2 style="margin: 0; color: #333;">Детали заказа #${order.id}</h2>
      <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
    </div>

    <div class="order-info" style="margin-bottom: 25px;">
      <div class="info-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-weight: bold; color: #555;">Дата заказа:</span>
        <span style="color: #333;">${orderDate}</span>
      </div>
      <div class="info-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-weight: bold; color: #555;">Статус:</span>
        <span class="status-${getOrderStatusClass(order.status)}" style="padding: 4px 12px; border-radius: 20px; font-size: 14px;">
          <i class="${getOrderStatusIcon(order.status)}"></i>
          ${getOrderStatusText(order.status)}
        </span>
      </div>
      <div class="info-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-weight: bold; color: #555;">Способ оплаты:</span>
        <span style="color: #333;">${paymentMethod}</span>
      </div>
      ${order.trackingNumber ? `
        <div class="info-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-weight: bold; color: #555;">Трек номер:</span>
          <span style="color: #333; font-family: monospace;">${order.trackingNumber}</span>
        </div>
      ` : ''}
    </div>

    <div class="shipping-address" style="margin-bottom: 25px;">
      <h3 style="margin-bottom: 10px; color: #333;">Адрес доставки</h3>
      <p style="color: #666; margin: 0; padding: 10px; background: #f9f9f9; border-radius: 6px;">
        ${order.shippingAddress || 'Адрес не указан'}
      </p>
    </div>

    <div class="order-items" style="margin-bottom: 25px;">
      <h3 style="margin-bottom: 15px; color: #333;">Товары в заказе</h3>
      <div class="items-list">
        ${order.orderItems ? order.orderItems.map(item => {
    const hasReview = userReviews.some(review => review.book && review.book.id === item.book.id);
    return `
          <div class="order-item-detail" style="display: flex; align-items: center; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
            <div class="item-image" style="margin-right: 15px;">
              ${item.book && item.book.coverImageUrl ?
        `<img src="${item.book.coverImageUrl}" alt="${item.book.title}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">`
        :
        `<i class="fas fa-book" style="font-size: 24px; color: #ccc;"></i>`
    }
            </div>
            <div class="item-info" style="flex: 1;">
              <h4 style="margin: 0 0 5px 0; color: #333;">${item.book ? item.book.title : 'Название книги'}</h4>
              <p style="margin: 0 0 5px 0; color: #666;">${item.book ? (item.book.authorName || 'Автор неизвестен') : 'Автор неизвестен'}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #888;">Количество: ${item.quantity || 1}</span>
                <span style="font-weight: bold; color: #333;">${formatPrice(item.unitPrice || 0)} BYN × ${item.quantity || 1}</span>
              </div>
              ${order.status === 'DELIVERED' ? `
                <div style="margin-top: 10px;">
                  ${!hasReview ? `
                    <button class="btn-review" onclick="showReviewModal(${item.book.id}, '${item.book.title}')" style="padding: 5px 10px; background: #2c5530; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                      Оставить отзыв
                    </button>
                  ` : `
                    <span style="color: #666; font-size: 12px;">Отзыв оставлен</span>
                  `}
                </div>
              ` : ''}
            </div>
            <div class="item-subtotal" style="margin-left: 15px; text-align: right;">
              <strong style="color: #2c5530; font-size: 16px;">${formatPrice((item.unitPrice || 0) * (item.quantity || 1))} BYN</strong>
            </div>
          </div>
        `}).join('') : '<p>Товары не найдены</p>'}
      </div>
    </div>

    <div class="order-total-details" style="border-top: 2px solid #e0e0e0; padding-top: 15px;">
      <div class="total-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-weight: bold; color: #555;">Стоимость товаров:</span>
        <span style="color: #333;">${formatPrice(order.totalAmount)} BYN</span>
      </div>
      <div class="total-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-weight: bold; color: #555;">Доставка:</span>
        <span style="color: #2c5530;">Бесплатно</span>
      </div>
      <div class="total-row" style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; padding-top: 10px; border-top: 1px solid #e0e0e0;">
        <span style="color: #333;">Итого:</span>
        <span style="color: #2c5530;">${formatPrice(order.totalAmount)} BYN</span>
      </div>
    </div>

    <div class="modal-actions" style="margin-top: 25px; text-align: right;">
      <button class="btn btn-primary" onclick="this.closest('.modal').remove()" style="padding: 10px 20px; background: #2c5530; color: white; border: none; border-radius: 6px; cursor: pointer;">
        Закрыть
      </button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  const closeBtn = modalContent.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  const closeModal = () => modal.remove();
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function showReviewModal(bookId, bookTitle) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
  `;

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;

  modalContent.innerHTML = `
    <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
      <h2 style="margin: 0; color: #333;">Оставить отзыв</h2>
      <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
    </div>

    <div class="book-info" style="margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #333;">${bookTitle}</h3>
    </div>

    <div class="review-form">
      <div class="rating-section" style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 10px; font-weight: bold; color: #555;">Оценка:</label>
        <div class="star-rating" style="display: flex; gap: 5px;">
          ${[1, 2, 3, 4, 5].map(star => `
            <button type="button" class="star-btn" data-rating="${star}" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #ddd;">
              <i class="far fa-star"></i>
            </button>
          `).join('')}
        </div>
        <input type="hidden" id="reviewRating" value="0">
      </div>

      <div class="comment-section" style="margin-bottom: 20px;">
        <label for="reviewComment" style="display: block; margin-bottom: 10px; font-weight: bold; color: #555;">Комментарий:</label>
        <textarea id="reviewComment" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical;" placeholder="Напишите ваш отзыв..."></textarea>
      </div>

      <div class="form-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
        <button type="button" class="btn btn-secondary" onclick="closeReviewModal()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Отмена
        </button>
        <button type="button" class="btn btn-primary" onclick="submitReview(${bookId})" style="padding: 10px 20px; background: #2c5530; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Отправить отзыв
        </button>
      </div>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  window.currentReviewModal = modal;

  const closeBtn = modalContent.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    closeReviewModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeReviewModal();
    }
  });

  const starButtons = modalContent.querySelectorAll('.star-btn');
  let selectedRating = 0;

  starButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      selectedRating = index + 1;
      starButtons.forEach((btn, i) => {
        const icon = btn.querySelector('i');
        if (i < selectedRating) {
          icon.className = 'fas fa-star';
          btn.style.color = '#ffc107';
        } else {
          icon.className = 'far fa-star';
          btn.style.color = '#ddd';
        }
      });
      document.getElementById('reviewRating').value = selectedRating;
    });
  });

  const closeModal = () => closeReviewModal();
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function closeReviewModal() {
  if (window.currentReviewModal) {
    window.currentReviewModal.remove();
    window.currentReviewModal = null;
  }
}

async function loadReviews() {
  try {
    const profileResponse = await fetch("/profile/getAllProfileInfo", {
      method: "GET",
      credentials: "include"
    });

    if (!profileResponse.ok) {
      throw new Error("Не удалось получить информацию о профиле");
    }

    const profile = await profileResponse.json();

    const response = await fetch(`/api/reviews/getMyReviews/${profile.id}`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось получить отзывы");
    }

    const reviews = await response.json();
    console.log("Полученные отзывы:", reviews);
    userReviews = reviews;
    renderReviews(reviews);

  } catch (error) {
    console.error("Ошибка при загрузке отзывов:", error);
    const reviewsContainer = document.querySelector('.reviews-container');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = '<p class="no-items">Не удалось загрузить отзывы</p>';
    }
  }
}

function canAddReview(bookId) {
  return !userReviews.some(review => review.book && review.book.id === bookId);
}

async function submitReview(bookId) {
  const rating = parseInt(document.getElementById('reviewRating').value);
  const comment = document.getElementById('reviewComment').value.trim();

  if (rating === 0) {
    showNotification("Пожалуйста, выберите оценку", "error");
    return;
  }

  if (!comment) {
    showNotification("Пожалуйста, напишите комментарий", "error");
    return;
  }

  try {
    const profileResponse = await fetch("/profile/getAllProfileInfo", {
      method: "GET",
      credentials: "include"
    });

    if (!profileResponse.ok) {
      throw new Error("Не удалось получить информацию о профиле");
    }

    const profile = await profileResponse.json();

    const reviewData = {
      userId: profile.id,
      bookId: bookId,
      rating: rating,
      comment: comment,
      reviewDate: new Date().toISOString(),
      isApproved: true
    };

    const response = await fetch("/api/reviews/createReview", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Не удалось добавить отзыв: ${errorText}`);
    }

    const result = await response.json();
    showNotification("Отзыв успешно добавлен!", "success");

    await createUserActivity('REVIEW_ADDED', `Оставлен отзыв на книгу`);
    closeReviewModal();
    await loadReviews();

    return result;

  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error);
    showNotification("Ошибка при добавлении отзыва: " + error.message, "error");
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
    return;
  }

  try {
    const response = await fetch(`/api/reviews/deleteReview/${reviewId}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Не удалось удалить отзыв");
    }

    showNotification("Отзыв успешно удален", "success");
    await loadReviews();

  } catch (error) {
    console.error("Ошибка при удалении отзыва:", error);
    showNotification("Ошибка при удалении отзыва", "error");
  }
}

function renderReviews(reviews) {
  const reviewsContainer = document.querySelector('.reviews-container');
  if (!reviewsContainer) {
    console.error('Контейнер для отзывов не найден');
    return;
  }

  console.log("Рендеринг отзывов:", reviews); // Для отладки

  if (!reviews || reviews.length === 0) {
    reviewsContainer.innerHTML = '<p class="no-items">Вы еще не оставляли отзывов</p>';
    return;
  }

  const reviewsHTML = reviews.map(review => {
    console.log("Обработка отзыва:", review); // Для отладки

    const bookTitle = review.book ? review.book.title : 'Название книги';
    const authorName = review.book ? review.book.authorName : 'Автор неизвестен';
    const rating = review.rating || 0;
    const comment = review.comment || 'Без комментария';
    const reviewDate = review.reviewDate || new Date();
    const reviewId = review.id;

    return `
        <div class="review-item" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 15px; background: #f9f9f9;">
            <div class="review-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div class="book-info">
                    <h4 style="margin: 0 0 5px 0; color: #333;">${bookTitle}</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">${authorName}</p>
                </div>
                <div class="review-rating">
                    ${renderStars(rating)}
                </div>
            </div>
            <div class="review-comment">
                <p style="margin: 0; color: #444; line-height: 1.5;">${comment}</p>
            </div>
            <div class="review-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                <span class="review-date" style="color: #888; font-size: 12px;">
                    ${formatDate(reviewDate)}
                </span>
                <button class="btn-delete-review" onclick="deleteReview(${reviewId})" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Удалить
                </button>
            </div>
        </div>
        `;
  }).join('');

  reviewsContainer.innerHTML = reviewsHTML;
}
function renderStars(rating) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += '<i class="fas fa-star" style="color: #ffc107;"></i>';
    } else {
      starsHTML += '<i class="far fa-star" style="color: #ddd;"></i>';
    }
  }
  return starsHTML;
}

function getPaymentMethodText(paymentMethod) {
  const paymentMap = {
    'PURSE': 'Электронный кошелек',
    'DEBIT_CARD': 'Банковская карта',
    'CREDIT_CARD': 'Кредитная карта',
    'ELECTRONICS_PURCHASE': 'Электронный платеж'
  };
  return paymentMap[paymentMethod] || 'Неизвестно';
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
      await toggleUserMenu();
      await loadActiveOrders();

    } catch (error) {
      console.error("Ошибка при отмене заказа:", error);
      showNotification("Ошибка при отмене заказа", "error");
    }
  }
}

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
      } else if (targetSection === 'reviews') {
        loadReviews();
      }
    });
  });

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

    await createUserActivity('BALANCE_TOP_UP', `Пополнен баланс на ${amount} BYN`);
    await toggleUserMenu();

    return result;

  } catch (error) {
    console.error("Ошибка при пополнении баланса:", error);
    showNotification("Ошибка при пополнении баланса: " + error.message, "error");
    throw error;
  }
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

async function createUserActivity(activityType, activityDescription) {
  try {
    const profileResponse = await fetch("/profile/getAllProfileInfo", {
      method: "GET",
      credentials: "include"
    });

    if (!profileResponse.ok) {
      throw new Error("Не удалось получить информацию о профиле");
    }

    const profile = await profileResponse.json();

    const activityData = {
      userId: profile.id,
      activityType: activityType,
      activityDescription: activityDescription
    };

    const response = await fetch("/profile/createNewActivity", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(activityData)
    });

    if (!response.ok) {
      throw new Error("Не удалось создать активность");
    }

    const result = await response.json();
    await toggleUserMenu();

    return result;

  } catch (error) {
    console.error("Ошибка при создании активности:", error);
  }
}