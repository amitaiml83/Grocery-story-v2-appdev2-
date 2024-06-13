from email.mime.application import MIMEApplication
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'amitkumargiriyak396@gmail.com'
SENDER_PASSWORD = ''

def send_message(to, subject, content_body, pdf_path=None):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL

    msg.attach(MIMEText(content_body, 'html'))

    if pdf_path:
        with open(pdf_path, 'rb') as pdf_file:
            pdf_attachment = MIMEApplication(pdf_file.read(), 'pdf')
            pdf_attachment.add_header('Content-Disposition', f'attachment; filename="{pdf_path}"')
            msg.attach(pdf_attachment)

    client = SMTP(host=SMTP_HOST,port = SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()
