// app.js - versão inicial: mock + stubs
document.addEventListener('DOMContentLoaded', ()=> {
  // elementos
  const jobResults = document.getElementById('jobResults');
  const btnSearch = document.getElementById('btnSearch');
  const searchKeywords = document.getElementById('searchKeywords');
  const searchLocation = document.getElementById('searchLocation');

  const resumeForm = document.getElementById('resumeForm');
  const profileCard = document.getElementById('profileCard');

  const recommendations = document.getElementById('recommendations');

  // chatbot
  const chatForm = document.getElementById('chatForm');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');

  // armazena perfil local (mock DB)
  let userProfile = JSON.parse(localStorage.getItem('favela_profile') || 'null');

  function renderProfile(){
    if(!userProfile) { profileCard.classList.add('hidden'); return }
    profileCard.classList.remove('hidden');
    profileCard.innerHTML = `<strong>${userProfile.name}</strong>
      <div><small>${userProfile.email}</small></div>
      <div><em>Skills:</em> ${userProfile.skills.join(', ')}</div>`;
    generateRecommendations();
  }

  // mock de vagas (pode substituir por chamada real às APIs)
  const mockJobs = [
    {id:1,title:"Dev Front-end Júnior",company:"StartUp BH",location:"Belo Horizonte",tags:["javascript","react","html"]},
    {id:2,title:"Suporte Técnico",company:"Conecta Serviços",location:"Belo Horizonte",tags:["atendimento","hardware"]},
    {id:3,title:"Analista QA",company:"TechLabs",location:"Porto Alegre",tags:["teste","automação"]},
    {id:4,title:"Estágio em TI",company:"FavelaWare",location:"Remoto",tags:["html","css","javascript"]},
  ];

  function renderJobs(list, targetEl){
    targetEl.innerHTML = '';
    if(!list.length) targetEl.innerHTML = '<li>Nenhuma vaga encontrada.</li>';
    list.forEach(j => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${j.title}</strong> — ${j.company} <div><small>${j.location} • ${j.tags.join(', ')}</small></div>`;
      targetEl.appendChild(li);
    });
  }

  // Busca (mock) — filtro local, substitua por fetch pra API
  btnSearch.addEventListener('click', ()=> {
    const kw = (searchKeywords.value || '').toLowerCase();
    const loc = (searchLocation.value || '').toLowerCase();
    const results = mockJobs.filter(j => {
      const matchesKw = !kw || j.title.toLowerCase().includes(kw) || j.tags.join(' ').includes(kw);
      const matchesLoc = !loc || j.location.toLowerCase().includes(loc);
      return matchesKw && matchesLoc;
    });
    renderJobs(results, jobResults);
  });

  // salvar currículo (mock)
  resumeForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const skills = (document.getElementById('skills').value || '').split(',').map(s=>s.trim()).filter(Boolean);
    const bio = document.getElementById('bio').value.trim();

    userProfile = {name,email,skills,bio};
    localStorage.setItem('favela_profile', JSON.stringify(userProfile));
    renderProfile();
    alert('Currículo salvo localmente (mock). Em produção, enviamos pro DB e ativamos alertas por e-mail.');
  });

  // recomendações simples: prioriza vagas que contenham alguma skill do usuário
  function generateRecommendations(){
    recommendations.innerHTML = '';
    if(!userProfile) { recommendations.innerHTML = '<li>Cadastre seu currículo para receber recomendações.</li>'; return }
    const matches = mockJobs.filter(j => j.tags.some(t => userProfile.skills.includes(t)));
    renderJobs(matches, recommendations);
  }

  // Chatbot simples
  function addChatMessage(text, from='bot'){
    const div = document.createElement('div');
    div.style.marginBottom='8px';
    if(from==='user') div.innerHTML = `<div style="text-align:right"><strong>Você:</strong> ${escapeHtml(text)}</div>`;
    else div.innerHTML = `<div><strong>WareBot:</strong> ${escapeHtml(text)}</div>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  chatForm.addEventListener('submit', e=>{
    e.preventDefault();
    const txt = chatInput.value.trim();
    if(!txt) return;
    addChatMessage(txt,'user');
    chatInput.value = '';

    // respostas simples rules
    const t = txt.toLowerCase();
    if(t.includes('vaga') || t.includes('emprego')) {
      addChatMessage('Quer que eu busque vagas pra você? Use o campo "Buscar vagas" ou me diga a cidade e tecnologia.');
      return;
    }
    if(t.includes('currículo') || t.includes('curriculo')) {
      addChatMessage('Posso te ajudar a montar o currículo. Me diga suas habilidades separadas por vírgula.');
      return;
    }
    if(t.includes('ajuda')||t.includes('oi')||t.includes('e aí')) {
      addChatMessage('E aí! Me manda o que você quer: buscar vaga, montar currículo ou receber dicas de entrevista.');
      return;
    }
    addChatMessage('Desculpa, ainda estou aprendendo. Pergunta sobre vagas, currículo ou diga "buscar vagas".');
  });

  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function(m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m]); });
  }

  // stubs pra futuras integrações:
  // fetchLinkedInJobs(query) { // usar OAuth + LinkedIn Jobs API
  // fetchIndeedJobs(query) { // usar Indeed API
  // subscribeEmailAlerts(email, filters) { // enviar pra backend que agenda envio SMTP
  // }

  // init
  renderProfile();
  generateRecommendations();
  renderJobs(mockJobs, jobResults);
});
