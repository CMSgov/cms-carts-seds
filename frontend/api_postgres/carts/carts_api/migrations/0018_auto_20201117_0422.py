# Generated by Django 2.2.13 on 2020-11-17 04:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("carts_api", "0017_auto_20201117_0106"),
    ]

    operations = [
        migrations.AddField(
            model_name="uploadedfiles",
            name="uploaded_state",
            field=models.CharField(default="", max_length=16),
        ),
        migrations.AlterField(
            model_name="uploadedfiles",
            name="aws_filename",
            field=models.CharField(default="", max_length=256),
        ),
        migrations.AlterField(
            model_name="uploadedfiles",
            name="filename",
            field=models.CharField(default="", max_length=256),
        ),
        migrations.AlterField(
            model_name="uploadedfiles",
            name="uploaded_username",
            field=models.CharField(default="", max_length=16),
        ),
    ]
