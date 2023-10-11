output "server_node_public_ip" {
  value = try(aws_instance.ec2_node.public_ip, "")
}


output "server_node_private_ip" {
  value = try(aws_instance.ec2_node.private_ip, "")
}

output "server_database_public_ip" {
  value = try(aws_instance.ec2_database.public_ip, "")
}


output "server_database_private_ip" {
  value = try(aws_instance.ec2_database.private_ip, "")
}