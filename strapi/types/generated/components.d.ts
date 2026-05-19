import type { Schema, Struct } from '@strapi/strapi';

export interface AddressSharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_address_shared_addresses';
  info: {
    displayName: 'shared.address';
  };
  attributes: {
    apartment: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    province: Schema.Attribute.String;
    street: Schema.Attribute.String;
    zipCode: Schema.Attribute.String;
  };
}

export interface ProductProductAttribute extends Struct.ComponentSchema {
  collectionName: 'components_product_product_attributes';
  info: {
    displayName: 'product.attribute';
  };
  attributes: {
    name: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SeoSharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_shared_seos';
  info: {
    displayName: 'shared.seo';
  };
  attributes: {
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.Text;
    ogImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'address.shared-address': AddressSharedAddress;
      'product.product-attribute': ProductProductAttribute;
      'seo.shared-seo': SeoSharedSeo;
    }
  }
}
