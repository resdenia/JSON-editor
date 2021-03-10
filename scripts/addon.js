const jsonSwitcher = document.querySelector('.switcher-json');
const builderContainer = document.querySelector('.builder-format');
const jsonContainer = document.querySelector('.json-format');

// tabs
const tabItems = document.querySelectorAll('.tab-nav-item');

tabItems.forEach((tabItem) => {
  tabItem.addEventListener('click', (e) => {});
});

jsonSwitcher.addEventListener('click', (e) => {
  jsonSwitcher.classList.toggle('active');
  if (jsonSwitcher.classList.contains('active')) {
    jsonContainer.style.display = 'block';
    builderContainer.style.display = 'none';
  } else {
    jsonContainer.style.display = 'none';
    builderContainer.style.display = 'block';
  }
});
