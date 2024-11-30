// Обновление таблицы
import axios from "axios";
import renderTable from "./createTable.js";
import showCreateButton from "./createCreateButton.js";
import showSearchButton from "./creaateSearchButton.js";
import labelCurrentPage from "./labelCurrentPage.js";

const loadTableData = async (nameTable) => {
    try {
      const response = await axios.get(`/api/${nameTable}?page=1`);
      const { data, totalPages, currentPage } = response.data;
      // Рендерим таблицу
      const targetTab = document.querySelector(`#nav-${nameTable}-tab`);
      renderTable(data, targetTab, totalPages, currentPage, nameTable);
      showCreateButton(nameTable)
      showSearchButton(nameTable)
      labelCurrentPage(currentPage,nameTable)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Failed to load data.');
    }
  };
  
  
  export default loadTableData