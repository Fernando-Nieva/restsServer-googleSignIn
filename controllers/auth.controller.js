const{response, request, json}=require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarjwt');
const { googleVerify } = require('../helpers/google-verify');




const login = async(req=request , res = response)=> {

    const {correo ,password}= req.body

    try{
        //verificar si el emali existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario){
            return res.status(400).json({
                msg: 'Usuario /Password no son correctos - correo'
            })

        }



        //si el usuario esta activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario /Password no son correctos - estado: false'
            })
            
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password,usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario /Password no son correctos - password'
            })
            
        }



        //generar el jwt
        const token = await generarJWT(usuario.id);



        
        res.json({
            usuario,
            token
          
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            msg:'hable con el administrador'
        })    
    }    
}

const googleSignIn = async (req, res = response)=>{

    const {id_token}=req.body;

    try{
        
        const {correo,nombre,img}=await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //tengo que crearlo
            const data ={
                nombre,
                correo,
                password:':p',
                rol:'USER_ROLE',
                img,
                google:true

            };
            usuario=new Usuario(data);
            await usuario.save();
        }

        //si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg:'hable con el administrador, usuario bloqueado'
            });
        }

        
        //generar el jwt
        const token = await generarJWT(usuario.id);


            res.json({
                usuario,
                token
            });

    }catch(error){
        console.log(error)
        res.status(400).json({
            ok:false,
            msg:'El token no se pudo verificar'
        })

    }


}


module.exports={
    login,
    googleSignIn
}