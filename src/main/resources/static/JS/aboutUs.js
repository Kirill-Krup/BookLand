document.addEventListener("DOMContentLoaded", () => {
  toggleUserMenu();
})

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

    // Проверяем существование элементов перед их обновлением
    const userLogin = document.getElementById('userLogin');
    const userBalance = document.getElementById('userBalance');
    const userAvatar = document.getElementById('userAvatar');
    const guestMenu = document.getElementById('guestMenu');
    const userProfile = document.getElementById('userProfile');

    if (userLogin) userLogin.textContent = profile.login;
    if (userBalance) userBalance.textContent = profile.wallet;
    if (userAvatar) userAvatar.src = profile.photoPath;

    if (guestMenu) guestMenu.style.display = "none";
    if (userProfile) userProfile.style.display = "flex";

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
    const guestMenu = document.getElementById('guestMenu');
    const userProfile = document.getElementById('userProfile');

    if (guestMenu) guestMenu.style.display = "flex";
    if (userProfile) userProfile.style.display = "none";

    isLoggedIn = false;

    // Проверяем существование функции updateCartCount
    if (typeof updateCartCount === 'function') {
      updateCartCount(0);
    }

    disableAddToCartButtons();
  }
}

// Добавляем недостающие функции
let isLoggedIn = false;
let currentCartCount = 0;

async function getCartCount() {
  try {
    const response = await fetch("/api/cart/getUserCart", {
      method: "GET",
      credentials: "include"
    });

    if (response.ok) {
      const cartData = await response.json();
      updateCartCountFromResponse(cartData);
    } else {
      if (typeof updateCartCount === 'function') {
        updateCartCount(0);
      }
    }
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    if (typeof updateCartCount === 'function') {
      updateCartCount(0);
    }
  }
}

function updateCartCountFromResponse(cartData) {
  if (cartData && cartData.cartItems) {
    const totalItems = cartData.cartItems.reduce((total, item) => total + item.quantity, 0);
    if (typeof updateCartCount === 'function') {
      updateCartCount(totalItems);
    }
  } else {
    if (typeof updateCartCount === 'function') {
      updateCartCount(0);
    }
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

function checkPendingCartItems() {
  const pendingItem = sessionStorage.getItem('pendingCartItem');
  if (pendingItem && isLoggedIn) {
    // Функция addToCart должна быть определена на странице
    if (typeof addToCart === 'function') {
      addToCart(parseInt(pendingItem));
    }
    sessionStorage.removeItem('pendingCartItem');
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

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  const carouselTrack = document.getElementById('carouselTrack');
  const indicators = document.querySelectorAll('.indicator');
  const carouselItems = document.querySelectorAll('.carousel-item');

  // Проверяем, что элементы найдены
  if (!carouselTrack) {
    console.error('Carousel track not found!');
    return;
  }

  if (indicators.length === 0) {
    console.error('No indicators found!');
    return;
  }

  console.log('Found', indicators.length, 'indicators and', carouselItems.length, 'carousel items');

  let currentSlide = 0;
  const totalSlides = 10; // Количество оригинальных слайдов (без дубликатов)
  let autoSlideInterval;

  // Initialize carousel
  function initCarousel() {
    console.log('Initializing carousel with', indicators.length, 'indicators');
    updateIndicators();
    startAutoSlide();
  }

  // Update indicators
  function updateIndicators() {
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }

  // Go to specific slide
  function goToSlide(slideIndex) {
    console.log('Going to slide:', slideIndex);
    currentSlide = slideIndex;
    const translateX = -currentSlide * 100;
    carouselTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    updateIndicators();
    console.log('Applied transform:', carouselTrack.style.transform);
  }

  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);

    // Reset to beginning when reaching the end
    if (currentSlide === 0) {
      setTimeout(() => {
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = 'translateX(0%)';
        setTimeout(() => {
          carouselTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 50);
      }, 800);
    }
  }

  // Start auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
  }

  // Stop auto slide
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Indicator clicked:', index);
      stopAutoSlide();
      goToSlide(index);
      // Restart auto slide after a delay
      setTimeout(() => {
        startAutoSlide();
      }, 1000);
    });
  });

  // Pause on hover
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Initialize carousel
  initCarousel();

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking on links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu) navMenu.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
    });
  });

  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      isLoggedIn = false;
      // Обновляем отображение меню
      const guestMenu = document.getElementById('guestMenu');
      const userProfile = document.getElementById('userProfile');
      if (guestMenu) guestMenu.style.display = 'flex';
      if (userProfile) userProfile.style.display = 'none';
    });
  }

  // Cart functionality
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', function() {
      window.location.href = 'profile.html';
    });
  }
});

function closeModal() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Animation on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.timeline-item, .value-card, .team-member, .achievement-card');

  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('animate-in');
    }
  });
}

// Initialize animations
window.addEventListener('scroll', animateOnScroll);
animateOnScroll();