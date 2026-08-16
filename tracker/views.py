from rest_framework import viewsets
from .models import DailyLog, Alimento, ComidaDiaria, Ejercicio, EjercicioRealizado, RegistroComida, RegistroEjercicio
from .serializers import DailyLogSerializer, AlimentoSerializer, ComidaDiariaSerializer, EjercicioSerializer, EjercicioRealizadoSerializer, RegistroComidaSerializer, RegistroEjercicioSerializer

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

class EjercicioViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer

class EjercicioRealizadoViewSet(viewsets.ModelViewSet):
    queryset = EjercicioRealizado.objects.all()
    serializer_class = EjercicioRealizadoSerializer

class RegistroComidaViewSet(viewsets.ModelViewSet):
    queryset = RegistroComida.objects.all()
    serializer_class = RegistroComidaSerializer

class RegistroEjercicioViewSet(viewsets.ModelViewSet):
    queryset = RegistroEjercicio.objects.all()
    serializer_class = RegistroEjercicioSerializer
