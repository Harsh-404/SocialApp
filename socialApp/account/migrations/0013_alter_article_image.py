# Generated by Django 5.1 on 2024-09-22 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0012_rename_author_article_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='image',
            field=models.ImageField(blank=True, default='Capture.png', null=True, upload_to='media\\images'),
        ),
    ]
