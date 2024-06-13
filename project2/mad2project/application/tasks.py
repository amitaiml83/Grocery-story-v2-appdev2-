from celery import shared_task
from datetime import datetime, timedelta

from os import makedirs
from os.path import join, exists
from application.mail_service import send_message
import flask_excel as excel
from .models import User,Role,Product,Transaction,Order
from flask import render_template
from weasyprint import HTML



@shared_task(ignore_result=False)
def create_resource_csv():
    product_d = Product.query.with_entities(Product.name,Product.quantity, Product.description,Product.rate_per_unit).all()
    csv_output = excel.make_response_from_query_sets(product_d,["name","quantity","description","rate_per_unit"],"csv")
    file_name="test1.csv"

    with open(file_name, 'wb') as f:
        f.write(csv_output.data)
    return file_name


@shared_task(ignore_result=False)
def generate_monthly_user_report():
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()
    for user in users:
        orders = Order.query.filter_by(user_id=user.id).all()
        transactions = Transaction.query.filter_by(user_id=user.id).all()


        subject = f"Monthly Report - {user.email}"

        report_html = render_template('monthly_user_report.html', user=user, orders=orders, transactions=transactions)

        send_message(user.email, subject, report_html)

    return "Report Sent Successfully"




@shared_task(ignore_result=False)
def generate_pdf():

    users = User.query.filter(User.roles.any(Role.name == 'user')).all()

    for user in users:
        orders = Order.query.filter_by(user_id=user.id).all()
        transactions = Transaction.query.filter_by(user_id=user.id).all()

        html_content = render_template('monthly_user_report.html', user=user, orders=orders, transactions=transactions)
        pdf_directory = 'monthlyreports'
        if not exists(pdf_directory):
            makedirs(pdf_directory)

        pdf_path = join(pdf_directory, f'{user.id}_.pdf')
        html = HTML(string=html_content)

        with open(pdf_path, 'wb') as pdf_file:
            html.write_pdf(pdf_file)

        subject = f"Monthly pdf Report - {user.email}"

        send_message(user.email, subject, html_content, pdf_path=pdf_path)

    return "PDFs generated successfully"

