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
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
    generated   = true
  }

  provisioner "file" {
    source      = "mysql.service"
    destination = "/etc/systemd/system/mysql.service"
  }

  provisioner "shell" {
    inline = [

      "sudo groupadd csye6225",
      "sudo useradd -M -s /usr/sbin/nologin -g csye6225 csye6225",

      "sudo mv /tmp/script.sh /home/script.sh",
      # set ownership
      "sudo chown csye6225:csye6225 /home/script.sh",
      "sudo chmod +x /home/script.sh",
      "/home/script.sh",

      "sudo mv /tmp/webapp.zip /home/webapp.zip",
      # set ownership
      "sudo chown csye6225:csye6225 /home/webapp.zip",
      "sudo unzip /home/webapp.zip -d /home/webapp",


      "sudo systemctl daemon-reload",
      "sudo systemctl enable mysql.service",
      "sudo systemctl start mysql.service"

    ]
  }
}
