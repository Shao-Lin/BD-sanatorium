import axios from "axios";
import loadTableData from "./loadTableData.js";
document.addEventListener('DOMContentLoaded', () => {
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
          <input type="text" class="form-control" id="${idFieldKey}" name="${idFieldKey}" value="${record[idFieldKey]}" disabled>
        </div>
      `;
      form.innerHTML += idField;
    }

    // Динамическое создание остальных полей
    const otherFields = Object.keys(record)
      .filter((key) => key !== idFieldKey) // Исключаем ID, так как оно уже добавлено
      .map(
        (key) =>{
          if(key === 'booking_status' || key === 'occupancy_status') {
            return `<label for="${key}">${key}</label>
            <div class="form-check-${key}">
  <input class="form-check-input" type="radio" name="${key}" id="${key}1" checked value="true">
  <label class="form-check-label" for="${key}1">
    true
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="${key}" id="${key}2" value="false">
  <label class="form-check-label" for="${key}2">
    false
  </label>
</div>`
          }
          else {
            return `
          <div class="mb-3">
            <label for="${key}" class="form-label">${key}</label>
            <input type="text" class="form-control" id="${key}" name="${key}" value="${record[key]}">
          </div> `
          }
        }
      )
      .join('');
      


    // Кнопка отправки
    const submitButton = `
      <button type="submit" class="btn btn-primary">Update</button>
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
        const response = await axios.put(`/api/${table}/${id}`, updatedData); // Отправка PUT запроса
        console.log(response); // Логируйте ответ для отладки
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
      console.log(`/api/${table}/${id}`);
      const response = await axios.get(`/api/${table}/${id}`);
      const record = response.data;

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


