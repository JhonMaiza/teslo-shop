import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductDatailsComponent } from "./product-datails/product-datails.component";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDatailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  activetedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);

  productId = toSignal(
    this.activetedRoute.params.pipe(map( params => params['id']))
  );

  producResource = rxResource({
    request: () => ({ id: this.productId()}),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id);
    }
  });

  redirectEffect = effect(() =>{
    if( this.producResource.error()){
      this.router.navigate(['/admin/products']);
    }
  })
}
