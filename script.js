class Table {
  constructor() {
    this.columns = [];
    this.data = [];
    this.filtredData = [];
    this.filtredColumns = [];
  }

  addColumn(columnName, columnType) {
    this.columns.push({ name: columnName, type: columnType });
  }

  removeColumn(columnName) {
    this.columns = this.columns.filter(column => {
      if(column.name !== columnName){
        return column.name !== columnName
      }else{
        document.querySelector(`#${columnName}`).remove()
      }
    });

    this.data = this.data.map(row => {
      delete row[columnName];
      return row;
    });

  }

  addRow(rowData) {
    this.data.push(rowData);
  }

  removeRow(rowIndex) {
    this.data.splice(rowIndex, 1);
  }

  sortColumn(columnName, order) {
    this.data.sort((a, b) => {
      if (order === 'asc') {
          return a[columnName].localeCompare(b[columnName]);
      } else {
          return b[columnName].localeCompare(a[columnName]);
      }
  });
  }

  searchColumn(columnName, searchString) {
    if(columnName){
      table.filtredData = [...this.data.filter(row =>{ 
        return  row[columnName].includes(searchString)
      })]
    }
  }

  searchAllColumns(searchString) {  table.columns.forEach(column => {
    const headerCell = headerRow.insertCell();
    columnSearch.innerHTML += `<option value="${column.name}">${column.name}</option>`
    filterContainer.innerHTML +=  `
    <div class="filter-item">
      <input type="radio" name="column" value="${column.name}"/>
      <label for="column">${column.name}</label>
    </div>
    `
    headerCell.textContent = column.name;
    headerCell.classList.add('header-cell');
    const headerColumn = document.querySelectorAll('.header-cell')
    headerColumn.forEach((item, index)=>{
      item.addEventListener('click',(event)=>{
        if(table.data.length > 0 && !sort){
          table.sortColumn(event.target.innerHTML, 'asc')
          renderTable(true)
          document.querySelectorAll('.header-cell')[index].classList.toggle('header-cell-active')
        }else{
          table.sortColumn(event.target.innerHTML)
          renderTable()
          document.querySelectorAll('.header-cell')[index].classList.toggle('header-cell-active')
        }
      })
    })
  });
    table.filtredData = [...this.data.filter(row => Object.values(row).some(value => String(value).includes(searchString)))]

  }

  hideColumn(columnName) {
    const someDate = this.columns.map(obj => Object.assign({}, obj)).filter(column => column.name !== columnName);
    this.filtredColumns = someDate.length  === 0 ? [{index:0}] : someDate
    this.filtredData = this.data.map(obj => Object.assign({}, obj));
    this.filtredData = this.filtredData.map(row => {
      delete row[columnName];
      return row;
    });
  }
  resizeTable(){
    const cols = document.querySelectorAll('col');
    const table = document.querySelector('table');

    cols.forEach((col, index) => {
        col.addEventListener('mousedown', (event) => {
            const initialX = event.clientX;
            const minWidth = 50; // Минимальная ширина столбца

            function handleMouseMove(moveEvent) {
                const dx = moveEvent.clientX - initialX;
                const newWidth = Math.max(minWidth, col.clientWidth + dx);
                col.style.width = `${newWidth}px`;
            }

            function handleMouseUp() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                table.style.cursor = 'auto';
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            table.style.cursor = 'col-resize';
        });
    });
  }
  loadFromJSON(jsonData) {
    const parsedData = JSON.parse(jsonData);
    this.data = parsedData.data
    this.columns = parsedData.columns
  }

  exportToJSON() {
    return JSON.stringify(this.data);
  }
}




const table = new Table();



// Функция для отображения таблицы
function renderTable(sort) {
  const tableElement = document.getElementById('table');
  const columnSearch  = document.querySelector('#columnSearch');
  const  filterContainer = document.querySelector('.filter-content');
  const  removeContainer = document.querySelector('.remove-content');

  // Очистка таблицы
  tableElement.innerHTML = '';
  columnSearch.innerHTML = '<option value=""></option>';
  removeContainer.innerHTML = '';
  filterContainer.innerHTML = '';

  // Добавление заголовков столбцов
  const headerRow = tableElement.insertRow();
  if(table.filtredColumns.length !== 0){
    table.columns.forEach(column => {

      columnSearch.innerHTML += `<option value="${column.name}">${column.name}</option>`
      filterContainer.innerHTML +=  `
      <div class="filter-item">
        <input type="radio" name="column" value="${column.name}"/>
        <label for="column">${column.name}</label>
      </div>
      `
      removeContainer.innerHTML +=  `
      <div class="filter-item">
        <input type="radio" name="column" value="${column.name}"/>
        <label for="column">${column.name}</label>
      </div>
      `;

    });
    table.filtredColumns.forEach((column) => {
      const headerCell = headerRow.insertCell();
      headerCell.textContent = column.name;
      headerCell.classList.add('header-cell');
      const headerColumn = document.querySelectorAll('.header-cell')
      headerColumn.forEach((item, index)=>{
        item.addEventListener('click',(event)=>{
          if(table.data.length > 0 && !sort){
            table.sortColumn(event.target.innerHTML, 'asc')
            renderTable(true)
            document.querySelectorAll('.header-cell')[index].classList.toggle('header-cell-active')
          }else{
            table.sortColumn(event.target.innerHTML)
            renderTable()
            document.querySelectorAll('.header-cell')[index].classList.toggle('header-cell-active')
          }
        })
      })
    });
  }else{
    table.columns.forEach(column => {
      const headerCell = headerRow.insertCell();
      columnSearch.innerHTML += `<option value="${column.name}">${column.name}</option>`
      filterContainer.innerHTML +=  `
      <div class="filter-item">
        <input type="radio" name="column" value="${column.name}"/>
        <label for="column">${column.name}</label>
      </div>
      `
      removeContainer.innerHTML +=  `
      <div class="filter-item">
        <input type="radio" name="column" value="${column.name}"/>
        <label for="column">${column.name}</label>
      </div>
      `;
      headerCell.textContent = column.name;
      headerCell.classList.add('header-cell');
      const headerColumn = document.querySelectorAll('.header-cell')
      headerColumn.forEach((item, index)=>{
        item.addEventListener('click',(event)=>{
          if(table.data.length > 0 && !sort){
            table.sortColumn(event.target.innerHTML, 'asc')
            renderTable(true)
            document.querySelectorAll('.header-cell')[index].classList.toggle('header-cell-active')
          }else{
            table.sortColumn(event.target.innerHTML)
            renderTable()
            document.querySelectorAll('.header-cell')[index].classList.toggle('header-cell-active')
          }
        })
      })

      
    });
    
  }

  // Добавление строк с данными
  if(table.filtredData.length !== 0){
    table.filtredData.forEach(rowData => {
      const row = tableElement.insertRow();
      table.filtredColumns.forEach(column => {
        if(column){
          const cell = row.insertCell();
          cell.textContent = rowData[column.name];
        }
        
      });
    });
  }else{
    table.data.forEach((rowData, index) => {
      const row = tableElement.insertRow();
      table.columns.forEach(column => {
        const cell = row.insertCell();
        cell.textContent = rowData[column.name];
      });
      const cell = row.insertCell();
      cell.innerHTML = `<button class="removeRowBtn" id="${index}">remove</button>`;
      cell.classList.add('container-btn-row');
    });
  }

  $(function() {
    
    $('td').resizable({
        alsoResize: "#astor img",
        minWidth:100,
        minHeight: 50
    });
  
  });

  $('input[type=radio]').on('click', function(){     
    if($(this).attr("checked") == 'checked') {  
        $(this).removeAttr('checked');
    } else {
        $(this).attr('checked', 'checked')
    }
  });
  const removeRowBtns = document.querySelectorAll('.removeRowBtn');
  removeRowBtns.forEach((item,index)=>{
    item.addEventListener('click', ()=>{
      table.removeRow(index)
      renderTable();
    })
  })

}


function addInputRows (name, type) {
  if(type ==  'number'){
    return (`
      <div class="form-item" id="${name}">
        <label for="${name}">${name}</label>
        <input type='number' name="${name}" required >
      </div>
      `)
  } else if(type == 'boolean'){
    return(
      `
      <div class="form-item" id="${name}">
        <label for="${name}">${name}</label>
        <select  name="${name}" required >
          <option value='false'>Ложь</option>
          <option value='true'>Правда</option>
        </select>
      </div>
      `
    )
  }else{
    return (  `
      <div class="form-item" id="${name}">
        <label for="${name}">${name}</label>
        <input type='text' name="${name}" required >
      </div>
      
      `)
  }
}

renderTable();


const FormaddColumn = document.querySelector('.form-add-column');
const  FormaddRowInputContainer = document.querySelector('.form-add-row .form-container');
const FormaddRow  = document.querySelector('.form-add-row');

FormaddColumn.addEventListener('submit', (event)=>{
  event.preventDefault() 

  const data = [...new FormData(event.target)];

    if(table.columns.findIndex(elem=> (elem.name === data[0][1])) == -1){
      table.addColumn(data[0][1], data[1][1]);
      FormaddRowInputContainer.innerHTML += addInputRows(data[0][1], data[1][1]);
      renderTable();
      table.resizeTable();
    }
})


FormaddRow.addEventListener('submit', (event)=>{
  event.preventDefault() 
  const obj = {};
  [...new FormData(event.target)].forEach((item)=>{
      obj[item[0]] = item[1]; 

  })
  table.addRow(obj);
  renderTable();
})


const searchForRow = document.querySelector('.search');
const searchSelect = document.querySelector('#columnSearch');

searchSelect.addEventListener('change', (event)=>{
  if(event.target.value !==''){
    searchForRow.disabled = false;
  }else{
    searchForRow.disabled = true;
  }
})
searchForRow.addEventListener('change', (event)=>{
  if(event.target.value.length !== 0){
    table.searchColumn(searchSelect.value, event.target.value);
    renderTable();
  }else{
    table.filtredData = [];
    renderTable();
  }

})



const searchForRows = document.querySelector('.searchs');

searchForRows.addEventListener('change', (event)=>{
  if(event.target.value.length !== 0){
    table.searchAllColumns(event.target.value);
    renderTable();
  }else{
    table.filtredData = [];
    renderTable();
  }

})
const  filterContainer = document.querySelector('.filter-content');
filterContainer.addEventListener('submit', (event)=>{
  event.preventDefault();
  const data = [...new FormData(event.target)];
  const btn = document.querySelector('#filterBtn');
  if(data.length > 0){
    btn.innerHTML = 'очистить'
    table.hideColumn(data[0][1])
    renderTable();
    
  }else{
    table.filtredData = [];
    table.filtredColumns = [];
    btn.innerHTML = 'применить'
    renderTable();
  }
})
const  removeContainer = document.querySelector('.remove-content');
removeContainer.addEventListener('submit', (event)=>{
  event.preventDefault();
  const data = [...new FormData(event.target)];
  if(data.length > 0){
    table.removeColumn(data[0][1])
    renderTable();   
  }
})
function readJsonFile(filePath, callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', filePath, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status == "200") {
          callback(JSON.parse(xhr.responseText));
      }
  };
  xhr.send(null);
}

// Пример использования функции

function readFileImport(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    table.loadFromJSON(reader.result)
    renderTable()
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}
// function saveDataForFile (){
//   saveAs(
//     new Blob(
//       [JSON.stringify({
//         data:[...table.data],
//         columns: [...table.columns]
//       }, null, 2)],
//       {type: "application/json;charset=" + document.characterSet}
//   ), `data.json`);

//   console.log('f');
// }
function saveDataToJSONFile(data, filename) {
  // Преобразование объекта данных в JSON строку
  const jsonData = JSON.stringify(data, null, 2);
  
  // Создание нового Blob объекта с типом MIME для JSON файла
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Создание ссылки для загрузки файла
  const url = URL.createObjectURL(blob);

  // Создание элемента 'a' для скачивания файла
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  // Эмуляция клика для скачивания файла
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.querySelector('#exportBtn').addEventListener('click',(event)=>{
  document.querySelector('#fileInputExport').click();
}) 

document.querySelector('#importBtn').addEventListener('click',(event)=>{
  saveDataToJSONFile({
    data:[...table.data],
    columns: [...table.columns]
  }, `data${new Date()}.json`);
}) 
