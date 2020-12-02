/**
 * Product Model
 */
export interface Product {
  /**
   * Identificador del producto
   */
  id?: number;
  /**
   * Nombre del producto
   */
  name?: string;
  /**
   * Tipo de producto
   */
  type?: string;
  /**
   * Precio del producto
   */
  price?: number;
  /**
   * Estado del producto
   */
  state?: boolean;
}
