# Generated by Django 3.2.8 on 2022-04-05 02:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_player_money'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='tools',
            field=models.JSONField(null=True),
        ),
    ]