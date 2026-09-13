//Importação das funções
import { injetarHtml, chamarNovaTela, voltarTelaInicio, fecharPopUp, inserirDadosNaLista, abrirPopUp } from "./controllers/screenControl.js";
import { salvarDados, adicionarReceita, editarDados } from "./repositories/addExpensesDAO.js";

// variável global responsável por receber o id da linha no momento do click no botão de edição.
let id_table_row = null;

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
    const btnRadio = event.target.closest("input")
    const btnArrowBack = event.target.closest('i')
    const btnMenu = event.target.closest('li');
    const btn_edition = event.target.closest('td');
    const btnMonth = pattern
    const btnBack = pattern
    const btnSituation = pattern
    


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

                // Recebe o valor informado no input e manda para a função que irá filtrar os dados
                inserirDadosNaLista(inputMont);
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

            event.preventDefault()

        } else if (btnSituation.matches('#payable')) {

            payable.classList.add('btnClicked')
            paid.classList.remove('btnClicked')
            scheduled.classList.remove('btnClicked')

            event.preventDefault()

        } else if (btnSituation.matches('#scheduled')) {

            scheduled.classList.add('btnClicked')
            payable.classList.remove('btnClicked')
            paid.classList.remove('btnClicked')

            event.preventDefault()
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

    const popUp_dueDate = document.getElementById('dueDate-container')
    const dueDateView = document.getElementById('dueDateView')
    

    // ouvinte que verifica qual opção de input do tipo radio button está selecionada
    if (btnRadio) {

        if (btnRadio.matches("#repetition")) {
            // chama a tela de definição da data de vencimento
           abrirPopUp(popUp_dueDate)

        } else if (btnRadio.matches("#variable")) {
            dueDateView.innerHTML = `Dia: --`
        }
    }

    if (btn_edition) {

        if (btn_edition.matches(".edit_Button")) {
            id_table_row = btn_edition.id
            const form_edition = document.querySelector('.edition')
            const tabela_row = document.getElementById(id_table_row);
            const allScreen = document.getElementById('allScreen')

            form_edition.classList.remove('toDown')
            form_edition.classList.add('toUp')
            allScreen.classList.remove('noActive')
            allScreen.classList.add('active')

            tabela_row.style = "background-color: #807e7e;";

        }
    }

    if (pattern) {

        // fecha o pop up onde o usuário informa uma data para o vencimento da despesa.
        if (pattern.matches('#close_popUp_dueDate')) {

            const type = document.querySelector("#repetition");

            fecharPopUp(popUp_dueDate);

            type.checked = false

            event.preventDefault();

        } else if (pattern.matches('#confirm')) {
            // captura o valor infomado no input 'dia' referente ao dia de vencimento
            const day = document.getElementById('day').value

            if (day) {

                fecharPopUp(popUp_dueDate);

                // insere o valor capiturado, no espaço dedicado para apresentação do dia de vencimento escolhido.
                document.getElementById('dueDateView').innerHTML = `Dia: ${day}`

            } else {
                alert("por favor, informe uma data!")
            }

            event.preventDefault();

        } else if (pattern.matches("#btn_save_edition")) {

            const desc = document.querySelector('#desc_edit').value
            const amount = document.querySelector('#amount_edit').value
            const type = document.querySelector('#type_edit').value
            const situation = document.querySelector('#situation_edit').value;
            const tabela_row = document.getElementById(id_table_row);
            const allScreen = document.getElementById('allScreen');
            const form_edition = document.querySelector('.edition')
     
            editarDados(id_table_row, desc, amount, type, situation);

            // formatação do comportamento do formulário de edição
            form_edition.classList.remove('toUp')
            form_edition.classList.add('toDown')
            allScreen.classList.remove('active')
            allScreen.classList.add('noActive')
            // remove o aspecto de linha 'selecionada' da lista
            tabela_row.style = " background-color: #333232;"

            // recarrega a lista editada
            inserirDadosNaLista();

            form_edition.reset()
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
            const dueDate = document.getElementById("day").value;

            // Verifica se foi selecionado alguma das opções de "situação" (pago, a pagar, agendado)!
            if (situation !== null) {

                if (type) {

                    // verifica se o comapo referente ao dia de vencimento está preenchido
                    if (dueDate !== "" && dueDate !== null && dueDate !== undefined) {

                        // chamada da função responsável por guardar os dados no localhost da página
                        salvarDados(description, amount.toString(), month, type, situation.value, dueDate);

                        // reseta o valor apresentado para o vencimento
                        document.getElementById('dueDateView').innerHTML = `Dia: --`

                    } else {

                        // chamada da função responsável por guardar os dados no localhost da página
                        salvarDados(description, amount.toString(), month, type, situation.value);
                    }

                    //limpa os campos de input para que seja possível adicionar novos dados
                    form.reset()
                } else {
                    alert("Favor, selecione um tipo de despesa!")
                }
            } else {
                alert("Favor, selecione uma opção de situação!");
            }

        } else if (btn_add.matches('.submit-income')) {
            const income = document.getElementById('income').value
            const month_income = document.getElementById('month-income').value
            const form = document.getElementById('incomeForm');

            // cadastro de uma nova receira (salário do mês)!
            adicionarReceita(income, month_income);

            form.reset()

        }
    }
})




