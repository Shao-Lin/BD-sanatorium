import axios from "axios";

const renderTable = (data,target) => {
  const titleObj = data[0]
  const titles = Object.keys(titleObj)
  const table = document.createElement('table')
  table.classList.add('table')
  const thead = document.createElement('thead')
  const tr = document.createElement('tr')
  titles.forEach((title) =>{
    const th = document.createElement('th')
    th.setAttribute('scope','col')
    th.textContent = title
    tr.appendChild(th)
  })
  thead.appendChild(tr)
  table.appendChild(thead)

  const containerContent = document.getElementById('nav-tabContent')
  if(containerContent.querySelector('.show')){
    const active = containerContent.querySelector('.show')
    active.classList.remove('active')
    active.classList.remove('show')
  }
  
  const idContent = target.getAttribute('data-bs-target') // Функция для рендера таблицы на основе полученных данных
  const tabContent = document.querySelector(idContent)
  tabContent.textContent = ''
  tabContent.classList.add('show')
  tabContent.classList.add('active')
  tabContent.appendChild(table);

  const tbody = document.createElement('tbody')

  data.forEach((item) => {
    const tr = document.createElement('tr')
    const values = Object.values(item)
    values.forEach((value) =>{
      const td = document.createElement('td')
      td.textContent = value
      tr.appendChild(td)
      tbody.appendChild(tr)
    })
  })
  table.appendChild(tbody)
}



export default () => {
  const button = document.getElementById('but');
  const container = document.querySelector('.container')
  const allTabs = container.querySelectorAll('.nav-link')

  allTabs.forEach((tab) =>{
    tab.addEventListener('click',async (event) =>{
      const target = event.target
      if(container.querySelector('.active')){
        const formerActive = container.querySelector('.active')
        formerActive.classList.remove('active')
      }
      
      target.classList.add('active')

      const id = target.id
      const split = id.split('-')
      const nameTable = split[1];
      try {
        const response = await axios.get(`/api/${nameTable}`); // Отправляем GET запрос
        const data = await response.data;
        console.log(data)
        renderTable(data,target);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
    })
  })

  button.addEventListener('click', async () => {
    console.log('aaa')
    try {
      const response = await axios.get('/api/tours');
      console.log('Received data:', response.data); // данные находятся в response.data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
};
