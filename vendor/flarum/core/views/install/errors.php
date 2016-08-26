<h2>请注意！</h2>

<p>这里有严重的问题需要解决，请访问 <a href="http://flarum.ga/docs/installation" target="_blank">Flarum 安装文档</a>，<a href="http://discuss.flarum.ga/" target="_blank">Flarum交流论坛</a>获得帮助！</p>

<div class="Errors">
  <?php foreach ($errors as $error): ?>
    <div class="Error">
      <h3 class="Error-message"><?php echo $error['message']; ?></h3>
      <?php if (! empty($error['detail'])): ?>
        <p class="Error-detail"><?php echo $error['detail']; ?></p>
      <?php endif; ?>
    </div>
  <?php endforeach; ?>
</div>
