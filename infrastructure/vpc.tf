resource "aws_vpc" "Semi1_VPC" {                # Creating VPC here
  cidr_block           = var.Semi1_vpc_cidr # Defining the CIDR block use 10.0.0.0/24 for demo
  instance_tenancy     = "default"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_internet_gateway" "IGW" { # Creating Internet Gateway
  vpc_id = aws_vpc.Semi1_VPC.id          # vpc_id will be generated after we create VPC
}

resource "aws_subnet" "PublicS1" { # Creating Public Subnets
  vpc_id                  = aws_vpc.Semi1_VPC.id
  map_public_ip_on_launch = "true"
  availability_zone       = "us-east-1a"
  cidr_block              = var.public1 # CIDR block of public subnets
}


#Route table for Public Subnet's
resource "aws_route_table" "PublicRT" { # Creating RT for Public Subnet
  vpc_id = aws_vpc.Semi1_VPC.id
  route {
    cidr_block = "0.0.0.0/0" # Traffic from Public Subnet reaches Internet via Internet Gateway
    gateway_id = aws_internet_gateway.IGW.id
  }
}

#Route table Association with Public Subnet's
resource "aws_route_table_association" "PublicRTassociation" {
  subnet_id      = aws_subnet.PublicS1.id
  route_table_id = aws_route_table.PublicRT.id
}

