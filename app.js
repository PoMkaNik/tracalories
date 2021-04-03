// Storage controller
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      const items = JSON.parse(localStorage.getItem('items')) || [];
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    },
    getItemsFromStorage: function () {
      const items = JSON.parse(localStorage.getItem('items')) || [];
      return items;
    },
    updateItemStorage: function (updateItem) {
      const items = JSON.parse(localStorage.getItem('items'));
      // find item to update
      const updatedItem = items.find((item) => item.id === updateItem.id);
      // update data
      updatedItem.name = updateItem.name;
      updatedItem.calories = updateItem.calories;
      // update local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      const items = JSON.parse(localStorage.getItem('items'));
      // find index of deleted item in array
      const index = items.findIndex((item) => item.id === id);
      // remove this item from array
      items.splice(index, 1);
      // update local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearStorage: function () {
      localStorage.removeItem('items');
    },
  };
})();

// Item controller
const ItemCtrl = (function (StorageCtrl) {
  //  item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // data structure
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // create id
      const ID =
        data.items.length > 0 ? data.items[data.items.length - 1].id + 1 : 0;
      // calories to number
      calories = parseInt(calories);
      // create item
      newItem = new Item(ID, name, calories);
      // add to items array
      data.items.push(newItem);
      return newItem;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      // find item to update
      const updatedItem = data.items.find(
        (item) => item.id === data.currentItem.id,
      );
      // update data
      updatedItem.name = name;
      updatedItem.calories = calories;
      return updatedItem;
    },
    deleteItem: function (id) {
      const indexOfItemToDelete = data.items.findIndex(
        (item) => item.id === id,
      );
      data.items.splice(indexOfItemToDelete, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    getItemById: function (id) {
      return data.items.find((item) => item.id === id);
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      data.totalCalories = data.items.reduce(
        (sum, item) => sum + item.calories,
        0,
      );
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})(StorageCtrl);

// UI controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
  };

  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach((item) => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name} </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fas fa-pencil-alt"></i>
          </a>
        </li>
      `;
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // create li element
      const li = document.createElement('li');
      // add class
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `
        <strong>${item.name} </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      `;
      // insert item in DOM
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert to array
      listItems = Array.from(listItems);
      // list item loop
      listItems.find(
        (listItem) => listItem.id === `item-${item.id}`,
      ).innerHTML = `
        <strong>${item.name} </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      `;
    },
    deleteListItem: function (item) {
      const itemID = `#item-${item.id}`;
      const deletedItem = document.querySelector(itemID);
      deletedItem.remove();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert to array
      listItems = Array.from(listItems);
      // loop listItems and remove
      listItems.forEach((item) => item.remove());
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      // get current item
      const { name, calories } = ItemCtrl.getCurrentItem();
      //show data
      document.querySelector(UISelectors.itemNameInput).value = name;
      document.querySelector(UISelectors.itemCaloriesInput).value = calories;
      // show Edit mode
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories,
      ).textContent = totalCalories;
    },
    showEditState: function () {
      [
        UISelectors.updateBtn,
        UISelectors.deleteBtn,
        UISelectors.backBtn,
      ].forEach((el) => (document.querySelector(el).style.display = 'inline'));
      // show add button
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    clearEditState: function () {
      UICtrl.clearInput();
      // init hide edit, delete, back buttons
      [
        UISelectors.updateBtn,
        UISelectors.deleteBtn,
        UISelectors.backBtn,
      ].forEach((el) => (document.querySelector(el).style.display = 'none'));
      // show add button
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // event listeners
  const loadEventListeners = function () {
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    // disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', function (e) {
        e.preventDefault();
        const editBtn = e.target.closest('.edit-item');
        // if click was made not on edit button
        if (!editBtn) return;
        // make action on edit button click
        itemEditClick(editBtn);
      });

    // update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', function (e) {
        e.preventDefault();
        itemUpdateSubmit();
      });

    // back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', function (e) {
        e.preventDefault();
        UICtrl.clearEditState();
      });

    // delete button event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', function (e) {
        e.preventDefault();
        itemDeleteSubmit();
      });

    // clear all button click event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', function (e) {
        e.preventDefault();
        clearAllItemsClick();
      });
  };

  // add item submit
  const itemAddSubmit = function (e) {
    e.preventDefault();
    // get inputs from UII
    const { name, calories } = UICtrl.getItemInput();
    // validate inputs
    if (name === '' || calories === '') return;
    // add item
    const newItem = ItemCtrl.addItem(name, calories);
    // render this item in UI
    UICtrl.addListItem(newItem);
    // show list in UI (if was hided due to no items before)
    UICtrl.showList();
    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total calories in UI
    UICtrl.showTotalCalories(totalCalories);
    // store in local storage
    StorageCtrl.storeItem(newItem);
    // clear input fields
    UICtrl.clearInput();
  };

  // click to edit the item
  const itemEditClick = function (btn) {
    // get list item id
    const itemId = Number(btn.closest('li').id.split('-')[1]);
    // get item
    const itemToEdit = ItemCtrl.getItemById(itemId);
    // set current item
    ItemCtrl.setCurrentItem(itemToEdit);
    // add item to form
    UICtrl.addItemToForm();
  };

  // update item submit
  const itemUpdateSubmit = function () {
    // get data from input fields
    const { name, calories } = UICtrl.getItemInput();
    // updated item
    const updatedItem = ItemCtrl.updateItem(name, calories);
    // update UI
    UICtrl.updateListItem(updatedItem);
    // update total calories
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    // update local storage
    StorageCtrl.updateItemStorage(updatedItem);
    // set currentItem to null
    ItemCtrl.setCurrentItem(null);
    // clear Edit mode
    UICtrl.clearEditState();
  };

  // delete item
  const itemDeleteSubmit = function () {
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();
    // delete item
    ItemCtrl.deleteItem(currentItem.id);
    // update UI
    UICtrl.deleteListItem(currentItem);
    // update total calories
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    // delete item from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    // set currentItem to null
    ItemCtrl.setCurrentItem(null);
    // clear Edit mode
    UICtrl.clearEditState();
    // hide list if all items removed
    if (ItemCtrl.getItems().length === 0) UICtrl.hideList();
  };

  // clear all items
  const clearAllItemsClick = function () {
    // delete all items from data structure
    ItemCtrl.clearAllItems();
    // clear UI
    UICtrl.removeItems();
    // clear Total Calories
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    // remove items from storage
    StorageCtrl.clearStorage();
    // hide list
    UICtrl.hideList();
  };

  // public methods
  return {
    init: function () {
      // clear Edit mode
      UICtrl.clearEditState();
      // fetch items from state
      const items = ItemCtrl.getItems();
      // check if any items
      items.length === 0
        ? // if nothing - hide the list from DOM
          UICtrl.hideList()
        : // else -> show items and total calories in UI
          (UICtrl.populateItemList(items),
          UICtrl.showTotalCalories(ItemCtrl.getTotalCalories()));
      // load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
