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
      // expected: { token, user }
      saveAuth(res.token, res.user, persistent);
      return res;
    });
}

function authSignup(data){
  return apiPost('/api/auth/register', JSON.stringify(data), 'application/json')
    .then(res=> res);
}

function logout(){ clearAuth(); window.location.href = 'login.html'; }

// Client-side guard: use isAdmin() and isAuthenticated() before showing admin UI
