export function obterTodoLocalStorage() {
    const dados = {};

    // Percorre todas as chaves salvas no localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        const valor = localStorage.getItem(chave);

        // Tenta converter de JSON (caso você tenha salvo arrays/objetos),
        // senão mantém o valor em formato de string
        try {
            dados[chave] = JSON.parse(valor);
        } catch (e) {
            dados[chave] = valor;
        }
    }

    return dados;

}

// Função responsável por receber os dados de cadastro de uma nova desepesa e enviar para o banco de dados
export function salvarDados(desc, amount, month, type, situation, day) {

    const datas = [desc, amount, month, type, situation]

    let is_True;

    for (let i = 0; i < datas.length; i++) {

        // validação dos dados
        if (datas[i] == undefined || datas[i] == null || datas[i] === '') {

            is_True = false

        } else {
            is_True = true
        }
    }

    if (is_True) {
        let expenses = {}

        // caso a despesa cadastrada seja do tipo repetição, adiciona o dia do vencimento no cadastro
        if (type === 'variável') {
            expenses = {
                descricao: desc,
                valor: amount,
                mes: month,
                tipo: type,
                situacao: situation
            };
        } else if (type === 'repetição') {
            expenses = {
                descricao: desc,
                valor: amount,
                vencimento: day,
                mes: month,
                tipo: type,
                situacao: situation
            };
        }

        try {
            localStorage.setItem(Date.now(), JSON.stringify(expenses))
            const msg = 'Despesa cadastrada com sucesso!';

            alert(msg)

        } catch {
            console.error(Error);
            alert(Error)
        }
    } else {
        alert('erro ao salvar dados, todos os campos devem estar preenchidos')
    }
}

export function adicionarReceita(income, month_income) {

    if (income !== null && income !== undefined && month_income !== null && month_income !== undefined) {

        let data_income = {
            salario: income,
            mes: month_income
        }

        try {
            localStorage.setItem(Date.now(), JSON.stringify(data_income))

            alert("Receita cadastrada com sucesso!");
        } catch {
            console.error('erro ao cadastrar receita!');
            alert("erro ao cadastrar receita!");
        }

    }
}

export function editarDados(id, desc, amount, type, situation) {

    const dados = obterTodoLocalStorage();

    for (let dado in dados) {
        if (dado == id) {

            if (desc !== "") {
                dados[id].descricao = desc
            }
            if (amount > 0) {
                dados[id].valor = amount
            }
            if (type !== "--selecione--") {
                dados[id].tipo = type
            }
            if (situation !== "--selecione--") {
                dados[id].situacao = situation
            }
        }
    }
    try {

        localStorage.setItem(id, JSON.stringify(dados[id]));
        alert('dados editados com sucesso!')

    } catch {
        console.error('erro ao editar dados!');
    }

}