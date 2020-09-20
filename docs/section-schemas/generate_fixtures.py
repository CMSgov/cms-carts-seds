import json
import csv
import jsonschema  # type: ignore
from pathlib import Path


def main() -> None:
    here = Path(".")
    there = Path("..", "..", "frontend", "api_postgres", "fixtures")

    def etl(fpath, modelname, schema):
        orig = json.loads(fpath.read_text(encoding='utf8'))
        jsonschema.validate(schema=schema, instance=orig)
        output = transform(modelname, orig)
        Path(there, f.name).write_text(json.dumps(output))

    schema = json.loads(Path(here, "backend-section.schema.json").read_text(encoding='utf8'))
    schemafixture = transform("carts_api.sectionschema", schema)
    schemapath = Path(there, "backend-section.schema.json")
    schemapath.write_text(json.dumps(schemafixture))

    for f in here.glob("backend-json-section-*.json"):
        etl(f, "carts_api.sectionbase", schema)

    for f in here.glob("2020-*.json"):
        etl(f, "carts_api.section", schema)

    for f in here.glob("2020-fmap-data.csv"):
        # probably won't need to update to enter arbitrary years because there
        # will be an admin interface for CMS users to enter this data.
        csvf = open(f, 'r')
        reader = csv.DictReader(csvf, delimiter=",")
        fields = reader.fieldnames
        fmaps = []
        for row in reader:
            obj = {
                "model": "carts_api.FMAP",
                "fields": {
                    "fiscal_year": 2020,
                    "state": row["State abbreviation"],
                    "enhanced_FMAP": row["enhanced FMAP"]
                }
            }
            fmaps.append(obj)
        outputpath = Path(there, "2020-fmap.json")
        outputpath.write_text(json.dumps(fmaps))

def transform(model, orig):
    models = {
        "carts_api.sectionschema": {
            "model": "carts_api.sectionschema",
            "fields": {
                "year": 2020
            }
        },
        "carts_api.sectionbase": {
            "model": "carts_api.sectionbase",
            "fields": {}
        },
        "carts_api.section": {
            "model": "carts_api.section",
            "fields": {}
        }
    }
    entry = models[model]
    entry["fields"]["contents"] = orig
    return [entry]

def load_acs_data():
    here = Path(".")
    state_to_abbrev = json.loads(Path(here, "state_to_abbrev.json").read_text(encoding='utf8'))
    years = ['2015', '2016', '2017', '2018', '2019']
    for y in years:
        csvf = open(Path(here, "hi10-acs-%s.csv" % y), 'r')
        reader = csv.reader(csvf, delimiter=",")
        next(reader) #skip header
        next(reader) #skip US totals
        acs_data = []
        for row in reader:
            obj = {
                "model": "carts_api.ACS",
                "fields":{
                    "year": y,
                    "state": state_to_abbrev[row[0].upper()],
                    "number_uninsured": 0 if row[1].lower() == 'z' else int(row[1]) * 1000, #numbers measured in thousands
                    "number_uninsured_moe": 0 if row[2].lower() == 'z' else int(row[2]) * 1000,
                    "percent_uninsured": row[3],
                    "percent_uninsured_moe": row[4]
                }
            }

            print(obj)

if __name__ == '__main__':
    main()
