(() => {
  'use strict';

  // Navegação responsiva
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#mainNav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
    }));
  }

  // Checklist sem armazenamento ou comunicação com servidores.
  const checks = [...document.querySelectorAll('.safety-check')];
  const counter = document.querySelector('#checklistCount');
  const meter = document.querySelector('#checklistProgress');
  const reset = document.querySelector('#resetChecklist');
  function updateChecklist() {
    const completed = checks.filter(c => c.checked).length;
    counter.textContent = `${completed} de ${checks.length} concluídos`;
    meter.style.width = `${Math.round(100 * completed / checks.length)}%`;
  }
  checks.forEach(check => check.addEventListener('change', updateChecklist));
  reset?.addEventListener('click', () => {checks.forEach(c => {c.checked = false;});updateChecklist();});
  updateChecklist();

  // Quiz inteiramente local; não coleta nem transmite as respostas.
  const questions = [
    {question: 'Um suposto funcionário do banco pede seu código de verificação por mensagem. O que você faz?',
      options: ['Envio o código para evitar o bloqueio da conta.', 'Não envio e procuro o banco pelo aplicativo oficial.'], correct: 1,
      explanation: 'Instituições não precisam que você forneça códigos de autenticação enviados ao seu celular. Entre em contato apenas pelos canais oficiais.'},
    {question: 'Um contato com foto de um familiar diz que mudou de número e pede um Pix urgente. Qual a reação mais segura?',
      options: ['Faço o Pix, porque reconheço a foto.', 'Ligo para o número antigo e confirmo o pedido por outro canal.'], correct: 1,
      explanation: 'Fotos e nomes de perfis podem ser copiados. Confirme pedidos de dinheiro por um canal de confiança antes de transferir.'},
    {question: 'Você usa a mesma senha em vários serviços. Qual hábito ajuda a proteger suas contas?',
      options: ['Criar senhas longas e diferentes e ativar a verificação em duas etapas.', 'Continuar usando a mesma senha, desde que ela seja difícil.'], correct: 0,
      explanation: 'Uma senha vazada em um serviço pode ser testada em outros. Senhas únicas e autenticação em duas etapas reduzem esse risco.'}
  ];
  const position = document.querySelector('#quizPosition');
  const content = document.querySelector('#quizContent');
  let current = 0, score = 0, answered = false;
  function renderQuestion() {
    answered = false;
    const q = questions[current];
    position.textContent = `QUESTÃO ${current + 1} DE ${questions.length}`;
    content.innerHTML = `<h3 id="quizQuestion"></h3><div id="quizOptions" class="quiz-options"></div><div id="quizFeedback" class="quiz-feedback" role="status" hidden></div><button type="button" id="quizNext" class="button button-dark quiz-next" hidden>${current === questions.length - 1 ? 'Ver resultado' : 'Próxima questão'} <span aria-hidden="true">→</span></button>`;
    content.querySelector('#quizQuestion').textContent = q.question;
    const optionRoot = content.querySelector('#quizOptions');
    q.options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = option;
      btn.addEventListener('click', () => choose(i));
      optionRoot.appendChild(btn);
    });
    content.querySelector('#quizNext').addEventListener('click', () => {
      current += 1;
      if (current < questions.length) renderQuestion(); else renderResult();
    });
  }
  function choose(index) {
    if (answered) return;
    answered = true;
    const q = questions[current];
    const correct = index === q.correct;
    if (correct) score += 1;
    content.querySelectorAll('.quiz-options button').forEach((button, i) => {
      button.disabled = true;
      if (i === q.correct) button.classList.add('correct');
      else if (i === index) button.classList.add('incorrect');
    });
    const feedback = content.querySelector('#quizFeedback');
    feedback.textContent = `${correct ? 'Acertou! ' : 'Boa tentativa. '}${q.explanation}`;
    feedback.hidden = false;
    content.querySelector('#quizNext').hidden = false;
  }
  function renderResult() {
    position.textContent = 'QUIZ CONCLUÍDO';
    content.innerHTML = `<div class="quiz-end"><h3>Você acertou ${score} de ${questions.length} questões.</h3><p>${score === questions.length ? 'Mandou bem! Continue praticando esses cuidados com frequência.' : 'Aprender é o mais importante. Reveja as dicas e compartilhe o que descobriu com outras pessoas.'}</p><button type="button" class="button button-dark" id="restartQuiz">Refazer o teste <span aria-hidden="true">↺</span></button></div>`;
    content.querySelector('#restartQuiz').addEventListener('click', () => {current = 0;score = 0;renderQuestion();});
  }
  if (position && content) renderQuestion();

  const share = document.querySelector('#shareWhatsApp');
  share?.addEventListener('click', () => {
    const url = new URL('.', window.location.href).href;
    const message = `Conheça o projeto gratuito Segurança digital para leigos! Dicas práticas e uma cartilha sobre golpes virtuais, senhas, WhatsApp e Pix: ${url}`;
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
})();
