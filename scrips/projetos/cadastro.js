let urlApi = "https://public.franciscosensaulas.com";
const campoCusto = document.getElementById('campoCusto');
const mascara = {
    mask: "000.00"
};
const mask = IMask(campoCusto, mascara);

let botaoSalvar = document.getElementById("btn-salvar");
botaoSalvar.addEventListener('click', salvar);

async function salvar(e) {
    e.preventDefault();
    
    // Obtendo valores dos campos
    let campoNome = document.getElementById("campoNome");
    let nome = campoNome.value;
    
    // Validação do nome
    if (nome.length < 3) {
        alert("Nome deve conter no mínimo 3 caracteres");
        return;
    }

    if (nome.length > 20) {
        alert("Nome deve conter no máximo 20 caracteres");
        return;
    }

    let custo = campoCusto.value;

    // Verificando se o preço está no formato correto
    if (!custo || custo === "000.00" || isNaN(custo.replace(",", "."))) {
        alert("Preço inválido. Por favor, insira um valor válido.");
        return;
    }

    // Remover a máscara para enviar o valor correto
    custo = custo.replace(".", "").replace(",", "."); // Remover máscara e ajustar o valor

    let codigo = document.getElementById("campoCodigo").value; // Capturando código

    // Atribuindo valores ao objeto dados
    const dados = {
        nome: nome,
        codigoProjeto: codigo,
        custoEstimado: parseFloat(custo) // Convertendo o custo para número
    };

    let url = `${urlApi}/api/v1/trabalho/projetos`;

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
            // Redireciona para a página de produtos
            location.href = '/projetos/index.html';
        } else {
            // Tentando transformar a resposta em JSON, caso a resposta seja um erro
            let errorData;
            try {
                errorData = JSON.parse(respostaTexto); // Tentando fazer o parse do texto como JSON
            } catch (e) {
                errorData = { message: 'Erro desconhecido' }; // Caso não consiga, retornamos uma mensagem padrão
            }

            // Exibindo um alerta caso a resposta seja um erro
            alert(`Erro ao cadastrar projeto: ${errorData.message || 'Erro desconhecido'}`);
        }
    } catch (error) {
        // Tratamento de erro no caso de falha na requisição
        console.error('Erro na requisição:', error);
        alert("Não foi possível cadastrar o projeto. Tente novamente.");
    }
}
