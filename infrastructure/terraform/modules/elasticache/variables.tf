variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "eks_security_group_id" {
  description = "EKS cluster security group ID"
  type        = string
}

variable "redis_password" {
  description = "Redis authentication password"
  type        = string
  sensitive   = true
}
