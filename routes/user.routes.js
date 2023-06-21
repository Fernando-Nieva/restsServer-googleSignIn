const {Router}= require ('express');
const { usersPut, 
    usersPost,
    usersDelete,
    usersPatch, 
    usersGet } = require('../controllers/user.controller');
const { check } = require('express-validator');
const { esRoleValido, emailEsvalido, existeUsuarioPorId } = require('../helpers/db_validators');

const {validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole}= require('../middlewares/index');
const router = Router();


router.get('/',usersGet);

router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos

],usersPut);


router.post('/',[
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('password','el password debe ser de mas de 6 letras').isLength({min:6}),
    check('correo','el correo no es valido').isEmail(),

    check('correo').custom(emailEsvalido),
    // check('rol','no es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usersPost);


router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE','EJEMPLO_ROLE'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usersDelete);

router.patch('/',usersPatch)

module.exports=router;