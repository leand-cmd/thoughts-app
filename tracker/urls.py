from rest_framework.routers import DefaultRouter
from .views import DailyLogViewSet, AlimentoViewSet, ComidaDiariaViewSet

router = DefaultRouter()
router.register(r'daily-logs', DailyLogViewSet, basename='daily-log')
router.register(r'alimentos', AlimentoViewSet, basename='alimento')
router.register(r'comidas', ComidaDiariaViewSet, basename='comida')

urlpatterns = router.urls
