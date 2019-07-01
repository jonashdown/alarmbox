const renderServerTime = (date, element) => {
  element.innerHTML = new Date(date);
}

const renderClientTime = (element) => {
  element.innerHTML = new Date();
}

export {renderServerTime, renderClientTime};