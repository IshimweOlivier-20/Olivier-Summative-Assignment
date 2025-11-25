/* api.js
   Lightweight AJAX wrapper around jQuery with auth injection and common error handling.
*/
(function(){
  // Attach Authorization header to all requests if token present
  $.ajaxPrefilter(function(options, originalOptions, jqXHR){
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if(stored){
      try{
        const parsed = JSON.parse(stored);
        if(parsed && parsed.token){
          jqXHR.setRequestHeader('Authorization', 'Bearer '+parsed.token);
        }
      }catch(e){}
    }
  });

  // Global 401 handler: redirect to login and clear auth
  $(document).ajaxError(function(event, jqxhr){
    if(jqxhr && jqxhr.status === 401){
      try{ localStorage.removeItem(AUTH_STORAGE_KEY); sessionStorage.removeItem(AUTH_STORAGE_KEY); }catch(e){}
      if(window.showError) showError('Session expired. Please login again.');
      else alert('Session expired. Please login again.');
      window.location.href = 'login.html';
    }
  });

  // Simple wrappers returning Promises
  window.apiGet = function(path, params){
    return new Promise(function(resolve, reject){
      $.ajax({url: API_BASE_URL + path, method: 'GET', data: params})
        .done(resolve).fail(function(xhr){ reject(xhr.responseJSON||xhr); });
    });
  };

  window.apiPost = function(path, data, contentType, processData){
    return new Promise(function(resolve, reject){
      $.ajax({url: API_BASE_URL + path, method: 'POST', data: data, contentType: contentType, processData: processData})
        .done(resolve).fail(function(xhr){
          // Normalize error object for callers
          try{
            const body = xhr.responseJSON || (xhr.responseText ? JSON.parse(xhr.responseText) : null);
            const message = (body && (body.message || body.error)) || xhr.statusText || 'Request failed';
            console.error('API POST error', path, xhr.status, message, body || xhr.responseText);
            reject({ status: xhr.status, message, body: body || xhr.responseText });
          }catch(e){
            console.error('API POST parse error', e, xhr);
            reject({ status: xhr.status, message: xhr.statusText || 'Request failed', body: xhr.responseText });
          }
        });
    });
  };

  window.apiPut = function(path, data){
    return new Promise(function(resolve, reject){
      $.ajax({url: API_BASE_URL + path, method: 'PUT', data: JSON.stringify(data), contentType: 'application/json'})
        .done(resolve).fail(function(xhr){
          try{
            const body = xhr.responseJSON || (xhr.responseText ? JSON.parse(xhr.responseText) : null);
            const message = (body && (body.message || body.error)) || xhr.statusText || 'Request failed';
            console.error('API PUT error', path, xhr.status, message, body || xhr.responseText);
            reject({ status: xhr.status, message, body: body || xhr.responseText });
          }catch(e){
            console.error('API PUT parse error', e, xhr);
            reject({ status: xhr.status, message: xhr.statusText || 'Request failed', body: xhr.responseText });
          }
        });
    });
  };

  // PATCH helper
  window.apiPatch = function(path, data){
    return new Promise(function(resolve, reject){
      $.ajax({url: API_BASE_URL + path, method: 'PATCH', data: data ? JSON.stringify(data) : undefined, contentType: data ? 'application/json' : undefined})
        .done(resolve).fail(function(xhr){
          try{
            const body = xhr.responseJSON || (xhr.responseText ? JSON.parse(xhr.responseText) : null);
            const message = (body && (body.message || body.error)) || xhr.statusText || 'Request failed';
            console.error('API PATCH error', path, xhr.status, message, body || xhr.responseText);
            reject({ status: xhr.status, message, body: body || xhr.responseText });
          }catch(e){
            console.error('API PATCH parse error', e, xhr);
            reject({ status: xhr.status, message: xhr.statusText || 'Request failed', body: xhr.responseText });
          }
        });
    });
  };

  window.apiDelete = function(path){
    return new Promise(function(resolve, reject){
      $.ajax({url: API_BASE_URL + path, method: 'DELETE'})
        .done(resolve).fail(function(xhr){
          try{
            const body = xhr.responseJSON || (xhr.responseText ? JSON.parse(xhr.responseText) : null);
            const message = (body && (body.message || body.error)) || xhr.statusText || 'Request failed';
            console.error('API DELETE error', path, xhr.status, message, body || xhr.responseText);
            reject({ status: xhr.status, message, body: body || xhr.responseText });
          }catch(e){
            console.error('API DELETE parse error', e, xhr);
            reject({ status: xhr.status, message: xhr.statusText || 'Request failed', body: xhr.responseText });
          }
        });
    });
  };
})();
