import React, { Component } from "react";
import { connect } from "react-redux";

import * as usuariosActions from "../../actions/usuariosActions";

import Spinner from "../General/Spinner";
import Fatal from "../General/Fatal"

class Usuarios extends Component {
  async componentDidMount() {
    this.props.traerTodos();
  }

  ponerContenido = () => {
    if (this.props.cargando) {
      return <Spinner />;
    }

    if (this.props.error){
        return <Fatal msg={this.props.error}/>;
    }
    return (
      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>{this.ponerFilas()}</tbody>
      </table>
    );
  };

  ponerFilas = () =>
    this.props.usuarios.map(usuario => (
      <tr key={usuario.id}>
        <td>{usuario.name}</td>
        <td>{usuario.email}</td>
        <td>{usuario.website}</td>
      </tr>
    ));

  render() {
    //console.log(this.props.cargando)
    //console.log(this.props.error)
    return <div>{this.ponerContenido()}</div>;
  }
}

const mapStateToProps = reducers => {
  return reducers.usuariosReducer;
};

export default connect(
  mapStateToProps,
  usuariosActions
)(Usuarios);
