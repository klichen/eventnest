# Generated by Django 4.2.13 on 2024-06-18 18:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Club',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=100)),
                ('description', models.TextField(max_length=300)),
                ('email', models.TextField(max_length=50)),
                ('website_type', models.CharField(choices=[('IN', 'Instagram'), ('NA', 'None'), ('HH', 'Hart House')], default='NA', max_length=2)),
                ('website_link', models.URLField(blank=True, default='', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=100)),
                ('date_time', models.DateTimeField()),
                ('location', models.TextField(max_length=100)),
                ('event_link', models.URLField(blank=True, default='', max_length=100)),
                ('image_link', models.URLField(blank=True, default='', max_length=100)),
                ('description', models.TextField(max_length=300)),
                ('club_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clubclubgo.club')),
            ],
        ),
    ]
