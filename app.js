// Storage controller

// Item controller
const ItemCtrl = (function () {
  //  item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // data structure
  const data = {
    items: [
      { id: 0, name: 'Steak Dinner', calories: 1200 },
      { id: 1, name: 'Cookie', calories: 400 },
      { id: 2, name: 'Eggs', calories: 300 },
    ],
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
    logData: function () {
      return data;
    },
  };
})();

// UI controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
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

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App controller
const App = (function (ItemCtrl, UICtrl) {
  // event listeners
  const loadEventListeners = function () {
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);
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
    console.log(newItem);
  };
  // public methods
  return {
    init: function () {
      // fetch items from state
      const items = ItemCtrl.getItems();
      // show items in UI
      UICtrl.populateItemList(items);
      // load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

App.init();
