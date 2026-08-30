//Importação das funções
import { injetarHtml, chamarNovaTela } from "./controllers/screenControl.js";
import { salvarDados, inserirDadosNaLista, filtrarDadosNaLista, adicionarReceita } from "./repositories/addExpensesDAO.js";

document.addEventListener('DOMContentLoaded', () => {

    // função que injeta o conteúdo no DOM
    injetarHtml('Views/mainMenu', 'content')

    setTimeout(() => {
        const intro = document.getElementById('intro')

        intro.classList.remove('active');
        intro.classList.add('noActive');
        intro.style = "z-index: 0;"

    }, 3000)
})

//Ouvinte de click responsável por identificar qual icone ou botão foi clicado!
document.addEventListener('click', (event) => {

    const pattern = event.target.closest('button')
    const btnMonth = pattern
    const btnBack = pattern
    const btnSituation = pattern
    const btnArrowBack = event.target.closest('i')
    const btnMenu = event.target.closest('li');


    // identifica qual ícone do menu foi clicado e dispara um evendo chamando uma nova tela correspondente ao ícone
    if (btnMenu) {

        if (btnMenu.matches('.controlPanelScreen, .listScreen, .addExpensesScreen, .addIncomeScreen')) {

            const screen = btnMenu.getAttribute('data-screen')

            //função responsável por encontrar a tela correspondente ao icone clicado
            chamarNovaTela(screen);

            if (screen) {
                // Caso a tela chamada for a da lista de despesas, adiciona os itens na lista antes de mostrá-la
                if (btnMenu.matches('.listScreen')) {
                    //função responsável por carregar todos os dados do localStorage, na lista de despesas
                    inserirDadosNaLista();

                }

            }
        }
    } else if (btnMonth) {

        if (btnMonth.matches('#searchResult')) {

            const inputMont = document.getElementById('inputMonth').value

            if (inputMont !== "") {
                filtrarDadosNaLista(inputMont)
            }

        }

    }


    if (btnSituation) {
        const paid = document.getElementById("paid")
        const payable = document.getElementById("payable")
        const scheduled = document.getElementById("scheduled")

        if (btnSituation.matches('#paid')) {

            paid.classList.add('btnClicked')
            payable.classList.remove('btnClicked')
            scheduled.classList.remove('btnClicked')

        } else if (btnSituation.matches('#payable')) {

            payable.classList.add('btnClicked')
            paid.classList.remove('btnClicked')
            scheduled.classList.remove('btnClicked')

        } else if (btnSituation.matches('#scheduled')) {

            scheduled.classList.add('btnClicked')
            payable.classList.remove('btnClicked')
            paid.classList.remove('btnClicked')

        }
    }

    if (btnBack) {

        if (btnBack.matches('#btnBack')) {
            voltarTelaInicio()
        }

    } else if (btnArrowBack) {

        if (btnArrowBack.matches('#arrowBack')) {
            voltarTelaInicio()
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
        if (btn_add.matches('.submit-expense')) {

            // as variáveis recebem os valores que foram digitados nos campos de entrada de dadas
            const description = document.getElementById('description').value
            const amount = document.getElementById('amount').value;
            const month = document.getElementById('month').value;
            const type = document.querySelector('input[name="expense"]:checked')?.value;
            const form = document.getElementById('expensesForm');
            const situation = document.querySelector('.btnClicked');

            // Verifica se foi selecionado alguma das opções de "situação" (pago, a pagar, agendado)!
            if (situation !== null) {
                // chamada da função responsável por guardar os dados no localhost da página
                salvarDados(description, amount.toString(), month, type, situation.value);

                //limpa os campos de input para que seja possível adicionar novos dados
                form.reset()
            } else {
                alert("Favor, selecione uma opção de situação!");
            }

        } else if (btn_add.matches('.submit-income')) {
            const income = document.getElementById('income').value
            const month_income = document.getElementById('month-income').value
            const form = document.getElementById('incomeForm');

            adicionarReceita(income, month_income);
            
            form.reset()

        }
    }
})

function voltarTelaInicio() {
    injetarHtml('Views/mainMenu', 'content');
    chamarNovaTela('mainMenu');
}

