from django.db import models

class DailyLog(models.Model):
    fecha = models.DateField(unique=True)
    gym = models.BooleanField(default=False)
    creatina = models.BooleanField(default=False)
    vitamina_d = models.BooleanField(default=False)
    omega3 = models.BooleanField(default=False)
    magnesio = models.BooleanField(default=False)
    zinc = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.fecha} - Gym: {self.gym}"


class Alimento(models.Model):
    TIPOS = [
        ('proteina', 'Proteína'),
        ('carbohidrato', 'Carbohidrato'),
        ('verdura', 'Verdura'),
        ('fruta', 'Fruta'),
        ('lacteo', 'Lácteo'),
        ('bebida', 'Bebida'),
        ('otro', 'Otro'),
    ]
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPOS, default='otro')
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['tipo', 'nombre']

    def __str__(self):
        return self.nombre


class ComidaDiaria(models.Model):
    MOMENTOS = [
        ('desayuno', 'Desayuno'),
        ('almuerzo', 'Almuerzo'),
        ('merienda', 'Merienda'),
        ('cena', 'Cena'),
        ('snack', 'Snack'),
    ]
    fecha = models.DateField()
    momento = models.CharField(max_length=20, choices=MOMENTOS)
    alimentos = models.ManyToManyField(Alimento, blank=True)
    nota = models.TextField(blank=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.fecha} - {self.momento}"
