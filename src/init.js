import axios from 'axios';
import renderTable from './createTable.js';
import showCreateButton from './createCreateButton.js';
import showSearchButton from './creaateSearchButton.js';

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
        renderTable(data.data, target, data.totalPages, data.currentPage,nameTable);
        showCreateButton(nameTable)
        showSearchButton(nameTable)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  });
};
