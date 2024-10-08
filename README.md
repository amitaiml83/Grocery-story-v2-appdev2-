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
├── 📁 __pycache__
├── 📁 application
├── 📁 instance
├── 📁 monthlyreports
├── 📁 static
├── 📁 templates
├── 📄 celerybeat-schedule
├── 📄 celeryconfig.py
├── 📄 config.py
├── 📄 main.py
├── 📄 requirement.txt
└── 📄 upload_initial_data.py
```

- application/: Contains the main application logic, including routes and models
- instance/: Holds instance-specific files, like the database
- monthlyreports/: Contains reports generated monthly.
- static/: Houses static files like CSS, JavaScript, and images.
- templates/: Includes HTML templates for the app.
- celerybeat-schedule: A file used by Celery Beat for scheduling tasks.
- celeryconfig.py: Configuration file for Celery.
- config.py: General configuration file for the Flask application.
- main.py: The entry point of the application.
- requirement.txt: Lists all Python dependencies.
- upload_initial_data.py: Script for uploading initial data into the application.

## 🛠️ Installation
1. Clone the repository:
```bash
git clone https://github.com/amitaiml83/Grocery-story-v2-appdev2-.git
```
2. Change directory:
```bash
cd online-grocery-store
```
3. Install the dependencies:
```bash
pip install -r requirements.txt
```
4. Configure your environment settings in config.py.

5. Initialize the database:
```bash
python upload_initial_data.py
```
6. Run the application:
```bash
python main.py
```
7. Start the Celery worker:
```bash
celery -A main.celery worker --loglevel=info
```

8. Start Celery Beat for scheduled tasks:
```bash
celery -A main.celery beat --loglevel=info
```
# 📬 Contributing
- Contributions are welcome! Please fork the repository and create a pull request with your improvements.

# 📝 License
- This project is licensed under the MIT License.

# Feel free to reach out if you have any questions or need further assistance.

```vbnet
Let me know if you'd like to adjust anything!
