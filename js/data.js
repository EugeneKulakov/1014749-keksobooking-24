const LOAD_FROM = 'https://24.javascript.pages.academy/keksobooking/data';
const UPLOAD_TO = 'https://24.javascript.pages.academy/keksobooking';
const Method = {
  POST: 'POST',
};

const loadHousings = () =>
  fetch(LOAD_FROM)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}. Ошибка загрузки данных. Попробуйте перезагрузить страницу.`);
    });

const send = (onSuccess, onError, body) => {
  fetch(
    UPLOAD_TO,
    {
      method: Method.POST,
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
        return;
      }
      throw new Error('Не удалось отправить форму. Попробуйте ещё раз');
    })
    .catch(onError);
};

export { loadHousings, send as sendData };
