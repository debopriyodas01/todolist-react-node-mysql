# fullstack.nomad
job "todo-fullstack" {
  datacenters = ["dc1"]
  type        = "service"

  update {
    max_parallel     = 1
    min_healthy_time = "10s"
    healthy_deadline = "3m"
  }

  # ONE UNIFIED GROUP: Forces tasks to share a blazing-fast local network loopback
  group "application-stack" {
    count = 1

    network {
      port "backend_port" { 
        static = 8080
        to     = 8080 
      }
      port "frontend_port" {
        static = 3000
        to     = 80
      }
    }

    # TASK 1: The Express Backend App Engine
    task "backend" {
      driver = "docker"

      config {
        image      = "BACKEND_IMAGE_PLACEHOLDER"
        ports      = ["backend_port"]
        force_pull = false
      }

      env {
        PORT        = "8080"
        DB_HOST     = "172.17.0.1" # Connects back to your Master MySQL container
        DB_PORT     = "3306"
        DB_USER     = "todo"
        DB_PASSWORD = "todo123"
        DB_NAME     = "todo"
      }

      resources {
        cpu    = 200
        memory = 128
      }
    }

    # TASK 2: The Production React Frontend Web App
    task "frontend" {
      driver = "docker"

      config {
        image      = "FRONTEND_IMAGE_PLACEHOLDER"
        ports      = ["frontend_port"]
        force_pull = false
      }

      resources {
        cpu    = 100
        memory = 64
      }
    }
  }
}
