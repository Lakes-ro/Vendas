var listaNomes = [];

function btnCadastrar(event) {
    var nome = $("#nome").val();
    var quarto = $("#quarto").val();
    let produtosSelecionados = coletarProdutos();

    if (!validarFormulario(nome, quarto) || produtosSelecionados.length === 0) {
        alert("Preencha todos os campos e selecione ao menos um produto.");
        return;
    }

    let pessoaObjeto = { nome, quarto, produtos: produtosSelecionados };
    listaNomes.push(pessoaObjeto);

    AdicionarNomesElementoHtml(pessoaObjeto);
    atualizarTotal();
}

function coletarProdutos() {
    let produtos = [];

    // Danix
    let saborDanix = $("#danix select").eq(0).find(":selected").text();
    let qtdDanix = parseInt($("#danix select").eq(1).val());
    if (saborDanix !== "Escolha o sabor" && qtdDanix === 0) {
        qtdDanix = obterMaiorQuantidade("#danix select");
    }
    if (qtdDanix > 0) {
        saborDanix = (saborDanix === "Escolha o sabor") ? "sabor aleatório" : saborDanix;
        produtos.push({ nome: "Danix", sabor: saborDanix, quantidade: qtdDanix, preco: calcularPreco(qtdDanix) });
    }

    // Guaravita
    let qtdGuara = parseInt($("#guaravita select").val());
    if (qtdGuara > 0) {
        produtos.push({ nome: "Guaravita", sabor: "-", quantidade: qtdGuara, preco: calcularPreco(qtdGuara) });
    }

    // Bis Xtra
    let qtdBis = parseInt($("#bis select").val());
    if (qtdBis > 0) {
        produtos.push({ nome: "Bis Xtra", sabor: "-", quantidade: qtdBis, preco: calcularPreco(qtdBis) });
    }

    // Suco Gelado
    let saborSuco = $("#suco select").eq(0).find(":selected").text();
    let qtdSuco = parseInt($("#suco select").eq(1).val());
    if (saborSuco !== "Escolha o sabor" && qtdSuco === 0) {
        qtdSuco = obterMaiorQuantidade("#suco select");
    }
    if (qtdSuco > 0) {
        saborSuco = (saborSuco === "Escolha o sabor") ? "sabor aleatório" : saborSuco;
        produtos.push({ nome: "Suco Gelado", sabor: saborSuco, quantidade: qtdSuco, preco: calcularPreco(qtdSuco) });
    }

    return produtos;
}

function obterMaiorQuantidade(seletorPai) {
    let maior = 0;
    $(seletorPai).each(function () {
        $(this).find("option").each(function () {
            let val = parseInt($(this).val());
            if (!isNaN(val) && val > maior) {
                maior = val;
            }
        });
    });
    return maior;
}

function calcularPreco(quantidade) {
    return (quantidade * 3) - ((quantidade - 1) * 0.5);
}

function AdicionarNomesElementoHtml(pessoaObjeto) {
    var elementoHmtl = document.getElementById("lista-nomes");

    let html = `<li class="mt-3 list-group-item">
        <button onclick='ExcluirElemento(this)' class='btn btn-danger'>
            <i class="fa fa-times" aria-hidden="true"></i>
        </button>
        <strong>Nome:</strong> ${pessoaObjeto.nome}<br>
        <strong>Quarto:</strong> ${pessoaObjeto.quarto}<br>`;

    pessoaObjeto.produtos.forEach(prod => {
        html += `<strong>${prod.nome}</strong> - ${prod.sabor} - 
        <strong>Qtd:</strong> ${prod.quantidade}<br>`;
    });

    html += `</li>`;

    elementoHmtl.insertAdjacentHTML("beforeend", html);
}

function ExcluirElemento(element) {
    element.parentNode.remove();
    atualizarTotal();
}

function atualizarTotal() {
    let total = 0;
    $("#lista-nomes li").each(function () {
        let texto = $(this).text();
        let regex = /Qtd:\s(\d+)/g;
        let match;

        while ((match = regex.exec(texto)) !== null) {
            let qtd = parseInt(match[1]);
            total += calcularPreco(qtd);
        }
    });

    $("#totalValue").text("R$ " + total.toFixed(2).replace('.', ','));
}

function validarFormulario(nome, quarto) {
    return nome && quarto;
}

$(document).ready(function () {
    $("#Enviar\\ pedido").on("click", function () {
        alert("Pedido enviado");
        location.reload();
    });

    // Trocar imagem do Danix conforme sabor
    $("#danix select").eq(0).on("change", function () {
        const sabor = $(this).val();
        const imgDanix = $("#danix img");
        if (sabor === "1") {
            imgDanix.attr("src", "https://www.arcor.com.br/wp-content/uploads/2019/06/Danix-Morango-130g.png");
        } else if (sabor === "2") {
            imgDanix.attr("src", "https://i3-imagens-prd.araujo.com.br/redimensionada/380x380/87713/171038_7896058257298_1.webp");
        } else if (sabor === "3") {
            imgDanix.attr("src", "https://www.arcor.com.br/wp-content/uploads/2019/06/Danix-Choco-Choco-130g-1.png");
        } else {
            imgDanix.attr("src", "https://www.arcor.com.br/wp-content/uploads/2019/06/Danix-Chocolate-130g.png");
        }
    });

    // Trocar imagem do Suco conforme sabor
    $("#suco select").eq(0).on("change", function () {
        const sabor = $(this).val();
        const imgSuco = $("#suco img");
        if (sabor === "1") {
            imgSuco.attr("src", "https://static.ifood-static.com.br/image/upload/t_high/pratos/67e3fd71-9be2-4670-a2ed-2e64a198b357/202208221719_r4MP_i.png"); // Uva
        } else if (sabor === "2") {
            imgSuco.attr("src", "https://superprix.vteximg.com.br/arquivos/ids/202290-460-460/Suco-Del-Valle-Pessego-290ml.jpg"); // Pêssego
        } else if (sabor === "3") {
            imgSuco.attr("src", "https://www.delfrescos.com.br/wp-content/uploads/2023/01/Suco-Laranja-Integral-1l.png"); // Laranja
        } else if (sabor === "4") {
            imgSuco.attr("src", "https://static.paodeacucar.com/img/uploads/1/313/554313.png"); // Manga
        } else {
            imgSuco.attr("src", "222801.png"); // padrão
        }
    });
});



<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

  const supabaseUrl = 'https://lbjsdaexqhkgxsuwfgmg.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxianNkYWV4cWhrZ3hzdXdmZ21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMTk5NjgsImV4cCI6MjA2MTg5NTk2OH0.SV93_0NdI_CgsoV6cTNzKlo74kk0CrViKn_K9fh0hJA'
  const supabase = createClient(supabaseUrl, supabaseKey)

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form')
    if (!form) return

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const produto = form.querySelector('[name="Produto"]')?.value || ''
      const quantidade = form.querySelector('[name="Quantidade"]')?.value || ''
      const sabor = form.querySelector('[name="Sabor"]')?.value || ''
      const nome = form.querySelector('[name="Nome"]')?.value || ''
      const quarto = form.querySelector('[name="Quarto"]')?.value || ''
      const valor = form.querySelector('[name="Valor Total"]')?.value || ''

      const { data, error } = await supabase.from('FomeZeroBD').insert([{
        Produto: produto,
        Quantidade: quantidade,
        Sabor: sabor,
        Nome: nome,
        Quarto: quarto,
        "Valor Total": valor
      }])

      if (error) {
        alert('Erro ao enviar: ' + error.message)
      } else {
        alert('Pedido enviado com sucesso!')
        location.reload()
      }
    })
  })
</script>

