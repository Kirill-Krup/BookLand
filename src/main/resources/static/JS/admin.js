const usersAPI = {
  async getAllUsers() {
    const response = await fetch('/users/allUsers', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async deleteUser(id) {
    const response = await fetch(`/users/deleteUser/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  },

  async toggleUserMenu(){
    try{
      const response = await fetch("/profile/getProfile",{
        method: "GET",
        credentials: "include"
      });

      if(!response.ok){
        throw new Error("Не удалось получить информацию о профиле")
      }
      const profile = await response.json();
      document.getElementById("email").textContent = profile.email;
      document.getElementById("avatar").src = profile.avatar;
      document.getElementById("login").textContent = profile.login;
    }catch(err){
      document.getElementById('guestMenu').style.display = "flex";
      document.getElementById('userProfile').style.display = "none";
    }
  }
};

const booksAPI = {
  async getAllBooks() {
    const response = await fetch('/books/getAllBooks', {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async addBook(bookData) {
    const response = await fetch('/books/createBook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async updateBook(id, bookData) {
    const response = await fetch(`/books/updateBook/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
  },

  async deleteBook(id) {
    const response = await fetch(`/books/deleteBook/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  }
};

const genresAPI = {
  async getAllGenres() {
    const response = await fetch('/genres/getAllGenres', {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async addGenre(genreData) {
    const response = await fetch('/genres/createGenre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(genreData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async deleteGenre(id) {
    const response = await fetch(`/genres/deleteGenre/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  }
};

const authorsAPI = {
  async getAllAuthors() {
    const response = await fetch('/authors/getAllAuthors', {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async addAuthor(authorData) {
    const response = await fetch('/authors/createAuthor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async deleteAuthor(id) {
    const response = await fetch(`/authors/deleteAuthor/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  }
};

let sampleUsers = [];
let sampleBooks = [];
let sampleGenres = [];
let sampleAuthors = [];
let currentUser = null;
let currentBook = null;

// Функции загрузки данных
async function loadUsersFromServer() {
  try {
    showLoading('users-table');
    const users = await usersAPI.getAllUsers();
    sampleUsers = users;
    populateUsersTable();
    updateStats();
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    showError('Ошибка при загрузке пользователей');
    populateUsersTable();
  }
}

async function loadBooksFromServer() {
  try {
    showLoading('books-table');
    const books = await booksAPI.getAllBooks();
    sampleBooks = books;
    document.getElementById("total-books").textContent = books.length;
    populateBooksTable();
  } catch (error) {
    console.error('Ошибка загрузки книг:', error);
    showError('Ошибка при загрузке книг');
    populateBooksTable();
  }
}

async function loadGenresFromServer() {
  try {
    const genres = await genresAPI.getAllGenres();
    sampleGenres = genres;
    return genres;
  } catch (error) {
    console.error('Ошибка загрузки жанров:', error);
    showError('Ошибка при загрузке жанров');
    throw error;
  }
}

async function loadAuthorsFromServer() {
  try {
    const authors = await authorsAPI.getAllAuthors();
    sampleAuthors = authors;
    return authors;
  } catch (error) {
    console.error('Ошибка загрузки авторов:', error);
    showError('Ошибка при загрузке авторов');
    throw error;
  }
}

// Вспомогательные функции
function updateStats() {
  const totalUsers = sampleUsers.length;
  const blockedUsers = sampleUsers.filter(user => isUserBlocked(user)).length;
  const activeUsers = totalUsers - blockedUsers;
  document.getElementById('total-users').textContent = totalUsers;
}

function showLoading(tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = `
    <tr>
      <td colspan="8" style="text-align: center; padding: 2rem;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Загрузка данных...</span>
        </div>
      </td>
    </tr>
  `;
}

function showError(message) {
  alert(message);
}

function showSuccess(message) {
  alert(message);
}

function formatDate(dateString) {
  if (!dateString) return 'Не указана';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  } catch (error) {
    return 'Неверный формат даты';
  }
}

function formatWallet(wallet) {
  if (wallet === null || wallet === undefined) return '0.00';
  return parseFloat(wallet).toFixed(2);
}

function isUserBlocked(user) {
  const blockedStatus = user.blocked;
  return blockedStatus === 1 ||
      blockedStatus === "1" ||
      blockedStatus === true ||
      blockedStatus === "true" ||
      blockedStatus === "blocked";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  currentUser = null;
  currentBook = null;
}

// Функции для работы с пользователями
function openUserProfile(user) {
  currentUser = user;

  document.getElementById('profile-id').textContent = `#${user.id}`;
  document.getElementById('profile-fullname').textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById('profile-login').textContent = `@${user.login}`;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-phone').textContent = user.phone || 'Не указан';
  document.getElementById('profile-registration-date').textContent = formatDate(user.registrationDate);
  document.getElementById('profile-wallet').textContent = `${formatWallet(user.wallet)} руб.`;
  document.getElementById('profile-address').textContent = user.deliveryAddress || 'Не указан';

  const isBlocked = isUserBlocked(user);
  document.getElementById('profile-status').textContent = isBlocked ? "Заблокирован" : "Активен";
  document.getElementById('profile-status').className = isBlocked ? "status blocked" : "status active";

  const toggleBlockBtn = document.getElementById('toggle-block-btn');
  if (isBlocked) {
    toggleBlockBtn.innerHTML = '<i class="fas fa-unlock"></i> Разблокировать';
    toggleBlockBtn.className = 'btn btn-success';
  } else {
    toggleBlockBtn.innerHTML = '<i class="fas fa-lock"></i> Заблокировать';
    toggleBlockBtn.className = 'btn btn-warning';
  }

  const avatar = document.getElementById('profile-avatar');
  if (user.photoPath) {
    avatar.src = user.photoPath;
    avatar.alt = `${user.firstName} ${user.lastName}`;
  } else {
    avatar.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%234a6fa5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E" +
        (user.firstName ? user.firstName.charAt(0) : '') + (user.lastName ? user.lastName.charAt(0) : '') + "%3C/text%3E%3C/svg%3E";
  }

  document.getElementById('user-profile-modal').style.display = 'flex';
}

async function toggleUserBlock(userId) {
  try {
    const user = sampleUsers.find(u => u.id === userId);
    const isCurrentlyBlocked = isUserBlocked(user);

    let updatedUser;
    if (isCurrentlyBlocked) {
      const response = await fetch(`/users/unBlockUser/${userId}`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      updatedUser = await response.json();
    } else {
      const response = await fetch(`/users/blockUser/${userId}`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      updatedUser = await response.json();
    }

    const userIndex = sampleUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      sampleUsers[userIndex] = updatedUser;
    }

    populateUsersTable();
    updateStats();

    if (currentUser && currentUser.id === userId) {
      openUserProfile(sampleUsers[userIndex]);
    }

    showSuccess(`Пользователь #USR-${userId} ${isCurrentlyBlocked ? 'разблокирован' : 'заблокирован'}`);

  } catch (error) {
    console.error('Ошибка блокировки пользователя:', error);
    showError('Ошибка при изменении статуса пользователя');
  }
}

async function deleteUser(userId) {
  try {
    await usersAPI.deleteUser(userId);
    sampleUsers = sampleUsers.filter(u => u.id !== userId);
    populateUsersTable();
    updateStats();

    if (currentUser && currentUser.id === userId) {
      closeModal('user-profile-modal');
    }

    showSuccess(`Пользователь #USR-${userId} удален`);

  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    showError('Ошибка при удалении пользователя');
  }
}

function populateUsersTable() {
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';

  if (sampleUsers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem;">
          <div style="color: var(--gray);">
            <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <div>Пользователи не найдены</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  sampleUsers.forEach(user => {
    const tr = document.createElement('tr');
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const registrationDate = formatDate(user.registrationDate);
    const isBlocked = isUserBlocked(user);

    tr.innerHTML = `
      <td>${user.id}</td>
      <td>
        <div class="user-info">
          <img src="${user.photoPath || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234a6fa5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3E${user.firstName ? user.firstName.charAt(0) : ''}${user.lastName ? user.lastName.charAt(0) : ''}%3C/text%3E%3C/svg%3E`}" 
               alt="${fullName}" class="user-avatar">
          <div>
            <div>${fullName || 'Не указано'}</div>
            <div style="font-size: 0.8rem; color: var(--gray);">${user.phone || 'Телефон не указан'}</div>
          </div>
        </div>
      </td>
      <td>${user.login}</td>
      <td>${user.email}</td>
      <td>${registrationDate}</td>
      <td>${formatWallet(user.wallet)} руб.</td>
      <td>
        <span class="status ${isBlocked ? 'blocked' : 'active'}">
          ${isBlocked ? 'Заблокирован' : 'Активен'}
        </span>
      </td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-primary view-user-btn" data-user-id="${user.id}" title="Просмотреть профиль">
          <i class="fas fa-eye"></i>
          <span class="btn-text">Просмотр</span>
        </button>
        <button class="btn btn-sm ${isBlocked ? 'btn-success' : 'btn-warning'} toggle-block-btn" data-user-id="${user.id}" title="${isBlocked ? 'Разблокировать' : 'Заблокировать'}">
          <i class="fas ${isBlocked ? 'fa-unlock' : 'fa-lock'}"></i>
          <span class="btn-text">${isBlocked ? 'Разблок.' : 'Блок.'}</span>
        </button>
        <button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.id}" title="Удалить пользователя">
          <i class="fas fa-trash"></i>
          <span class="btn-text">Удалить</span>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Обработчики событий для пользователей
  document.querySelectorAll('.view-user-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const userId = parseInt(this.getAttribute('data-user-id'));
      const user = sampleUsers.find(u => u.id === userId);
      if (user) openUserProfile(user);
    });
  });

  document.querySelectorAll('.toggle-block-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const userId = parseInt(this.getAttribute('data-user-id'));
      const user = sampleUsers.find(u => u.id === userId);
      if (user) {
        const isBlocked = isUserBlocked(user);
        if (confirm(`Вы уверены, что хотите ${isBlocked ? 'разблокировать' : 'заблокировать'} пользователя #${userId}?`)) {
          toggleUserBlock(userId);
        }
      }
    });
  });

  document.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const userId = parseInt(this.getAttribute('data-user-id'));
      if (confirm(`Вы уверены, что хотите удалить пользователя #${userId}?`)) {
        deleteUser(userId);
      }
    });
  });
}

// Функции для работы с книгами
async function populateAuthorsDropdown() {
  try {
    const authors = await authorsAPI.getAllAuthors();
    const authorSelect = document.getElementById('book-author');
    authorSelect.innerHTML = '<option value="">Выберите автора</option>';

    authors.forEach(author => {
      const option = document.createElement('option');
      option.value = author.id;
      option.textContent = author.name;
      authorSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Ошибка загрузки авторов для dropdown:', error);
    throw error;
  }
}

async function populateGenresDropdown() {
  try {
    const genres = await genresAPI.getAllGenres();
    const genreSelect = document.getElementById('book-genre');
    genreSelect.innerHTML = '<option value="">Выберите жанр</option>';

    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Ошибка загрузки жанров для dropdown:', error);
    throw error;
  }
}

function openBookModal(book = null) {
  currentBook = book;
  const modal = document.getElementById('book-modal');
  const title = document.getElementById('book-modal-title');
  const form = document.getElementById('book-form');

  // Функция для безопасной установки значения элемента
  function setElementValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.value = value || '';
    } else {
      console.warn(`Элемент с id "${elementId}" не найден`);
    }
  }

  // Функция для безопасной установки текста элемента
  function setElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text || '';
    } else {
      console.warn(`Элемент с id "${elementId}" не найден`);
    }
  }

  Promise.all([
    populateAuthorsDropdown(),
    populateGenresDropdown()
  ]).then(() => {
    if (book) {
      setElementText('book-modal-title', 'Редактировать книгу');

      setElementValue('book-title', book.title);
      setElementValue('book-isbn', book.isbn);
      setElementValue('book-description', book.description);
      setElementValue('book-price', book.price);

      const publishDate = book.publicationDate ? book.publicationDate.split('T')[0] : '';
      setElementValue('book-publish-date', publishDate);

      setElementValue('book-pages', book.pages);
      setElementValue('book-image-url', book.coverImageUrl);
      setElementValue('book-publisher', book.publisherName);
      setElementValue('book-added-by', book.addedBy);

      setTimeout(() => {
        if (book.author && book.author.id) {
          setElementValue('book-author', book.author.id);
        }
        if (book.genre && book.genre.id) {
          setElementValue('book-genre', book.genre.id);
        }
      }, 100);
    } else {
      setElementText('book-modal-title', 'Добавить книгу');
      form.reset();

      const addedByElement = document.getElementById('book-added-by');
      const loginElement = document.getElementById('login');
      if (addedByElement && loginElement) {
        addedByElement.value = loginElement.textContent || 'admin';
      }
    }

    modal.style.display = 'flex';
  }).catch(error => {
    console.error('Ошибка при загрузке данных для модального окна:', error);
    showError('Не удалось загрузить необходимые данные');
  });
}

async function saveBook() {
  try {
    const form = document.getElementById('book-form');
    const formData = new FormData(form);

    const title = formData.get('title');
    const isbn = formData.get('isbn');
    const authorId = formData.get('author');
    const genreId = formData.get('genre');
    const publisher = formData.get("addedBy");

    if (!title || !isbn || !authorId || !genreId) {
      showError('Пожалуйста, заполните все обязательные поля (Название, ISBN, Автор, Жанр)');
      return;
    }

    const bookData = {
      title: title,
      isbn: isbn,
      description: formData.get('description') || '',
      price: parseFloat(formData.get('price')) || 0,
      publicationDate: formData.get('publishDate') || null,
      pages: parseInt(formData.get('pages')) || 0,
      coverImageUrl: formData.get('imageUrl') || '',
      publisherName: publisher,
      authorId: parseInt(authorId),
      genreId: parseInt(genreId)
    };

    console.log('Сохранение книги:', { currentBook, bookData });

    if (currentBook) {
      await booksAPI.updateBook(currentBook.id, bookData);
      showSuccess('Книга успешно обновлена');
    } else {
      await booksAPI.addBook(bookData);
      showSuccess('Книга успешно добавлена');
    }

    await loadBooksFromServer();
    closeModal('book-modal');

  } catch (error) {
    console.error('Ошибка при сохранении книги:', error);
    showError('Ошибка при сохранении книги: ' + (error.message || 'Неизвестная ошибка'));
  }
}

async function deleteBook(bookId) {
  try {
    await booksAPI.deleteBook(bookId);
    sampleBooks = sampleBooks.filter(b => b.id !== bookId);
    populateBooksTable();
    showSuccess('Книга успешно удалена');
  } catch (error) {
    console.error('Ошибка удаления книги:', error);
    showError('Ошибка при удалении книги');
  }
}

function populateBooksTable() {
  const tbody = document.querySelector('#books-table tbody');
  tbody.innerHTML = '';

  if (sampleBooks.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 2rem;">
          <div style="color: var(--gray);">
            <i class="fas fa-book" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <div>Книги не найдены</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  sampleBooks.forEach(book => {
    const tr = document.createElement('tr');
    const publishDate = formatDate(book.publicationDate);

    // Получаем имя автора и жанра из вложенных объектов
    const authorName = book.author?.name || 'Не указан';
    const genreName = book.genre?.name || 'Не указан';

    tr.innerHTML = `
      <td>${book.id}</td>
      <td>
        <div class="book-info">
          <img src="${book.coverImageUrl || 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"%3E%3Crect width=\"40\" height=\"40\" fill=\"%234a6fa5\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"14\" fill=\"white\"%3EНет фото%3C/text%3E%3C/svg%3E'}" 
               alt="${book.title}" class="book-cover">
          <div>
            <div><strong>${book.title}</strong></div>
            <div style="font-size: 0.8rem; color: var(--gray);">ISBN: ${book.isbn}</div>
          </div>
        </div>
      </td>
      <td>${authorName}</td>
      <td>${genreName}</td>
      <td>${book.price ? `${book.price} руб.` : 'Не указана'}</td>
      <td>${publishDate}</td>
      <td>${book.pages || 'Не указано'}</td>
      <td>${book.publisherName || 'Не указан'}</td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-primary edit-book-btn" data-book-id="${book.id}" title="Редактировать книгу">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-book-btn" data-book-id="${book.id}" title="Удалить книгу">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Обработчики событий для книг
  document.querySelectorAll('.edit-book-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const bookId = parseInt(this.getAttribute('data-book-id'));
      const book = sampleBooks.find(b => b.id === bookId);
      if (book) openBookModal(book);
    });
  });

  document.querySelectorAll('.delete-book-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const bookId = parseInt(this.getAttribute('data-book-id'));
      if (confirm(`Вы уверены, что хотите удалить книгу #${bookId}?`)) {
        deleteBook(bookId);
      }
    });
  });
}

// Функции для работы с жанрами
function openGenreModal() {
  const modal = document.getElementById('genre-modal');
  loadGenresFromServer().then(() => {
    populateGenresList();
    modal.style.display = 'flex';
  }).catch(error => {
    console.error('Ошибка открытия модального окна жанров:', error);
  });
}

function populateGenresList() {
  const tbody = document.querySelector('#genres-list tbody');
  tbody.innerHTML = '';

  if (sampleGenres.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; padding: 1rem;">
          <div style="color: var(--gray);">
            <i class="fas fa-tags" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
            <div>Жанры не найдены</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  sampleGenres.forEach(genre => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${genre.name}</td>
      <td>${genre.description || 'Нет описания'}</td>
      <td>
        <button class="btn btn-sm btn-danger delete-genre-btn" data-genre-id="${genre.id}" title="Удалить жанр">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.delete-genre-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const genreId = parseInt(this.getAttribute('data-genre-id'));
      if (confirm(`Вы уверены, что хотите удалить этот жанр?`)) {
        deleteGenre(genreId);
      }
    });
  });
}

async function addGenre() {
  try {
    const name = document.getElementById('genre-name').value;
    const description = document.getElementById('genre-description').value;

    if (!name) {
      showError('Название жанра обязательно');
      return;
    }

    await genresAPI.addGenre({ name, description });
    showSuccess('Жанр успешно добавлен');

    await loadGenresFromServer();
    populateGenresList();
    document.getElementById('genre-name').value = '';
    document.getElementById('genre-description').value = '';

  } catch (error) {
    console.error('Ошибка добавления жанра:', error);
    showError('Ошибка при добавлении жанра');
  }
}

async function deleteGenre(genreId) {
  try {
    await genresAPI.deleteGenre(genreId);
    sampleGenres = sampleGenres.filter(g => g.id !== genreId);
    populateGenresList();
    showSuccess('Жанр успешно удален');
  } catch (error) {
    console.error('Ошибка удаления жанра:', error);
    showError('Ошибка при удалении жанра');
  }
}

// Функции для работы с авторами
function openAuthorModal() {
  const modal = document.getElementById('author-modal');
  loadAuthorsFromServer().then(() => {
    populateAuthorsList();
    modal.style.display = 'flex';
  }).catch(error => {
    console.error('Ошибка открытия модального окна авторов:', error);
  });
}

function populateAuthorsList() {
  const tbody = document.querySelector('#authors-list tbody');
  tbody.innerHTML = '';

  if (sampleAuthors.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; padding: 1rem;">
          <div style="color: var(--gray);">
            <i class="fas fa-user-pen" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
            <div>Авторы не найдены</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  sampleAuthors.forEach(author => {
    const tr = document.createElement('tr');
    const bio = author.biography ?
        (author.biography.length > 100 ? author.biography.substring(0, 100) + '...' : author.biography) :
        'Нет биографии';

    tr.innerHTML = `
      <td>${author.name}</td>
      <td>${bio}</td>
      <td>
        <button class="btn btn-sm btn-danger delete-author-btn" data-author-id="${author.id}" title="Удалить автора">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.delete-author-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const authorId = parseInt(this.getAttribute('data-author-id'));
      if (confirm(`Вы уверены, что хотите удалить этого автора?`)) {
        deleteAuthor(authorId);
      }
    });
  });
}

async function addAuthor() {
  try {
    const name = document.getElementById('author-name').value;
    const biography = document.getElementById('author-biography').value;

    if (!name) {
      showError('Имя автора обязательно');
      return;
    }

    await authorsAPI.addAuthor({ name, biography });
    showSuccess('Автор успешно добавлен');

    await loadAuthorsFromServer();
    populateAuthorsList();
    document.getElementById('author-name').value = '';
    document.getElementById('author-biography').value = '';

  } catch (error) {
    console.error('Ошибка добавления автора:', error);
    showError('Ошибка при добавлении автора');
  }
}

async function deleteAuthor(authorId) {
  try {
    await authorsAPI.deleteAuthor(authorId);
    sampleAuthors = sampleAuthors.filter(a => a.id !== authorId);
    populateAuthorsList();
    showSuccess('Автор успешно удален');
  } catch (error) {
    console.error('Ошибка удаления автора:', error);
    showError('Ошибка при удалении автора');
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  usersAPI.toggleUserMenu();
  loadUsersFromServer();
  loadBooksFromServer();
  loadGenresFromServer();
  loadAuthorsFromServer();
  loadReviewsFromServer();
  loadOrdersFromServer();

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Скрываем все секции
        document.querySelectorAll('.section').forEach(section => {
          section.classList.remove('active');
        });

        navItems.forEach(nav => nav.classList.remove('active'));

        targetSection.classList.add('active');
        this.classList.add('active');

        // Загружаем данные при переключении на соответствующие разделы
        if (targetId === 'users') loadUsersFromServer();
        if (targetId === 'books') loadBooksFromServer();
        if (targetId === 'reviews') loadReviewsFromServer();
        if (targetId === 'orders') loadOrdersFromServer();
      }
    });
  });
});

// Поиск пользователей
document.getElementById('user-search').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#users-table tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

// Кнопки добавления
document.getElementById('add-book-btn').addEventListener('click', function() {
  openBookModal();
});

document.getElementById('add-genre-btn').addEventListener('click', function() {
  openGenreModal();
});

document.getElementById('add-author-btn').addEventListener('click', function() {
  openAuthorModal();
});

// Формы
document.getElementById('book-form').addEventListener('submit', function(e) {
  e.preventDefault();
  saveBook();
});

document.getElementById('genre-form').addEventListener('submit', function(e) {
  e.preventDefault();
  addGenre();
});

document.getElementById('author-form').addEventListener('submit', function(e) {
  e.preventDefault();
  addAuthor();
});

// Кнопки профиля пользователя
document.getElementById('toggle-block-btn').addEventListener('click', function() {
  if (currentUser) {
    const isBlocked = isUserBlocked(currentUser);
    if (confirm(`Вы уверены, что хотите ${isBlocked ? 'разблокировать' : 'заблокировать'} пользователя #USR-${currentUser.id}?`)) {
      toggleUserBlock(currentUser.id);
    }
  }
});

document.getElementById('delete-user-btn').addEventListener('click', function() {
  if (currentUser) {
    if (confirm(`Вы уверены, что хотите удалить пользователя #USR-${currentUser.id}?`)) {
      deleteUser(currentUser.id);
    }
  }
});

// Выход
document.getElementById('logout-btn').addEventListener('click', function() {
  if (confirm('Вы уверены, что хотите выйти из панели администратора?')) {
    fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(response => {
      localStorage.clear();
      window.location.href = '/';
    })
    .catch(error => {
      localStorage.clear();
      window.location.href = '/';
    });
  }
});

// Закрытие модальных окон
document.querySelectorAll('.close').forEach(closeBtn => {
  closeBtn.addEventListener('click', function() {
    const modal = this.closest('.modal');
    if (modal) closeModal(modal.id);
  });
});

window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    closeModal(event.target.id);
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      closeModal(modal.id);
    });
  }
});


// Добавляем API функции для отзывов и заказов
const reviewsAPI = {
  async getAllReviews() {
    const response = await fetch('/api/reviews/getAllReviews', {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async deleteReview(id) {
    const response = await fetch(`/api/reviews/deleteReview/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  }
};

const ordersAPI = {
  async getAllOrders() {
    const response = await fetch('/api/orders/allOrders', {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async updateOrderStatus(orderId, status) {
    const response = await fetch(`/api/orders/updateOrderStatus/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async deleteOrder(orderId) {
    const response = await fetch(`/api/orders/deleteOrder/${orderId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  }
};


let sampleReviews = [];
let sampleOrders = [];

async function loadReviewsFromServer() {
  try {
    showLoading('reviews-table');
    const reviews = await reviewsAPI.getAllReviews();
    document.getElementById("total-reviews").textContent = reviews.length
    sampleReviews = reviews;
    populateReviewsTable();
    updateDashboardStats();
  } catch (error) {
    console.error('Ошибка загрузки отзывов:', error);
    showError('Ошибка при загрузке отзывов');
    populateReviewsTable();
  }
}

async function loadOrdersFromServer() {
  try {
    showLoading('orders-table');
    const orders = await ordersAPI.getAllOrders();
    document.getElementById("total-orders").textContent = orders.length
    sampleOrders = orders;
    populateOrdersTable();
    updateDashboardStats();
    populateRecentOrders();
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error);
    showError('Ошибка при загрузке заказов');
    populateOrdersTable();
  }
}

// Функции для работы с отзывами
function populateReviewsTable() {
  const tbody = document.querySelector('#reviews-table tbody');
  if (!tbody) {
    console.error('Элемент #reviews-table tbody не найден');
    return;
  }

  tbody.innerHTML = '';

  if (sampleReviews.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem;">
          <div style="color: var(--gray);">
            <i class="fas fa-star" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <div>Отзывы не найдены</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  sampleReviews.forEach(review => {
    const tr = document.createElement('tr');
    const userName = review.user ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() : 'Пользователь удален';
    const userLogin = review.user ? `@${review.user.login}` : 'N/A';
    const bookTitle = review.book ? review.book.title : 'Книга удалена';
    const reviewDate = formatDate(review.reviewDate);
    const rating = review.rating || 0;

    tr.innerHTML = `
      <td>${review.id}</td>
      <td>
        <div class="book-info">
          <img src="${review.book?.coverImageUrl || 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"%3E%3Crect width=\"40\" height=\"40\" fill=\"%234a6fa5\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"14\" fill=\"white\"%3EНет фото%3C/text%3E%3C/svg%3E'}" 
               alt="${bookTitle}" class="book-cover">
          <div>
            <div><strong>${bookTitle}</strong></div>
            <div style="font-size: 0.8rem; color: var(--gray);">${review.book?.authorName || 'Автор неизвестен'}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="user-info">
          <img src="${review.user?.photoPath || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234a6fa5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3E${review.user?.firstName ? review.user.firstName.charAt(0) : '?'}${review.user?.lastName ? review.user.lastName.charAt(0) : ''}%3C/text%3E%3C/svg%3E`}" 
               alt="${userName}" class="user-avatar">
          <div>
            <div>${userName}</div>
            <div style="font-size: 0.8rem; color: var(--gray);">${userLogin}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="rating-stars">
          ${renderStars(rating)}
          <span class="rating-number">(${rating})</span>
        </div>
      </td>
      <td>${reviewDate}</td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-primary view-review-btn" data-review-id="${review.id}" title="Просмотреть отзыв">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-review-btn" data-review-id="${review.id}" title="Удалить отзыв">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Обработчики событий для отзывов
  document.querySelectorAll('.view-review-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const reviewId = parseInt(this.getAttribute('data-review-id'));
      const review = sampleReviews.find(r => r.id === reviewId);
      if (review) openReviewModal(review);
    });
  });

  document.querySelectorAll('.delete-review-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const reviewId = parseInt(this.getAttribute('data-review-id'));
      if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        deleteReview(reviewId);
      }
    });
  });
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

function openReviewModal(review) {
  // Создаем модальное окно если его нет
  if (!document.getElementById('review-modal')) {
    const modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h3>Отзыв #${review.id}</h3>
          <span class="close">&times;</span>
        </div>
        <div id="review-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modal = document.getElementById('review-modal');
  const userName = review.user ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() : 'Пользователь удален';
  const userLogin = review.user ? `@${review.user.login}` : 'N/A';
  const userEmail = review.user ? review.user.email : 'N/A';
  const bookTitle = review.book ? review.book.title : 'Книга удалена';
  const authorName = review.book ? review.book.authorName : 'Автор неизвестен';
  const rating = review.rating || 0;
  const reviewDate = formatDateTime(review.reviewDate);

  document.getElementById('review-modal-content').innerHTML = `
    <div class="modal-body">
      <div class="review-details">
        <div class="review-user-info">
          <h4>Информация о пользователе:</h4>
          <div class="user-card">
            <img src="${review.user?.photoPath || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%234a6fa5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${review.user?.firstName ? review.user.firstName.charAt(0) : '?'}${review.user?.lastName ? review.user.lastName.charAt(0) : ''}%3C/text%3E%3C/svg%3E`}" 
                 alt="${userName}" class="user-avatar-large">
            <div class="user-details">
              <div class="user-name">${userName}</div>
              <div class="user-login">${userLogin}</div>
              <div class="user-email">${userEmail}</div>
              <div class="user-registration">Зарегистрирован: ${formatDate(review.user?.registrationDate)}</div>
            </div>
          </div>
        </div>

        <div class="review-book-info">
          <h4>Информация о книге:</h4>
          <div class="book-card">
            <img src="${review.book?.coverImageUrl || 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\"%3E%3Crect width=\"60\" height=\"60\" fill=\"%234a6fa5\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"14\" fill=\"white\"%3EНет фото%3C/text%3E%3C/svg%3E'}" 
                 alt="${bookTitle}" class="book-cover-large">
            <div class="book-details">
              <div class="book-title">${bookTitle}</div>
              <div class="book-author">${authorName}</div>
              <div class="book-price">${review.book?.price ? review.book.price + ' руб.' : 'Цена не указана'}</div>
            </div>
          </div>
        </div>

        <div class="review-content">
          <h4>Содержание отзыва:</h4>
          <div class="rating-section">
            <div class="rating-stars-large">
              ${renderStars(rating)}
              <span class="rating-number">${rating}/5</span>
            </div>
          </div>
          <div class="comment-section">
            <label>Комментарий:</label>
            <div class="comment-text">${review.comment || 'Без комментария'}</div>
          </div>
          <div class="review-meta">
            <div class="review-date">Дата отзыва: ${reviewDate}</div>
            <div class="review-status">
              Статус: 
              <span class="status ${review.isApproved ? 'active' : 'blocked'}">
                ${review.isApproved ? 'Одобрен' : 'На модерации'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="action-buttons">
        <button class="btn btn-danger" id="modal-delete-review">
          <i class="fas fa-trash"></i> Удалить
        </button>
        <button class="btn btn-secondary" id="modal-close-review">Закрыть</button>
      </div>
    </div>
  `;

  // Обработчики событий для модального окна
  document.getElementById('modal-close-review').addEventListener('click', () => {
    closeModal('review-modal');
  });

  document.querySelector('#review-modal .close').addEventListener('click', () => {
    closeModal('review-modal');
  });

  document.getElementById('modal-delete-review').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      deleteReview(review.id);
      closeModal('review-modal');
    }
  });

  modal.style.display = 'flex';
}

async function deleteReview(reviewId) {
  try {
    await reviewsAPI.deleteReview(reviewId);
    sampleReviews = sampleReviews.filter(r => r.id !== reviewId);
    populateReviewsTable();
    updateDashboardStats();
    showSuccess('Отзыв удален');
  } catch (error) {
    console.error('Ошибка удаления отзыва:', error);
    showError('Ошибка при удалении отзыва');
  }
}

// Функции для работы с заказами
function populateOrdersTable() {
  const tbody = document.querySelector('#orders-table tbody');
  if (!tbody) {
    console.error('Элемент #orders-table tbody не найден');
    return;
  }

  tbody.innerHTML = '';

  if (sampleOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem;">
          <div style="color: var(--gray);">
            <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <div>Заказы не найдены</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  sampleOrders.forEach(order => {
    const tr = document.createElement('tr');
    const userName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Пользователь удален';
    const userLogin = order.user ? `@${order.user.login}` : 'N/A';
    const orderDate = formatDate(order.orderDate);
    const totalAmount = order.totalAmount ? `${order.totalAmount.toFixed(2)} руб.` : '0.00 руб.';
    const statusClass = getOrderStatusClass(order.status);
    const statusText = getOrderStatusText(order.status);

    tr.innerHTML = `
      <td>${order.id}</td>
      <td>
        <div class="user-info">
          <img src="${order.user?.photoPath || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234a6fa5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3E${order.user?.firstName ? order.user.firstName.charAt(0) : '?'}${order.user?.lastName ? order.user.lastName.charAt(0) : ''}%3C/text%3E%3C/svg%3E`}" 
               alt="${userName}" class="user-avatar">
          <div>
            <div>${userName}</div>
            <div style="font-size: 0.8rem; color: var(--gray);">${userLogin}</div>
          </div>
        </div>
      </td>
      <td>${orderDate}</td>
      <td>${totalAmount}</td>
      <td>
        <span class="status ${statusClass}">
          ${statusText}
        </span>
      </td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-primary view-order-btn" data-order-id="${order.id}" title="Просмотреть заказ">
          <i class="fas fa-eye"></i>
        </button>
        ${order.status !== 'DELIVERED' ? `
          <button class="btn btn-sm btn-success mark-delivered-btn" data-order-id="${order.id}" title="Отметить как доставленный">
            <i class="fas fa-check"></i>
          </button>
        ` : ''}
        <button class="btn btn-sm btn-danger delete-order-btn" data-order-id="${order.id}" title="Удалить заказ">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.querySelectorAll('.view-order-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = parseInt(this.getAttribute('data-order-id'));
      const order = sampleOrders.find(o => o.id === orderId);
      if (order) openOrderModal(order);
    });
  });

  document.querySelectorAll('.mark-delivered-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = parseInt(this.getAttribute('data-order-id'));
      markOrderAsDelivered(orderId);

    });
  });

  document.querySelectorAll('.delete-order-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = parseInt(this.getAttribute('data-order-id'));
      if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        deleteOrder(orderId);
      }
    });
  });
}

function populateRecentOrders() {
  const tbody = document.querySelector('#recent-orders-table tbody');
  if (!tbody) return;

  const recentOrders = sampleOrders.slice(0, 5); // Последние 5 заказов

  if (recentOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray);">
          <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <div>Заказы не найдены</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = '';
  recentOrders.forEach(order => {
    const tr = document.createElement('tr');
    const userName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Пользователь удален';
    const orderDate = formatDate(order.orderDate);
    const totalAmount = order.totalAmount ? `${order.totalAmount.toFixed(2)} руб.` : '0.00 руб.';
    const statusClass = getOrderStatusClass(order.status);
    const statusText = getOrderStatusText(order.status);

    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${userName}</td>
      <td>${orderDate}</td>
      <td>${totalAmount}</td>
      <td>
        <span class="status ${statusClass}">
          ${statusText}
        </span>
      </td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-primary view-order-btn" data-order-id="${order.id}" title="Просмотреть заказ">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Обработчики для кнопок просмотра в таблице последних заказов
  document.querySelectorAll('#recent-orders-table .view-order-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = parseInt(this.getAttribute('data-order-id'));
      const order = sampleOrders.find(o => o.id === orderId);
      if (order) openOrderModal(order);
    });
  });
}

function getOrderStatusText(status) {
  const statusMap = {
    'PENDING': 'Ожидает',
    'PROCESSING': 'Обрабатывается',
    'SHIPPED': 'Отправлен',
    'DELIVERED': 'Доставлен',
    'CANCELLED': 'Отменен'
  };
  return statusMap[status] || status;
}

function getOrderStatusClass(status) {
  const statusClassMap = {
    'PENDING': 'pending',
    'PROCESSING': 'processing',
    'SHIPPED': 'shipped',
    'DELIVERED': 'active',
    'CANCELLED': 'blocked'
  };
  return statusClassMap[status] || 'processing';
}

function getPaymentMethodText(paymentMethod) {
  const paymentMap = {
    'PURSE': 'Кошелек',
    'DEBIT_CARD': 'Карта',
    'CREDIT_CARD': 'Кредитная карта',
    'ELECTRONICS_PURCHASE': 'Электронный платеж'
  };
  return paymentMap[paymentMethod] || paymentMethod;
}

function openOrderModal(order) {
  // Создаем модальное окно если его нет
  if (!document.getElementById('order-modal')) {
    const modal = document.createElement('div');
    modal.id = 'order-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h3>Заказ #${order.id}</h3>
          <span class="close">&times;</span>
        </div>
        <div id="order-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modal = document.getElementById('order-modal');
  const userName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Пользователь удален';
  const userLogin = order.user ? `@${order.user.login}` : 'N/A';
  const userEmail = order.user ? order.user.email : 'N/A';
  const orderDate = formatDateTime(order.orderDate);
  const totalAmount = order.totalAmount ? `${order.totalAmount.toFixed(2)} руб.` : '0.00 руб.';
  const statusClass = getOrderStatusClass(order.status);
  const statusText = getOrderStatusText(order.status);

  const orderItemsHTML = order.orderItems ? order.orderItems.map(item => `
    <div class="order-item-detail">
      <div class="item-image">
        <img src="${item.book?.coverImageUrl || 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" viewBox=\"0 0 50 50\"%3E%3Crect width=\"50\" height=\"50\" fill=\"%234a6fa5\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"12\" fill=\"white\"%3EНет фото%3C/text%3E%3C/svg%3E'}" 
             alt="${item.book?.title || 'Книга'}" class="book-cover-small">
      </div>
      <div class="item-details">
        <div class="item-title">${item.book?.title || 'Книга удалена'}</div>
        <div class="item-author">${item.book?.authorName || 'Автор неизвестен'}</div>
        <div class="item-quantity">Количество: ${item.quantity || 1}</div>
      </div>
      <div class="item-price">
        ${item.unitPrice ? `${item.unitPrice.toFixed(2)} руб.` : '0.00 руб.'} × ${item.quantity || 1}
      </div>
      <div class="item-subtotal">
        <strong>${((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)} руб.</strong>
      </div>
    </div>
  `).join('') : '<p>Товары не найдены</p>';

  document.getElementById('order-modal-content').innerHTML = `
    <div class="modal-body">
      <div class="order-details">
        <div class="order-user-info">
          <h4>Информация о пользователе:</h4>
          <div class="user-card">
            <img src="${order.user?.photoPath || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%234a6fa5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${order.user?.firstName ? order.user.firstName.charAt(0) : '?'}${order.user?.lastName ? order.user.lastName.charAt(0) : ''}%3C/text%3E%3C/svg%3E`}" 
                 alt="${userName}" class="user-avatar-large">
            <div class="user-details">
              <div class="user-name">${userName}</div>
              <div class="user-login">${userLogin}</div>
              <div class="user-email">${userEmail}</div>
            </div>
          </div>
        </div>

        <div class="order-info-section">
          <div class="info-row">
            <label>Дата заказа:</label>
            <span>${orderDate}</span>
          </div>
          <div class="info-row">
            <label>Статус:</label>
            <span class="status ${statusClass}">${statusText}</span>
          </div>
          <div class="info-row">
            <label>Способ оплаты:</label>
            <span>${getPaymentMethodText(order.paymentMethod)}</span>
          </div>
          <div class="info-row">
            <label>Адрес доставки:</label>
            <span>${order.shippingAddress || 'Не указан'}</span>
          </div>
          ${order.trackingNumber ? `
            <div class="info-row">
              <label>Трек номер:</label>
              <span>${order.trackingNumber}</span>
            </div>
          ` : ''}
        </div>

        <div class="order-items-section">
          <h4>Товары в заказе:</h4>
          <div class="order-items-list">
            ${orderItemsHTML}
          </div>
        </div>

        <div class="order-total-section">
          <div class="total-row">
            <strong>Итого:</strong>
            <strong>${totalAmount}</strong>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="action-buttons">
        ${order.status !== 'DELIVERED' ? `
          <button class="btn btn-success" id="modal-mark-delivered">
            <i class="fas fa-check"></i> Отметить как доставленный
          </button>
        ` : ''}
        <button class="btn btn-danger" id="modal-delete-order">
          <i class="fas fa-trash"></i> Удалить заказ
        </button>
        <button class="btn btn-secondary" id="modal-close-order">Закрыть</button>
      </div>
    </div>
  `;

  // Обработчики событий для модального окна
  document.getElementById('modal-close-order').addEventListener('click', () => {
    closeModal('order-modal');
  });

  document.querySelector('#order-modal .close').addEventListener('click', () => {
    closeModal('order-modal');
  });

  if (document.getElementById('modal-mark-delivered')) {
    document.getElementById('modal-mark-delivered').addEventListener('click', () => {
      if (confirm('Отметить заказ как доставленный?')) {
        markOrderAsDelivered(order.id);
        closeModal('order-modal');
      }
    });
  }

  document.getElementById('modal-delete-order').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      deleteOrder(order.id);
      closeModal('order-modal');
    }
  });

  modal.style.display = 'flex';
}

async function markOrderAsDelivered(orderId) {
  try {
    await ordersAPI.updateOrderStatus(orderId, 'DELIVERED');
    const orderIndex = sampleOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      sampleOrders[orderIndex].status = 'DELIVERED';
    }
    populateOrdersTable();
    populateRecentOrders();
    updateDashboardStats();
    showSuccess('Заказ отмечен как доставленный');
  } catch (error) {
    console.error('Ошибка обновления статуса заказа:', error);
    showError('Ошибка при обновлении статуса заказа');
  }
}

async function deleteOrder(orderId) {
  try {
    await ordersAPI.deleteOrder(orderId);
    sampleOrders = sampleOrders.filter(o => o.id !== orderId);
    populateOrdersTable();
    populateRecentOrders();
    updateDashboardStats();
    showSuccess('Заказ удален');
  } catch (error) {
    console.error('Ошибка удаления заказа:', error);
    showError('Ошибка при удалении заказа');
  }
}

// Обновление статистики на дашборде
function updateDashboardStats() {
  // Обновляем счетчик отзывов
  const totalReviews = sampleReviews.length;
  const reviewsElement = document.getElementById('total-reviews');
  if (reviewsElement) {
    reviewsElement.textContent = totalReviews;
  }

  // Обновляем счетчик заказов (только новые заказы - не доставленные)
  const newOrders = sampleOrders.filter(order =>
      order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
  ).length;
  const ordersElement = document.getElementById('total-orders');
  if (ordersElement) {
    ordersElement.textContent = newOrders;
  }
}

// Вспомогательные функции
function formatDateTime(dateString) {
  if (!dateString) return 'Не указана';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Неверный формат даты';
  }
}

