const config = {
    baseUrl: 'https://nomoreparties.co/v1/frontend-st-cohort-201/',
    headers: {
        authorization: '0c64fffb-c999-45c3-8082-3fb2af291b58',
        'Content-Type': 'application/json'
    }
};

const handleResponse = (res) => {
    if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
};

const get_all_cards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    }).then(handleResponse);
};

const get_profile = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    }).then(handleResponse);
};

const update_profile = (new_name, new_about) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: new_name,
            about: new_about
        })
    }).then(handleResponse);
};

const add_new_card = (new_name, new_link) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: new_name,
            link: new_link
        })
    }).then(handleResponse);
};

const delete_card = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
    }).then(handleResponse);
};

const like_card = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers,
    }).then(handleResponse);
};

const unlike_card = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
    }).then(handleResponse);
};

const update_avatar = (url) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: url
        })
    }).then(handleResponse);
};

export {
    get_all_cards,
    get_profile,
    update_profile,
    add_new_card,
    delete_card,
    like_card,
    unlike_card,
    update_avatar
};
