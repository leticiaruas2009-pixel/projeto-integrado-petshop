// ========== FUNÇÕES DE APOIO ==========

// Busca dados de uma rota (GET) e devolve o JSON
async function buscar(url) {
    const resposta = await fetch(url);   // await = "espere a resposta chegar"
    return resposta.json();
}

// Envia dados para uma rota (POST). Devolve true se deu certo
async function enviar(url, dados) {
    const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)      // transforma o objeto em texto JSON
    });
    const resultado = await resposta.json();
    if (!resposta.ok) {                  // se o Flask devolveu erro (400, 404...)
        alert(resultado.erro);
        return false;
    }
    return true;
}


// ========== TUTORES ==========

async function carregarTutores() {
    const tutores = await buscar("/tutores");
    const lista = document.getElementById("lista-tutores");
    const select = document.getElementById("pet-tutor");

    lista.innerHTML = "";   // limpa antes de preencher de novo
    select.innerHTML = '<option value="">Escolha o tutor</option>';

    for (const t of tutores) {
        lista.innerHTML += `<li><strong>${t.nome}</strong><br>
            ${t.telefone || "sem telefone"} · ${t.email || "sem email"}</li>`;
        select.innerHTML += `<option value="${t.id_tutor}">${t.nome}</option>`;
    }
}

document.getElementById("form-tutor").addEventListener("submit", async (evento) => {
    evento.preventDefault();   // impede a página de recarregar
    const deuCerto = await enviar("/tutores", {
        nome: document.getElementById("tutor-nome").value,
        telefone: document.getElementById("tutor-telefone").value || null,
        email: document.getElementById("tutor-email").value || null
    });
    if (deuCerto) {
        evento.target.reset();   // limpa o formulário
        carregarTutores();       // atualiza a lista
    }
});


// ========== PETS ==========

async function carregarPets() {
    const pets = await buscar("/pets");
    const lista = document.getElementById("lista-pets");
    const select = document.getElementById("atend-pet");

    lista.innerHTML = "";
    select.innerHTML = '<option value="">Escolha o pet</option>';

    for (const p of pets) {
        lista.innerHTML += `<li><strong>${p.nome}</strong> (${p.especie}${p.raca ? ", " + p.raca : ""})<br>
            Tutor nº ${p.id_tutor}</li>`;
        select.innerHTML += `<option value="${p.id_pet}">${p.nome}</option>`;
    }
}

document.getElementById("form-pet").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const deuCerto = await enviar("/pets", {
        nome: document.getElementById("pet-nome").value,
        especie: document.getElementById("pet-especie").value,
        raca: document.getElementById("pet-raca").value || null,
        data_nascimento: document.getElementById("pet-nascimento").value || null,
        id_tutor: Number(document.getElementById("pet-tutor").value)
    });
    if (deuCerto) {
        evento.target.reset();
        carregarPets();
    }
});


// ========== ATENDIMENTOS ==========

async function carregarAtendimentos() {
    const atendimentos = await buscar("/atendimentos");
    const lista = document.getElementById("lista-atendimentos");
    lista.innerHTML = "";

    for (const a of atendimentos) {
        const valor = a.valor.toFixed(2).replace(".", ",");   // 80 vira "80,00"
        lista.innerHTML += `<li><strong>${a.servico}</strong> · R$ ${valor}<br>
            ${a.data_hora} · Pet nº ${a.id_pet}</li>`;
    }
}

document.getElementById("form-atendimento").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    // o campo de data devolve "2026-11-17T10:00"; o MySQL prefere "2026-11-17 10:00:00"
    const dataHora = document.getElementById("atend-data").value.replace("T", " ") + ":00";
    const deuCerto = await enviar("/atendimentos", {
        servico: document.getElementById("atend-servico").value,
        data_hora: dataHora,
        valor: parseFloat(document.getElementById("atend-valor").value),
        id_pet: Number(document.getElementById("atend-pet").value)
    });
    if (deuCerto) {
        evento.target.reset();
        carregarAtendimentos();
    }
});


// ========== AO ABRIR A PÁGINA ==========
carregarTutores();
carregarPets();
carregarAtendimentos();