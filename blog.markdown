---
layout: default
title: Articles
permalink: /blog/
---

This will have a list of articles:

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
