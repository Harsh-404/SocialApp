# Generated by Django 5.1 on 2024-09-15 04:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0009_alter_article_author_alter_profile_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images'),
        ),
    ]
