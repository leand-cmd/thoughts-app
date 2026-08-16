from rest_framework.routers import DefaultRouter
from .views import DailyLogViewSet, AlimentoViewSet, ComidaDiariaViewSet, EjercicioViewSet, EjercicioRealizadoViewSet, RegistroComidaViewSet, RegistroEjercicioViewSet

router = DefaultRouter()
router.register(r'daily-logs', DailyLogViewSet, basename='daily-log')
router.register(r'alimentos', AlimentoViewSet, basename='alimento')
router.register(r'comidas', ComidaDiariaViewSet, basename='comida')
router.register(r'ejercicios', EjercicioViewSet, basename='ejercicio')
router.register(r'ejercicios-realizados', EjercicioRealizadoViewSet, basename='ejercicio-realizado')
router.register(r'registro-comidas', RegistroComidaViewSet, basename='registro-comida')
router.register(r'registro-ejercicios', RegistroEjercicioViewSet, basename='registro-ejercicio')

urlpatterns = router.urls
