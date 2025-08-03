const supabaseUrl = 'https://lbjsdaexqhkgxsuwfgmg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // sua key completa
const supabase = supabase || createClient(supabaseUrl, supabaseKey);

var listaNomes = [];

function btnCadastrar() {
    const nome = $("#nome").val();
    const quarto = $("#quarto").val();
    const produtos = coletarProdutos();

    if (!nome || !quarto || produtos.length === 0) {
        alert("Preencha todos os campos e selecione ao menos um produto.");
        return;
    }

    const pessoa = { nome, quarto, produtos };
    listaNomes.push(pessoa);

    AdicionarNomesElementoHtml(pessoa);
    atualizarTotal();
}

function coletarProdutos() {
    const produtos = [];

    function getQtd(el) {
        return parseInt($(el).val()) || 0;
    }

    // Danix
    const saborDanix = $("#danix select").eq(0).find(":selected").text();
    const qtdDanix = getQtd($("#danix select").eq(1));
    if (qtdDanix > 0) {
        produtos.push({ nome: "Danix", sabor: saborDanix, quantidade: qtdDanix, preco: calcularPreco(qtdDanix) });
    }

    // Guaravita
    const qtdGuara = getQtd($("#guaravita select"));
    if (qtdGuara > 0) {
        produtos.push({ nome: "Guaravita", sabor: "-", quantidade: qtdGuara, preco: calcularPreco(qtdGuara) });
    }

    // Bis
    const qtdBis = getQtd($("#bis select"));
    if (qtdBis > 0) {
        produtos.push({ nome: "Bis Xtra", sabor: "-", quantidade: qtdBis, preco: calcularPreco(qtdBis) });
    }

    // Suco
    const saborSuco = $("#suco select").eq(0).find(":selected").text();
    const qtdSuco = getQtd($("#suco select").eq(1));
    if (qtdSuco > 0) {
        produtos.push({ nome: "Suco Gelado", sabor: saborSuco, quantidade: qtdSuco, preco: calcularPreco(qtdSuco) });
    }

    return produtos;
}

function calcularPreco(qtd) {
    return qtd >= 4 ? 10 : qtd * 3 - (qtd - 1) * 0.5;
}

function AdicionarNomesElementoHtml(pessoa) {
    const ul = $("#lista-nomes");
    let html = `<li class="mt-3 list-group-item">
        <button onclick='ExcluirElemento(this)' class='btn btn-danger'><i class="fa fa-times"></i></button>
        <strong>Nome:</strong> ${pessoa.nome}<br>
        <strong>Quarto:</strong> ${pessoa.quarto}<br>`;
    pessoa.produtos.forEach(p => {
        html += `<strong>${p.nome}</strong> - ${p.sabor} - <strong>Qtd:</strong> ${p.quantidade}<br>`;
    });
    html += "</li>";
    ul.append(html);
}

function ExcluirElemento(el) {
    $(el).parent().remove();
    atualizarTotal();
}

function atualizarTotal() {
    let total = 0;
    $("#lista-nomes li").each(function () {
        const texto = $(this).text();
        const matches = [...texto.matchAll(/Qtd:\s(\d+)/g)];
        matches.forEach(m => total += calcularPreco(parseInt(m[1])));
    });
    $("#totalValue").text("R$ " + total.toFixed(2).replace(".", ","));
}

async function Envio() {
    if (listaNomes.length === 0) {
        alert("Carrinho vazio.");
        return;
    }

    for (const pessoa of listaNomes) {
        for (const prod of pessoa.produtos) {
            await supabase.from("FomeZeroBD").insert([{
                Produto: prod.nome,
                Quantidade: prod.quantidade,
                Sabor: prod.sabor,
                Nome: pessoa.nome,
                Quarto: pessoa.quarto,
                "Valor Total": prod.preco
            }]);
        }
    }

    alert("Pedido enviado!");
    location.reload();
}

$(document).ready(function () {
    $("#danix select").eq(0).on("change", function () {
        const sabor = $(this).val();
        const img = $("#danix img");
        const imagens = {
            "1": "https://www.arcor.com.br/wp-content/uploads/2019/06/Danix-Morango-130g.png",
            "2": "https://i3-imagens-prd.araujo.com.br/redimensionada/380x380/87713/171038_7896058257298_1.webp",
            "3": "https://www.arcor.com.br/wp-content/uploads/2019/06/Danix-Choco-Choco-130g-1.png",
            "default": "https://www.arcor.com.br/wp-content/uploads/2019/06/Danix-Chocolate-130g.png"
        };
        img.attr("src", imagens[sabor] || imagens.default);
    });

    $("#suco select").eq(0).on("change", function () {
        const sabor = $(this).val();
        const img = $("#suco img");
        const imagens = {
            "1": "https://static.ifood-static.com.br/image/upload/t_high/pratos/67e3fd71-9be2-4670-a2ed-2e64a198b357/202208221719_r4MP_i.png",
            "2": "https://superprix.vteximg.com.br/arquivos/ids/202290-460-460/Suco-Del-Valle-Pessego-290ml.jpg",
            "3": "https://www.delfrescos.com.br/wp-content/uploads/2023/01/Suco-Laranja-Integral-1l.png",
            "4": "https://static.paodeacucar.com/img/uploads/1/313/554313.png",
            "default": "222801.png"
        };
        img.attr("src", imagens[sabor] || imagens.default);
    });
});
