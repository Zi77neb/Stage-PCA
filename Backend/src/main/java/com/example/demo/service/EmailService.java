package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendAccountEmail(
            String to,
            String username,
            String password
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Votre compte AllDoc"
        );

        message.setText(
                "Bonjour,\n\n" +

                "Votre compte AllDoc a été créé.\n\n" +

                "Email : " + to + "\n" +
                "Nom utilisateur : " + username + "\n" +
                "Mot de passe : " + password + "\n\n" +

                "Connexion : http://localhost:5173\n\n" +

                "Cordialement,\n" +
                "Equipe PCA"
        );

        mailSender.send(message);
    }
}