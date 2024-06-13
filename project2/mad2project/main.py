from flask import Flask
from flask_security import Security
from application.models import db,User,Role
from config import DeveloperConfig  
from application.resource import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import generate_monthly_user_report,generate_pdf
from application.instances import cache


def create_app():
    app=Flask(__name__)
    app.config.from_object(DeveloperConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.view
    
    return app


app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute='*/1'),
        generate_monthly_user_report.s(),

    )

@celery_app.on_after_configure.connect
def pdf_generate(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute='*/1'),
        generate_pdf.s(),

    )



if __name__ == '__main__':
    app.run(debug=True)
