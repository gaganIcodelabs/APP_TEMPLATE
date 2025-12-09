export interface ImageVariant {
  height: number;
  width: number;
  url: string;
  name: string;
}

export interface ImageAsset {
  id: string;
  type: 'imageAsset';
  attributes: {
    variants: Record<string, ImageVariant>;
    assetPath: string;
  };
}

// -----------------------------------------------------------------------------
// BRANDING
// -----------------------------------------------------------------------------

export interface Branding {
  marketplaceColor: string;
  marketplaceColorDark: string;
  marketplaceColorLight: string;
  colorPrimaryButton: string;
  colorPrimaryButtonDark: string | null;
  colorPrimaryButtonLight: string | null;

  //optional we only use colors in the app
  logoSettings?: {
    height: number;
    format: string;
  };

  logoImageDesktop?: ImageAsset | null;
  logoImageMobile?: ImageAsset | null;
  brandImage?: ImageAsset | null;
  favicon?: ImageAsset | null;
  appIcon?: ImageAsset | null;

  facebookImage?: string | null;
  twitterImage?: string | null;
}

// -----------------------------------------------------------------------------
// LAYOUT
// -----------------------------------------------------------------------------

export interface LayoutVariant {
  variantType: string;
}

export interface ListingImageLayout {
  variantType: string;
  aspectRatio: string;
  aspectWidth?: number;
  aspectHeight?: number;
  variantPrefix: string;
}

export interface Layout {
  searchPage: LayoutVariant;
  listingPage: LayoutVariant;
  listingImage: ListingImageLayout;
}
