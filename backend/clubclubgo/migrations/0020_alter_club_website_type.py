# Generated by Django 4.2.13 on 2024-06-25 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubclubgo', '0019_alter_club_website_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='website_type',
            field=models.CharField(choices=[('NA', 'None'), ('HH', 'Hart House'), ('IN', 'Instagram')], default='NA', max_length=2),
        ),
    ]
