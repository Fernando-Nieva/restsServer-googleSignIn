const { response,request } = require("express");
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');


const usersGet=async(req=request, res=response)=> {

    // const {q,nombre='no name',apikey,page=1,limit} =req.query
    const {limite=5,desde = 0}=req.query;
    const query = {estado : true};
    // const usuarios=await Usuario.find(query)
    // .skip(Number(desde))
    // .limit(Number(limite));
    
    // const total = await Usuario.countDocument(query);

    const [total,usuarios]= await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
    ]) 

    res.json({
        total,
        usuarios
    });
}


const usersPut= async(req=request, res= response)=> {

    const {id} = req.params;
    const {_id,password,google,...resto} =req.body;
   
    //TODO validar contra abse de datos
    if (password){
    //encryptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password,salt);

    }

    const  usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json(usuario);
};



const usersPost = async(req=request, res= response)=> {

    const {nombre,correo,password,rol} = req.body;
    
    //verifiar si el correo existe
    const UsuarioEliminado = await Usuario.findOne({correo, estado:false});
    if(!UsuarioEliminado){

        const usuario = new Usuario({nombre,correo,password,rol});
        //encryptar la contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password,salt);
        //guardar en db
        await usuario.save();
        res.json(usuario);

    }else{
        const {_id} = UsuarioEliminado
        let usuario = await Usuario.findByIdAndUpdate(_id,{estado:true})
        const salt=bcryptjs.genSaltSync();
        const contrasena =bcryptjs.hashSync(password,salt);
        usuario = await Usuario.findByIdAndUpdate(_id,{password:contrasena})
        res.json(usuario)
    };
}

const usersPatch=(req=request, res= response)=> {
    res.json({
        
        msg:'patch API -controlador'
    });
};


const usersDelete = async(req=request, res= response)=> {

    const{id} =req.params;


    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);
    const usuarioBorrado = await Usuario.findByIdAndUpdate(id,{estado: false});
    // const usuarioAutenticado = req.usuario;




    res.json({usuarioBorrado/*,usuarioAutenticado*/});
};




module.exports={
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
}