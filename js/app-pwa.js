if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Usamos o escopo explícito da pasta do repositório para evitar conflito de rotas no GitHub Pages
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then((reg) => {
        // Verifica se há uma atualização instalada e esperando ativação
        if (reg.waiting) {
          solicitarAtualizacao(reg.waiting);
        }

        // Monitora novas atualizações enquanto o app estiver em execução
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                solicitarAtualizacao(newWorker);
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log('Service Worker não afetará o build: ', err);
      });

    // Recarrega a página automaticamente para aplicar as mudanças da nova versão
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
  const confirmar = confirm("Uma nova atualização do CineHub Premium está disponível! Deseja instalar agora?");
  if (confirmar && worker) {
    worker.postMessage('skipWaiting');
  }
}
