import pagination from "./pagination.js";
import axios from "axios";
import { handleDelete,handleUpdate } from "./hendleDeleteUpdate.js";


// Функция для отображения кнопки Create в каждой вкладке
const showCreateButton = (nameTable) => {

    const createButton = document.createElement('button');
    createButton.id = 'createButton';
    createButton.textContent = 'Create';
    createButton.classList.add('btn', 'btn-success'); // Bootstrap стили для кнопки
    createButton.style.marginTop = '10px'; // Отступ сверху
    createButton.style.display = 'block'; // Отображение как блок для выравнивания
    createButton.style.marginBottom = '20px'; // Отступ снизу, чтобы кнопка не прилипала к таблице

    // Добавление обработчика события
    createButton.addEventListener('click', () => {
      window.location.href = `/create.html?table=${nameTable}&id=10`;
      // Здесь можно вставить логику для перехода на страницу создания
    });

    // Добавляем кнопку под контейнер для всех вкладок
    const tabContent = document.querySelector(`#nav-${nameTable}-tab`);
    console.log(tabContent)
    const container = document.querySelector(tabContent.getAttribute('data-bs-target'));
    if (container) {
      const marginDiv = document.createElement('div');
      marginDiv.style.marginBottom = '20px'; // Отступ перед таблицей
      container.insertBefore(createButton, container.firstChild);
      container.insertBefore(marginDiv, createButton);
    }
};


const renderTable = (data, target, totalPages, currentPage, nameTable) => {
  const titleObj = data[0]; // Предполагаем, что первая запись содержит заголовки
  const titles = Object.keys(titleObj);

  const idTable = titles[0]
  const sortedData = data.sort((a, b) => a[idTable] - b[idTable]);
  const table = document.createElement('table');
  table.classList.add('table');

  // Заголовок таблицы
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  titles.forEach((title) => {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.textContent = title;
    tr.appendChild(th);
  });

  // Добавляем столбец для кнопок действий
  const actionTh = document.createElement('th');
  actionTh.setAttribute('scope', 'col');
  actionTh.textContent = 'Actions';
  tr.appendChild(actionTh);

  thead.appendChild(tr);
  table.appendChild(thead);

  // Контейнер для контента
  const containerContent = document.getElementById('nav-tabContent');
  if (containerContent) {
    const activeTab = containerContent.querySelector('.show');
    if (activeTab) {
      activeTab.classList.remove('active', 'show');
    }

    const idContent = target.getAttribute('data-bs-target');
    const tabContent = document.querySelector(idContent);
    if (tabContent) {
      tabContent.textContent = ''; // Очищаем контент
      tabContent.classList.add('show', 'active');
      tabContent.appendChild(table);
    } else {
      console.error(`Element with id ${idContent} not found`);
      return;
    }
  } else {
    console.error('Container for tab content not found');
  }

  // Тело таблицы
  const tbody = document.createElement('tbody');
  sortedData.forEach((item) => {
    const tr = document.createElement('tr');
    Object.values(item).forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    // Создаем ячейку для кнопок действий
    const actionsTd = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'me-2');
    const ID = titles[0];
    deleteButton.addEventListener('click', () => handleDelete(item[ID], nameTable)); // Привязка функции удаления
    actionsTd.appendChild(deleteButton);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.classList.add('btn', 'btn-primary', 'btn-sm');
    updateButton.addEventListener('click', () => handleUpdate(item[ID], nameTable)); // Привязка функции обновления
    actionsTd.appendChild(updateButton);

    tr.appendChild(actionsTd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  pagination(currentPage, totalPages, nameTable);

  // Добавление кнопки Create
  showCreateButton(nameTable);
};

export default renderTable