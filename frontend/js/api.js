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
      alert('Session expired. Please login again.');
      window.location.href = '/frontend/login.html'.replace('/frontend','').includes('frontend') ? 'login.html' : 'login.html';
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
        .done(resolve).fail(function(xhr){ reject(xhr.responseJSON||xhr); });
    });
  };

  window.apiPut = function(path, data){
    return new Promise(function(resolve, reject){
      $.ajax({url: API_BASE_URL + path, method: 'PUT', data: JSON.stringify(data), contentType: 'application/json'})
        .done(resolve).fail(function(xhr){ reject(xhr.responseJSON||xhr); });
    });
  };

  window.apiDelete = function(path){
    return new Promise(function(resolve, reject){
      $.ajax({url: API_BASE_URL + path, method: 'DELETE'})
        .done(resolve).fail(function(xhr){ reject(xhr.responseJSON||xhr); });
    });
  };
})();
