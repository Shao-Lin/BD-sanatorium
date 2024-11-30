// Обновление таблицы
import axios from "axios";
import renderTable from "./createTable.js";
const loadTableData = async (nameTable) => {
    try {
      const response = await axios.get(`/api/${nameTable}?page=1`);
      const { data, totalPages, currentPage } = response.data;
      // Рендерим таблицу
      const targetTab = document.querySelector(`#nav-${nameTable}-tab`);
      renderTable(data, targetTab, totalPages, currentPage, nameTable);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Failed to load data.');
    }
  };
  
  
  export default loadTableData