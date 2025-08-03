const supabaseUrl = "https://lbjsdaexqhkgxsuwfgmg.supabase.co";
const supabaseKey = "SUA_CHAVE_PUBLICA_DO_SUPABASE_AQUI"; // <- troque aqui
const database = supabase.createClient(supabaseUrl, supabaseKey);

// Botão "Adicionar ao Carrinho"
function btnCadastrar() {
  const nome = document.getElementById("nome").value;
  const quarto = document.getElementById("quarto").value;

  if (!nome || !quarto) {
    alert("Preencha nome e quarto antes.");
    return;
  }

  const selects = document.querySelectorAll(".card");
  const lista = document.getElementById("lista-nomes");
  lista.innerHTML = "";

  selects.forEach((card) => {
    const titulo = card.querySelector("h1").innerText;
    const selects = card.querySelectorAll("select");

    if (selects.length === 2) {
      const sabor = selects[0].value;
      const qtd = parseInt(selects[1].value);

      if (qtd > 0) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = `${titulo} - ${sabor} x${qtd}`;
        li.dataset.produto = titulo;
        li.dataset.sabor = sabor;
        li.dataset.quantidade = qtd;
        lista.appendChild(li);
      }
    } else if (selects.length === 1) {
      const qtd = parseInt(selects[0].value);
      if (qtd > 0) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = `${titulo} x${qtd}`;
        li.dataset.produto = titulo;
        li.dataset.sabor = "-";
        li.dataset.quantidade = qtd;
        lista.appendChild(li);
      }
    }
  });

  atualizarTotal();
}

// Atualiza o total do carrinho
function atualizarTotal() {
  const itens = document.querySelectorAll("#lista-nomes li");
  let total = 0;

  itens.forEach((li) => {
    const produto = li.dataset.produto;
    const qtd = parseInt(li.dataset.quantidade);

    if (produto.includes("Bis")) {
      total += qtd < 4 ? qtd * 3 : Math.floor(qtd / 4) * 10 + (qtd % 4) * 3;
    } else if (produto.includes("Suco")) {
      total += qtd < 4 ? qtd * 3 : Math.floor(qtd / 4) * 10 + (qtd % 4) * 3;
    } else {
      total += qtd * 3;
    }
  });

  document.getElementById("totalValue").innerText = "R$ " + total.toFixed(2);
}

// Botão "Enviar pedido"
async function Envio() {
  const nome = document.getElementById("nome").value;
  const quarto = document.getElementById("quarto").value;
  const lista = document.querySelectorAll("#lista-nomes li");

  if (!nome || !quarto) {
    alert("Preencha nome e quarto.");
    return;
  }

  if (lista.length === 0) {
    alert("Adicione algo ao carrinho antes de enviar.");
    return;
  }

  let total = 0;

  for (let li of lista) {
    const produto = li.dataset.produto;
    const sabor = li.dataset.sabor || "-";
    const quantidade = parseInt(li.dataset.quantidade);

    if (produto.includes("Bis")) {
      total += quantidade < 4 ? quantidade * 3 : Math.floor(quantidade / 4) * 10 + (quantidade % 4) * 3;
    } else if (produto.includes("Suco")) {
      total += quantidade < 4 ? quantidade * 3 : Math.floor(quantidade / 4) * 10 + (quantidade % 4) * 3;
    } else {
      total += quantidade * 3;
    }

    const { error } = await database
      .from("FomeZeroBD")
      .insert({
        Nome: nome,
        Quarto: quarto,
        Produto: produto,
        Quantidade: quantidade,
        Sabor: sabor,
        "Valor Total": total,
      });

    if (error) {
      alert("Erro ao enviar: " + error.message);
      return;
    }
  }

  alert("Seu pedido foi enviado!");
  window.location.reload();
}

