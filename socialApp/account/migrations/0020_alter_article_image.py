# Generated by Django 5.1 on 2024-09-23 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0019_alter_article_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='image',
            field=models.ImageField(blank=True, default='capture.png', upload_to='images'),
        ),
    ]
