import {delete_card, like_card, unlike_card} from "./api";

const cardTemplate = document.querySelector('#card-template').content;

function createCard(card, user_id) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

    cardElement.querySelector('.card__title').textContent = card.name;

    const cardImage = cardElement.querySelector('.card__image');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardLikeAmount = cardElement.querySelector('.card__like-amount');

    cardImage.setAttribute('src', card.link);
    cardImage.setAttribute('alt', card.name);

    if (card.owner && card.owner._id === user_id) {
        cardDeleteButton.style.display = 'block';
        cardDeleteButton.addEventListener('click', () => {
            delete_card(card._id)
                .then(() => {
                    cardElement.remove();
                })
                .catch((err) => {
                    console.error(`Ошибка удаления карточки: ${err}`);
                });
        });
    } else {
        cardDeleteButton.style.display = 'none';
    }

    // Обработка лайков
    const updateLikes = (updatedCard) => {
        cardLikeAmount.textContent = updatedCard.likes.length;
        if (updatedCard.likes.some(like => like._id === user_id)) {
            cardLikeButton.classList.add('card__like-button_is-active');
        } else {
            cardLikeButton.classList.remove('card__like-button_is-active');
        }
    };

    updateLikes(card);

    cardLikeButton.addEventListener('click', () => {
        if (cardLikeButton.classList.contains('card__like-button_is-active')) {
            unlike_card(card._id)
                .then(updateLikes)
                .catch(err => console.error(`Ошибка снятия лайка: ${err}`));
        } else {
            like_card(card._id)
                .then(updateLikes)
                .catch(err => console.error(`Ошибка постановки лайка: ${err}`));
        }
    });

    return cardElement;
}

export {createCard};
