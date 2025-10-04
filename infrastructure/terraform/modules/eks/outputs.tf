output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
}

output "cluster_certificate_authority_data" {
  description = "Certificate authority data"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "load_balancer_dns" {
  description = "Load balancer DNS (placeholder - will be created by ingress)"
  value       = "Will be created after ingress deployment"
}
