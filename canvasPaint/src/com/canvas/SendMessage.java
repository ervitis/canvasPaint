package com.canvas;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class SendMessage extends HttpServlet{
	
	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		try{
			String code = request.getParameter("code");
			
			Properties properties = new Properties();
			properties.setProperty("mail.host", ConfiguracionCorreo.smtp);
			properties.setProperty("mail.smtp.port", ConfiguracionCorreo.port);
			properties.setProperty("mail.smtp.auth", ConfiguracionCorreo.isAuth);
			properties.setProperty("mail.smtp.socketFactory.class", ConfiguracionCorreo.socketFactory);
			properties.setProperty("mail.smtp.socketFactory.port", ConfiguracionCorreo.port);
			
			Session session = Session.getDefaultInstance(properties, new Authenticator(){
				protected PasswordAuthentication getPasswordAuthentication(){
					return new PasswordAuthentication(DatosCorreo.correo, DatosCorreo.password);
				}
			});
			
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(DatosCorreo.correo));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(DatosCorreo.correo));
			message.setSubject(DatosCorreo.subject);
			
			message.setText("Prueba");
			
			Transport.send(message);
			
			System.out.println(code);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		processRequest(request, response);
	}
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		
	}
}
