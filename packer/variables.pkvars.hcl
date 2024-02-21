variable "project_id" {
  type    = string
  default = "csye6225-dev-415023"
}

variable "source_image" {
  type    = string
  default = "centos-stream-8-v20240110"
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "zone" {
  type    = string
  default = "us-central1-c"
}

variable "ssh_username" {
  type    = string
  default = "packer"
}
