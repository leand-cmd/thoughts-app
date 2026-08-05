import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from thoughts.models import Thought

thoughts = Thought.objects.all()

data = {
    'export_date': str(__import__('datetime').datetime.now()),
    'total': thoughts.count(),
    'thoughts': [
        {
            'id': t.id,
            'text': t.text,
            'category': t.category,
            'sentiment': t.sentiment,
            'created_at': str(t.created_at)
        }
        for t in thoughts
    ]
}

with open('thoughts_export.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Exportados {thoughts.count()} pensamientos a thoughts_export.json")
