const campoNome = document.getElementById('campoNome');
const campoCodigo = document.getElementById('campoCodigo');
const campoCusto = document.getElementById('campoCusto');
const mascara = {
    mask: "000,00"
};
const mask = IMask(campoCusto, mascara);

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idParaEditar = params.get("id");
const urlAPI = "https://public.franciscosensaulas.com";

// Função para consultar os dados do projeto pelo ID
async function consultarDadosProjetosPorId() {
    const urlParaConsultarProjeto = `${urlAPI}/api/v1/trabalho/projetos/${idParaEditar}`;
    console.log(urlParaConsultarProjeto);

    try {
        const resposta = await fetch(urlParaConsultarProjeto);

        if (resposta.ok === false) {
            alert("Projeto não encontrado");
            window.location.href = "/projetos/index.html";  // Redireciona caso o projeto não seja encontrado
            return;
        }

        const dadosProjeto = await resposta.json();
        console.log(dadosProjeto);

        // Preenche os campos do formulário com os dados retornados da API
        campoNome.value = dadosProjeto.nome;
        campoCodigo.value = dadosProjeto.codigoProjeto;  // Correção para usar 'codigoProjeto'
        campoCusto.value = dadosProjeto.custoEstimado;  // Correção para usar 'custoEstimado'
    } catch (error) {
        console.error('Erro ao consultar o projeto:', error);
        alert("Erro ao consultar o projeto. Tente novamente.");
    }
}

// Função para editar o projeto
async function editar(evento) {
    evento.preventDefault();

    let nome = campoNome.value;
    let codigo = campoCodigo.value;
    let custo = campoCusto.value;

    // Removendo máscara do campo de custo antes de enviar para a API
    custo = custo.replace(",", ".");  // Substitui vírgula por ponto, caso haja

    const dados = {
        nome: nome,
        codigoprojeto: codigo,  // Corrigido para 'codigoprojeto' em vez de 'codigo'
        custoEstimado: custo  // Corrigido para 'custoEstimado'
    };

    let url = `${urlAPI}/api/v1/trabalho/projetos/${idParaEditar}`;
    
    try {
        const resposta = await fetch(url, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (resposta.ok === false) {
            alert("Não foi possível alterar o projeto.");
        } else {
            location.href = '/projetos/index.html';  // Redireciona para a página de listagem após sucesso
        }
    } catch (error) {
        console.error('Erro ao editar o projeto:', error);
        alert("Erro ao editar o projeto. Tente novamente.");
    }
}

// Adiciona o evento de clique ao botão "Alterar"
const botaoEditar = document.getElementById("botao-alterar");
botaoEditar.addEventListener("click", editar);

// Chama a função para consultar os dados do projeto ao carregar a página
consultarDadosProjetosPorId();
