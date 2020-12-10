# Generated by Django 2.2.13 on 2020-12-10 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('carts_api', '0018_auto_20201123_1702'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFiles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.CharField(default='', max_length=256)),
                ('aws_filename', models.CharField(default='', max_length=256)),
                ('question_id', models.CharField(max_length=16)),
                ('uploaded_date', models.DateTimeField(auto_now_add=True)),
                ('uploaded_username', models.CharField(default='', max_length=16)),
                ('uploaded_state', models.CharField(default='', max_length=16)),
            ],
        ),
        migrations.AlterField(
            model_name='statestatus',
            name='status',
            field=models.CharField(choices=[('not_started', 'Not started'), ('in_progress', 'In progress'), ('certified', 'Certified'), ('uncertified', 'Uncertified'), ('accepted', 'Accepted'), ('submitted', 'Submitted'), ('published', 'Published')], default='not_started', max_length=32),
        ),
    ]
