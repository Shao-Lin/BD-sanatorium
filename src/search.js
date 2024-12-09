import axios from "axios";
import { handleDelete,handleUpdate } from "./hendleDeleteUpdate.js";
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const nameTable = urlParams.get('table');

  // Контейнер для формы
  const formContainer = document.getElementById('formContainer');
  

  // Функция для создания формы
  const generateUpdateForm = async (record) => {
    const form = document.createElement('form');
    form.id = 'searchForm';

    const idFieldKey = Object.keys(record).find((key) => key.includes('id')); // Ищем поле, содержащее "id"
    // Динамическое создание остальных полей
    const otherFields = Object.keys(record)
      .filter((key) => key !== idFieldKey) // Исключаем ID, так как оно уже добавлено
      .map(
        (key) => {
          if(key === 'booking_status' || key === 'occupancy_status') {
            return `<label for="${key}">${key}</label>
            <div class="form-check">
  <input class="form-check-input" type="radio" name="${key}" id="flexRadioDefault1" value="true">
  <label class="form-check-label" for="flexRadioDefault1">
    true
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="${key}" id="flexRadioDefault2" checked value="false">
  <label class="form-check-label" for="flexRadioDefault2">
    false
  </label>
</div>`
          }
          else if(key.includes('id')) {
            return `<label for="${key}">${key}</label>
            <div class="dropdown-${key}">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="${key}" data-bs-toggle="dropdown" aria-expanded="false">
    Выбрать ID
  </button>
  <ul class="dropdown-menu" aria-labelledby="${key}"></ul>
  <input type="hidden" name="${key}" id="${key}-hidden">
</div>`
          }
          else {
            return `
          <div class="mb-3">
            <label for="${key}" class="form-label">${key}</label>
            <input type="text" class="form-control" id="${key}" name="${key}">
          </div> `
          }
        }
      )
      .join('');

    // Кнопка отправки
    const submitButton = `
      <button type="submit" class="btn btn-primary">Search</button>
    `;

    // Добавляем остальные поля и кнопку в форму
    form.innerHTML += otherFields + submitButton;

    // Очищаем контейнер и вставляем форму
    formContainer.innerHTML = '';
    formContainer.appendChild(form);
    const objTables = {
      procedure_id: 'procedures',
      procedure_room_id: 'procedureRooms',
      staff_id: 'staffs',
      tour_id: 'tours',
      client_id: 'clients',
      room_id: 'rooms'
    }

    const dropDownBtn = document.querySelectorAll('[data-bs-toggle="dropdown"]')
    console.log(dropDownBtn)
    dropDownBtn.forEach((btn) => {
      const idBtn = btn.id   // id кнопки такое же как и название столбца
      const ul = document.querySelector(`[aria-labelledby="${idBtn}"]`)
      btn.addEventListener('click',async (event) => {
        
        if(ul.classList.contains('show')){
          ul.textContent = ''
          ul.classList.remove('show')
          btn.setAttribute('aria-expanded','false')
        } else {
          btn.setAttribute('aria-expanded','true')
        const allTables = await axios.get(`/api/${objTables[idBtn]}`)
        const sortedData = allTables.data.sort((a, b) => a[idBtn] - b[idBtn]);
        console.log(allTables)
        ul.classList.add('show')
        sortedData.forEach((item) => {
          let nameId = ''
          if(item.room_id && item.service_type) {
            nameId = item.room_id
          } else {
            nameId = item[idBtn]
          }
          const li = document.createElement('li')

          li.textContent = nameId
          li.classList.add('dropdown-item')
          ul.appendChild(li)

          li.addEventListener('click',(event) => {
            ul.textContent = ''
            ul.classList.remove('show')
            btn.setAttribute('aria-expanded','false')
            btn.textContent = li.textContent
            const hiddenInput = document.querySelector(`#${idBtn}-hidden`)
            hiddenInput.value = li.textContent
            console.log(hiddenInput)
            })
        })
        } 
    })
    
    })

    // Добавляем обработчик отправки формы
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const filters = {};
      
        // Собираем фильтры
        formData.forEach((value, key) => {
          if (value) filters[key] = value; // Добавляем только заполненные фильтры
        });
      
        try {
          console.log(filters)
          const response = await axios.get(`/api/${nameTable}`, { params: filters });
          console.log('Filtered data:', response.data);
          
          
          renderTableStandalone(response.data,'tableContainer')
          // Здесь обновляем таблицу с данными
        } catch (error) {
          console.error('Error filtering data:', error);
        }
    });
  };

  // Функция для загрузки данных записи
  const loadRecord = async () => {
    console.log('Loading record...');
    try {
      const response = await axios.get(`/api/${nameTable}?page=1`)
      const page10 = response.data.data

      const titleObj = page10[0]; // Предполагаем, что первая запись содержит заголовки
      const titles = Object.keys(titleObj);

      const idTable = titles[0]
      const sortedData = page10.sort((a, b) => a[idTable] - b[idTable]);

      const record = sortedData.slice(-1)[0];
      console.log('Response data:', record);

      // Создаем форму с полученными данными
      generateUpdateForm(record);
    } catch (error) {
      console.error('Ошибка загрузки записи:', error);
      alert('Failed to load record data.');
    }
  };

  const renderTableStandalone = (data, containerId) => {
    if (!data || data.length === 0) {
      console.error('No data to render');
      return;
    }
    
  
    const titleObj = data[0]; // Предполагаем, что первая запись содержит заголовки
    const titles = Object.keys(titleObj);
  
    const idField = titles[0];
    console.log('aaaaa')
    const sortedData = data.sort((a, b) => a[idField] - b[idField]);
  
    // Создаем таблицу
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered');
    
    // Создаем заголовок таблицы
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    titles.forEach((title) => {
      const th = document.createElement('th');
      th.textContent = title;
      thead.appendChild(th);
    });
   
  
    // Добавляем столбец для действий
    const actionTh = document.createElement('th');
    actionTh.textContent = 'Actions';
    thead.appendChild(actionTh);
    tr.appendChild(thead);
    table.appendChild(thead);
    // Создаем тело таблицы
    const tbody = document.createElement('tbody');
    sortedData.forEach((item) => {
      const tr = document.createElement('tr');
  
      Object.values(item).forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
      
      // Создаем ячейку для действий
      const actionsTd = document.createElement('td');
  
      // Кнопка Delete
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'me-2');
      deleteButton.addEventListener('click', () => handleDelete(item[idField], nameTable)); // Привязка функции удаления
      actionsTd.appendChild(deleteButton);
  
      // Кнопка Update
      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.classList.add('btn', 'btn-primary', 'btn-sm');
      updateButton.addEventListener('click', () => handleUpdate(item[idField], nameTable)); // Привязка функции обновления
      actionsTd.appendChild(updateButton);
  
      tr.appendChild(actionsTd);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    // Находим контейнер и добавляем таблицу
    const container = document.getElementById(containerId);
    if (container) {
      container.textContent = ''; // Очищаем контейнер
      container.appendChild(table);
    } else {
      console.error(`Container with ID "${containerId}" not found`);
    }
  };
  

  // Загружаем данные при загрузке страницы
  if (formContainer) {
    loadRecord();
  }
});
