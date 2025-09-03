import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-datails',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-datails.component.html',
})
export class ProductDatailsComponent implements OnInit { 
  product = input.required<Product>();
  productService = inject(ProductService);
  router = inject(Router);

  fb = inject(FormBuilder);
  wasSaved = signal(false);
  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  imagesToCarousel = computed (() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()]
    return currentProductImages;
  })

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  };

  setFormValue( formLike: Partial<Product>){
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',')});
    // this.productForm.patchValue( formLike as any)
  }

  onSizeClicked(size: string){
    const currentSize = this.productForm.value.sizes ?? [];
    if( currentSize.includes(size)){
      currentSize.splice(currentSize.indexOf(size), 1);
    } else {
      currentSize.push(size);
    }

    this.productForm.patchValue({ sizes: currentSize });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAsTouched();
    if( !isValid ) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: 
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map( tag => tag.trim()) ?? [],
    };
    if( this.product().id === 'new'){
      const product = await firstValueFrom(this.productService.createProduct(productLike, this.imageFileList))
      this.router.navigate(['/admin/product', product.id]);
    } else {
      await firstValueFrom(
        this.productService
        .updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false)
    }, 3000);
  }

  // images

  onFilesChanged( event: Event){
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;
    const imageUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );
    this.tempImages.set(imageUrls);
  }
}
