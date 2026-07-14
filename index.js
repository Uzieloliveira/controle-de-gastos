import { injetarHtml } from "./controllers/screenControl.js";
import { chamarNovaTela } from "./controllers/screenControl.js";

// função para injetar o html do menu no DOM
function carregarMenu() {

    const path = 'Views/mainMenu'
    // função que injeta o conteúdo no DOM
    injetarHtml(path, 'content')

}

// chama a função 'carregarMenu' no momento do carregamento do html
document.addEventListener('DOMContentLoaded', () => {
    carregarMenu();
})

// identifica qual ícone do menu foi clicado e dispara um evendo chamando uma nova tela correspondente ao ícone
document.addEventListener('click', (event) => {
    const btn_menu = event.target.closest('li');

    if (btn_menu) {

        if (btn_menu.matches('.controlPanelScreen, .listScreen, .addExpensesScreen, .addIncomeScreen')) {

            const screen = btn_menu.getAttribute('data-screen')

            if (screen) {
                chamarNovaTela(screen)
            }
        }
    }
})
