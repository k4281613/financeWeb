<html>
<head>
    <title>home</title>
</head>
<body>
<ul>
    {%- for item in list %}
    <li>
        <h1>{{ item.title }}</h1>
        <p>
            {%- for children in item.children %}
            <a href="{{ children.url }}"><label>{{children.title}}</label></a>
            {% endfor %}
        </p>
    </li>
    {% endfor %}
</ul>
</body>
</html>
