$(function () {
  requireAuth();
  renderHeader('dashboard.html');

  $.ajax({
    url: '/api/dashboard/summary',
    headers: { Authorization: 'Bearer ' + getToken() },
    success: function (d) {
      $('#totalCustomers').text(d.total_customers);
      $('#totalDevices').text(d.total_devices);
      $('#totalJobs').text(d.total_jobs);
      $('#activeJobs').text(d.active_jobs);
      $('#todayJobs').text(d.today_jobs);
      $('#totalRevenue').text('Rs. ' + parseFloat(d.total_revenue).toFixed(2));
      $('#pendingPayments').text(d.pending_payments);
    }
  });

  $.ajax({
    url: '/api/dashboard/report',
    headers: { Authorization: 'Bearer ' + getToken() },
    success: function (rows) {
      const tbody = $('#reportTable tbody').empty();
      if (!rows.length) {
        tbody.append('<tr><td colspan="3" style="text-align:center;">No data</td></tr>');
        return;
      }
      rows.forEach(r => {
        tbody.append(
          '<tr><td>' + escapeHtml(r.service_name) + '</td>' +
          '<td>' + r.job_count + '</td>' +
          '<td>Rs. ' + parseFloat(r.revenue).toFixed(2) + '</td></tr>'
        );
      });
    }
  });

  $('#exportBtn').on('click', function () {
    $.ajax({
      url: '/api/dashboard/report',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        let csv = 'Service,Jobs,Revenue\n';
        rows.forEach(r => {
          csv += `"${r.service_name}",${r.job_count},${r.revenue}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'service-report.csv';
        a.click();
      }
    });
  });
});