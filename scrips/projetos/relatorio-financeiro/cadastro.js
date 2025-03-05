let urlApi = "https://public.franciscosensaulas.com";
const campoValorTotal = document.getElementById('campoValorTotal');
const mascara = {
    mask: "000.00"
};
const mask = IMask(campoValorTotal, mascara);

document.addEventListener('DOMContentLoaded', function () {
    const botaoSalvar = document.getElementById("btn-salvar");
    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', salvar);
    } else {
        console.error("Elemento 'btn-salvar' não encontrado.");
    }
});



async function salvar(e) {
    e.preventDefault();
    
    // Obtendo valores dos campos
    let campoTitulo = document.getElementById("campoTitulo");
    let titulo = campoTitulo.value;
    
    // Validação do título
    if (titulo.length < 3) {
        alert("Título deve conter no mínimo 3 caracteres");
        return;
    }

    if (titulo.length > 50) {
        alert("Título deve conter no máximo 50 caracteres");
        return;
    }

    let tipo = document.getElementById("campoTipo").value;  // Novo campo 'tipo'

    let valorTotal = campoValorTotal.value;

    // Verificando se o valorTotal está no formato correto
    if (!valorTotal || valorTotal === "000.00" || isNaN(valorTotal.replace(",", "."))) {
        alert("Valor total inválido. Por favor, insira um valor válido.");
        return;
    }

    // Remover a máscara para enviar o valor correto
    valorTotal = valorTotal.replace(".", "").replace(",", "."); // Remover máscara e ajustar o valor

    let dataEmissao = document.getElementById("campoDataEmissao").value; // Novo campo 'dataEmissao'

    let responsavel = document.getElementById("campoResponsavel").value; // Novo campo 'responsavel'

    // Atribuindo valores ao objeto dados
    const dados = {
        titulo: titulo,
        tipo: tipo,
        valorTotal: parseFloat(valorTotal), // Convertendo o valorTotal para número
        dataEmissao: dataEmissao,
        responsavel: responsavel
    };

    let url = `${urlApi}/api/v1/trabalho/relatorios-financeiros`;  // Atualizando o endpoint conforme necessário

    try {
        // Enviando requisição para o servidor
        const resposta = await fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dados)
        });

        // Adicionando um log para entender a resposta do servidor
        const respostaTexto = await resposta.text();  // Vamos obter o conteúdo como texto para análise
        console.log('Resposta do servidor:', respostaTexto);  // Isso ajuda a entender o que foi retornado

        // Verificando se a resposta foi bem-sucedida
        if (resposta.ok) {
            // Redireciona para a página de projetos
            location.href = '/relatorio-financeiro/index.html';
        } else {
            // Tentando transformar a resposta em JSON, caso a resposta seja um erro
            let errorData;
            try {
                errorData = JSON.parse(respostaTexto); // Tentando fazer o parse do texto como JSON
            } catch (e) {
                errorData = { message: 'Erro desconhecido' }; // Caso não consiga, retornamos uma mensagem padrão
            }

            // Exibindo um alerta caso a resposta seja um erro
            alert(`Erro ao cadastrar relatorio: ${errorData.message || 'Erro desconhecido'}`);
        }
    } catch (error) {
        // Tratamento de erro no caso de falha na requisição
        console.error('Erro na requisição:', error);
        alert("Não foi possível cadastrar o relatorio. Tente novamente.");
    }
}
