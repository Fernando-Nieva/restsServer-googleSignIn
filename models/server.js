const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT;

        
        this.usuariosPath ='/api/usuarios'
        this.authPath ='/api/auth'

        //conectar a base de datos
        this.conectarDb();
        
        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion

        this.routes();
    }

    async conectarDb(){

        await dbConnection();
    }

    middlewares(){

        //Cors
        this.app.use(cors());
        //lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }


    routes(){
        this.app.use(this.usuariosPath,require('../routes/user.routes'));
        this.app.use(this.authPath,require('../routes/auth.routes'));
        
    }

    listen(){
        this.app.listen (this.port,()=> {
            console.log(`Servidor corriendo en puerto http://localhost:${this.port}`);
        });    

    }
}


module.exports=Server;