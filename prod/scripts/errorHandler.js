const errorContainer = document.querySelector('.errorStatus');
const errorParagraph = document.querySelector('.errorStatus p');

const errorHandler = (e) => {
  console.log(e);
  if (e.value) {
    const spanContainer = document.createElement('span');
    spanContainer.textContent = e.value;
    const errorCode = ` ${e.description}`;
    errorParagraph.appendChild(spanContainer);
    errorParagraph.textContent = errorCode;
    errorContainer.style.display = 'block';
    errorContainer.style.bottom = '10px';
    setTimeout(function () {
      errorContainer.style.bottom = '-20px';
      errorContainer.style.display = 'none';
    }, 10000);
    console.log(e);
  } else {
    errorParagraph.textContent = e;
    errorContainer.style.display = 'block';
    errorContainer.style.bottom = '10px';
    setTimeout(function () {
      errorContainer.style.bottom = '-20px';
      errorContainer.style.display = 'none';
    }, 10000);
  }
};
