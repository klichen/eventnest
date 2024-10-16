# Generated by Django 4.2.13 on 2024-08-06 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubclubgo', '0036_alter_club_website_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='club',
            name='last_updated',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='club',
            name='website_type',
            field=models.CharField(choices=[('IN', 'Instagram'), ('HH', 'Hart House'), ('SP', 'Student Portal'), ('NA', 'None')], default='NA', max_length=2),
        ),
    ]
