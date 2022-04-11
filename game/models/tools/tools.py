from django.db import models

class Tool(models.Model):
    name=models.CharField(max_length=200,default="")
    cost=models.IntegerField(default=0)

    def __str__(self):
        return str(self.name)
