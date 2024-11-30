const labelCurrentPage = (currentPage,nameTable) =>{
    const labelPage = document.createElement('div');
    labelPage.classList.add('label-info');
    labelPage.textContent = `Current page: ${currentPage}`;
    
    const tabContent = document.querySelector(`#nav-${nameTable}-tab`);
    const container = document.querySelector(tabContent.getAttribute('data-bs-target'));
    if (container) {
      const marginDiv = document.createElement('div');
      marginDiv.style.marginBottom = '20px'; // Отступ перед таблицей
      container.insertBefore(labelPage, container.firstChild);
      container.insertBefore(marginDiv, labelPage);
    }
}
export default labelCurrentPage