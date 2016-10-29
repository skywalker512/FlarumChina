<h2>升级 Flarum</h2>

<p>请输入mysql用户密码<strong>在升级前请备份数据库</strong>. 若有麻烦请到 <a href="http://discuss.flarum.ga" target="_blank">FlarumChina</a>.</p>

<form method="post">
  <div id="error" style="display:none"></div>

  <div class="FormGroup">
    <div class="FormField">
      <label>Database Password</label>
      <input type="password" name="databasePassword">
    </div>
  </div>

  <div class="FormButtons">
    <button type="submit">Update Flarum</button>
  </div>
</form>

<script src="https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
<script>
$(function() {
  $('form :input:first').select();

  $('form').on('submit', function(e) {
    e.preventDefault();

    var $button = $(this).find('button')
      .text('Please Wait...')
      .prop('disabled', true);

    $.post('', $(this).serialize())
      .done(function() {
        window.location.reload();
      })
      .fail(function(data) {
        $('#error').show().text('Something went wrong:\n\n' + data.responseText);

        $button.prop('disabled', false).text('Update Flarum');
      });

    return false;
  });
});
</script>
