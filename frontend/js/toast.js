// toast.js - lightweight toast notifications
(function(){
  const containerId = 'toast-container';

  function ensureContainer(){
    let c = document.getElementById(containerId);
    if(!c){
      c = document.createElement('div');
      c.id = containerId;
      c.setAttribute('aria-live','polite');
      c.style.position = 'fixed';
      c.style.right = '16px';
      c.style.top = '16px';
      c.style.zIndex = 9999;
      document.body.appendChild(c);
    }
    return c;
  }

  function showToast(message, type='info', duration=4000){
    const c = ensureContainer();
    const el = document.createElement('div');
    el.className = 'toast-item toast-'+type;
    el.style.marginTop = '8px';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    el.style.color = '#fff';
    el.style.minWidth = '200px';
    el.style.maxWidth = '360px';
    el.style.fontFamily = 'Inter, system-ui, Arial, sans-serif';
    el.style.fontSize = '14px';
    if(type==='error') el.style.background = '#ef4444';
    else if(type==='success') el.style.background = '#10b981';
    else if(type==='warning') el.style.background = '#f59e0b';
    else el.style.background = '#374151';
    el.textContent = message;

    c.appendChild(el);
    setTimeout(()=>{
      el.style.transition = 'opacity 300ms ease, transform 300ms ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(10px)';
      setTimeout(()=> el.remove(), 350);
    }, duration);
  }

  window.showToast = showToast;
  window.showSuccess = function(msg,d=3000){ showToast(msg,'success',d); };
  window.showError = function(msg,d=5000){ showToast(msg,'error',d); };
  window.showInfo = function(msg,d=3000){ showToast(msg,'info',d); };
})();
