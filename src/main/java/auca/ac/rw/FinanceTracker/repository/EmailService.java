package auca.ac.rw.FinanceTracker.repository;

import auca.ac.rw.FinanceTracker.model.EmailDetails;

public interface EmailService {

    String sendSimpleMail(EmailDetails details);

    String sendMailWithAttachment(EmailDetails details);
}