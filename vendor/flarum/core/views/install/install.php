<h2>安装 Flarum</h2>

<p>请在下面设置你的信息. 若你遇到麻烦可点击  <a href="http://flarum.org/docs/installation" target="_blank">Flarum 交流论坛（英文）</a>.</p>

<form method="post">
  <div id="error" style="display:none"></div>

  <div class="FormGroup">
    <div class="FormField">
      <label>论坛标题</label>
      <input name="forumTitle">
    </div>
  </div>

  <div class="FormGroup">
    <div class="FormField">
      <label>MySQL 数据库地址</label>
      <input name="mysqlHost" value="localhost">
    </div>

    <div class="FormField">
      <label>MySQL 数据库名</label>
      <input name="mysqlDatabase">
    </div>

    <div class="FormField">
      <label>MySQL 用户名</label>
      <input name="mysqlUsername">
    </div>

    <div class="FormField">
      <label>MySQL 密码</label>
      <input type="password" name="mysqlPassword">
    </div>

    <div class="FormField">
      <label>MySQL 端口</label>
      <input type="number" name="mysqlPort">
    </div>

    <div class="FormField">
      <label>数据库前缀（可选）</label>
      <input type="text" name="tablePrefix">
    </div>
  </div>

  <div class="FormGroup">
    <div class="FormField">
      <label>管理者用户名</label>
      <input name="adminUsername">
    </div>

    <div class="FormField">
      <label>管理者Email</label>
      <input name="adminEmail">
    </div>

    <div class="FormField">
      <label>管理者密码</label>
      <input type="password" name="adminPassword">
    </div>

    <div class="FormField">
      <label>重复密码</label>
      <input type="password" name="adminPasswordConfirmation">
    </div>
  </div>

  <div class="FormButtons">
    <button type="submit">点击安装</button>
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

        $button.prop('disabled', false).text('Install Flarum');
      });

    return false;
  });
});
</script>
