import axios from 'axios';
const renderTable = (data, target, totalPages, currentPage) => {
  const titleObj = data[0]; // Предполагаем, что первая запись содержит заголовки
  const titles = Object.keys(titleObj);
  const table = document.createElement("table");
  table.classList.add("table");

  // Заголовок таблицы
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  titles.forEach((title) => {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.textContent = title;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  // Контейнер для контента
  const containerContent = document.getElementById("nav-tabContent");
  if (containerContent) {
    const activeTab = containerContent.querySelector(".show");
    if (activeTab) {
      activeTab.classList.remove("active", "show");
    }

    const idContent = target.getAttribute("data-bs-target"); // Получаем id целевого контента
    const tabContent = document.querySelector(idContent);

    if (tabContent) {
      tabContent.textContent = ""; // Очищаем контент
      tabContent.classList.add("show", "active");
      tabContent.appendChild(table);
    } else {
      console.error("Target tab content not found:", idContent);
    }
  } else {
    console.error("Container for tab content not found");
  }

  // Тело таблицы
  const tbody = document.createElement("tbody");
  data.forEach((item) => {
    const tr = document.createElement("tr");
    Object.values(item).forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // Создаем пагинацию
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.innerHTML = ''; // Очищаем старую пагинацию

    // Кнопка "Previous"
    if (currentPage > 1) {
      const prevItem = document.createElement("li");
      prevItem.classList.add("page-item");
      const prevLink = document.createElement("a");
      prevLink.classList.add("page-link");
      prevLink.href = "#";
      prevLink.innerHTML = "Previous";
      prevLink.addEventListener("click", () => changePage(currentPage - 1));
      prevItem.appendChild(prevLink);
      pagination.appendChild(prevItem);
    }

    // Номера страниц (ограниченный диапазон)
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

    // Если оставшиеся страницы меньше maxPagesToShow, сдвигаем диапазон
    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage <= Math.floor(maxPagesToShow / 2)) {
        endPage = Math.min(totalPages, maxPagesToShow);
      } else {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    // Добавляем страницы
    for (let i = startPage; i <= endPage; i++) {
      const pageItem = document.createElement("li");
      pageItem.classList.add("page-item");
      if (i === currentPage) {
        pageItem.classList.add("active");
      }

      const pageLink = document.createElement("a");
      pageLink.classList.add("page-link");
      pageLink.href = "#";
      pageLink.textContent = i;
      pageLink.addEventListener("click", () => changePage(i));
      pageItem.appendChild(pageLink);
      pagination.appendChild(pageItem);
    }

    // Кнопка "Next"
    if (currentPage < totalPages) {
      const nextItem = document.createElement("li");
      nextItem.classList.add("page-item");
      const nextLink = document.createElement("a");
      nextLink.classList.add("page-link");
      nextLink.href = "#";
      nextLink.innerHTML = "Next";
      nextLink.addEventListener("click", () => changePage(currentPage + 1));
      nextItem.appendChild(nextLink);
      pagination.appendChild(nextItem);
    }
  } else {
    console.error("Pagination element not found");
  }
};

const changePage = async (page) => {
  const button = document.querySelector('.nav-link.active');
  const id = button.id.split('-')[1]; // Получаем имя таблицы
  try {
    const response = await axios.get(`/api/${id}?page=${page}`);
    const { data, totalPages, currentPage } = response.data;
    renderTable(data, button, totalPages, currentPage);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default () => {
  const container = document.querySelector('.container');
  const allTabs = container.querySelectorAll('.nav-link');

  allTabs.forEach((tab) => {
    tab.addEventListener('click', async (event) => {
      const target = event.target;
      if (container.querySelector('.active')) {
        const formerActive = container.querySelector('.active');
        formerActive.classList.remove('active');
      }

      target.classList.add('active');

      const id = target.id;
      const split = id.split('-');
      const nameTable = split[1];
      try {
        const response = await axios.get(`/api/${nameTable}?page=1`); // Начальная страница
        const data = await response.data;
        renderTable(data.data, target, data.totalPages, data.currentPage);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  });
};
