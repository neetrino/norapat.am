/**
 * Բազմալեզու հաղորդագրությունների կառուցվածք։
 */

export type AppLocale = 'hy' | 'en' | 'ru'

export interface AppMessages {
  languageSwitcher: {
    label: string
    hy: string
    en: string
    ru: string
  }
  brandBanner: {
    badge: string
    titleWhite: string
    titleAccent: string
    tagline: string
    descriptionBefore: string
    descriptionHighlight: string
    descriptionAfter: string
    statFlavors: string
    statMinutes: string
    statDelivery: string
    mobileTagline: string
    viewMenu: string
    contactUs: string
    cardTitle: string
    cardSubtitle: string
    viewMenuBtn: string
    add: string
    quickOrder: string
    floatFlavors: string
    fastDelivery: string
  }
  nav: {
    home: string
    menu: string
    about: string
    contact: string
    navigation: string
  }
  auth: {
    login: string
    register: string
    logoutTitle: string
    admin: string
    loginTitle: string
    loginSubtitle: string
    email: string
    password: string
    passwordPlaceholder: string
    signingIn: string
    invalidCredentials: string
    loginError: string
    noAccount: string
    registerLink: string
  }
  cartPage: {
    emptyTitle: string
    emptyHint: string
    goToMenu: string
    backToMenu: string
    title: string
    clearing: string
    clearCart: string
    itemsInCart: (n: number) => string
    remove: string
    total: string
    itemsLine: (qty: number) => string
    delivery: string
    free: string
    toPay: string
    checkout: string
    continueShopping: string
  }
  search: {
    short: string
    menu: string
    productsPage: string
  }
  cart: {
    label: string
  }
  profile: {
    label: string
  }
  wishlist: {
    title: string
    pageTitle: string
    pageDescription: string
    loginPrompt: string
    backToMenu: string
    emptyHint: string
    goToMenu: string
    productUnavailable: string
    removeFromWishlist: string
  }
  footer: {
    tagline: string
    navHeading: string
    contactsHeading: string
    privacy: string
    terms: string
    copyright: string
    createdBy: string
    refundPolicy: string
    deliveryPolicy: string
    refundShort: string
    deliveryShort: string
    addressZoravar: string
    addressEznik: string
    hoursWeek: string
    hoursDelivery: string
    ariaPhone: string
    ariaEmail: string
  }
  home: {
    ariaBrandBanner: string
    ariaCategories: string
    ariaBestSellers: string
    ariaPromo: string
    productsLoading: string
    categoryEmptyTitle: (category: string) => string
    categoryEmptyHint: string
    showFirstCategory: (name: string) => string
    showCategories: string
    viewFullMenu: string
    whyUsTitle: string
    whyUsSubtitle: string
    featureFastTitle: string
    featureFastDesc: string
    featureFastBadge: string
    featureDeliveryTitle: string
    featureDeliveryDesc: string
    featureDeliveryBadge: string
    featureQualityTitle: string
    featureQualityDesc: string
    featureQualityBadge: string
    featureSupportTitle: string
    featureSupportDesc: string
    featureSupportBadge: string
    testimonialsTitle: string
    testimonialsSubtitle: string
    testimonial1Quote: string
    testimonial1Name: string
    testimonial1Role: string
    testimonial1Initial: string
    testimonial2Quote: string
    testimonial2Name: string
    testimonial2Role: string
    testimonial2Initial: string
    testimonial3Quote: string
    testimonial3Name: string
    testimonial3Role: string
    testimonial3Initial: string
    statHappyClients: string
    statUniqueFlavors: string
    statDeliveryMinutes: string
    statRating: string
    ctaTitle: string
    ctaSubtitle: string
    ctaOrderNow: string
    ctaLearnMore: string
    categories: {
      title: string
      subtitle: string
      loadError: string
      empty: string
      goToMenu: string
      viewAllMenu: string
      itemsCount: (n: number) => string
    }
    bestSellers: {
      title: string
      subtitle: string
      viewAll: string
    }
    promo: {
      title: string
      subtitle: string
      viewAll: string
    }
  }
  products: {
    allCategories: string
    uncategorized: string
    searchNoResultsTitle: (query: string) => string
    searchNoResultsHint: string
    clearSearch: string
    showAllProducts: string
    categoryEmpty: (category: string) => string
    tryAnotherCategory: string
  }
  productCard: {
    uncategorized: string
    badgeHit: string
    badgeNew: string
    badgeClassic: string
    addToCartTitle: string
    inCart: string
    add: string
    wishlistAdd: string
    wishlistRemove: string
  }
  legal: {
    privacyShort: string
    termsShort: string
  }
  profilePage: {
    loading: string
    back: string
    backHome: string
    titleMobile: string
    titleDesktop: string
    userDefault: string
    notSet: string
    logout: string
    deleteAccount: string
    profileInfo: string
    name: string
    email: string
    phone: string
    address: string
    editProfile: string
    wishlistHeading: string
    openWishlist: string
    wishlistEmpty: string
    removeWishlistAria: string
    ordersHistory: string
    noOrders: string
    placeOrder: string
    orderLabel: string
    qtyTimes: string
    reorder: string
  }
  orderStatus: {
    PENDING: string
    CONFIRMED: string
    PREPARING: string
    READY: string
    DELIVERED: string
    CANCELLED: string
  }
}
