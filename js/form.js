import { getDeclension } from './util.js';

const form = document.querySelector('.ad-form');
const filters = document.querySelector('.map__filters');
const formElements = ['fieldset', 'select'];
const inputTitle = form.querySelector('#title');
const inputType = form.querySelector('#type');
const inputPrice = form.querySelector('#price');
const inputCapacity = form.querySelector('#capacity');
const formButtonSubmit = form.querySelector('.ad-form__submit');
const roomNumber = document.querySelector('#room_number');

const TooltipText = {
  VALUE_1: 'символ',
  VALUE_2: 'символа',
  VALUE_3: 'символов',
};

const ZERO = 0;
const MIN_TITLE_LENGTH = 30;
const MAX_ROOM_CAPACITY = 100;

const ApartmentMinPrice = {
  FLAT: 1000,
  BUNGALOW: 0,
  HOUSE: 5000,
  PALACE: 10000,
  HOTEL: 3000,
};

const Room = {
  VALUE_1: 'комнатe',
  VALUE_2: 'комнатах',
};

const Guest = {
  SINGLE: 'гость',
  SEVERAL: 'гостя',
  MANY: 'гостей',
};

const ATTENTION_STYLE = '0 0 2px 2px #ff6547';

const toggleBoxShadow = (elem, isAdded) => elem.style.boxShadow = isAdded ? ATTENTION_STYLE : '';

const togglePageActivity = (isActive = false) => {
  if (isActive) {
    form.classList.remove('ad-form--disabled');
    filters.classList.remove('map__filters--disabled');
  } else {
    form.classList.add('ad-form--disabled');
    filters.classList.add('map__filters--disabled');
  }

  [...form.elements, ...filters.elements]
    .filter((elem) => formElements.includes(elem.tagName.toLowerCase()))
    .forEach((elem) => elem.disabled = !isActive);
};

const addCustomValidity = (elem, text) => {
  elem.setCustomValidity(text);
  elem.reportValidity();
};

const removeCustomValidity = (elem) => {
  elem.setCustomValidity('');
  toggleBoxShadow(elem);
};

const validateCapacity = () => {
  const rooms = Number(roomNumber.value);
  const guests = Number(inputCapacity.value);
  const roomDec = getDeclension(rooms, [Room.VALUE_1, Room.VALUE_2]);
  const guestDec = getDeclension(rooms, [Guest.SINGLE, Guest.SEVERAL, Guest.MANY]);

  if (rooms < guests && rooms !== MAX_ROOM_CAPACITY) {
    addCustomValidity(inputCapacity, `В ${rooms} ${roomDec} максимум ${rooms} ${guestDec}`);
  } else if (rooms === MAX_ROOM_CAPACITY && guests !== ZERO) {
    addCustomValidity(inputCapacity, 'Не для гостей');
  } else if (guests === ZERO && rooms !== MAX_ROOM_CAPACITY) {
    addCustomValidity(inputCapacity, 'Укажите количество мест');
  } else {
    removeCustomValidity(inputCapacity);
  }
};

const validatePrice = () => {
  if (Number(inputPrice.value) < Number(inputPrice.min)) {
    addCustomValidity(inputPrice, `Минимальная цена ${inputPrice.min}`);
  } else {
    removeCustomValidity(inputPrice);
  }
};

const setMinPriceAttributes = () => {
  const minPrice = ApartmentMinPrice[inputType.value.toUpperCase()];
  inputPrice.placeholder = minPrice;
  inputPrice.min = minPrice;
};

const validateTitile = () => {
  const count = inputTitle.value.length;
  const message = getDeclension(MIN_TITLE_LENGTH - count, [TooltipText.VALUE_1, TooltipText.VALUE_2, TooltipText.VALUE_3]);

  if (count > ZERO && count < MIN_TITLE_LENGTH) {
    addCustomValidity(inputTitle, `Еще ${MIN_TITLE_LENGTH - count} ${message}`);
  } else {
    removeCustomValidity(inputTitle);
  }
};

const setValidationForm = () => {
  inputTitle.addEventListener('input', () => {
    validateTitile();
  });

  inputPrice.addEventListener('input', () => {
    validatePrice();
  });

  inputType.addEventListener('change', () => {
    setMinPriceAttributes();
    validatePrice();
  });

  inputCapacity.addEventListener('change', () => {
    validateCapacity();
  });

  roomNumber.addEventListener('change', () => {
    validateCapacity();
  });

  formButtonSubmit.addEventListener('click', () => {
    [...form.elements]
      .filter((elem) => !elem.checkValidity())
      .forEach((elem) => toggleBoxShadow(elem, true));
  });
};

export { togglePageActivity, setValidationForm };