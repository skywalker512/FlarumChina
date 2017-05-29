<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>重置密码</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
    <style>
        body {
            background: #fff;
            margin: 0;
            padding: 0;
            line-height: 1.5;
        }

        body, input, button {
            font-family: 'Open Sans', sans-serif;
            font-size: 16px;
            color: #7E96B3;
        }

        .container {
            max-width: 515px;
            margin: 0 auto;
            padding: 100px 30px;
            text-align: center;
        }

        a {
            color: #e7652e;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        h2 {
            font-size: 28px;
            font-weight: normal;
            color: #3C5675;
            margin-bottom: 0;
        }

        form {
            margin-top: 40px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        input {
            background: #EDF2F7;
            margin: 0 0 1px;
            border: 2px solid transparent;
            transition: background 0.2s, border-color 0.2s, color 0.2s;
            width: 100%;
            padding: 15px 15px 15px 180px;
            box-sizing: border-box;
        }

        input:focus {
            border-color: #e7652e;
            background: #fff;
            color: #444;
            outline: none;
        }

        label {
            float: left;
            width: 160px;
            text-align: right;
            margin-right: -160px;
            position: relative;
            margin-top: 18px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0.7;
        }

        button {
            background: #3C5675;
            color: #fff;
            border: 0;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            padding: 15px 30px;
            -webkit-appearance: none;
        }

    </style>
</head>

<body>
<div class="container">

    <h2>重置您的密码</h2>

    <div class="fadeIn">
        <form class="form-horizontal" role="form" method="POST" action="{{ app('Flarum\Forum\UrlGenerator')->toRoute('savePassword') }}">
      <input type="hidden" name="csrfToken" value="{{ $csrfToken }}">
      <input type="hidden" name="passwordToken" value="{{ $passwordToken }}">

            <div class="form-group">
                <label class="control-label">新密码</label>
                <input type="password" class="form-control" name="password">
            </div>

            <div class="form-group">
                <label class="control-label">再次输入</label>
                <input type="password" class="form-control" name="password_confirmation">
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-primary">重置</button>
            </div>
        </form>
    </div>

</div>
</body>
</html>
