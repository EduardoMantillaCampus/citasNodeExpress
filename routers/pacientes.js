import "reflect-metadata";
import dotenv from "dotenv";
import mysql from "mysql2";
import { Router } from "express";
import proxyPacientes from "../middleware/proxyPacientes.js";

dotenv.config();
const storagePacientes = Router();
let con = undefined;

storagePacientes.use((req, res, next) => {
    let my_config = JSON.parse(process.env.MY_DB);
    con = mysql.createPool(my_config);
    next();
})
storagePacientes.get("/", proxyPacientes, (req, res) => {
    con.query(
        /*sql */`select usuario.usu_id as id, usuario.usu_nombre as nombre, usuario.usu_segdo_nombre as segNombre, usuario.usu_primer_apellido_usuar as apellido, usuario.usu_segdo_apellido_usuar as apellido2, usuario.usu_telefono as telefono, usuario.usu_email as email, tipo_documento.tipdoc_abreviatura as tipo, genero.gen_nombre as genero, acudiente.acu_nombreCompleto as acudiente from usuario inner join tipo_documento on usuario.usu_tipodoc=tipo_documento.tipdoc_id INNER JOIN genero on genero.gen_id=usuario.usu_genero INNER JOIN acudiente on acudiente.acu_codigo=usuario.usu_acudiente ORDER by usuario.usu_nombre asc;;`,
        (err,data,fill)=>{
            res.send(data);
        }
    )
})

storagePacientes.get("/:id", (req, res) => {
    con.query(
        /*sql */`select cita.cit_codigo as codigo, cita.cit_fecha as fecha, estado_cita.estcita_nombre as estado, usuario.usu_nombre as usuario, medico.med_nombrecompleto as medico from cita INNER JOIN estado_cita on estado_cita.estcita_id=cita.cit_estadoCita INNER JOIN usuario on usuario.usu_id=cita.cit_datosUsuario INNER JOIN medico on medico.med_nroMatriculaProfesional=cita.cit_medico where cita.cit_datosUsuario=${req.params.id}`,
        (err,data,fill)=>{
            res.send(data);
        }
    )
})
storagePacientes.get("/medico/:id", (req, res) => {
    con.query(
        /*sql */`select cita.cit_codigo as codigo, cita.cit_fecha as fecha, estado_cita.estcita_nombre as estado, usuario.usu_nombre as usuario, medico.med_nombrecompleto as medico from cita INNER JOIN estado_cita on estado_cita.estcita_id=cita.cit_estadoCita INNER JOIN usuario on usuario.usu_id=cita.cit_datosUsuario INNER JOIN medico on medico.med_nroMatriculaProfesional=cita.cit_medico where cit_medico=${req.params.id}`,
        (err,data,fill)=>{
            res.send(data);
        }
    )
})

storagePacientes.get("/consultorias/:idPaciente",(req, res)=>{
    con.query(
        /*sql*/ `SELECT consultorio.cons_codigo as consultorioCodigo, consultorio.cons_nombre as consultorioNombre, usuario.usu_id as pacienteCodigo, usuario.usu_nombre as pacienteNombre, usuario.usu_primer_apellido_usuar as pacienteApellido1, cita.cit_fecha as citaFecha FROM usuario INNER JOIN cita ON cita.cit_datosUsuario = usuario.usu_id INNER JOIN medico ON medico.med_nroMatriculaProfesional = cita.cit_medico INNER JOIN consultorio ON consultorio.cons_codigo = medico.med_consultorio WHERE usuario.usu_id = ${req.params.idPaciente};`,
        (err,data,fill)=>{
            res.send(data);
        }
    )
})

storagePacientes.get("/consultorios/:idPaciente",(req, res)=>{
    con.query(
        /*sql*/ `select cita.cit_fecha as fecha, usuario.usu_nombre as paciente, consultorio.cons_nombre as consultorio from cita INNER JOIN medico on cita.cit_medico=medico.med_nroMatriculaProfesional INNER JOIN consultorio on consultorio.cons_codigo=medico.med_consultorio INNER JOIN usuario on usuario.usu_id=cita.cit_datosUsuario where usuario.usu_id=${req.params.idPaciente}`,
        (err,data,fill)=>{
            res.send(data);
        }
    )
})

storagePacientes.get("/citas/:genero/:estado",(req, res)=>{
    let data = req.params;
    con.query(
        /*sql*/ `select cita.cit_fecha as fecha, usuario.usu_nombre as paciente, estado_cita.estcita_nombre as estado, genero.gen_nombre as genero from cita INNER JOIN usuario on usuario.usu_id=cita.cit_datosUsuario INNER JOIN genero on genero.gen_id=usuario.usu_genero INNER JOIN estado_cita on estado_cita.estcita_id=cita.cit_estadoCita where genero.gen_nombre=? and estado_cita.estcita_nombre=? `,
        Object.values(data),
        (err,data,fill)=>{
            res.send(data);
        }
    )
})
export default storagePacientes;