const jsonSwitcher = document.querySelector('.switcher-json');
const builderContainer = document.querySelector('.builder-format');
const jsonContainer = document.querySelector('.json-format');
const uploadViewContainer = document.querySelector('.uploadView');
const resultLogData = document.querySelector('div[data-tabbody="parsedlogs"]');
const innerInputToggler = document.querySelectorAll('.innerTab li');

innerInputToggler.forEach((tabItem) => {
  tabItem.addEventListener('click', (e) => {
    const itemNoActiveInner = document.querySelector(
      '.innerTab li:not(.active)'
    );
    const itemBodyNoActiveInner = document.querySelector(
      '.inputView:not(.active)'
    );

    if (e.target.classList.contains('active')) {
      return true;
    }

    document.querySelector('.innerTab li.active').classList.remove('active');
    document.querySelector('.inputView.active').classList.remove('active');

    itemNoActiveInner.classList.add('active');
    itemBodyNoActiveInner.classList.add('active');
  });
});

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

    // document.querySelector('#acceptSamplesButton').removeAttribute('disabled');
  }
};

// file upload

['drop'].forEach((eventName) => {
  uploadViewContainer.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
  var event = new Event('change');
  document.querySelector('#fileUploadButton').dispatchEvent(event);
}

document
  .querySelector('#fileUploadButton')
  .addEventListener('change', handleUpload);

const sendToSamwill = () => {
  const buttonSend = document.querySelector('.validateWithSamwill');
  buttonSend.addEventListener('click', async (e) => {
    e.preventDefault();
    if (buttonSend.classList.contains('disabled')) {
      return;
    }

    try {
      const JSONPipeline = document.querySelector('#output').value;
      const sampleLogs = document.querySelector('#samplesBox').value;
      const stringLog = sampleLogs.toString().replace(' ', '');
      const sampleLogsParsed = JSON.parse(stringLog);
      let sampleDataToSend = [];
      if (!Array.isArray(sampleLogsParsed)) {
        sampleDataToSend.push(sampleLogsParsed);
      } else {
        sampleLogsParsed.forEach((item) => {
          sampleDataToSend.push(item);
        });
      }

      const sendData = {
        logs: sampleDataToSend,
        pipeline: JSONPipeline.toString(),
      };

      const response = await fetch(
        ' https://sawmill-server.herokuapp.com/sawmill/execute-multiple',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',

          body: JSON.stringify(sendData),
        }
      );
      const json = await response.json();
      const ErrorLog = json.filter((jsonItem) => jsonItem.error != null);

      if (json.length > 1 && ErrorLog.length > 0) {
        console.log(ErrorLog);
      }
      if (json.status || json.status) {
        errorHandler(json.status);
      }
    } catch (e) {
      console.log(e);
      errorHandler(e);
    }
  });
};

const syntaxHighlight = (json) => {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 4);
  }
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
};

sendToSamwill();
