---
title: '@knora/action'
category: Knora-ui modules
---

---

{% for module in site.data.action %}

{% assign mod = module[1] %}

{% for object in mod %}

{{ object.description.full }}

{% for tag in object.tags %}

{% if tag.type != 'ignore' %}

##### {{ tag.type }}

~~~html
{{ tag.string }}
~~~

{% endif %}

{% endfor %}

{% endfor %}

---

{% endfor %}
