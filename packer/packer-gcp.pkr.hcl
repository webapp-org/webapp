packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1"
    }
  }
}

source "googlecompute" "image" {
  project_id   = var.project_id
  source_image = var.source_image
  region       = var.region
  zone         = var.zone
  ssh_username = var.ssh_username
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
