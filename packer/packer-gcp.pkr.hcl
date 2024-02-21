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
    source      = "app.service"
    destination = "/tmp/app.service"
  }

  provisioner "shell" {
    inline = [

      "sudo adduser csye6225 --shell /usr/sbin/nologin",

      "sudo mv /tmp/script.sh /home/script.sh",
      # set ownership
      "sudo chown csye6225:csye6225 /home/script.sh",
      "sudo chmod +x /home/script.sh",
      "/home/script.sh",

      "sudo mv /tmp/webapp.zip /home/webapp.zip",
      # set ownership
      "sudo chown csye6225:csye6225 /home/webapp.zip",
      "sudo unzip /home/webapp.zip -d /home/webapp",
      "sudo chown -R csye6225:csye6225 /home/webapp",



      # move and run the service
      "sudo systemctl enable mysqld.service",
      "sudo mv /tmp/app.service /etc/systemd/system/app.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable app.service",

    ]
  }
}
