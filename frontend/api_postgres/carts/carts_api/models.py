from django.contrib.postgres.fields import JSONField  # type: ignore
from django.db import models  # type: ignore
import json
import jsonschema  # type: ignore


class SectionSchema(models.Model):
    year = models.IntegerField()
    contents = JSONField()


class SectionBase(models.Model):
    contents = JSONField()

    def clean(self):
        schema_object = SectionSchema.objects.first()
        schema = schema_object.contents
        jsonschema.validate(instance=self.contents, schema=schema)


class Section(models.Model):
    contents = JSONField()

    def clean(self):
        schema_object = SectionSchema.objects.first()
        schema = schema_object.contents
        jsonschema.validate(instance=self.contents, schema=schema)

class State(models.Model):
    """
    A model to hold and reference state specific information
    """
    code = models.CharField(help_text="A unique two-character state code", max_length=2, primary_key=True)
    name = models.CharField(help_text="Full state name", max_length=100)

class FMAP(models.Model):
    """FMAP - Federal Medical Assistance Percentage - Rates used for determining
    the federal matching percentage for states/territories for Medicaid and CHIP.
    FY 20 data is in docs/FMAPfy20_data and can be loaded with generate_fixtures.py
    """
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    fiscal_year = models.IntegerField(help_text="The 4-digit fiscal year for this FMAP")
    enhanced_FMAP = models.DecimalField(help_text="Enhanced FMAP percentage", decimal_places=2, max_digits=5)

class ACS(models.Model):
    """ACS - American Community Survey data for each state for the number and
    percentage of children under 200% FPL that are uninsured, by year. Used to
    populate the table in section 2A.
    """
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    year = models.IntegerField(help_text="The 4-digit year of the ACS")
    number_uninsured = models.IntegerField(help_text="the number of uninsured children under 200% FPL")
    number_uninsured_moe = models.IntegerField(help_text="the margin of error for the number of uninsured children")
    percent_uninsured = models.DecimalField(help_text="percentage of uninsured \
    children", decimal_places=1, max_digits=5)
    percent_uninsured_moe = models.DecimalField(help_text="the margin of error \
    for the percentage of uninsured children", decimal_places=1, max_digits=5)
