/**
 * Role Model
 */
export interface Role {
  /**
   * Identificador del rol
   */
  id?: number;

  /**
   * Nombre del rol
   */
  name?: string;

  /**
   * Estado del rol
   */
  state?: boolean;

  /**
   * Fecha de creación del rol
   */
  dataCreate?: Date;
}
