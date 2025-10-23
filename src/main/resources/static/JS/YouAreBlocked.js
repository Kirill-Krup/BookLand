// Добавляем дополнительные анимации при загрузке
document.addEventListener('DOMContentLoaded', function() {
  const elements = document.querySelectorAll('.message p');
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.2}s`;
    element.classList.add('fadeInUp');
  });

  // Автоматическое обновление статуса каждые 30 секунд
  setInterval(() => {
    checkAccountStatus();
  }, 30000);
});

// Функция для проверки статуса аккаунта
async function checkAccountStatus() {
  try {
    const response = await fetch('/api/account/status', {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'active') {
        window.location.href = '/';
      }
    }
  } catch (error) {
    console.log('Ошибка при проверке статуса:', error);
  }
}

// Добавляем эффект при наведении на иконку замка
const lockIcon = document.querySelector('.lock-icon');
lockIcon.addEventListener('mouseenter', function() {
  this.style.transform = 'scale(1.1)';
});

lockIcon.addEventListener('mouseleave', function() {
  this.style.transform = 'scale(1)';
});