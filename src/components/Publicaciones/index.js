import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../General/Spinner';
import Fatal from '../General/Fatal';
import Comentarios from "./Comentarios";

import * as usuariosActions from '../../actions/usuariosActions';
import * as publicacionesActions from '../../actions/publicacionesActions';

const { traerTodos: usuariosTraerTodos } = usuariosActions;
const { traerPorUsuario: publicacionesTraerPorUsuario, abrirCerar, traerComentarios } = publicacionesActions;

class Publicaciones extends Component {

  async componentDidMount() {
    const {
      usuariosTraerTodos,
      match: { params: { key } },
      publicacionesTraerPorUsuario
    } = this.props;

    if (!this.props.usuariosReducer.usuarios.length) {
      await usuariosTraerTodos();
    }
    if (this.props.usuariosReducer.error) {
      return;
    }
    if (!('publicaciones_key' in this.props.usuariosReducer.usuarios[key])) {
      await publicacionesTraerPorUsuario(key);
    }
  }

  ponerUsuario = () => {
    const {
      match: { params: { key } },
      usuariosReducer
    } = this.props;

    if (usuariosReducer.error) {
      return <Fatal mensaje={ usuariosReducer.error } />;
    }
    if (!usuariosReducer.usuarios.length || usuariosReducer.cargando) {
      return <Spinner />
    }

    const nombre = usuariosReducer.usuarios[key].name;

    return (
        <h1>
          Publicaciones de { nombre }
        </h1>
    );
  };

  ponerPublicaciones = () => {
    const {
      usuariosReducer,
      usuariosReducer: { usuarios },
      publicacionesReducer,
      publicacionesReducer: { publicaciones },
      match: { params: { key } }
    } = this.props;

    if (!usuarios.length) return;
    if (usuariosReducer.error) return;
    if (publicacionesReducer.cargando) {
      return <Spinner />;
    }
    if (publicacionesReducer.error) {
      return <Fatal mensaje={ publicacionesReducer.error } />
    }
    if (!publicaciones.length) return;
    if (!('publicaciones_key' in usuarios[key])) return;

    const { publicaciones_key } = usuarios[key];
    return this.mostrarInfo(publicaciones[publicaciones_key],publicaciones_key)
  };

  mostrarInfo = (publicaciones,pub_key) => (
      publicaciones.map((publicacion, com_key) => (
          <div
              key={publicacion.id}
              className='pub_titulo'
              onClick={ () => this.mostartComentarios(pub_key, com_key, publicacion.comentarios) }
          >
            <h2>
              { publicacion.title }
            </h2>
            <h3>
              { publicacion.body }
            </h3>
            {
              (publicacion.abierto) ? <Comentarios comentarios={publicacion.comentarios}/>:''
            }
          </div>
      ))
  );

  mostartComentarios = (pub_key, com_key, comentarios) => {

    this.props.abrirCerar(pub_key, com_key);
    if(!comentarios.length){
      this.props.traerComentarios(pub_key, com_key);
    }
  };

  render() {
    return (
        <div>
          { this.ponerUsuario() }
          { this.ponerPublicaciones() }
        </div>
    );
  }
}

const mapStateToProps = ({ usuariosReducer, publicacionesReducer }) => {
  return { usuariosReducer, publicacionesReducer };
};

const mapDispatchToProps = {
  usuariosTraerTodos,
  publicacionesTraerPorUsuario,
  abrirCerar,
  traerComentarios
};

export default connect(mapStateToProps, mapDispatchToProps)(Publicaciones);