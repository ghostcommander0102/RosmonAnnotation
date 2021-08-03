from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from django.contrib.auth.models import User
from django.core.mail import BadHeaderError, send_mail
from django.conf import settings

from django.contrib import messages

@receiver(post_save, sender=User)
def update_snapshot_on_save(sender, instance, created, **kwargs):
    if created:
        #send email
        user_email = instance.email
        subject = 'Complete Your Profile'
        domain = 'http://127.0.0.1:8000'
        message = domain + '/api/register/{}'.format(instance.email)
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [instance.email,]
        if subject and message and email_from:
            try:
                send_mail(subject, message, email_from, recipient_list , fail_silently=False)
            except BadHeaderError as error:
                pass





