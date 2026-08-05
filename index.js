//Importação das funções
import { injetarHtml, chamarNovaTela } from "./controllers/screenControl.js";
import { filtrarDadosNaLista, salvarDados, inserirDadosNaLista, obterTodoLocalStorage } from "./repositories/addExpensesDAO.js";

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

            //função responsável por encontrar a tela correspondente ao icone clicado
            chamarNovaTela(screen);

            if (screen) {
                // Caso a tela chamada for a da lista de despesas, adiciona os itens na lista antes de mostrá-la
                if (btn_menu.matches('.listScreen')) {
                    //função responsável por carregar todos os dados do localStorage, na lista de despesas
                    inserirDadosNaLista();

                }
            }
        }
    }

})

// Captura dos valores dos inputs da tela de cadatro de despesas
document.addEventListener('submit', (event) => {

    // identifica o evento de submit do botão clicado
    const btn_menu = event.submitter;

    event.preventDefault()

    if (btn_menu) {

        // verifica se o botão clicado possui uma classe com o nome "submit"
        if (btn_menu.matches('.submit')) {

            // as variáveis recebem os valores que foram digitados nos campos de entrada de dadas
            const description = document.getElementById('description').value
            const amount = document.getElementById('amount').value;
            const day = document.getElementById('day').value;
            const month = document.getElementById('month').value;
            const year = document.getElementById('year').value;

            // chamada da função responsável por guardar os dados no localhost da página
            salvarDados(description, amount.toString(), day, month, year);

        }
    }
})

// captura o valor selecionado no input de opções, esse valor pode ser: (month, year, all) / referente ao tipo de filtro de exibição!
document.addEventListener('click', (event) => {

    const btn_resultFilter = event.target.closest('button')

    if (btn_resultFilter) {

        let valueMonth_home = null;
        let valueMonth_end = null;

        // caso o primeiro input do tipo month foi modificado, pega o valor do input e salva na variável de nome 'valueMonth_home'
        if (btn_resultFilter.matches('#resultFilter')) {

            valueMonth_home = document.getElementById('inputMonth_home').value
            valueMonth_end = document.getElementById('inputMonth_end').value

            if (valueMonth_home !== '' && valueMonth_end !== '') {

                // a função que insere os dados na lista é chamada e recebe os valores dos inputs do tipo month, como parâmetros!
                filtrarDadosNaLista(valueMonth_home, valueMonth_end)

            } else {
                console.error("dados de entrada não foram encontrados!")
            }

        }

    }

})
