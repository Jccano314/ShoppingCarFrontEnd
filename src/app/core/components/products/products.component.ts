import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, takeUntil } from 'rxjs/operators';
import { BASE_API_URL } from 'src/app/shared/http/global';
import { Product } from '../../models/product/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  /**
   * Permite la configuración de los campos del formulario
   */
  public formBuilder: FormBuilder;

  /**
   * Permite crear grupos de controles para un formulario
   */
  public frmGroup: FormGroup;

  /**
   * Observable de productos
   */
  public products$: Observable<Product[]>;

  /**
   * Subscripción a los observables
   */
  public destroy$: Subject<boolean>;

  /**
   * Columnas de la tabla
   */
  public displayedColumns: string[] = ['id', 'name', 'type', 'price', 'delete', 'edit'];

  /**
   * Fuente de datos de usuarios
   */
  public dataSource: MatTableDataSource<Product>;

  /**
   * Valida si se crea o edita un registro
   */
  public idProduct: number;

  /**
   * Decorador para ordenamiento de la tabla
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Crea una nueva instancia de @see ProductsComponent
   * @param formBuilder Permite la configuración de los campos del formulario
   */
  public constructor(formBuilder: FormBuilder) {
    this.products$ = new Observable<Product[]>();
    this.destroy$ = new Subject();
    this.dataSource = new MatTableDataSource<Product>();

    this.formBuilder = formBuilder;
    this.frmGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
      type: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
      price: [0, Validators.required],
    });

    this.idProduct = 0;
  }

  /**
   * Al iniciarse el componente
   */
  public ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Al destruirse el componente
   */
  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  /**
   * Carga los productos del sistema
   */
  public loadProducts() {
    this.products$ = ajax.getJSON<Product[]>(BASE_API_URL.url + 'products')
      .pipe(
        map((products) => products.filter((product) => product.state)),
        takeUntil(this.destroy$),
      );

    this.products$.subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.sort = this.sort;
    });

  }

  /**
   * Guardar información
   */
  public onSubmit() {
    if (this.frmGroup.invalid) {
      return false;
    }

    const form = this.frmGroup.value;

    const product: Product = {
      name: form.name,
      type: form.type,
      price: form.price,
      state: true,
    };

    if (this.idProduct > 0) {
      ajax({
        url: BASE_API_URL.url + 'products/' + this.idProduct,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: product,
      }).pipe(
        takeUntil(this.destroy$),
      ).subscribe(() => {
        alert('Registro actualizado con exito');
        this.loadProducts();
      });
    } else {
      ajax({
        url: BASE_API_URL.url + 'products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: product,
      }).pipe(
        takeUntil(this.destroy$),
      ).subscribe(() => {
        alert('Registro guardado con exito');
        this.loadProducts();
      });
    }
  }

  /**
   * Elimina un producto
   * @param id Identificador del producto a eliminar
   */
  public deleteProduct(id: number) {
    ajax({
      url: BASE_API_URL.url + 'products/' + id,
      method: 'DELETE',
    }).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
      alert('Registro eliminado con exito');
      this.loadProducts();
    });
  }

  /**
   * Cambia de producto
   * @param id Identificador del usuario
   */
  public changeProduct(row: any) {
    this.idProduct = row.id;
    this.frmGroup.controls.name.setValue(row.name);
    this.frmGroup.controls.type.setValue(row.type);
    this.frmGroup.controls.price.setValue(row.price);
  }

}
