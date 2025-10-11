document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('passwordToggle');
  const loginBtn = document.getElementById('loginBtn');
  const successModal = document.getElementById('successModal');

  passwordToggle.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

  emailInput.addEventListener('blur', function() {
    if (!this.value) {
      showError(this, 'Email обязателен');
    } else if (!validateEmail(this.value)) {
      showError(this, 'Введите корректный email');
    } else {
      clearError(this);
    }
  });

  passwordInput.addEventListener('blur', function() {
    if (!this.value) {
      showError(this, 'Пароль обязателен');
    } else if (this.value.length < 6) {
      showError(this, 'Пароль должен содержать минимум 6 символов');
    } else {
      clearError(this);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!emailInput.value || !validateEmail(emailInput.value)) {
      showError(emailInput, "Введите корректный email");
      return;
    }

    if (!passwordInput.value) {
      showError(passwordInput, "Введите корректный пароль");
      return;
    }

    const loginDto = {
      str: emailInput.value,
      password: passwordInput.value
    };

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginDto),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Ошибка авторизации");
      }

      const user = await response.json();
      console.log("Вошёл как:", user);

      window.location.href = "/HTML/home.html";
    } catch (e) {
      console.error(e);
    }
  });


  document.querySelector('.google-btn').addEventListener('click', function() {
    alert('Вход через Google (в разработке)');
  });

  document.querySelector('.vk-btn').addEventListener('click', function() {
    alert('Вход через VK (в разработке)');
  });
});