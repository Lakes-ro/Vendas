const supabaseUrl = "https://lbjsdaexqhkgxsuwfgmg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxianNkYWV4cWhrZ3hzdXdmZ21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMTk5NjgsImV4cCI6MjA2MTg5NTk2OH0.SV93_0NdI_CgsoV6cTNzKlo74kk0CrViKn_K9fh0hJA";
const database = supabase.createClient(supabaseUrl, supabaseKey);

async function Envio() {
  const nome = document.getElementById("nome").value;
  const quarto = document.getElementById("quarto").value;
  const lista = document.querySelectorAll("#lista-nomes li");

  if (!nome || !quarto) {
    alert("Preencha nome e quarto.");
    return;
  }

  if (lista.length === 0) {
    alert("Adicione algo ao carrinho.");
    return;
  }

  let total = 0;

  for (let li of lista) {
    const produto = li.dataset.produto;
    const sabor = li.dataset.sabor || "-";
    const quantidade = parseInt(li.dataset.quantidade);

    let valorProduto = 0;

    if (produto.includes("Bis") || produto.includes("Suco")) {
      valorProduto = quantidade < 4 ? quantidade * 3 : Math.floor(quantidade / 4) * 10 + (quantidade % 4) * 3;
    } else {
      valorProduto = quantidade * 3;
    }

    total += valorProduto;

    const { error } = await database
      .from("FomeZeroBD")
      .insert({
        Nome: nome,
        Quarto: quarto,
        Produto: produto,
        Quantidade: quantidade,
        Sabor: sabor,
        "Valor Total": valorProduto,
      });

    if (error) {
      alert("Erro ao enviar: " + error.message);
      return;
    }
  }

  alert("Seu pedido foi enviado!");
  window.location.reload();
}


