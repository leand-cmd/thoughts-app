from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Thought
from .serializers import ThoughtSerializer
import json
from datetime import datetime

class ThoughtViewSet(viewsets.ModelViewSet):
    queryset = Thought.objects.all().order_by('-created_at')
    serializer_class = ThoughtSerializer

    @action(detail=False, methods=['get'])
    def export(self, request):
        """
        Exporta todos los pensamientos en JSON para análisis
        Uso: GET /api/thoughts/export/
        """
        thoughts = self.get_queryset()
        data = {
            'export_date': datetime.now().isoformat(),
            'total_thoughts': thoughts.count(),
            'thoughts': ThoughtSerializer(thoughts, many=True).data
        }
        return Response(data)

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """
        Crea múltiples pensamientos de una vez
        """
        thoughts_data = request.data.get('thoughts', [])
        created_thoughts = []

        for thought_data in thoughts_data:
            serializer = self.get_serializer(data=thought_data)
            if serializer.is_valid():
                serializer.save()
                created_thoughts.append(serializer.data)

        return Response({
            'created': len(created_thoughts),
            'thoughts': created_thoughts
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Filtra pensamientos por categoría
        Uso: GET /api/thoughts/by_category/?category=profesional
        """
        category = request.query_params.get('category')
        if category:
            thoughts = self.get_queryset().filter(category=category)
        else:
            thoughts = self.get_queryset()

        serializer = self.get_serializer(thoughts, many=True)
        return Response(serializer.data)
