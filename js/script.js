// CRUD com Fetch e JSON. O back-end agora é PHP (não Flask).
let registros = { tutores: [], pets: [], atendimentos: [] };

async function requisicao(entidade, metodo = "GET", dados = null) {
    let opcoes = { method: metodo };
    if (dados !== null) {
        opcoes.headers = { "Content-Type": "application/json" };
        opcoes.body = JSON.stringify(dados);
    }
    let resposta = await fetch("php/" + ({ GET: "read.php", POST: "create.php", PUT: "update.php", DELETE: "delete.php" }[metodo]) + "?entidade=" + entidade, opcoes);
    let resultado = await resposta.json();
    if (!resposta.ok || resultado.sucesso === false) {
        throw new Error(resultado.erro || "Não foi possível completar a operação.");
    }
    return resultado;
}

function valor(id) { return document.getElementById(id).value.trim(); }
function campo(id, conteudo) { document.getElementById(id).value = conteudo ?? ""; }
function texto(elemento, conteudo) { elemento.textContent = conteudo ?? ""; }

function opcao(select, id, nome) {
    let item = document.createElement("option");
    item.value = id;
    texto(item, nome);
    select.appendChild(item);
}

function botao(nome, acao, item) {
    let elemento = document.createElement("button");
    elemento.type = "button";
    texto(elemento, nome);
    elemento.addEventListener("click", function () { acao(item); });
    return elemento;
}

function criarLinha(lista, descricao, entidade, registro) {
    let linha = document.createElement("li");
    let descricaoEl = document.createElement("span");
    texto(descricaoEl, descricao);
    linha.appendChild(descricaoEl);
    let acoes = document.createElement("div");
    acoes.className = "acoes";
    acoes.appendChild(botao("Editar", editar, { entidade: entidade, registro: registro }));
    acoes.appendChild(botao("Excluir", excluir, { entidade: entidade, registro: registro }));
    linha.appendChild(acoes);
    lista.appendChild(linha);
}

async function carregarTudo() {
    try {
        registros.tutores = await requisicao("tutores");
        registros.pets = await requisicao("pets");
        registros.atendimentos = await requisicao("atendimentos");
        let listaTutores = document.getElementById("lista-tutores");
        let listaPets = document.getElementById("lista-pets");
        let listaAtendimentos = document.getElementById("lista-atendimentos");
        let selectTutor = document.getElementById("pet-tutor");
        let selectPet = document.getElementById("atend-pet");
        listaTutores.replaceChildren();
        listaPets.replaceChildren();
        listaAtendimentos.replaceChildren();
        selectTutor.replaceChildren();
        selectPet.replaceChildren();
        opcao(selectTutor, "", "Escolha o tutor");
        opcao(selectPet, "", "Escolha o pet");

        registros.tutores.forEach(function (t) {
            criarLinha(listaTutores, t.Nome + " | " + (t.Telefone || "sem telefone") + " | " + (t.Email || "sem email"), "tutores", t);
            opcao(selectTutor, t.ID_Tutor, t.Nome);
        });
        registros.pets.forEach(function (p) {
            let tutor = registros.tutores.find(function (t) { return t.ID_Tutor == p.ID_Tutor; });
            criarLinha(listaPets, p.Nome + " (" + p.Especie + ") | Tutor: " + (tutor ? tutor.Nome : p.ID_Tutor), "pets", p);
            opcao(selectPet, p.ID_Pet, p.Nome);
        });
        registros.atendimentos.forEach(function (a) {
            let pet = registros.pets.find(function (p) { return p.ID_Pet == a.ID_Pet; });
            criarLinha(listaAtendimentos, a.Servico + " | R$ " + Number(a.Valor).toFixed(2).replace(".", ",") + " | " + a.Data_hora + " | Pet: " + (pet ? pet.Nome : a.ID_Pet), "atendimentos", a);
        });
    } catch (erro) {
        alert("Erro ao carregar dados: " + erro.message);
    }
}

let formularios = {
    tutores: { form: "form-tutor", id: "tutor-id", cancelar: "cancelar-tutor" },
    pets: { form: "form-pet", id: "pet-id", cancelar: "cancelar-pet" },
    atendimentos: { form: "form-atendimento", id: "atend-id", cancelar: "cancelar-atendimento" }
};

function limpar(entidade) {
    let config = formularios[entidade];
    document.getElementById(config.form).reset();
    campo(config.id, "");
    document.getElementById(config.cancelar).hidden = true;
}

function editar(item) {
    let e = item.entidade, r = item.registro;
    limpar(e);
    if (e === "tutores") {
        campo("tutor-id", r.ID_Tutor);
        campo("tutor-nome", r.Nome);
        campo("tutor-telefone", r.Telefone);
        campo("tutor-email", r.Email);
    } else if (e === "pets") {
        campo("pet-id", r.ID_Pet);
        campo("pet-nome", r.Nome);
        campo("pet-especie", r.Especie);
        campo("pet-raca", r.Raca);
        campo("pet-nascimento", r.Data_nascimento);
        campo("pet-tutor", r.ID_Tutor);
    } else {
        campo("atend-id", r.ID_Atendimento);
        campo("atend-servico", r.Servico);
        campo("atend-data", (r.Data_hora || "").replace(" ", "T").slice(0, 16));
        campo("atend-valor", r.Valor);
        campo("atend-pet", r.ID_Pet);
    }
    document.getElementById(formularios[e].cancelar).hidden = false;
    document.getElementById(formularios[e].form).scrollIntoView({ behavior: "smooth", block: "center" });
}

async function excluir(item) {
    let ids = { tutores: "ID_Tutor", pets: "ID_Pet", atendimentos: "ID_Atendimento" };
    if (!confirm("Deseja excluir este registro? Registros vinculados também poderão ser excluídos.")) return;
    try {
        await requisicao(item.entidade, "DELETE", { id: item.registro[ids[item.entidade]] });
        limpar(item.entidade);
        await carregarTudo();
    } catch (erro) { alert(erro.message); }
}

function dadosFormulario(entidade) {
    if (entidade === "tutores") return {
        Nome: valor("tutor-nome"), Telefone: valor("tutor-telefone"), Email: valor("tutor-email")
    };
    if (entidade === "pets") return {
        Nome: valor("pet-nome"), Especie: valor("pet-especie"), Raca: valor("pet-raca"),
        Data_nascimento: valor("pet-nascimento"), ID_Tutor: valor("pet-tutor")
    };
    return {
        Servico: valor("atend-servico"), Data_hora: valor("atend-data").replace("T", " ") + ":00",
        Valor: valor("atend-valor"), ID_Pet: valor("atend-pet")
    };
}

Object.keys(formularios).forEach(function (entidade) {
    let config = formularios[entidade];
    document.getElementById(config.form).addEventListener("submit", async function (evento) {
        evento.preventDefault();
        let dados = dadosFormulario(entidade);
        let id = valor(config.id);
        if (id) dados.id = Number(id);
        try {
            await requisicao(entidade, id ? "PUT" : "POST", dados);
            limpar(entidade);
            await carregarTudo();
        } catch (erro) { alert(erro.message); }
    });
    document.getElementById(config.cancelar).addEventListener("click", function () { limpar(entidade); });
});

carregarTudo();
