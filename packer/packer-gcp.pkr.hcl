packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1"
    }
  }
}

source "googlecompute" "image" {
  project_id   = "robust-doodad-412315"
  source_image = "centos-stream-8-v20240110"
  region       = "us-central1"
  zone         = "us-central1-c"
  ssh_username = "packer"
}

build {

  sources = ["source.googlecompute.image"]

  provisioner "file" {
    source      = "script/script.sh"
    destination = "/tmp/script.sh"
  }

  provisioner "file" {
    source      = "myapp.zip"
    destination = "/tmp/myapp.zip"
  }

  provisioner "shell" {
    inline = [
      "sudo mv /tmp/script.sh /home/script.sh",
      "sudo chmod +x /home/script.sh",
      "/home/script.sh",

      "sudo mv /tmp/myapp.zip /home/myapp.zip",
      "sudo unzip /home/myapp.zip -d /home/myapp",
    ]
  }
}
