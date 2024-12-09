import axios from "axios";
import loadTableData from "./loadTableData.js";
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const table = urlParams.get('table');
  const id = urlParams.get('id');

  // Контейнер для формы
  const formContainer = document.getElementById('formContainer');
  

  // Функция для создания формы
  const generateUpdateForm = (record) => {
    const form = document.createElement('form');
    form.id = 'updateForm';

    // Поле ID (только для чтения)
    const idFieldKey = Object.keys(record).find((key) => key.includes('id')); // Ищем поле, содержащее "id"
    if (idFieldKey) {
      const idField = `
        <div class="mb-3">
          <label for="${idFieldKey}" class="form-label">${idFieldKey}</label>
          <input type="text" class="form-control" id="${idFieldKey}" name="${idFieldKey}" value="${record[idFieldKey] + 1}" readonly>
        </div>
      `;
      form.innerHTML += idField;
    }

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
      <button type="submit" class="btn btn-primary">Create</button>
    `;

    // Добавляем остальные поля и кнопку в форму
    form.innerHTML += otherFields + submitButton;

    // Очищаем контейнер и вставляем форму
    formContainer.innerHTML = '';
    formContainer.appendChild(form);

    // Добавляем обработчик отправки формы
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

      const formData = new FormData(form);
      const updatedData = {};

      // Собираем данные из формы
      formData.forEach((value, key) => {
        updatedData[key] = value;
      });

      console.log('Incoming data for update:', updatedData);

      try {
        const response = await axios.post(`/api/${table}`,updatedData); // Отправка PosT запроса
        console.log('отправка формы '+ response); // Логируйте ответ для отладки
        alert('Record updated successfully');
        window.location.href = '/'; // Перенаправление на главную страницу
      } catch (error) {
        console.error('Ошибка обновления записи:', error);
        alert('Failed to update record.');
      }
    });
  };

  // Функция для загрузки данных записи
  const loadRecord = async () => {
    console.log('Loading record...');
    try {
      const response = await axios.get(`/api/${table}?page=5`)
      const page10 = response.data.data
      console.log(page10)
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

  // Загружаем данные при загрузке страницы
  if (formContainer) {
    loadRecord();
  }
});
