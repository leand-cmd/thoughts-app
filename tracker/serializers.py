from rest_framework import serializers
from .models import DailyLog, Alimento, ComidaDiaria, Ejercicio, EjercicioRealizado

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'

class AlimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimento
        fields = '__all__'

class ComidaDiariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComidaDiaria
        fields = '__all__'

class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'

class EjercicioRealizadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjercicioRealizado
        fields = '__all__'
