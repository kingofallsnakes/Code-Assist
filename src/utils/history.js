export const saveToHistory = (type, input, response) => {
  const history = JSON.parse(localStorage.getItem('gca-history') || '[]');
  history.unshift({ type, input, response, timestamp: new Date().toISOString() });
  localStorage.setItem('gca-history', JSON.stringify(history.slice(0, 50)));
};
