$(function () {
  requireAuth();
  renderHeader('services.html');
  let editingId = null;

  function load() {
    $.ajax({
      url: '/api/services',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#servicesTable tbody').empty();
        rows.forEach(s => {
          tbody.append(
            '<tr>' +
              '<td>' + s.id + '</td>' +
              '<td>' + escapeHtml(s.name) + '</td>' +
              '<td>' + s.category + '</td>' +
              '<td>Rs. ' + parseFloat(s.price).toFixed(2) + '</td>' +
              '<td>' + s.estimated_hours + ' hrs</td>' +
              '<td>' + (s.active ? '✅' : '❌') + '</td>' +
              '<td>' +
                '<button class="btn warn edit-btn" data-id="' + s.id + '">Edit</button> ' +
                '<button class="btn danger delete-btn" data-id="' + s.id + '">Delete</button>' +
              '</td>' +
            '</tr>'
          );
        });
      }
    });
  }

  $(document).on('click', '.edit-btn', function () {
    $.ajax({
      url: '/api/services/' + $(this).data('id'),
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (s) {
        editingId = s.id;
        $('#name').val(s.name);
        $('#description').val(s.description);
        $('#category').val(s.category);
        $('#price').val(s.price);
        $('#estimated_hours').val(s.estimated_hours);
      }
    });
  });

  $(document).on('click', '.delete-btn', function () {
    if (!confirm('Delete this service?')) return;
    $.ajax({
      url: '/api/services/' + $(this).data('id'),
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: load
    });
  });

  $('#resetBtn').on('click', function () {
    editingId = null;
    $('#serviceForm')[0].reset();
  });

  $('#serviceForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      name: $('#name').val(),
      description: $('#description').val(),
      category: $('#category').val(),
      price: $('#price').val(),
      estimated_hours: $('#estimated_hours').val(),
      active: 1
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? '/api/services/' + editingId : '/api/services';
    $.ajax({
      url, method,
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: () => {
        showMessage($('#msg'), 'Service saved!');
        editingId = null;
        $('#serviceForm')[0].reset();
        load();
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  load();
});