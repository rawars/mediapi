import { Request, Response, Router } from 'express';

import Doctor from '../models/Doctor';

const nodemailer = require('nodemailer'); // email sender function
const md5 = require('md5');
const generator = require('generate-password');

class AuthRoutes{

	public router: Router;

	constructor(){
		this.router = Router();
		this.routes();
	}

	async login(req: Request, res: Response):Promise<void>{

		const {email, password} = req.query;

		const doctors = await Doctor.findOne({
			email: email
		});

		if(doctors != null){

			// Verificamos si la contraseña es correcta
			if(doctors.password != ""){
				// Tiene una contraseña asignada
				let currentPassword = md5(password);
				if(currentPassword === doctors.password){

					res.status(200).json({
		                message: 'Bienvenido.'
		            });

				}else{
					res.status(409).json({
		                message: 'Contraseña incorrecta.'
		            });						
				}
			}else{
				// No tiene una contraseña asignada
				res.status(409).json({
	                message: 'Usuario identificado, porfavor defina una contraseña en su perfil de usuario, para aumentar la seguridad de tu cuenta.'
	            });				
			}

		}else{

			res.status(409).json({
                message: 'El email no existe.'
            });

		}

	}

	async signup(req: Request, res: Response):Promise<void>{

		const {names, surnames, email, erm} = req.query;

		console.log(req.query);

		const cDoctor = await Doctor.findOne({ email: email });
		// Evaluamos si existe una doctor con el mismo email
		if(cDoctor != null){
			// Si existe un doctor con el mismo email
			res.status(409).json({
                message: 'El email ya se ecuentra en uso.'
            });

		}else{

			// No existe un doctor con el mismo email, insertamos el nuevo doctor

			const newDoctor = new Doctor({
				names: names,
				surnames: surnames,
				email: email,
				erm: erm
			});

			await newDoctor.save();

			res.status(200).json({
                message: 'Se registro el doctor.'
            });
		}
	}


	async recovery(req: Request, res: Response):Promise<void>{

		const { email } = req.query;

		Doctor.findOne({
		        email: email
		    }).exec().then(user => {

		        if (user === null) {
		            // NO EXISTE
		            return res.status(404).json({
		                message: 'El correo electronico no existe.'
		            });

		        } else {

		                // ENVIAMOS EL EMAIL
		                // nodemailer stuff will go here
		                var transporter = nodemailer.createTransport({
		                    pool: true,
		                    host: "smtp.gmail.com",
		                    port: 587, //465
		                    secure: false,
		                    auth: {
		                        user: 'patriacombustible@gmail.com',
		                        pass: 'Ra%31@*$'
		                    }
		                });

						var tempPassword = generator.generate({
						    length: 8,
						    numbers: true
						});

		                var mailOptions = {
		                    from: '"EMERCARE" <emercare@gmail.com>',
		                    to: user.email,
		                    subject: 'Recuperación de Cuenta',
		                    html: `<div style="background:#f2f2f2; padding:10px; color:#000; font-family:Arial; text-align: center;"><h1>EMERCARE</h1></div>
		                        <div style="background:#f7f7f7; padding:10px; color:#000; font-family:Arial; text-align: center;">
		                            <h3>Recuperación de Contraseña</h3>
		                            <div>
		                            <div>Querido ${user.names} ${user.surnames},</div>
		                            <div>Hemos recibido una solicitud de recuperación de su contraseña en EMERCARE.</div>
		                            <br>
		                            <div>Tu contraseña es:</div>
		                            <div>${tempPassword}</div>
		                            </div>
		                            <div style="margin-top:1em;">
		                                <div>Atentamente el equipo de,</div>
		                                <div>EMERCARE</div>
		                            </div>
		                        </div>
		                        <div style="background:#f2f2f2; padding:10px; color:#000; font-family:Arial; text-align: center;">
		                            Recibes este correo electrónico porque te registraste en EMERCARE</a>
		                        </div>`
		                };

		                transporter.sendMail(mailOptions, function(error, info) {
		                    if (error) {
		                        console.log(error);
		                        res.send(500, error.message);
		                    } else {
		                        console.log("Email enviado");
		                        res.status(200).json({
		                            message: 'Su nueva clave fue enviada a su correo electronico.'
		                        });
		                    }
		                });

		        }
		    })
	}

	routes(){
		this.router.post('/login/', this.login);
		this.router.post('/signup/', this.signup);
		this.router.post('/recovery/', this.recovery);
	}	

}

const authRoutes = new AuthRoutes();
export default authRoutes.router;