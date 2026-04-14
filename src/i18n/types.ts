/**
 * Բազմալեզու հաղորդագրությունների կառուցվածք։
 */

export type AppLocale = 'hy'

export interface AppMessages {
  languageSwitcher: {
    label: string
    hy: string
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
    promoBadge: string
    heroFeaturedLabel: string
  }
  nav: {
    home: string
    menu: string
    about: string
    contact: string
    navigation: string
    /** Կարճ բրենդային անուն (aria-label, fallback) */
    siteBrand: string
    /** Լոգոտիպի պատկերի alt */
    logoAlt: string
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
    policiesHeading: string
    privacy: string
    terms: string
    copyright: string
    createdBy: string
    refundPolicy: string
    deliveryPolicy: string
    refundShort: string
    deliveryShort: string
    addressLine: string
    hoursWeek: string
    hoursDelivery: string
    ariaPhone: string
    ariaEmail: string
    /** Դեկորատիվ պատկեր ֆուտերում (մասկոտ) */
    mascotAlt: string
    /** Idram վճարային համակարգի լոգո (կոպիրայթի գոտի) */
    idramLogoAlt: string
    /** Ardshinbank բանկի լոգո (կոպիրայթի տողի աջ կողմում) */
    ardshinbankLogoAlt: string
  }
  home: {
    ariaBrandBanner: string
    ariaCategories: string
    ariaBestSellers: string
    ariaPromo: string
    productsLoading: string
    showcaseEmptyPromo: string
    showcaseEmptyBest: string
    categoryEmptyTitle: (category: string) => string
    categoryEmptyHint: string
    showFirstCategory: (name: string) => string
    showCategories: string
    viewFullMenu: string
    carouselScrollPrev: string
    carouselScrollNext: string
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
    /** CTA բաժնի ձախ պատկեր — դեկորատիվ կերպար */
    ctaGirlIllustrationAlt: string
    /** CTA բաժնի աջ պատկեր — դեկորատիվ կերպար */
    ctaBoyIllustrationAlt: string
    brandBannerPromo: {
      super: string
      delicious: string
      menu: string
      weekendBefore: string
      weekendWord: string
      weekendAfter: string
      body: string
      cta: string
    }
    categories: {
      title: string
      subtitle: string
      loadError: string
      empty: string
      goToMenu: string
      viewAllMenu: string
      scrollPrev: string
      scrollNext: string
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
    actions: {
      title: string
      subtitle: string
      viewAll: string
      ariaLabel: string
    }
  }
  aboutPage: {
    heroTitle: string
    heroSubtitle: string
    storyTitle: string
    storyP1: string
    storyP2: string
    storyP3: string
    valuesTitle: string
    valueLoveTitle: string
    valueLoveDesc: string
    valueQualityTitle: string
    valueQualityDesc: string
    valueSpeedTitle: string
    valueSpeedDesc: string
    valueCommunityTitle: string
    valueCommunityDesc: string
    teamTitle: string
    teamChefTitle: string
    teamChefDesc: string
    teamManagerTitle: string
    teamManagerDesc: string
    teamDeliveryTitle: string
    teamDeliveryDesc: string
    statsTitle: string
    statOrdersValue: string
    statOrdersLabel: string
    statFlavorsValue: string
    statFlavorsLabel: string
    statBranchesValue: string
    statBranchesLabel: string
    statPrepValue: string
    statPrepLabel: string
    processTitle: string
    processStep1Title: string
    processStep1Desc: string
    processStep2Title: string
    processStep2Desc: string
    processStep3Title: string
    processStep3Desc: string
    processStep4Title: string
    processStep4Desc: string
  }
  products: {
    allCategories: string
    uncategorized: string
    categoryLabel: string
    sortLabel: string
    sortNewest: string
    sortPriceAsc: string
    sortPriceDesc: string
    sortPopular: string
    priceRange: string
    priceFrom: string
    priceTo: string
    searchNoResultsTitle: (query: string) => string
    searchNoResultsHint: string
    clearSearch: string
    showAllProducts: string
    categoryEmpty: (category: string) => string
    tryAnotherCategory: string
    /** Մենյու՝ «Բոլորը», առանց կատեգորիայի ֆիլտրի, դատարկ ցուցակ */
    catalogEmpty: string
    paginationPrev: string
    paginationNext: string
    paginationAria: (current: number, totalPages: number) => string
    /** Էջի համարի կոճակի aria-label */
    paginationGoToPage: (page: number) => string
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
    starAdd: string
    starRemove: string
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
    viewAllOrders: string
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
  productPage: {
    breadcrumbHome: string
    breadcrumbMenu: string
    backToCatalog: string
    badgeHit: string
    badgeNew: string
    badgeClassic: string
    productInfo: string
    prepTime: string
    prepTimeValue: string
    deliveryTimeValue: string
    weight: string
    freshIngredients: string
    noPreservatives: string
    reviews: string
    perServing: string
    ingredients: string
    prepTimeShort: string
    delivery: string
    support: string
    similarProducts: string
    all: string
    shortDescription: string
    fullDescription: string
    stockAvailable: string
    stockUnavailable: string
    badgeHotPill: string
    customerReviewsLabel: string
    pricePerKg: string
  }
  productQuantity: {
    quantity: string
    addToCart: string
    addedToCart: string
    decreaseQuantity: string
    increaseQuantity: string
  }
  checkoutPage: {
    backToCart: string
    backToCartShort: string
    title: string
    titleShort: string
    deliveryData: string
    guestOrder: string
    name: string
    phone: string
    address: string
    addressPlaceholder: string
    namePlaceholder: string
    deliveryTime: string
    asap: string
    paymentMethod: string
    cash: string
    cashDesc: string
    cashDescFull: string
    card: string
    cardDesc: string
    cardDescFull: string
    idram: string
    idramDesc: string
    ardshinbank: string
    ardshinbankDesc: string
    arca: string
    arcaDesc: string
    comment: string
    commentPlaceholder: string
    yourOrder: string
    total: string
    freeDelivery: string
    submit: string
    submitting: string
    agreeTerms: string
    guestHint: string
    errorName: string
    errorPhone: string
    errorPhoneFormat: string
    errorAddress: string
    alertEmptyCart: string
    alertOrderError: string
    qtyUnit: string
  }
  contactPage: {
    heroTitle: string
    heroSubtitle: string
    phoneTitle: string
    phoneHours: string
    callBtn: string
    emailTitle: string
    emailResponse: string
    writeBtn: string
    hoursTitle: string
    deliveryHours: string
    quickOrderTitle: string
    quickOrderSubtitle: string
    callPhoneBtn: string
    locationTitle: string
    locationLabel: string
    addressLine: string
    openMapBtn: string
    onMap: string
    mapTitle: string
    faqTitle: string
    faqPrepQ: string
    faqPrepA: string
    faqDeliveryQ: string
    faqDeliveryA: string
    faqAdvanceQ: string
    faqAdvanceA: string
    faqPaymentQ: string
    faqPaymentA: string
    faqDiscountQ: string
    faqDiscountA: string
    faqContactQ: string
    faqContactA: string
    testimonialsTitle: string
    testimonial1Quote: string
    testimonial1Name: string
    testimonial2Quote: string
    testimonial2Name: string
    testimonial3Quote: string
    testimonial3Name: string
  }
}
