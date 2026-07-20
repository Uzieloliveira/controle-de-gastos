// Função responsável por receber os dados de cadastro de uma nova desepesa e enviar para o banco de dados
export function salvarDados(desc, amount, date) {

    const datas = [desc, amount, date]

    for (let i = 0; i < datas.length; i++) {

        // validação dos dados
        if (datas[i] !== undefined && datas[i] !== null && datas[i] !== "") {

            localStorage.setItem(i, datas[i]);

        } else {
            alert('erro ao enviar dado!')
        }
    }

}