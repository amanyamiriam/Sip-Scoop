from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sip_and_scoop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASS')

db = SQLAlchemy(app)
mail = Mail(app)

# Database Models
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Newsletter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.json
        
        # Create new contact entry
        new_contact = Contact(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message']
        )
        db.session.add(new_contact)
        db.session.commit()

        # Send email notification
        msg = Message(
            subject=f'New Contact Form Submission: {data["subject"]}',
            sender=app.config['MAIL_USERNAME'],
            recipients=['amanyamiriam08@gmail.com'],
            body=f"""
            New contact form submission from {data['name']}
            
            Email: {data['email']}
            Subject: {data['subject']}
            
            Message:
            {data['message']}
            """
        )
        mail.send(msg)
        
        return jsonify({'message': 'Message sent successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/newsletter', methods=['POST'])
def newsletter_signup():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        existing_subscriber = Newsletter.query.filter_by(email=email).first()
        if existing_subscriber:
            return jsonify({'message': 'Already subscribed'}), 200
            
        new_subscriber = Newsletter(email=email)
        db.session.add(new_subscriber)
        db.session.commit()
        
        return jsonify({'message': 'Successfully subscribed'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)