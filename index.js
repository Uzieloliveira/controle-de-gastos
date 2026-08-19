//Importação das funções
import { injetarHtml, chamarNovaTela } from "./controllers/screenControl.js";
import { salvarDados, inserirDadosNaLista, filtrarDadosNaLista } from "./repositories/addExpensesDAO.js";

document.addEventListener('DOMContentLoaded', () => {

    // função que injeta o conteúdo no DOM
    injetarHtml('Views/mainMenu', 'content')

    setTimeout(()=> {
        const intro = document.getElementById('intro')

        intro.classList.remove('active');
        intro.classList.add('noActive');
        intro.style = "z-index: 0;"

    }, 3000)
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
    const btn_add = event.submitter;

    event.preventDefault()

    if (btn_add) {

        // verifica se o botão clicado possui uma classe com o nome "submit"
        if (btn_add.matches('.submit')) {

            // as variáveis recebem os valores que foram digitados nos campos de entrada de dadas
            const description = document.getElementById('description').value
            const amount = document.getElementById('amount').value;
            const mes = document.getElementById('month').value;
            const form = document.getElementById('expensesForm')

            // chamada da função responsável por guardar os dados no localhost da página
            salvarDados(description, amount.toString(), mes);

            //limpa os campos de input para que seja possível adicionar novos dados
            form.reset()
        }
    }
})

function voltarTelaInicio() {
    injetarHtml('Views/mainMenu', 'content');
    chamarNovaTela('mainMenu');
}

document.addEventListener('click', (event) => {

    const btnMonth = event.target.closest('button')
    const btnBack = event.target.closest('button')
    const btnArrowBack = event.target.closest('i')


    if (btnMonth) {
        if (btnMonth.matches('#searchResult')) {

            const inputMont = document.getElementById('inputMonth').value

            if (inputMont !== "") {
                filtrarDadosNaLista(inputMont)
            }

        }
    }

    if (btnBack) {
        if (btnBack.matches('#btnBack')) {
            voltarTelaInicio()
        }
    }

    if (btnArrowBack) {
        if (btnArrowBack.matches('#arrowBack')) {
            voltarTelaInicio()
        }
    }
})
