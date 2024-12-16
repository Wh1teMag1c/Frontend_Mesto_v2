import '../pages/index.css';
import {add_new_card, get_all_cards, get_profile, update_avatar, update_profile} from './api.js';
import {closeModal, openModal} from './modal.js';
import {createCard} from './card.js';
import {enableValidation} from './validate.js';

// Элементы профиля
const userName = document.querySelector('.profile__title');
const userText = document.querySelector('.profile__description');
const userImage = document.querySelector('.profile__image');

// Попапы
const popups = document.querySelectorAll('.popup');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');

// Формы
const profileForm = profilePopup.querySelector('.popup__form');
const cardForm = cardPopup.querySelector('.popup__form');
const avatarForm = avatarPopup.querySelector('.popup__form');

// Инпуты
const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
const profileTextInput = profilePopup.querySelector('.popup__input_type_description');
const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');
const avatarInput = avatarPopup.querySelector('.popup__input_type_avatar');

// Кнопки
const profileSaveButton = profilePopup.querySelector('.popup__button');
const cardSaveButton = cardPopup.querySelector('.popup__button');
const avatarSaveButton = avatarPopup.querySelector('.popup__button');

// Другие элементы
const cardsList = document.querySelector('.places__list');
const addCardButton = document.querySelector('.profile__add-button');
const editProfileButton = document.querySelector('.profile__edit-button');

// Общая функция для отображения состояния загрузки кнопки
function setLoadingState(button, isLoading, defaultText) {
    button.textContent = isLoading ? 'Сохранение...' : defaultText;
}

// Сброс ошибок формы
function resetFormErrors(formElement) {
    const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
    inputList.forEach((inputElement) => {
        const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.remove('popup__input_error');
        errorElement.classList.remove('popup__error-text_active');
        errorElement.textContent = '';
    });
}

// Обработчик формы редактирования профиля
function handleProfileFormSubmit(event) {
    event.preventDefault();
    setLoadingState(profileSaveButton, true, 'Сохранить');

    update_profile(profileNameInput.value, profileTextInput.value)
        .then((profile) => {
            userName.textContent = profile.name;
            userText.textContent = profile.about;
            closeModal(profilePopup);
        })
        .catch((err) => {
            console.error('Ошибка обновления профиля:', err);
        })
        .finally(() => {
            setLoadingState(profileSaveButton, false, 'Сохранить');
        });
}

// Обработчик формы добавления карточки
function handleCardFormSubmit(event) {
    event.preventDefault();
    setLoadingState(cardSaveButton, true, 'Создать');

    add_new_card(cardNameInput.value, cardLinkInput.value)
        .then((card) => {
            return get_profile().then(profile => {
                cardsList.prepend(createCard(card, profile._id));
                closeModal(cardPopup);
            });
        })
        .catch((err) => {
            console.error('Ошибка добавления карточки:', err);
        })
        .finally(() => {
            setLoadingState(cardSaveButton, false, 'Создать');
        });
}

// Обработчик формы редактирования аватара
function handleAvatarFormSubmit(event) {
    event.preventDefault();
    setLoadingState(avatarSaveButton, true, 'Сохранить');

    update_avatar(avatarInput.value)
        .then((profile) => {
            userImage.style.backgroundImage = `url(${profile.avatar})`;
            closeModal(avatarPopup);
        })
        .catch((err) => {
            console.error('Ошибка обновления аватара:', err);
        })
        .finally(() => {
            setLoadingState(avatarSaveButton, false, 'Сохранить');
        });
}

// Установить слушатели событий
function setEventListeners() {
    editProfileButton.addEventListener('click', () => {
        profileNameInput.value = userName.textContent;
        profileTextInput.value = userText.textContent;
        resetFormErrors(profileForm);
        openModal(profilePopup);
    });

    addCardButton.addEventListener('click', () => {
        cardNameInput.value = '';
        cardLinkInput.value = '';
        resetFormErrors(cardForm);
        openModal(cardPopup);
    });

    userImage.addEventListener('click', () => {
        avatarInput.value = '';
        resetFormErrors(avatarForm);
        openModal(avatarPopup);
    });

    profileForm.addEventListener('submit', handleProfileFormSubmit);
    cardForm.addEventListener('submit', handleCardFormSubmit);
    avatarForm.addEventListener('submit', handleAvatarFormSubmit);

    // Закрытие всех попапов по крестику
    popups.forEach((popup) => {
        popup.querySelector('.popup__close').addEventListener('click', () => closeModal(popup));
    });
}

// Загрузка данных профиля и карточек
function loadInitialData() {
    Promise.all([get_profile(), get_all_cards()])
        .then(([profile, allCards]) => {
            const user_id = profile._id;

            userName.textContent = profile.name;
            userText.textContent = profile.about;
            userImage.style.backgroundImage = `url(${profile.avatar})`;

            allCards.forEach((card) => {
                cardsList.append(createCard(card, user_id));
            });
        })
        .catch((err) => {
            console.error('Ошибка загрузки данных:', err);
        });
}

// Анимация попапов
function addPopupAnimation() {
    popups.forEach((popup) => {
        popup.classList.add('popup_is-animated');
    });
}

// Инициализация приложения
function init() {
    setEventListeners();
    addPopupAnimation();
    loadInitialData();

    const validationSettings = {
        formClass: '.popup__form',
        inputClass: '.popup__input',
        inputErrorClass: 'popup__input_error',
        buttonClass: '.popup__button',
        buttonInactiveClass: 'popup__button_inactive',
        errorClass: 'popup__error-text_active'
    };
    enableValidation(validationSettings);
}

init();
