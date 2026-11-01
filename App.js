// VELVET — рабочая основа приложения

const $ = (selector) => document.querySelector(selector);

const pages = document.querySelectorAll(".page");

// Названия разделов
const pageTitles = {
  home: "Главная",
  catalog: "Каталог",
  updates: "Обновления",
  community: "Сообщество",
  activity: "Моя библиотека",
  studio: "Авторская студия",
  pro: "VELVET PRO",
  profile: "Профиль"
};

// Переключение страниц
function openPage(id) {
  const page = document.getElementById(id);
  if (!page) return;

  pages.forEach(item => {
    item.classList.toggle("active", item.id === id);
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === id
    );
  });

  const heading = $("#page-name");
  if (heading) heading.textContent = pageTitles[id] || id;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Все кнопки переходов
document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    openPage(button.dataset.page);
  });
});

// Убираем демонстрационные истории из HTML
const featured = $("#featured-stories");
const catalog = $("#catalog-grid");

function showEmptyStories(container) {
  if (!container) return;

  container.replaceChildren();

  const message = document.createElement("div");
  message.className = "empty-state";

  const symbol = document.createElement("div");
  symbol.className = "empty-symbol";
  symbol.textContent = "V";

  const title = document.createElement("h2");
  title.textContent = "Пока нет опубликованных историй";

  const description = document.createElement("p");
  description.textContent =
    "Здесь появятся настоящие истории авторов после публикации.";

  message.append(symbol, title, description);
  container.appendChild(message);
}

showEmptyStories(featured);
showEmptyStories(catalog);

// Поиск пока показывает честное пустое состояние
const search = $("#story-search");
const genre = $("#genre-filter");
const age = $("#age-filter");

function filterCatalog() {
  const query = search?.value.trim();

  if (!catalog) return;

  if (query) {
    showEmptyStories(catalog);
    const paragraph = catalog.querySelector("p");
    if (paragraph) {
      paragraph.textContent =
        "Историй пока нет. Поиск заработает, когда авторы опубликуют проекты.";
    }
  } else {
    showEmptyStories(catalog);
  }
}

search?.addEventListener("input", filterCatalog);
genre?.addEventListener("change", filterCatalog);
age?.addEventListener("change", filterCatalog);

// Обновления
const updateData = {
  app: [],
  news: [],
  stories: []
};

function renderUpdates(type = "app") {
  const container = $("#updates-list");
  if (!container) return;

  container.replaceChildren();

  const items = updateData[type] || [];

  if (items.length === 0) {
    const message = document.createElement("div");
    message.className = "empty-state";

    const title = document.createElement("h2");
    title.textContent = "Пока нет обновлений";

    const description = document.createElement("p");
    description.textContent =
      "Новые публикации появятся здесь после подключения панели управления.";

    message.append(title, description);
    container.appendChild(message);
    return;
  }

  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "update-card";

    const heading = document.createElement("h3");
    heading.textContent = item.title;

    const body = document.createElement("p");
    body.textContent = item.body;

    card.append(heading, body);
    container.appendChild(card);
  });
}

document.querySelectorAll(".update-tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".update-tab").forEach(tab => {
      tab.classList.remove("active");
    });

    button.classList.add("active");
    renderUpdates(button.dataset.update);
  });
});

// Черновики автора на этом устройстве
const STORAGE_KEY = "velvet_projects";

function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
  const container = $("#my-projects");
  if (!container) return;

  container.replaceChildren();

  const projects = getProjects();

  if (!projects.length) {
    container.textContent = "У тебя пока нет черновиков.";
    return;
  }

  projects.forEach(project => {
    const item = document.createElement("div");
    item.className = "project-item";

    const name = document.createElement("strong");
    name.textContent = project.title;

    const status = document.createElement("p");
    status.textContent = "Черновик · сохранён на этом устройстве";

    item.append(name, status);
    container.appendChild(item);
  });
}

// Создание проекта
$("#create-project")?.addEventListener("click", () => {
  const title = prompt("Введи название своей истории:");

  if (!title || !title.trim()) return;

  const projects = getProjects();

  projects.push({
    id: crypto.randomUUID(),
    title: title.trim(),
    createdAt: new Date().toISOString()
  });

  saveProjects(projects);
  renderProjects();

  alert("Черновик создан!");
});

// Запуск
renderUpdates("app");
renderProjects();

console.log("VELVET запущен.");
