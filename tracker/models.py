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
