import { Role } from '../role/role.model';

/**
 * User Model
 */
export interface User {
  /**
   * Identificador del usuario
   */
  id?: number;

  /**
   * Nombre del usuario
   */
  name?: string;

  /**
   * Contraseña del usuario
   */
  password?: string;

  /**
   * Estado del usuario
   */
  state?: boolean;

  /**
   * Fecha de creación del usuario
   */
  dataCreate?: Date;

  /**
   * Rol asociado al usuario
   */
  role?: Role;
}
