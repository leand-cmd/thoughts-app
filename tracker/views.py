from rest_framework import viewsets
from .models import DailyLog
from .serializers import DailyLogSerializer

class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer
    lookup_field = 'fecha'
