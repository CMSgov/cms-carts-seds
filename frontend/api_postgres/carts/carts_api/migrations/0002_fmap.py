# Generated by Django 2.2.13 on 2020-09-12 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("carts_api", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="FMAP",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "state",
                    models.CharField(
                        db_index=True,
                        help_text="Please use the two character state abbreviation",
                        max_length=2,
                    ),
                ),
                (
                    "fiscal_year",
                    models.IntegerField(
                        help_text="The 4-digit fiscal year for this FMAP"
                    ),
                ),
                (
                    "enhanced_FMAP",
                    models.DecimalField(
                        decimal_places=2,
                        help_text="Enhanced FMAP percentage",
                        max_digits=5,
                    ),
                ),
            ],
        ),
    ]
