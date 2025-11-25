/* auth.js
   Authentication helpers: login, signup, token storage, role helpers.

   Notes: This file implements client-side guards and helpers only.
   Real security must be enforced by the backend.
*/

function saveAuth(token, user, persistent){
  const payload = JSON.stringify({token, user});
  try{
    if(persistent) localStorage.setItem(AUTH_STORAGE_KEY, payload);
    else sessionStorage.setItem(AUTH_STORAGE_KEY, payload);
  }catch(e){ console.warn('Storage failed', e); }
}

function clearAuth(){
  try{ localStorage.removeItem(AUTH_STORAGE_KEY); sessionStorage.removeItem(AUTH_STORAGE_KEY); }catch(e){}
}

function getAuth(){
  try{
    const s = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  }catch(e){ return null; }
}

function isAuthenticated(){
  return !!(getAuth() && getAuth().token);
}

function getToken(){
  const a = getAuth(); return a ? a.token : null;
}

function getCurrentUser(){
  const a = getAuth(); return a ? a.user : null;
}

function isAdmin(){
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// login/signup wrappers that call API and save token/user
function authLogin(credentials, persistent){
  return apiPost('/api/auth/login', JSON.stringify(credentials), 'application/json')
    .then(res=>{
      // Backend may return { data: { token, user } } or { token, user }
      let token = null;
      let user = null;
      if(res){
        if(res.token && res.user){ token = res.token; user = res.user; }
        else if(res.data && res.data.token){ token = res.data.token; user = res.data.user; }
        else if(res.data && res.data.data && res.data.data.token){ token = res.data.data.token; user = res.data.data.user; }
      }
      if(!token || !user) return Promise.reject({ message: 'Invalid login response from server', body: res });
      saveAuth(token, user, persistent);
      return { token, user };
    });
}

function authSignup(data){
  // backend route is /api/auth/signup
  return apiPost('/api/auth/signup', JSON.stringify(data), 'application/json')
    .then(res=> res);
}

function logout(){ clearAuth(); window.location.href = 'login.html'; }

// Decode JWT payload (naive) and return payload object
function decodeJwt(token){
  try{
    const parts = token.split('.');
    if(parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g,'+').replace(/_/g,'/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  }catch(e){ return null; }
}

// Ensure auth token not expired. If expired, clear and redirect to login.
function ensureAuth(){
  const a = getAuth();
  if(!a || !a.token) return false;
  const payload = decodeJwt(a.token);
    if(payload && payload.exp){
    const now = Math.floor(Date.now()/1000);
    if(payload.exp < now){
      clearAuth();
      if(window.showError) showError('Session expired. Please login again.');
      else alert('Session expired. Please login again.');
      window.location.href = 'login.html';
      return false;
    }
  }
  return true;
}

// Client-side guard: use isAdmin() and isAuthenticated() before showing admin UI
