from rest_framework import serializers
from .models import Thought

class ThoughtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thought
        fields = ['id', 'text', 'category', 'sentiment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
