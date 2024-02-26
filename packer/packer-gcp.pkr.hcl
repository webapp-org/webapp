packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1"
    }
  }
}

source "googlecompute" "image" {
  project_id   = "csye6225-dev-415023"
  source_image = "centos-stream-8-v20240110"
  region       = "us-central1"
  zone         = "us-central1-c"
  ssh_username = "packer"
}

build {

  sources = ["source.googlecompute.image"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
    generated   = true
  }

  provisioner "file" {
    source      = "packer/service/app.service"
    destination = "/tmp/app.service"
  }

  provisioner "file" {
    source      = ".env"
    destination = "/tmp/.env"
  }

  # Script to install dependecies 
  provisioner "shell" {
    script = "packer/scripts/setup.sh"
  }

  # Script to move project and set up ownership
  provisioner "shell" {
    script = "packer/scripts/move_app.sh"
  }

  # Script to start services
  provisioner "shell" {
    script = "packer/scripts/run_service.sh"
  }

}
