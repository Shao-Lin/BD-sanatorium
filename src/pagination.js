 // Создаем пагинацию
 import changePage from "./changePage.js"

const pagination = (currentPage,totalPages,nameTable) =>{
    const pagination = document.getElementById("pagination");
 if (pagination) {
   pagination.innerHTML = ''; // Очищаем старую пагинацию

   // Кнопка "Previous"
   if (currentPage > 1) {
     const prevItem = document.createElement("li");
     prevItem.classList.add("page-item");
     const prevLink = document.createElement("a");
     prevLink.classList.add("page-link");
     prevLink.href = "#";
     prevLink.innerHTML = "Previous";
     prevLink.addEventListener("click", () => changePage(currentPage - 1),nameTable);
     prevItem.appendChild(prevLink);
     pagination.appendChild(prevItem);
   }

   // Номера страниц (ограниченный диапазон)
   const maxPagesToShow = 5;
   let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
   let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

   // Если оставшиеся страницы меньше maxPagesToShow, сдвигаем диапазон
   if (endPage - startPage + 1 < maxPagesToShow) {
     if (currentPage <= Math.floor(maxPagesToShow / 2)) {
       endPage = Math.min(totalPages, maxPagesToShow);
     } else {
       startPage = Math.max(1, totalPages - maxPagesToShow + 1);
     }
   }

   // Добавляем страницы
   for (let i = startPage; i <= endPage; i++) {
     const pageItem = document.createElement("li");
     pageItem.classList.add("page-item");
     if (i === currentPage) {
       pageItem.classList.add("active");
     }

     const pageLink = document.createElement("a");
     pageLink.classList.add("page-link");
     pageLink.href = "#";
     pageLink.textContent = i;
     pageLink.addEventListener("click", () => changePage(i,nameTable));
     pageItem.appendChild(pageLink);
     pagination.appendChild(pageItem);
   }

   // Кнопка "Next"
   if (currentPage < totalPages) {
     const nextItem = document.createElement("li");
     nextItem.classList.add("page-item");
     const nextLink = document.createElement("a");
     nextLink.classList.add("page-link");
     nextLink.href = "#";
     nextLink.innerHTML = "Next";
     nextLink.addEventListener("click", () => changePage(currentPage + 1,nameTable));
     nextItem.appendChild(nextLink);
     pagination.appendChild(nextItem);
   }
 } else {
   console.error("Pagination element not found");
 }
 }
 export default pagination
 

 
  