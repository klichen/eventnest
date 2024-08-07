# Generated by Django 4.2.13 on 2024-07-31 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubclubgo', '0032_alter_club_website_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='email',
            field=models.TextField(default='', max_length=50),
        ),
        migrations.AlterField(
            model_name='club',
            name='website_type',
            field=models.CharField(choices=[('HH', 'Hart House'), ('SP', 'Student Portal'), ('NA', 'None'), ('IN', 'Instagram')], default='NA', max_length=2),
        ),
    ]
