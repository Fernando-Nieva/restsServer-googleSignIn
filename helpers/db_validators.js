const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido=async(rol = '') => {
    const  existeRol= await Role.findOne({rol});
    if(!existeRol){
        throw new Error (`El rol ${rol} no esta registrada en la base de datos`)
    }

}

const emailEsvalido =async(correo ='')=> {

//verificar si el correo existe
const existeEmail = await Usuario.findOne({correo,estado:true});
    if(existeEmail){

        throw new Error (`El correo ${correo} ya esta registrado`)
    }
}



const existeUsuarioPorId = async(id='')=> {

    //verificar si el correo existe
const existeUsuario = await Usuario.findOne({_id: id/*, estado: true*/});
        if(!existeUsuario){
    
            throw new Error (`El id ${id} no existe`)
        }
    }

module.exports={esRoleValido,emailEsvalido,existeUsuarioPorId}
