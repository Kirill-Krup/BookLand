document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registrationForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordToggle = document.getElementById('passwordToggle');
  const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
  const registrationBtn = document.getElementById('registrationBtn');
  const successModal = document.getElementById('successModal');

  // Password toggles
  passwordToggle.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });

  confirmPasswordToggle.addEventListener('click', function() {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });

  // Password strength checker
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    let strength = 0;
    let strengthLabel = '';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
        strengthLabel = 'Слабый';
        strengthFill.style.width = '20%';
        strengthFill.style.background = '#ef4444';
        break;
      case 2:
        strengthLabel = 'Средний';
        strengthFill.style.width = '40%';
        strengthFill.style.background = '#f59e0b';
        break;
      case 3:
        strengthLabel = 'Хороший';
        strengthFill.style.width = '60%';
        strengthFill.style.background = '#3b82f6';
        break;
      case 4:
        strengthLabel = 'Сильный';
        strengthFill.style.width = '80%';
        strengthFill.style.background = '#10b981';
        break;
      case 5:
        strengthLabel = 'Очень сильный';
        strengthFill.style.width = '100%';
        strengthFill.style.background = '#059669';
        break;
    }

    strengthText.textContent = password ? strengthLabel : 'Введите пароль';
  });

  // Form validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
  }

  function showError(input, message) {
    const errorElement = document.getElementById(input.id + 'Error');
    errorElement.textContent = message;
    input.classList.add('error');
  }

  function clearError(input) {
    const errorElement = document.getElementById(input.id + 'Error');
    errorElement.textContent = '';
    input.classList.remove('error');
  }

  // Real-time validation
  const inputs = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];

  inputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    input.addEventListener('blur', function() {
      validateField(this);
    });
  });

  confirmPasswordInput.addEventListener('input', function() {
    if (this.value && passwordInput.value) {
      if (this.value !== passwordInput.value) {
        showError(this, 'Пароли не совпадают');
      } else {
        clearError(this);
      }
    }
  });

  function validateField(input) {
    const value = input.value.trim();

    switch (input.id) {
      case 'firstName':
      case 'lastName':
        if (!value) {
          showError(input, 'Поле обязательно для заполнения');
        } else if (value.length < 2) {
          showError(input, 'Минимум 2 символа');
        } else {
          clearError(input);
        }
        break;

      case 'email':
        if (!value) {
          showError(input, 'Email обязателен');
        } else if (!validateEmail(value)) {
          showError(input, 'Введите корректный email');
        } else {
          clearError(input);
        }
        break;

      case 'phone':
        if (!value) {
          showError(input, 'Телефон обязателен');
        } else if (!validatePhone(value)) {
          showError(input, 'Введите корректный номер телефона');
        } else {
          clearError(input);
        }
        break;

      case 'password':
        if (!value) {
          showError(input, 'Пароль обязателен');
        } else if (value.length < 8) {
          showError(input, 'Пароль должен содержать минимум 8 символов');
        } else {
          clearError(input);
        }
        break;

      case 'confirmPassword':
        if (!value) {
          showError(input, 'Подтвердите пароль');
        } else if (value !== passwordInput.value) {
          showError(input, 'Пароли не совпадают');
        } else {
          clearError(input);
        }
        break;
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let isValid = true;

    inputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      validateField(input);
      if (input.classList.contains('error')) {
        isValid = false;
      }
    });

    if (confirmPasswordInput.value !== passwordInput.value) {
      showError(confirmPasswordInput, 'Пароли не совпадают');
      isValid = false;
    }

    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
      alert('Необходимо согласиться с условиями использования');
      isValid = false;
    }

    if (!isValid) return;

    registrationBtn.querySelector('.btn-text').style.display = 'none';
    registrationBtn.querySelector('.btn-loader').style.display = 'flex';
    registrationBtn.disabled = true;

    const registrationDto = {
      login: document.getElementById('login').value,
      email: document.getElementById('email').value,
      password: passwordInput.value,
      phone: document.getElementById('phone').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      deliveryAddress: document.getElementById('address').value
    };

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(registrationDto)
      });

      if (!response.ok) {
        throw new Error('Ошибка регистрации');
      }

      window.location.href = '/HTML/home.html';
    } catch (err) {
      console.error(err);
      alert('Регистрация не удалась: ' + err.message);
    } finally {
      registrationBtn.querySelector('.btn-text').style.display = 'block';
      registrationBtn.querySelector('.btn-loader').style.display = 'none';
      registrationBtn.disabled = false;
    }
  });


  // Social registration buttons
  document.querySelector('.google-btn').addEventListener('click', function() {
    alert('Регистрация через Google (в разработке)');
  });

  document.querySelector('.vk-btn').addEventListener('click', function() {
    alert('Регистрация через VK (в разработке)');
  });
});