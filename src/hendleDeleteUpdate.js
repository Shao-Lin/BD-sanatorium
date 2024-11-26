import loadTableData from "./loadTableData.js";
import axios from "axios";
const handleDelete = async (id, nameTable) => {
    try {
      const confirmed = confirm('Are you sure you want to delete this record?');
      if (!confirmed) return;
  
      // Удаление записи
      await axios.delete(`/api/${nameTable}/${id}`);
  
      alert('Record deleted successfully');
  
      // Обновляем данные таблицы после удаления
      await loadTableData(nameTable);
    } catch (error) {
      console.error('Ошибка удаления записи:', error);
  
      if (error.response && error.response.status === 409) {
        alert('Cannot delete record due to database constraints.');
      } else {
        alert('Failed to delete record.');
      }
    }
  };
  
  const handleUpdate = (id, table) => {
    console.log(id)
    console.log(table)
    window.location.href = `/update.html?table=${table}&id=${id}`;
  };

  export {handleDelete, handleUpdate}