# Generated by Django 3.2.4 on 2021-07-15 07:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('labels', '0002_user_label'),
    ]

    operations = [
        migrations.CreateModel(
            name='Label_types',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        )
    ]
