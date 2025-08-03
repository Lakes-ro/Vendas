// Conexão com Supabase
const supabaseUrl = "https://lbjsdaexqhkgxsuwfgmg.supabase.co";
const supabaseKey = "SUA_CHAVE_PUBLICA_DO_SUPABASE_AQUI"; // substitua pela sua
const database = supabase.createClient(supabaseUrl, supabaseKey);

// Função chamada ao clicar em "Enviar pedido"
async function Envio() {
  const nome = document.getElementById("nome").value;
  const quarto = document.getElementById("quarto").value;

  if (!nome || !quarto) {
    alert("Preencha nome e quarto antes de enviar.");
    return;
  }

  const danixSelects = document.querySelectorAll("#danix select");
  const danixSabor = danixSelects[0].value;
  const danixQtd = parseInt(danixSelects[1].value);

  const guaravitaQtd = parseInt(document.querySelector("#guaravita select").value);

  const bisQtd = parseInt(document.querySelector("#bis select").value);

  const sucoSelects = document.querySelectorAll("#suco select");
  const sucoSabor = sucoSelects[0].value;
  const sucoQtd = parseInt(sucoSelects[1].value);

  let produtos = [];
  let total = 0;

  if (danixQtd > 0) {
    produtos.push({ produto: "Danix", quantidade: danixQtd, sabor: danixSabor });
    total += danixQtd * 3;
  }

  if (guaravitaQtd > 0) {
    produtos.push({ produto: "Guaravita", quantidade: guaravitaQtd });
    total += guaravitaQtd * 3;
  }

  if (bisQtd > 0) {
    produtos.push({ produto: "Bis Xtra", quantidade: bisQtd });
    total += bisQtd < 4 ? bisQtd * 3 : Math.floor(bisQtd / 4) * 10 + (bisQtd % 4) * 3;
  }

  if (sucoQtd > 0) {
    produtos.push({ produto: "Suco", quantidade: sucoQtd, sabor: sucoSabor });
    total += sucoQtd < 4 ? sucoQtd * 3 : Math.floor(sucoQtd / 4) * 10 + (sucoQtd % 4) * 3;
  }

  if (produtos.length === 0) {
    alert("Selecione pelo menos 1 produto.");
    return;
  }

  for (let item of produtos) {
    const { produto, quantidade, sabor = "-" } = item;

    const { error } = await database
      .from("FomeZeroBD")
      .insert({
        Nome: nome,
        Quarto: quarto,
        Produto: produto,
        Quantidade: quantidade,
        Sabor: sabor,
        "Valor Total": total
      });

    if (error) {
      alert("Erro ao enviar o pedido: " + error.message);
      return;
    }
  }

  // Alerta final e recarregar
  alert("Seu pedido foi enviado!");
  window.location.reload();
}
