import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from thoughts.models import Thought

deleted_count, _ = Thought.objects.all().delete()
print(f"✓ BD limpia: {deleted_count} pensamientos eliminados")
