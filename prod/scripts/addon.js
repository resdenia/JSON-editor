const jsonSwitcher = document.querySelector('.switcher-json');
const builderContainer = document.querySelector('.builder-format');
const jsonContainer = document.querySelector('.json-format');
const uploadViewContainer = document.querySelector('.uploadView');
// tabs
const tabItems = document.querySelectorAll('.tab-nav-item');

tabItems.forEach((tabItem) => {
  tabItem.addEventListener('click', (e) => {
    const itemNoActive = document.querySelector('.tab-nav-item:not(.active)');
    const itemBodyNoActive = document.querySelector(
      '.tab-nav-body__item:not(.active)'
    );

    if (e.target.classList.contains('active')) {
      return true;
    }

    document.querySelector('.tab-nav-item.active').classList.remove('active');
    document
      .querySelector('.tab-nav-body__item.active')
      .classList.remove('active');

    itemNoActive.classList.add('active');
    itemBodyNoActive.classList.add('active');
  });
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

const handleUpload = async (e) => {
  if (e.target.files[0]) {
    if (e.target.files[0].size > 5 * 1000000) {
      return alert('File too large. Upload must be less than 5mb.');
    }
    const reader = new FileReader();
    const content = await new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(e.target.files[0]);
    });
    document.querySelector('#samplesBox').value = content;
    document.querySelector('#samplesBox').style.display = 'block';
    document.querySelector('.uploadView').style.display = 'none';

    document.querySelector('#acceptSamplesButton').removeAttribute('disabled');
  }
};

// file upload

['drop'].forEach((eventName) => {
  uploadViewContainer.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  console.log('here');
  e.preventDefault();
  e.stopPropagation();
  var event = new Event('change');
  document.querySelector('#fileUploadButton').dispatchEvent(event);
}

document
  .querySelector('#fileUploadButton')
  .addEventListener('change', handleUpload);
