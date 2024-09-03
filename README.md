# 🛒 Online Grocery Store App

Welcome to the **Online Grocery Store App** repository! This project is a robust web application designed to streamline the grocery shopping experience, offering an intuitive interface and powerful backend features. It is built using **Python**, **Flask**, and **Vue.js** and leverages **Celery** and **Redis** for handling asynchronous tasks.

## 🌟 Features

- **Role-Based Access Control (RBAC):** Secure user authentication and authorization system, offering tailored access to features based on user roles.
- **Responsive Dashboards:** Dynamic and interactive dashboards for different user roles, providing an optimal user experience on any device.
- **CRUD Operations:** Full CRUD capabilities for managing products and categories, allowing for easy inventory management.
- **Asynchronous Tasks:** Integration of Celery and Redis for handling background tasks like:
  - Automated monthly expenditure reports
  - Real-time data exports
  - Scheduled email notifications to customers

## 🚀 Technologies Used

- **Frontend:**
  - [Vue.js](https://vuejs.org/): A progressive JavaScript framework for building user interfaces.
- **Backend:**
  - [Flask](https://flask.palletsprojects.com/): A lightweight WSGI web application framework in Python.
  - [Celery](https://docs.celeryq.dev/en/stable/): An asynchronous task queue/job queue based on distributed message passing.
  - [Redis](https://redis.io/): An in-memory data structure store, used as a message broker by Celery.
- **Database:**
  - [SQLite/MySQL/PostgreSQL](#): (Specify the one used) for storing user, product, and order data.
- **Others:**
  - [Bootstrap](https://getbootstrap.com/): For responsive design.
  - [Jinja2](https://jinja.palletsprojects.com/): Templating engine for Flask.

## 📂 Project Structure

```bash
📦 online-grocery-store
├── 📁 backend
│   ├── 📁 app
│   │   ├── 📁 templates
│   │   ├── 📁 static
│   │   ├── 📄 __init__.py
│   │   └── ... (Other Flask app files)
│   ├── 📄 celery_worker.py
│   └── ... (Other backend files)
├── 📁 frontend
│   ├── 📁 src
│   │   ├── 📁 components
│   │   ├── 📄 App.vue
│   │   └── ... (Other Vue.js files)
├── 📄 Dockerfile
├── 📄 docker-compose.yml
├── 📄 README.md
└── ... (Other project files)

#🛠️ Installation & Setup
Clone the Repository:

```bash
Copy code
git clone https://github.com/amitaiml83/online-grocery-store.git
cd online-grocery-store
