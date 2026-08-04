from django.db import models
from django.utils import timezone

class Thought(models.Model):
    CATEGORY_CHOICES = [
        ('sin_categoria', 'Sin Categoría'),
        ('profesional', 'Profesional'),
        ('liderazgo', 'Liderazgo'),
        ('personal', 'Personal'),
        ('técnico', 'Técnico'),
        ('relaciones', 'Relaciones'),
        ('mentalidad', 'Mentalidad'),
        ('salud', 'Salud'),
        ('finanzas', 'Finanzas'),
        ('crecimiento', 'Crecimiento'),
        ('otro', 'Otro'),
    ]

    SENTIMENT_CHOICES = [
        ('positivo', 'Positivo'),
        ('negativo', 'Negativo'),
        ('neutro', 'Neutro'),
    ]

    text = models.TextField(
        help_text="El pensamiento o idea a registrar"
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='sin_categoria',
        blank=True,
        null=True
    )
    sentiment = models.CharField(
        max_length=10,
        choices=SENTIMENT_CHOICES,
        default='neutro',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Thoughts"

    def __str__(self):
        return f"{self.text[:50]}... ({self.created_at.strftime('%Y-%m-%d')})"
