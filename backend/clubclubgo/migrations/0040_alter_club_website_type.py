# Generated by Django 4.2.13 on 2024-08-06 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubclubgo', '0039_alter_club_website_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='website_type',
            field=models.CharField(choices=[('SP', 'Student Portal'), ('IN', 'Instagram'), ('NA', 'None'), ('HH', 'Hart House')], default='NA', max_length=2),
        ),
    ]
