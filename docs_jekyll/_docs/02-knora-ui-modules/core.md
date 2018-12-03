---
title: '@knora/core'
category: Knora-ui modules
---

---

{% for module in site.data.core %}

{% assign mod = module[1] %}

{% for object in mod %}

{% if object.ctx %}

{{ object.ctx.type }} <br>
#### {{ object.ctx.string }}

{% endif %}

{{ object.description.full }}

{% for tag in object.tags %}

{% if tag.type != 'ignore' %}

##### {{ tag.type }}: {{ tag.string }}

~~~html
{{ tag.string }}
~~~

{% endif %}

{% endfor %}

{% endfor %}

---

{% endfor %}
