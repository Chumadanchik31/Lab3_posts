// Адрес API для загрузки публикаций.
const GET_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";

// Адрес API для создания публикаций.
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

// Находим элементы страницы.
const loadButton = document.getElementById("loadButton");
const createButton = document.getElementById("createButton");

const postsList = document.getElementById("postsList");
const emptyMessage = document.getElementById("emptyMessage");

const postForm = document.getElementById("postForm");
const postTitleInput = document.getElementById("postTitle");
const postBodyInput = document.getElementById("postBody");

const message = document.getElementById("message");


// Показывает сообщение пользователю.
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}


// Создаёт карточку публикации и добавляет её на страницу.
function addPostToPage(post) {
    const card = document.createElement("article");
    card.className = "post-card";

    const id = document.createElement("span");
    id.className = "post-id";
    id.textContent = `Публикация № ${post.id}`;

    const title = document.createElement("h3");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    card.append(id, title, body);

    postsList.append(card);
}


// Загружает публикации с сервера (GET).
async function loadPosts() {
    loadButton.disabled = true;

    showMessage("Загружаем публикации...", "loading");

    try {
        const response = await fetch(GET_URL);

        // Проверяем успешность HTTP-запроса.
        if (!response.ok) {
            throw new Error(`Ошибка загрузки. Код ответа: ${response.status}`);
        }

        // Преобразуем ответ сервера в JSON.
        const posts = await response.json();

        // Очищаем старый список перед отображением новых записей.
        postsList.textContent = "";

        // Создаём карточки для всех полученных публикаций.
        posts.forEach(post => {
            addPostToPage(post);
        });

        emptyMessage.hidden = posts.length !== 0;

        showMessage(
            `Успешно загружено публикаций: ${posts.length}.`,
            "success"
        );

    } catch (error) {
        showMessage(
            `Не удалось загрузить публикации: ${error.message}. Попробуйте ещё раз.`,
            "error"
        );

    } finally {
        // Возвращаем кнопку в активное состояние.
        loadButton.disabled = false;
    }
}


// Создаёт новую публикацию на сервере (POST).
async function createPost(title, body) {
    createButton.disabled = true;

    showMessage("Отправляем публикацию...", "loading");

    try {
        const response = await fetch(POST_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        // Проверяем успешность HTTP-запроса.
        if (!response.ok) {
            throw new Error(`Ошибка отправки. Код ответа: ${response.status}`);
        }

        // Получаем данные созданной публикации.
        const newPost = await response.json();

        // Выводим новую публикацию на страницу.
        addPostToPage(newPost);

        // Скрываем сообщение о пустом списке.
        emptyMessage.hidden = true;

        // Выводим результат отправки.
        showMessage(
            `Публикация "${newPost.title}" успешно создана. ID: ${newPost.id}.`,
            "success"
        );

        // Очищаем поля формы.
        postForm.reset();

    } catch (error) {
        showMessage(
            `Не удалось создать публикацию: ${error.message}. Попробуйте ещё раз.`,
            "error"
        );

    } finally {
        // Снова активируем кнопку.
        createButton.disabled = false;
    }
}


// Обрабатываем нажатие кнопки загрузки публикаций.
loadButton.addEventListener("click", loadPosts);


// Обрабатываем отправку формы.
postForm.addEventListener("submit", event => {
    // Отменяем стандартную отправку формы.
    event.preventDefault();

    // Получаем значения полей и удаляем пробелы по краям.
    const title = postTitleInput.value.trim();
    const body = postBodyInput.value.trim();

    // Проверяем, что заголовок и текст не пустые.
    if (title === "" || body === "") {
        showMessage(
            "Заполните заголовок и текст публикации.",
            "error"
        );

        return;
    }

    // Если данные корректны, отправляем запрос.
    createPost(title, body);
});


// При открытии страницы список публикаций пока пустой.
emptyMessage.hidden = false;