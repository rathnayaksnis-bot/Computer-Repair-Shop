$(function () {
  requireAuth();
  renderHeader('payments.html');

  function load() {
    $.ajax({
      url: '/api/payments',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#paymentsTable tbody').empty();
        if (!rows.length) {
          tbody.append('<tr><td colspan="8" style="text-align:center;">No payments</td></tr>');
          return;
        }
        rows.forEach(p => {
          tbody.append(
            '<tr>' +
              '<td>' + p.id + '</td>' +
              '<td>' + p.job_number + '</td>' +
              '<td>' + escapeHtml(p.customer_name) + '</td>' +
              '<td>Rs. ' + parseFloat(p.amount).toFixed(2) + '</td>' +
              '<td>' + p.mode + '</td>' +
              '<td><span class="badge ' + p.status + '">' + p.status + '</span></td>' +
              '<td>' + (p.transaction_ref || '') + '</td>' +
              '<td>' +
                (p.status !== 'paid'
                  ? '<button class="btn success mark-paid-btn" data-id="' + p.id + '">Mark Paid</button>'
                  : '') +
              '</td>' +
            '</tr>'
          );
        });
      }
    });
  }

  $(document).on('click', '.mark-paid-btn', function () {
    if (!confirm('Mark this payment as Paid?')) return;
    $.ajax({
      url: '/api/payments/' + $(this).data('id') + '/status',
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify({ status: 'paid', mode: 'cash' }),
      success: load
    });
  });

  load();
});