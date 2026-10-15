$(function () {
  if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
    return;
  }
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const username = $('#username').val().trim();
    const password = $('#password').val().trim();
    $('button[type="submit"]').prop('disabled', true).text('Signing in...');
    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ username, password }),
      success: function (res) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        $('#msg').removeClass('error').addClass('success').text('Login successful!');
        setTimeout(() => window.location.href = 'dashboard.html', 400);
      },
      error: function (xhr) {
        $('button[type="submit"]').prop('disabled', false).text('Sign In →');
        $('#msg').removeClass('success').addClass('error')
          .text(xhr.responseJSON?.error || 'Login failed');
      }
    });
  });
});