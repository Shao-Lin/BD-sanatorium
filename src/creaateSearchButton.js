const showSearchButton = (nameTable) => {

    const createButton = document.createElement('button');
    createButton.id = 'searchButton';
    createButton.textContent = 'Search';
    createButton.classList.add('btn', 'btn-info'); // Bootstrap стили для кнопки
    createButton.style.marginTop = '10px'; // Отступ сверху
    createButton.style.display = 'block'; // Отображение как блок для выравнивания
    createButton.style.marginBottom = '20px'; // Отступ снизу, чтобы кнопка не прилипала к таблице
  
    // Добавление обработчика события
    createButton.addEventListener('click', () => {
      window.location.href = `/search.html?table=${nameTable}`;
      // Здесь можно вставить логику для перехода на страницу создания
    });
  
    // Добавляем кнопку под контейнер для всех вкладок
    const tabContent = document.querySelector(`#nav-${nameTable}-tab`);
    const container = document.querySelector(tabContent.getAttribute('data-bs-target'));
    if (container) {
      const marginDiv = document.createElement('div');
      marginDiv.style.marginBottom = '20px'; // Отступ перед таблицей
      container.insertBefore(createButton, container.firstChild);
      container.insertBefore(marginDiv, createButton);
    }
  };

  export default showSearchButton