// Frontend configuration
// Update API_BASE_URL to point to the provided backend.
// Backend README says the server runs on port 4000 by default.
const API_BASE_URL = window.__API_BASE_URL__ || 'http://localhost:4000';
const AUTH_STORAGE_KEY = 'olivier_auth_v1';

// Helper to choose storage based on persistent flag
function storage(persistent){
  return persistent ? localStorage : sessionStorage;
}

// Dynamically load toast.js next to this config file so showError/showSuccess are available
(function(){
  try{
    const scripts = document.getElementsByTagName('script');
    let base = '';
    for(let i=0;i<scripts.length;i++){
      const s = scripts[i];
      if(s.src && s.src.indexOf('config.js') !== -1){
        base = s.src.replace(/config\.js(?:\?.*)?$/,'');
        break;
      }
    }
    if(!base) base = './';
    const toastSrc = base + 'toast.js';
    if(!document.querySelector('script[src="'+toastSrc+'"]')){
      const t = document.createElement('script'); t.src = toastSrc; t.async = false; document.head.appendChild(t);
    }
  }catch(e){/* ignore */}
})();
