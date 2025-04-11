from django.db import models

# Create your models here.
class Log(models.Model):
    log_id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=250)
    sentiment = models.CharField(max_length=17)
    score = models.FloatField()
    magnitude = models.FloatField()
    subjectivity = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.log_id