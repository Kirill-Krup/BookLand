document.addEventListener("DOMContentLoaded", () => {
  toggleUserMenu();
});

// Get all info about user
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
    console.log(profile.activities.length);
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

  document.getElementById('firstName').value = profile.firstName;
  document.getElementById('lastName').value = profile.lastName;
  document.getElementById('email').value = profile.email;
  document.getElementById('phone').value = profile.phone;
  document.getElementById('address').value = profile.deliveryAddress;

  document.getElementById("stat-number-orders").textContent = profile.orders.length;
  document.getElementById("stat-number-days").textContent = calculateDaysSinceRegistration(profile.registrationDate);

  renderActivities(profile.activities);
}

function calculateDaysSinceRegistration(registrationDate) {
  const regDate = new Date(registrationDate);
  const currentDate = new Date();
  const timeDiff = currentDate - regDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}



document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.profile-section');

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));

      this.classList.add('active');

      const targetSection = this.getAttribute('data-section');
      document.getElementById(targetSection).classList.add('active');
    });
  });

  // Modal functionality
  const topupBtn = document.getElementById('topupBtn');
  const modal = document.getElementById('topupModal');
  const modalClose = document.getElementById('modalClose');
  const cancelTopup = document.getElementById('cancelTopup');

  topupBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
  });

  modalClose.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  cancelTopup.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Amount selection
  const amountBtns = document.querySelectorAll('.amount-btn');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      amountBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Cart quantity controls
  const quantityBtns = document.querySelectorAll('.quantity-btn');
  quantityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      const quantitySpan = this.parentElement.querySelector('.quantity-value');
      let quantity = parseInt(quantitySpan.textContent);

      if (action === 'increase') {
        quantity++;
      } else if (action === 'decrease' && quantity > 1) {
        quantity--;
      }

      quantitySpan.textContent = quantity;
    });
  });

  // Remove cart items
  const removeBtns = document.querySelectorAll('.remove-btn');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.cart-item').remove();
    });
  });

  // History filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const historyItems = document.querySelectorAll('.history-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      historyItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});



function renderActivities(activities) {
  const activitiesContainer = document.getElementById('activity-list');
  if (!activities || activities.length === 0) {
    activitiesContainer.innerHTML = '<p class="no-activities">Активности не найдены</p>';
    return;
  }
  const activitiesHTML = activities.map(activity => {
    const iconClass = getActivityIcon(activity.type);
    const title = getActivityTitle(activity.type);

    return `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <h4 class="activity-title">${title}</h4>
                    <p class="activity-description">${activity.description || ''}</p>
                    <span class="activity-time">${activity.timeAgo}</span>
                </div>
            </div>
        `;
  }).join('');

  activitiesContainer.innerHTML = activitiesHTML;
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