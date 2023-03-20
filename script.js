const USER_PER_PAGE = 10;
const URL = 'https://api.github.com/';

const form = document.querySelector('form'),
    nameInput = form.querySelector('#text'),
    resultList = document.querySelector('.users-list');

function formSubmit(form) {
    const text = form.text.value;
    loadUsers(text)
        .then(response => response.json())
        .then(data => {
            const users = data.items;
            if (users.length === 0) resultList.textContent = "Ничего не найдено";
            else users.forEach(user => showUserInfo(user));
        })
        .catch(error => console.log("error"));
}

async function loadUsers(searchValue) {
    return await fetch(`${URL}search/users?q=${searchValue}&per_page=${USER_PER_PAGE}&page=1`);
}

form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.classList.contains('invalid'))
        formSubmit(form)
});

form.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !form.classList.contains('invalid')) {
        formSubmit(form);
    }
});

function showUserInfo(user) {
    console.log(user);

    let userElem = document.createElement('li');
    userElem.className = "user-elem";
    userElem.innerHTML = `
        <img src="${user["avatar_url"]}" class="user-img">
        <div class="user-info">
            <div class="user-title"><a href="${user["html_url"]}" class="user-link" target="_blank">${user["login"]}</a></div>
            <div class="id-info">ID: ${user["id"]}</div>
        </div>
    `;

    resultList.append(userElem);
}

nameInput.addEventListener('input', event => {
    nameInput.value = nameInput.value.trim();

    if (nameInput.value.length < 1) {
        form.classList.add('invalid');
        showErrorInfo(form, 'Введено слишком короткое имя!')
    } else {
        form.classList.remove('invalid');
        hideErrorInfo();
    }
});

function showErrorInfo(elem, textError) {
    if (document.querySelector('.error-message')) return;

    elem.insertAdjacentHTML('afterend', `
        <div class="error-message">${textError}</div>
    `);
}

function hideErrorInfo() {
    const errorElem = document.querySelector('.error-message');
    if (errorElem) errorElem.remove();
}