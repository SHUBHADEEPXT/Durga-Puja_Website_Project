terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Durga-Puja-Platform"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr     = var.vpc_cidr
  project_name = var.project_name
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  project_name       = var.project_name
  cluster_version    = var.cluster_version
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids

  depends_on = [module.vpc]
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  project_name           = var.project_name
  vpc_id                 = module.vpc.vpc_id
  database_subnet_ids    = module.vpc.database_subnet_ids
  eks_security_group_id  = module.eks.cluster_security_group_id
  db_password            = var.mongodb_password

  depends_on = [module.eks]
}

# ElastiCache Module
module "elasticache" {
  source = "./modules/elasticache"

  project_name          = var.project_name
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  eks_security_group_id = module.eks.cluster_security_group_id
  redis_password        = var.redis_password

  depends_on = [module.eks]
}

# S3 Module
module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
}

# Data sources for Kubernetes/Helm providers
#data "aws_eks_cluster" "cluster" {
#  name = module.eks.cluster_name
#}

#data "aws_eks_cluster_auth" "cluster" {
#  name = module.eks.cluster_name
#}

#provider "kubernetes" {
#  host                   = data.aws_eks_cluster.cluster.endpoint
#  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
#  token                  = data.aws_eks_cluster_auth.cluster.token
#}

#provider "helm" {
#  kubernetes {
#    host                   = data.aws_eks_cluster.cluster.endpoint
#    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
#    token                  = data.aws_eks_cluster_auth.cluster.token
#  }
#}
