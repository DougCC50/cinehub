if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      
      // Verifica se já há uma atualização esperando para ser instalada
      if (reg.waiting) {
        solicitarAtualizacao(reg.waiting);
      }

      // Escuta se uma nova atualização chegar enquanto o app está aberto
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            solicitarAtualizacao(newWorker);
          }
        });
      });
    });

    // Controla o recarregamento automático da página após aceitar a atualização
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

function solicitarAtualizacao(worker) {
  // Cria uma caixa de confirmação nativa ou personalizada para o usuário
  const confirmar = confirm("Uma nova atualização do CineHub Premium está disponível! Deseja instalar agora?");
  if (confirmar) {
    worker.postMessage('skipWaiting');
  }
}