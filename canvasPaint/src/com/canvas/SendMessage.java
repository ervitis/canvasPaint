package com.canvas;

import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class SendMessage extends HttpServlet{
	
	public static final Logger log = Logger.getLogger(SendMessage.class.getName());
	
	/**
	 * Servlet to process the send email request
	 * @see http://stackoverflow.com/questions/9822633/sending-an-html-email-with-an-image-in-gae
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 */
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
			
			StringBuilder emailBuilder = new StringBuilder();
			emailBuilder.append(DatosCorreo.builder1);
			emailBuilder.append(code);
			emailBuilder.append(DatosCorreo.builder2);
			
			Multipart multipart = new MimeMultipart();
			
			BodyPart bodyPart = new MimeBodyPart();			
			bodyPart.setContent(emailBuilder.toString(), "text/html; charset=UTF-8");
			multipart.addBodyPart(bodyPart);
			message.setContent(multipart);
			
			Transport.send(message);
		}catch(Exception e){
			log.warning(e.getMessage() + ": " + e.getLocalizedMessage());
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
