$(function () {
  requireAuth();
  renderHeader('jobs.html');

  function loadDropdowns() {
    $.ajax({
      url: '/api/customers',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const sel = $('#customer_id').empty().append('<option value="">Select Customer</option>');
        rows.forEach(c => sel.append('<option value="' + c.id + '">' + escapeHtml(c.name) + '</option>'));
      }
    });
    $.ajax({
      url: '/api/devices',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const sel = $('#device_id').empty().append('<option value="">Select Device</option>');
        rows.forEach(d => sel.append(
          '<option value="' + d.id + '" data-customer="' + d.customer_id + '">' +
          escapeHtml(d.customer_name) + ' - ' + d.brand + ' ' + d.model +
          '</option>'
        ));
      }
    });
    $.ajax({
      url: '/api/services',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const sel = $('#service_id').empty().append('<option value="">Select Service</option>');
        rows.forEach(s => sel.append(
          '<option value="' + s.id + '" data-price="' + s.price + '">' +
          escapeHtml(s.name) + ' (Rs. ' + s.price + ')</option>'
        ));
      }
    });
  }

  function load(status) {
    let url = '/api/jobs';
    if (status) url += '?status=' + status;
    $.ajax({
      url,
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#jobsTable tbody').empty();
        if (!rows.length) {
          tbody.append('<tr><td colspan="9" style="text-align:center;">No jobs</td></tr>');
          return;
        }
        rows.forEach(j => {
          tbody.append(
            '<tr>' +
              '<td>' + j.job_number + '</td>' +
              '<td>' + escapeHtml(j.customer_name) + '</td>' +
              '<td>' + escapeHtml(j.device_brand) + ' ' + escapeHtml(j.device_model) + '</td>' +
              '<td>' + escapeHtml(j.service_name) + '</td>' +
              '<td><span class="badge ' + j.status + '">' + j.status + '</span></td>' +
              '<td>' + j.priority + '</td>' +
              '<td>Rs. ' + parseFloat(j.estimated_cost).toFixed(2) + '</td>' +
              '<td>' + (j.received_date ? j.received_date.split('T')[0] : '') + '</td>' +
              '<td>' +
                '<button class="btn warn status-btn" data-id="' + j.id + '">Status</button> ' +
                '<button class="btn danger delete-btn" data-id="' + j.id + '">Delete</button>' +
              '</td>' +
            '</tr>'
          );
        });
      }
    });
  }

  $(document).on('click', '.delete-btn', function () {
    if (!confirm('Delete this job?')) return;
    $.ajax({
      url: '/api/jobs/' + $(this).data('id'),
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: () => load($('#statusFilter').val())
    });
  });

  $(document).on('click', '.status-btn', function () {
    const id = $(this).data('id');
    const status = prompt(
      'New status (received/diagnosing/in_progress/completed/delivered/cancelled):'
    );
    if (!status) return;
    $.ajax({
      url: '/api/jobs/' + id + '/status',
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify({ status }),
      success: () => load($('#statusFilter').val())
    });
  });

  $('#jobForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      customer_id: $('#customer_id').val(),
      device_id: $('#device_id').val(),
      service_id: $('#service_id').val(),
      problem_description: $('#problem_description').val(),
      priority: $('#priority').val(),
      received_date: $('#received_date').val(),
      target_date: $('#target_date').val() || null
    };
    $.ajax({
      url: '/api/jobs',
      method: 'POST',
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: function (res) {
        showMessage($('#msg'), 'Job created: ' + res.job_number);
        // Auto-create pending payment
        $.ajax({
          url: '/api/payments',
          method: 'POST',
          headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
          data: JSON.stringify({
            job_id: res.id,
            amount: res.estimated_cost,
            mode: 'cash',
            status: 'pending'
          })
        });
        $('#jobForm')[0].reset();
        load($('#statusFilter').val());
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  $('#statusFilter').on('change', function () {
    load($(this).val());
  });

  // ============ REPORT ============
  $('#generateReport').on('click', function () {
    const from = $('#reportFrom').val();
    const to = $('#reportTo').val();
    const status = $('#reportStatus').val();
    const params = [];
    if (from) params.push('from=' + from);
    if (to) params.push('to=' + to);
    if (status) params.push('status=' + status);
    const url = '/api/jobs/report' + (params.length ? '?' + params.join('&') : '');

    $.ajax({
      url,
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (data) {
        $('#reportSummary').show();
        $('#rTotal').text(data.summary.total_jobs);
        $('#rCompleted').text(data.summary.completed_jobs);
        $('#rActive').text(data.summary.active_jobs);
        $('#rRevenue').text('Rs. ' + parseFloat(data.summary.total_revenue).toFixed(2));

        const tbody = $('#reportTable tbody').empty();
        if (!data.rows.length) {
          tbody.append('<tr><td colspan="7" style="text-align:center;">No data</td></tr>');
          return;
        }
        data.rows.forEach(r => {
          tbody.append(
            '<tr>' +
              '<td>' + r.job_number + '</td>' +
              '<td>' + escapeHtml(r.customer_name) + '</td>' +
              '<td>' + escapeHtml(r.service_name) + '</td>' +
              '<td>' + r.status + '</td>' +
              '<td>Rs. ' + parseFloat(r.estimated_cost).toFixed(2) + '</td>' +
              '<td>' + (r.received_date ? r.received_date.split('T')[0] : '') + '</td>' +
              '<td>' + (r.payment_status || 'N/A') + '</td>' +
            '</tr>'
          );
        });
      }
    });
  });

  $('#downloadCSV').on('click', function () {
    const from = $('#reportFrom').val();
    const to = $('#reportTo').val();
    const status = $('#reportStatus').val();
    const params = [];
    if (from) params.push('from=' + from);
    if (to) params.push('to=' + to);
    if (status) params.push('status=' + status);
    const url = '/api/jobs/report/csv' + (params.length ? '?' + params.join('&') : '');

    fetch(url, { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(r => r.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'repair-jobs-report-' + Date.now() + '.csv';
        link.click();
      });
  });

  loadDropdowns();
  load();
});