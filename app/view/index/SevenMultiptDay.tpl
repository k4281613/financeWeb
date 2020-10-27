
<html>
<head>
    <title>Hacker News</title>
</head>
<body>
<ul class="news-view view">
    {%- for item in list %}
    <li class="item">
        <p>
            <a href="{{ item.target }}">
                <label>资讯：</label>{{item.new_id}}
            </a>
            <label>时间：</label>{{item.created_at}}
        </p>
        <p>{{ item.text }}</p>
        <p><label>分享：</label>{{item.share_count}}</p>
        <p><label>评论：</label>{{item.reply_count}}</p>
    </li>
    {% endfor %}
</ul>
</body>
</html>
