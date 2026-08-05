job "todo-fullstack" {
  datacenters = ["dc1"]
  type        = "service"

  update {
    max_parallel     = 1
    min_healthy_time = "10s"
    healthy_deadline = "3m"
  }

  group "application-stack" {
    count = 1

    network {
      # Exposes the Express backend internally on port 8080
      port "backend_port" { to = 8080 }
      
      # Exposes the React frontend publicly on host port 3000
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
        # 172.17.0.1 points straight to your Master MySQL container on the host bridge
        DB_HOST     = "172.17.0.1"
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
