# Basa Tattoo — site

Site estático (HTML + CSS + JS), sem build. Basta publicar a pasta em qualquer hospedagem (Vercel, Netlify, Hostinger etc.).
Para testar localmente: `python3 -m http.server 8000` e abrir http://localhost:8000

## O que preencher antes de publicar
1. **Domínio**: troque `https://SEU-DOMINIO.com.br` pelo domínio real em `index.html` (canonical, og:*, JSON-LD), `robots.txt` e `sitemap.xml`.
2. **WhatsApp**: em `js/main.js`, preencha `CONFIG.whatsapp` (ex.: `'5592999999999'`). Enquanto vazio, o botão de agendamento leva ao Instagram @basa.tattoo.
3. **Sobre o Basa**: em `index.html`, seção `#sobre`, substitua os 4 cards "Texto oficial em breve" pelos textos oficiais.
4. **Premiações**: em `#premiacoes`, cada `<li class="award">` tem os campos `.a-name`, `.a-event`, `.a-cat`, `.a-year`, `.a-place`. Campo vazio fica oculto. Para novo prêmio, copie um `<li>`.
5. **Horários, telefone e redes**: quando houver, acrescentar no card de contato e no JSON-LD (`openingHours`, `telephone`).

## Abertura em vídeo
`assets/video/abertura-basa-tattoo.mp4` toca uma vez por sessão (sessionStorage). Quando as portas abrem, o preto do vídeo vira transparente (blend `screen`) e a página real aparece atrás. Ajuste o instante em `DOORS_AT` (`js/main.js`). Há botão "Pular abertura", fallback se o vídeo falhar e versão sem vídeo para `prefers-reduced-motion`.
