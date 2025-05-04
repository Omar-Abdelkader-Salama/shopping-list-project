const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;
let itemAlreadyExists = false;

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // Validate Input
  if (newItem.trim() === '') {
    alert('Please add an item');
    return;
  }
  // Create list item
  addItemToLocalStorage(newItem);
  addingItemToDOM();
  itemInput.value = '';
  checkUI();
}

function addItemToLocalStorage(item) {
  itemAlreadyExists = false; // Reset this flag at the beginning
  let itemsFromStorage;
  
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  
  itemsFromStorage.forEach((itemStorage) => {
    if (itemStorage === item) {
      itemAlreadyExists = true;
      if (confirm(`${item} is already found , do you want to edit it ?`)) {
        // We'll use a different approach here
        // First, add all items to the DOM
        addingItemToDOM();
        
        // Then find the item and trigger edit mode with a small delay
        setTimeout(() => {
          const items = Array.from(itemList.querySelectorAll('li'));
          for (const li of items) {
            // Get just the text without the X button
            const itemText = li.firstChild.textContent;
            if (itemText === itemStorage) {
              // Directly call editMode instead of click
              editMode(li);
              break;
            }
          }
        }, 50); // Small delay to ensure DOM is ready
      } else {
        itemInput.value = '';
      }
    }
  });
  
  if (!itemAlreadyExists) {
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  }
}



z
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure you want delete the item ? ')) {
      e.target.parentElement.parentElement.remove();
      let itemsFromStorage = JSON.parse(localStorage.getItem('items'));
      const removedItem = e.target.parentElement.parentElement.textContent;

      // if (itemsFromStorage.indexOf(removedItem) !== -1) {
      // itemsFromStorage.splice(itemsFromStorage.indexOf(removedItem), 1);
      // }
      // This is a way by using array methods

      itemsFromStorage = itemsFromStorage.filter((i) => i !== removedItem);
      // this has a glitch which it deletes the item if it is repeated

      localStorage.setItem('items', JSON.stringify(itemsFromStorage));
      addingItemToDOM();
    }
  } else {
    if (e.target.tagName === 'LI') {
      editMode(e.target);
    }
  }
  checkUI();
}

function editMode(listItem) {

  itemForm.querySelectorAll('button').forEach((e) => {
    if (e.classList.contains('exit-editMode')) {
      e.remove();
    }
  });
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((e) => e.classList.remove('edit-mode'));
  listItem.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.classList.add('update');
  itemForm.removeEventListener('submit', addItem);
  console.log(listItem);
  console.log(listItem.textContent);
  console.log(document.body.contains(listItem));
  itemInput.value = listItem.textContent;
  const button = createButton('exit-editMode btn');
  button.appendChild(document.createTextNode('Exit Edit Mode'));
  document.getElementById('buttons-section').appendChild(button);
  button.addEventListener('click', () => {
    document.querySelector('.exit-editMode').remove();
    formBtn.classList.remove('update');
    formBtn.innerHTML = ' <i class="fa-solid fa-plus"></i> Add Item';
    listItem.classList.remove('edit-mode');
    itemInput.value = '';
    isEditMode = false;
    itemForm.addEventListener('submit', addItem);
    itemForm.removeEventListener('submit', updateItem);
  });
  function updateItem(e){
    e.preventDefault();
    let itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    const updatedItem = document.querySelector('.edit-mode').textContent;
    const itemIndex = itemsFromStorage.indexOf(updatedItem);
    itemsFromStorage[itemIndex] = itemInput.value;
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
    addingItemToDOM();
    itemInput.value = '';
    document.querySelector('.exit-editMode').remove();
    formBtn.classList.remove('update');
    formBtn.innerHTML = ' <i class="fa-solid fa-plus"></i> Add Item';
    listItem.classList.remove('edit-mode');
    isEditMode = false;
    itemForm.addEventListener('submit', addItem);
    itemForm.removeEventListener('submit', updateItem);
  }
  itemForm.addEventListener('submit', updateItem);
  
}

function clearAll(e) {
  if (confirm('Are you sure you want to delete everything ?')) {
    while (itemList.firstChild) {
      itemList.firstChild.remove();
    }
    localStorage.removeItem('items');
    checkUI();
  }
}

function checkUI() {
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
}

// function filter() {
//   const items = itemList.querySelectorAll('li');
//   items.forEach((e) => {
//     if (itemFilter.value.toLowerCase() !== e.textContent.substring(0,itemFilter.value.length).toLowerCase()){
//       e.style.display = 'none'
//     }else{
//       e.style.display = 'flex'
//     }
//   });
// }

// function filter(){
//   const items = itemList.querySelectorAll('li');
//   items.forEach(e => !e.textContent.toLowerCase().startsWith(itemFilter.value.toLowerCase()) ? e.style.display = 'none' : e.style.display = 'flex')

// }

// // well both of my filters check if the input filter is equal to the beginning of the item

function filter() {
  const items = itemList.querySelectorAll('li');
  items.forEach((e) =>
    e.textContent.toLowerCase().indexOf(itemFilter.value.toLowerCase()) === -1
      ? (e.style.display = 'none')
      : (e.style.display = 'flex')
  );
}

// now this function checks if the input is inside the item anywhere

// Event Listener
itemForm.addEventListener('submit', addItem);
itemForm.addEventListener('submit', filter);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearAll);
itemFilter.addEventListener('input', filter);
addingItemToDOM();
checkUI();
