// main.js - UI helpers and small global behaviors
function showToast(msg){ if(window.showToast) return window.showToast(msg); alert(msg); }

$(function(){
  // Ensure token validity and sign-out if expired
  ensureAuth();
  // Render auth links / profile
  function refreshAuthUI(){
    if(isAuthenticated()){
      $('#auth-links').hide();
      $('#profile-menu').show();
      const user = getCurrentUser();
      $('#btn-profile').text(user ? user.full_name + ' ▾' : 'Profile ▾');
      // show admin link in dropdown and top nav when admin
      if(isAdmin()){
        $('#link-admin').removeClass('hidden');
        if(!$('#admin-link').length) $('#main-nav').append('<a id="admin-link" href="admin/dashboard.html" class="text-gray-600 hover:text-gray-900 ml-2">Admin</a>');
      } else {
        $('#link-admin').addClass('hidden');
        $('#admin-link').remove();
      }
    } else {
      $('#auth-links').show();
      $('#profile-menu').hide();
      $('#admin-link').remove();
    }
  }

  refreshAuthUI();

  // Notification count placeholder (will call API for both anonymous and authenticated users)
  // Backend returns broadcast notifications when unauthenticated (recipient_id IS NULL)
  apiGet('/api/notifications').then(resp=>{
    const list = (resp && resp.data) ? resp.data : resp;
    const unread = (list || []).filter(n=>!n.read).length;
    $('#notif-count').text(unread?unread:'');
  }).catch(()=>{});

  // Profile dropdown toggle and actions
  $('#btn-profile').on('click', function(){
    $('#profile-dropdown').toggleClass('hidden');
  });

  $('#btn-logout').on('click', function(){ logout(); });

  $('#link-profile').on('click', function(){ $('#profile-dropdown').addClass('hidden'); });
  $('#link-registrations').on('click', function(){ $('#profile-dropdown').addClass('hidden'); });

  $('#btn-notifications').on('click', function(){ window.location.href = 'notifications.html'; });
  // Close dropdown when clicking outside
  $(document).on('click', function(e){
    if(!$(e.target).closest('#profile-menu').length) $('#profile-dropdown').addClass('hidden');
  });
});
