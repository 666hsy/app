# Generated by Django 3.2.8 on 2022-04-06 03:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_tool'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='tools',
        ),
        migrations.AddField(
            model_name='player',
            name='shoose',
            field=models.BooleanField(default=False),
        ),
    ]
