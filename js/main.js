// main.js - UI helpers and small global behaviors
function showToast(msg){ if(window.showToast) return window.showToast(msg); alert(msg); }

$(function(){
  // Render auth links / profile
  function refreshAuthUI(){
    if(isAuthenticated()){
      $('#auth-links').hide();
      $('#profile-menu').show();
      $('#btn-profile').text(getCurrentUser() ? getCurrentUser().full_name : 'Profile');
      if(isAdmin()){
        // add admin link if not present
        if(!$('#admin-link').length) $('#main-nav').append('<a id="admin-link" href="admin/dashboard.html" class="text-gray-600 hover:text-gray-900 ml-2">Admin</a>');
      }
    } else {
      $('#auth-links').show();
      $('#profile-menu').hide();
      $('#admin-link').remove();
    }
  }

  refreshAuthUI();

  // Notification count placeholder (will call API when available)
  if(isAuthenticated()){
    // fetch notifications count
    apiGet('/api/notifications').then(list=>{
      const unread = (list || []).filter(n=>!n.read).length;
      $('#notif-count').text(unread?unread:'');
    }).catch(()=>{});
  }

  $('#btn-profile').on('click', function(){ window.location.href = 'profile.html'; });
  $('#btn-notifications').on('click', function(){ window.location.href = 'notifications.html'; });
});
