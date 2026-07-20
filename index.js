import { injetarHtml } from "./Views/screenControl.js";
import { chamarNovaTela } from "./Views/screenControl.js";
import { salvarDados } from "./controllers/dataController.js"

document.addEventListener('DOMContentLoaded', () => {

    // função que injeta o conteúdo no DOM
    injetarHtml('Views/mainMenu', 'content')

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

document.addEventListener('submit', (event) => {

    // identifica o evento de submit do botão clicado
    const btn_menu = event.submitter;

    if (btn_menu) {

        // verifica se o botão clicado possui uma classe com o nome "submit"
        if (btn_menu.matches('.submit')) {

            // as variáveis recebem os valores que foram digitados nos campos de entrada de dadas
            const description = document.getElementById('description').value
            const amount = document.getElementById('amount').value;
            const day = document.getElementById('day').value;
            const month = document.getElementById('month').value;
            const year = document.getElementById('year').value;
            const date = day + '-' + month + '-' + year // concatenação dos resultados de dia, mes e ano informados, para salvamento no formato correto!

            // chamada da função responsável por guardar os dados no localhost da página
            salvarDados(description, amount.toString(), date);

        }
    }
})