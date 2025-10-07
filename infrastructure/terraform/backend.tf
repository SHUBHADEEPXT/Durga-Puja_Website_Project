terraform {
  backend "s3" {
    bucket         = "durga-puja-terraform-state-695128592265"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "durga-puja-terraform-locks"
  }
}
