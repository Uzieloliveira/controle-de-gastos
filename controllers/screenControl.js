import { verificarDados } from "../controllers/dataVerify.js";
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

export function fecharPopUp(element) {
    if (element) {
        element.classList.remove('active');
        element.classList.add('noActive');
    }
}

export function abrirPopUp(element) {
    if (element) {
        element.classList.remove("noActive");
        element.classList.add("active");
    }
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

export function voltarTelaInicio() {
    injetarHtml('Views/mainMenu', 'content');
    chamarNovaTela('mainMenu');
}

// define uma cor para cada tipo de valor da coluna 'situação'(pago, a pagar, agendado),apresentada na lista de despesas!
function definirCor(dado) {
    if (dado === "pago") {
        return "#5fff4a";
    } else if (dado === "a pagar") {
        return "#ff3f3f";
    } else if (dado === "agendado") {
        return "#56c9ff";
    }

    if (dado < 0) {
        return "#ff3f3f";
    } else {
        return "rgb(8, 194, 132);"
    }
}

// insere os valores dentro de um texto
function inserirInfomacaoRodapeLista(totalSum, totalSumPayable, balance) {

    let sum = balance - totalSumPayable
    let colorBalance = definirCor(sum)

    return ` 
    <div id="total_SumPayable"><p style= "color: #fafafa">Valor total a pagar / agendado:</p>&nbsp<p style= "color: var(---theme-color)">R$ ${totalSumPayable} </p></div>

    <div id="total_Sum"><p style= "color: #fafafa">Soma total:</p>&nbsp<p style= "color: var(---theme-color)">R$ ${totalSum}</p></div>

    <div id="total_Balance"><p style= "color: #fafafa">Saldo atual:</p>&nbsp<p style= "color: var(---theme-color)">R$ ${balance}</p></div>
    
    <div id="total_Balance"><p style= "color: #fafafa">Restante:</p>&nbsp<p style= "color: ${colorBalance}">R$ ${balance - totalSumPayable}</p></div>`

}

function criarListaFormatada(datas, month) {

    let results = {};
    let totalSum = 0;
    let totalSumPayable = 0;
    let list = '';
    let font_color_situation;
    let balance = 0

    for (let id in datas) {

        //constante usada para fazer a verificação da validade dos dados
        const dataVerify = verificarDados(datas[id]);
        font_color_situation = definirCor(datas[id].situacao);

        if (dataVerify) {

            let showDueDate = ""

            if (month) {
                if (datas[id].mes === month) {

                    if (datas[id].vencimento) {
                        showDueDate = `<p>(dia ${datas[id].vencimento})`
                    }

                    list +=
                        `<tr class = "table_row" id ="${id}">

                            <td style= "color: var(---theme-color); text-align: left;">&nbsp&nbsp${datas[id].descricao}</td>

                            <td style = "text-align: left;">R$&nbsp&nbsp<span style= "color: var(---theme-color);">${datas[id].valor}</span></td>

                            <td>${datas[id].tipo}${showDueDate}</p></td>

                            <td style= "color: ${font_color_situation}">${datas[id].situacao}</td>

                            <td id ="${id}" class="edit_Button"><i class="fa-regular fa-pen-to-square"></i></td>
                        </tr>`

                    // faz a soma de todos os valores dos resultados armazenados
                    totalSum += Number(datas[id].valor)

                    // faz a soma de todos os valores de despesas 'a pagar' e 'agendada'
                    if (datas[id].situacao === "a pagar" || datas[id].situacao === "agendado") {
                        totalSumPayable += Number(datas[id].valor)
                    }
                }

            } else {

                if (datas[id].vencimento) {
                    showDueDate = `<p>(dia ${datas[id].vencimento})`
                }
                //insere na tela, uma lista de todos os dados armazenados no localStorage
                list +=
                    `<tr class = "table_row" id ="${id}">
                            <td style= "color: var(---theme-color); text-align: left;">&nbsp&nbsp${datas[id].descricao}</td>

                            <td style = "text-align: left;">R$&nbsp&nbsp<span style= "color: var(---theme-color);">${datas[id].valor}</span></td>

                            <td>${datas[id].tipo}${showDueDate}</p></td>

                            <td style= "color: ${font_color_situation}">${datas[id].situacao} </td>

                            <td id ="${id}" class="edit_Button"><i class="fa-regular fa-pen-to-square"></i></td> 
                        </tr>`

                // faz a soma de todos os valores dos resultados armazenados
                totalSum += Number(datas[id].valor)

                // faz a soma de todos os valores de despesas 'a pagar' e 'agendada'
                if (datas[id].situacao === "a pagar" || datas[id].situacao === "agendado") {
                    totalSumPayable += Number(datas[id].valor)
                }
            }

        }

        // salva o salário na variável 'balance', que será mostrado na tela da lista junto as demais informações.
        if (datas[id].salario) {
            if (datas[id].mes == month) {

                balance = Number(datas[id].salario)
            }
        }
    }

    return results = {
        lista: list,
        soma_total: totalSum,
        total_a_pagar: totalSumPayable,
        saldo_atual: balance
    };
}

export function inserirDadosNaLista(month) {

    //adiciona os dados em uma constante
    const dados = obterTodoLocalStorage();
    let formatedList = '';

    if (month) {

        formatedList = criarListaFormatada(dados, month)

    } else {
        formatedList = criarListaFormatada(dados);
    }

    fetch("./Views/listScreen").then(response => {
        if (!response.ok) {
            // se o arquivo não existir ou der erro, avisa no console
            throw new Error("Erro ao carregar a tela: " + response.statusText);
        }
        return response.text();
    })
        .then(html => {
            const tabela = document.querySelector('tbody');
            if (tabela) {

                // injeta uma lista na tela com os campos preenchidos
                tabela.innerHTML = formatedList.lista;

            }
            const informacoes = document.querySelector("#displayInformations");

            if (informacoes) {

                informacoes.innerHTML = inserirInfomacaoRodapeLista(formatedList.soma_total, formatedList.total_a_pagar, formatedList.saldo_atual);
            }
        })
}

export function mostrarEsconderInput(component, container_input, id_input, id_input_select) {

    const input_value = document.getElementById(id_input);
    const input_select = document.getElementById(id_input_select);

    if (component.checked) {
        container_input.style = "display: flex;"
    } else {

        if (input_select) {
            container_input.style = "display: none;"
            input_select.value = "--selecione--"
        } else {
            container_input.style = "display: none;"
            input_value.value = '';
        }

    }
}
export function definirEstiloBotao(btnSituation, event) {


    const paid = document.getElementById("paid")
    const payable = document.getElementById("payable")
    const scheduled = document.getElementById("scheduled")

    if (btnSituation !== null) {

        if (btnSituation.matches('#paid')) {

            paid.style.backgroundColor = "#78e2b1";
            payable.style.backgroundColor = "transparent";
            scheduled.style.backgroundColor = "transparent";
            payable.style.color = "#fafafa";
            scheduled.style.color = "#fafafa";
            paid.style.color = "#022515";

            paid.classList.add('btnClicked')
            payable.classList.remove('btnClicked')
            scheduled.classList.remove('btnClicked')

            event.preventDefault()

        } else if (btnSituation.matches('#payable')) {

            paid.style.backgroundColor = "transparent";
            payable.style.backgroundColor = "#f32525";
            scheduled.style.backgroundColor = "transparent";
            paid.style.color = "#fafafa";
            scheduled.style.color = "#fafafa";
            payable.style.color = "#3f0404";

            payable.classList.add('btnClicked')
            paid.classList.remove('btnClicked')
            scheduled.classList.remove('btnClicked')

            event.preventDefault()


        } else if (btnSituation.matches('#scheduled')) {

            paid.style.backgroundColor = "transparent";
            payable.style.backgroundColor = "transparent";
            scheduled.style.backgroundColor = "#56c9ff";
            paid.style.color = "#fafafa";
            payable.style.color = "#fafafa";
            scheduled.style.color = "#022738";

            scheduled.classList.add('btnClicked')
            paid.classList.remove('btnClicked')
            payable.classList.remove('btnClicked')

            event.preventDefault()
        }

    } else {
        paid.style.backgroundColor = "transparent";
        payable.style.backgroundColor = "transparent";
        scheduled.style.backgroundColor = "transparent";
        paid.style.color = "#fafafa";
        payable.style.color = "#fafafa";
        scheduled.style.color = "#fafafa";

        paid.classList.remove('btnClicked')
        payable.classList.remove('btnClicked')
        scheduled.classList.remove('btnClicked')

        event.preventDefault()
    }
}


// função responsável por esconder os inputs novamente após salvar os dados
export function resetarInputs() {
    const input_desc_edit = document.querySelector(".container_input_edit_desc");
    const input_amount_edit = document.querySelector(".container_input_edit_amount");
    const input_type_edit = document.querySelector(".container_input_edit_type");
    const input_situation_edit = document.querySelector(".container_input_edit_situation");
    const input_dueDate_edit = document.querySelector('#dueDate_edit');

    const list_input_reset = [input_desc_edit, input_amount_edit, input_type_edit, input_situation_edit, input_dueDate_edit];

    for (let i = 0; i < list_input_reset.length; i++) {
        list_input_reset[i].style = "display: none";
    }
}
