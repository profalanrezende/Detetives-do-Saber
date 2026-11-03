# 🔎 Detetives do Saber
**A.R.S. HTML APPS e GAMES** · Jogo de aventura e investigação para História, Geografia e Ciências (PWA estático).

## Como funciona
1. O professor escreve **livros** (cada livro = uma missão) na *Área do professor* (senha inicial: `prof123`, troque em *Ajustes*).
2. O aluno cria uma conta (nome, bichinho, PIN opcional), abre um livro na **Biblioteca** e lê. Frases marcadas viram **pistas** (clique para guardar).
3. No **Quadro de Evidências** o aluno liga duas pistas com barbante. Para acertar, precisa descobrir a relação nas **cartas do Animail** (use a lupa/Ctrl+K: a caixa tem cartas de distração).
4. Ligações certas dão pontos; erros tiram. Resolver todas as ligações encerra o caso, dá estrelas e medalhas no **Diário**.
5. Os alunos também trocam bilhetes pelo Animail.

## Novidades desta versão
- **⚙️ Configurações** (engrenagem no topo): tela cheia, sons, modo desafio, salvar progresso, baixar e carregar backup, sair. O backup (`.json`) guarda contas, cartas, progresso e diário; use-o para levar os dados de um aparelho para outro.
- **Estante única**: todos os livros lado a lado; os filtros por disciplina continuam disponíveis.
- **Livro**: arraste a folha, clique na borda da página ou no canto para virar; pistas e perguntas funcionam em todas as páginas.
- **Animail = portal dos Amigos do Saber** (fauna brasileira): cartas com dicas e curiosidades, botão *Pedir uma dica* (custa 1 ponto) e a lista **Recentes** com as últimas contas criadas, para abrir conversa com os colegas.
- **Diário**: livros, pistas anotadas e explicadas, anexos dos Amigos, **Cadernos** (ditados do professor e anotações livres) e **PDF** no estilo diário (completo ou por nota).
- **Professor → Notas e ditados**: escreva textos para os alunos copiarem e salvarem no Diário. As notas vão junto no `livros.json`.
- Em cada livro, o campo *Curiosidades dos Amigos do Saber* (`Título | Texto`, uma por linha) vira cartas do Animail e anexos do Diário.

## Arara Tagarela com IA (Gemini, opcional)
Área do professor → Ajustes → cole a chave da API Gemini e use *Testar IA*. Para valer em todos os aparelhos, coloque `"gemKey":"SUA_CHAVE"` no `config.json`. Como o GitHub Pages é público, **restrinja a chave ao seu site** (referenciador HTTP) no Google AI Studio e use cota baixa. Sem chave, a Arara usa só o texto dos livros.

## Publicar no GitHub Pages
1. Crie um repositório e envie **todo o conteúdo desta pasta** para a raiz.
2. *Settings → Pages → Deploy from branch → main / (root)*.
3. Abra `https://SEU-USUARIO.github.io/SEU-REPO/`.

## Contas e cartas no GitHub (importante)
O GitHub Pages só entrega arquivos; **não guarda dados**. Por isso:
- **Contas, cartas e progresso ficam no navegador de cada aparelho** (localStorage). No laboratório de informática (mesmo computador) todos se veem e trocam bilhetes normalmente.
- Para alunos em **aparelhos diferentes** conversarem (casa, celular) use a **Sala online** (opcional, gratuita): veja abaixo.
- **Livros do professor**: ficam no navegador onde foram criados. Para publicar para todos: *Área do professor → Livros → Baixar livros.json* e envie esse arquivo para a raiz do repositório (substitua o anterior). O jogo lê `livros.json` ao abrir.

## Sala online (Supabase, opcional)
1. Crie um projeto em supabase.com, abra o *SQL Editor* e rode o conteúdo de `supabase/setup.sql`.
2. *Área do professor → Sala online*: cole a URL do projeto, a chave **anon public** e escolha um código de sala (ex.: `T401`). Clique em *Salvar* e *Testar conexão*.
3. Entregue aos alunos o **link da sala** (botão *Copiar link*) ou coloque o `config.json` baixado na raiz do repositório. O aparelho do aluno guarda a configuração na primeira abertura.
4. Contas, cartas e progresso passam a sincronizar (cartas a cada ~20 s). Alunos e resultados aparecem na aba *Alunos e resultados*.
> A chave anon é pública por natureza; as políticas do SQL permitem leitura/escrita anônima só nas tabelas `da_*`. Não guarde dados sensíveis; use apenas primeiro nome.

## Escrevendo um livro
- `[[texto]]` ou `[[texto|Rótulo da pista]]` marca uma pista.
- `# Título` na primeira linha da página dá nome a ela; `---` separa páginas (sem isso, o texto é paginado automaticamente).
- `**negrito**` funciona.
- **Ligações**: escolha duas pistas, escreva a conclusão correta, a carta do Animail que explica (e quem a envia) e, se quiser, alternativas erradas.
- **Cartas extras**: uma por linha, `Assunto | Texto`, para encher a caixa de distrações.
- Use *Testar* para jogar o livro como aluno.

## Arquivos
`index.html`, `style.css`, `app.js`, `sw.js`, `manifest.webmanifest`, ícones, `supabase/setup.sql`. Opcionais: `livros.json`, `config.json`.

## Créditos e licenças
Projetos Pedagógicos: **A.R.S.** (Alan Rezende) **HTML5** **GAMES e APPS**.
