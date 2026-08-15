from rest_framework import viewsets
from .models import DailyLog, Alimento, ComidaDiaria
from .serializers import DailyLogSerializer, AlimentoSerializer, ComidaDiariaSerializer

class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer
    lookup_field = 'fecha'

class AlimentoViewSet(viewsets.ModelViewSet):
    queryset = Alimento.objects.all()
    serializer_class = AlimentoSerializer

class ComidaDiariaViewSet(viewsets.ModelViewSet):
    queryset = ComidaDiaria.objects.all()
    serializer_class = ComidaDiariaSerializer
