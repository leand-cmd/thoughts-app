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
    descripcion = models.TextField(blank=True)
    porcion = models.CharField(max_length=100, blank=True)
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


class Ejercicio(models.Model):
    GRUPOS = [
        ('pecho', 'Pecho'),
        ('espalda', 'Espalda'),
        ('piernas', 'Piernas'),
        ('hombros', 'Hombros'),
        ('brazos', 'Brazos'),
        ('core', 'Core'),
        ('cardio', 'Cardio'),
        ('otro', 'Otro'),
    ]
    nombre = models.CharField(max_length=100)
    grupo = models.CharField(max_length=20, choices=GRUPOS, default='otro')
    descripcion = models.TextField(blank=True)
    gif_url = models.URLField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['grupo', 'nombre']

    def __str__(self):
        return self.nombre


class EjercicioRealizado(models.Model):
    fecha = models.DateField()
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    series = models.IntegerField(null=True, blank=True)
    repeticiones = models.IntegerField(null=True, blank=True)
    peso = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    nota = models.TextField(blank=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.fecha} - {self.ejercicio.nombre}"


class RegistroComida(models.Model):
    MOMENTOS = [
        ('desayuno', 'Desayuno'),
        ('almuerzo', 'Almuerzo'),
        ('merienda', 'Merienda'),
        ('cena', 'Cena'),
        ('snack', 'Snack'),
    ]
    fecha = models.DateField()
    momento = models.CharField(max_length=20, choices=MOMENTOS)
    detalle = models.TextField()

    class Meta:
        ordering = ['-fecha', 'momento']

    def __str__(self):
        return f"{self.fecha} - {self.momento}"
