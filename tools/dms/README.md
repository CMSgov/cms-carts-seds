# Terraform 

Drawn from https://github.com/ministryofjustice/cloud-platform-terraform-dms

The DMS code is intended to be run locally rather than managed through a CI tool. To run, navigate to your target environment within the DMS folder (e.g. tools/dms/prod). From this directory, execute the following:

## Secret Values
* Copy terraform.tfvars.example into a new file called terraform.tfvars, in the same directory. 
* Update the password string values for the target and source database connection.

## Terraform Commands
_To be run from /tools/dms/<workspace_name>/aws_
terraform init

terraform workspace new <workspace_name>
terraform workspace select <workspace_name>
terraform workspace list - will show all available workspaces and which is currently selected

terraform plan
terraform apply

# Automated nightly job
_To be run from tools/dms/serverless_
Serverless architecture adapted from https://serverless-stack.com/
* To run locally: npm install, serverless invoke local --function #{Function Name} --stage #{Stage Name}
* To destroy: serverless remove
* To deploy to AWS: serverless deploy --stage #{Stage Name}

## Email notifications
Email recipients for error notifications must be configured through the AWS SNS console

# Workspace/Stage Names
* master
* staging
* prod