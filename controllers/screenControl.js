import { obterTodoLocalStorage } from "../repositories/addExpensesDAO.js";

export function injetarHtml(path, id) {

    fetch(path).then(response => {
        if (!response.ok) {
            // se o arquivo não existir ou der erro, avisa no console
            throw new Error("Erro ao carregar a tela: " + response.statusText);
        }
        return response.text();
    })
        .then(html => {
            const divContent = document.getElementById(`${id}`);
            divContent.innerHTML = html
        })
}

// Função responsável por chamar uma nova tela 
export function chamarNovaTela(name_screen) {
    const pathScreen = `Views/${name_screen}`;
    const currentScreen = document.querySelector('.active');
    const newScreen = document.getElementById('app');

    injetarHtml(pathScreen, 'app')

    if (currentScreen) {
        currentScreen.classList.remove('active');
        currentScreen.classList.add('noActive');
    }

    if (newScreen) {
        newScreen.classList.add('active');
        newScreen.classList.remove('noActive');
    }
}

