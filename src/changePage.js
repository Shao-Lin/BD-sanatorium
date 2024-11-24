import axios from "axios";
import renderTable from "./createTable.js";
const changePage = async (page,nameTable) => {
    const button = document.querySelector('.nav-link.active');
    const id = button.id.split('-')[1]; // Получаем имя таблицы
    try {
      const response = await axios.get(`/api/${id}?page=${page}`);
      const { data, totalPages, currentPage } = response.data;
      renderTable(data, button, totalPages, currentPage,nameTable);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  export default changePage