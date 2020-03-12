import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import AuthRoutes from './routes/AuthRoutes';
 
class Server {
 
	public app: express.Application;
 
	constructor(){
		this.app = express(); 
		this.config();
		this.routes(); 
	}

	config(){
		const MONGO_URI = 'mongodb://localhost/restapi';
		mongoose.set('useFindAndModify', true);

		mongoose.connect(MONGO_URI || 	process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true, 
		}).then(db=> console.log('DB is connected'));

		// Setting
		this.app.set('port', process.env.PORT || 100);

		// Middlewares
		this.app.use(morgan('dev'));
		this.app.use(express.json());
		this.app.use(express.urlencoded({extended: false}));
		this.app.use(helmet());
		this.app.use(compression());

		// PARA VALIDAD NUESTRO SERVIDOR PARA CONECTARSE A APP CLIENTES
		this.app.use(cors());
	}

	routes(){
		this.app.use(indexRoutes);
		this.app.use('/auth', AuthRoutes);
	}

	start(){
		this.app.listen(this.app.get('port'), () => {
			console.log('Server on port', this.app.get('port'));
		});
	}

}

const server = new Server();
server.start();