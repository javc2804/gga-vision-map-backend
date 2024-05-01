import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  const { email, name, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: '"360 Vision Map  - GGA" <cuentas@management.com>',
    to: email,
    subject: "GGA 360 Vision Map- Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola: ${name} has solicitado reestablecer tu password</p>
  
      <p>Sigue el siguiente enlace para generar un nuevo password: 
  
      <a href=${process.env.FRONTEND_URL}/auth/recovery/${token}>Reestablecer Password</a>
      
      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
      
      
      `,
  });
};

export { emailOlvidePassword };
