const campoNome = document.getElementById('campoNome');
const campoCodigo = document.getElementById('campoCodigo');
const campoCusto = document.getElementById('campoCusto');
const mascara = {
    mask: "00,00"
};
const mask = IMask(campoCusto, mascara);

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const idParaEditar = params.get("id");
const urlAPI = "https://public.franciscosensaulas.com";

async function consultarDadosProjetosPorId() {
    const urlParaConsultarProjeto = `${urlAPI}/api/v1/trabalho/projetos/${idParaEditar}`;
    console.log(urlParaConsultarProjeto);

    try {
        const resposta = await fetch(urlParaConsultarProjeto);

        if (resposta.ok === false) {
            alert("Produto não encontrado");
            window.location.href = "/projetos/index.html";
            return;
        }

        const dadosProjeto = await resposta.json();
        console.log(dadosProjeto);

        campoNome.value = dadosProjeto.nome;
        campoCodigo.value = dadosProjeto.codigo;
        campoCusto.value = dadosProjeto.custo;
    } catch (error) {
        console.error('Erro ao consultar o projeto:', error);
        alert("Erro ao consultar o projeto. Tente novamente.");
    }
}

async function editar(evento) {
    evento.preventDefault();

    let nome = campoNome.value;
    let codigo = campoCodigo.value;
    let custo = campoCusto.value;

    // Removendo máscara do campo de custo antes de enviar para a API
    custo = custo.replace(",", ".");  // Substitui vírgula por ponto, caso haja

    const dados = {
        nome: nome,
        codigoprojeto: codigo,  // Corrigido para a variável 'codigo'
        custo: custo
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
            location.href = '/projetos/index.html';
        }
    } catch (error) {
        console.error('Erro ao editar o projeto:', error);
        alert("Erro ao editar o projeto. Tente novamente.");
    }
}

const botaoEditar = document.getElementById("botao-alterar");
botaoEditar.addEventListener("click", editar);

consultarDadosProjetosPorId();
