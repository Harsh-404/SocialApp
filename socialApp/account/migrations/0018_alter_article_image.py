# Generated by Django 5.1 on 2024-09-22 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0017_alter_article_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='socialApp/media/images/'),
        ),
    ]
