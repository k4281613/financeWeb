<!-- app/view/index/SnowHotNew.tpl -->
<html>
<head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css"/>
</head>
<body>
<div>
<ul class="news-view view">
    {%- for item in list %}
    <li class="item">
        <a href="{{ item.url }}"><h2>{{ item.title }}</h2>
            <p><label>文章编码：</label>{{item.article_id}}</p>
        </a>
        <p><label>描述：</label>{{item.description | safe}}</p>
        <p>{{item.from}}</p>
        <p><label>详细：</label>{{item.detail}}</p>
        <p><label>作者：</label>{{item.user}}</p>
    </li>
    {% endfor %}
</ul>
</div>
</body>
</html>
