document.addEventListener('DOMContentLoaded', function () {
    const campoTitulo = document.getElementById('campoTitulo');
    const campoTipo = document.getElementById('campoTipo');
    const campoValorTotal = document.getElementById('campoValorTotal');
    const campoData = document.getElementById('campoData');
    const campoResponsavel = document.getElementById('campoResponsavel');
    const botaoAlterar = document.getElementById('botao-alterar');
    
    // Verifique se os elementos foram encontrados
    if (!campoTitulo || !campoTipo || !campoValorTotal || !campoData || !campoResponsavel || !botaoAlterar) {
        console.error("Um ou mais elementos não foram encontrados no DOM.");
        return;  // Encerra o script se algum elemento não for encontrado
    }

    const urlParams = new URLSearchParams(window.location.search);
    const idParaEditar = urlParams.get("id");

    // Verificar se o id está presente e é válido
    if (!idParaEditar) {
        Swal.fire({
            title: "Erro!",
            text: "ID não encontrado na URL.",
            icon: "error"
        });
        return;
    }

    // URL da API
    const urlApi = "https://public.franciscosensaulas.com";

    // Função para consultar os dados do relatório financeiro
    async function consultarRelatorioPorId() {
        const url = `${urlApi}/api/v1/trabalho/relatorios-financeiros/${idParaEditar}`;
        
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error("Relatório não encontrado.");
            const relatorio = await resposta.json();

            // Preencher os campos com os dados do relatório
            campoTitulo.value = relatorio.titulo;
            campoTipo.value = relatorio.tipo;
            campoValorTotal.value = relatorio.valorTotal;
            campoData.value = relatorio.dataEmissao;
            campoResponsavel.value = relatorio.responsavel;
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Função para editar o relatório
    async function editarRelatorio(evento) {
        evento.preventDefault();

        const dados = {
            titulo: campoTitulo.value,
            tipo: campoTipo.value,
            valorTotal: campoValorTotal.value,
            dataEmissao: campoData.value,
            responsavel: campoResponsavel.value
        };

        const url = `${urlApi}/api/v1/trabalho/relatorios-financeiros/${idParaEditar}`;
        
        try {
            const resposta = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            if (!resposta.ok) throw new Error("Erro ao editar o relatório.");

            Swal.fire({
                title: "Sucesso!",
                text: "Relatório editado com sucesso!",
                icon: "success"
            });

            // Redireciona para a página principal após a edição
            window.location.href = "/relatorio-financeiro/index.html";
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Evento para o botão de alteração
    botaoAlterar.addEventListener('click', editarRelatorio);

    // Carregar os dados do relatório
    consultarRelatorioPorId();
});
