$(function () {
  requireAuth();
  renderHeader('devices.html');
  let editingId = null;

  function loadCustomers() {
    $.ajax({
      url: '/api/customers',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const sel = $('#customer_id').empty().append('<option value="">Select Customer</option>');
        rows.forEach(c => sel.append('<option value="' + c.id + '">' + escapeHtml(c.name) + '</option>'));
      }
    });
  }

  function load() {
    $.ajax({
      url: '/api/devices',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#devicesTable tbody').empty();
        if (!rows.length) {
          tbody.append('<tr><td colspan="7" style="text-align:center;">No devices</td></tr>');
          return;
        }
        rows.forEach(d => {
          tbody.append(
            '<tr>' +
              '<td>' + d.id + '</td>' +
              '<td>' + escapeHtml(d.customer_name) + '</td>' +
              '<td>' + d.device_type + '</td>' +
              '<td>' + escapeHtml(d.brand) + '</td>' +
              '<td>' + escapeHtml(d.model) + '</td>' +
              '<td>' + escapeHtml(d.serial_number) + '</td>' +
              '<td>' +
                '<button class="btn warn edit-btn" data-id="' + d.id + '">Edit</button> ' +
                '<button class="btn danger delete-btn" data-id="' + d.id + '">Delete</button>' +
              '</td>' +
            '</tr>'
          );
        });
      }
    });
  }

  $(document).on('click', '.edit-btn', function () {
    $.ajax({
      url: '/api/devices/' + $(this).data('id'),
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (d) {
        editingId = d.id;
        $('#customer_id').val(d.customer_id);
        $('#device_type').val(d.device_type);
        $('#brand').val(d.brand);
        $('#model').val(d.model);
        $('#serial_number').val(d.serial_number);
        $('#purchase_date').val(d.purchase_date ? d.purchase_date.split('T')[0] : '');
        $('#notes').val(d.notes);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  $(document).on('click', '.delete-btn', function () {
    if (!confirm('Delete this device?')) return;
    $.ajax({
      url: '/api/devices/' + $(this).data('id'),
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: load
    });
  });

  $('#resetBtn').on('click', function () {
    editingId = null;
    $('#deviceForm')[0].reset();
  });

  $('#deviceForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      customer_id: $('#customer_id').val(),
      device_type: $('#device_type').val(),
      brand: $('#brand').val(),
      model: $('#model').val(),
      serial_number: $('#serial_number').val(),
      purchase_date: $('#purchase_date').val() || null,
      notes: $('#notes').val()
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? '/api/devices/' + editingId : '/api/devices';
    $.ajax({
      url, method,
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: () => {
        showMessage($('#msg'), 'Device saved!');
        editingId = null;
        $('#deviceForm')[0].reset();
        load();
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  loadCustomers();
  load();
});