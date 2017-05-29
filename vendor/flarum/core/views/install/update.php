<h2>更新 Flarum</h2>

<p>输入数据库密码以更新 Flarum. 在更新前你需要<strong>备份数据库</strong>. 若你遇到麻烦可点击 <a href="http://flarum.org/docs/updating" target="_blank">Flarum 交流论坛（英文）</a>.</p>

<form method="post">
  <div id="error" style="display:none"></div>

  <div class="FormGroup">
    <div class="FormField">
      <label>数据库密码</label>
      <input type="password" name="databasePassword">
    </div>
  </div>

  <div class="FormButtons">
    <button type="submit">点击更新</button>
  </div>
</form>

<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
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
