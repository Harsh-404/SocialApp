# Generated by Django 5.1 on 2024-09-24 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0022_friendslist'),
    ]

    operations = [
        migrations.RenameField(
            model_name='friendslist',
            old_name='friends_id',
            new_name='friends',
        ),
        migrations.AddField(
            model_name='profile',
            name='friends',
            field=models.ManyToManyField(to='account.profile'),
        ),
    ]
