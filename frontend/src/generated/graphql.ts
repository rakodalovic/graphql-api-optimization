import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  Email: { input: any; output: any; }
  JSON: { input: any; output: any; }
  URL: { input: any; output: any; }
};

export type AddToCartInput = {
  productId: Scalars['Int']['input'];
  productVariantId?: InputMaybe<Scalars['Int']['input']>;
  quantity: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type Address = IAuditable & IEntityNode & {
  __typename?: 'Address';
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  billingOrders: Array<Order>;
  city: Scalars['String']['output'];
  company?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  shippingOrders: Array<Order>;
  state?: Maybe<Scalars['String']['output']>;
  type: AddressType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type AddressFilterInput = {
  addressLine1?: InputMaybe<StringOperationFilterInput>;
  addressLine2?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<AddressFilterInput>>;
  billingOrders?: InputMaybe<ListFilterInputTypeOfOrderFilterInput>;
  city?: InputMaybe<StringOperationFilterInput>;
  company?: InputMaybe<StringOperationFilterInput>;
  country?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isDefault?: InputMaybe<BooleanOperationFilterInput>;
  label?: InputMaybe<StringOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AddressFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  postalCode?: InputMaybe<StringOperationFilterInput>;
  shippingOrders?: InputMaybe<ListFilterInputTypeOfOrderFilterInput>;
  state?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<AddressTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type AddressSortInput = {
  addressLine1?: InputMaybe<SortEnumType>;
  addressLine2?: InputMaybe<SortEnumType>;
  city?: InputMaybe<SortEnumType>;
  company?: InputMaybe<SortEnumType>;
  country?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDefault?: InputMaybe<SortEnumType>;
  label?: InputMaybe<SortEnumType>;
  lastName?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  postalCode?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export enum AddressType {
  Billing = 'BILLING',
  Both = 'BOTH',
  Shipping = 'SHIPPING'
}

export type AddressTypeOperationFilterInput = {
  eq?: InputMaybe<AddressType>;
  in?: InputMaybe<Array<AddressType>>;
  neq?: InputMaybe<AddressType>;
  nin?: InputMaybe<Array<AddressType>>;
};

export type ApiVersion = {
  __typename?: 'ApiVersion';
  buildDate: Scalars['DateTime']['output'];
  environment: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Cart = IAuditable & IEntityNode & {
  __typename?: 'Cart';
  cartItems: Array<CartItem>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  discountAmount: Scalars['Decimal']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  sessionId?: Maybe<Scalars['String']['output']>;
  shippingAmount: Scalars['Decimal']['output'];
  subtotalAmount: Scalars['Decimal']['output'];
  taxAmount: Scalars['Decimal']['output'];
  totalAmount: Scalars['Decimal']['output'];
  totalItems: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type CartFilterInput = {
  and?: InputMaybe<Array<CartFilterInput>>;
  cartItems?: InputMaybe<ListFilterInputTypeOfCartItemFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  discountAmount?: InputMaybe<DecimalOperationFilterInput>;
  expiresAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CartFilterInput>>;
  sessionId?: InputMaybe<StringOperationFilterInput>;
  shippingAmount?: InputMaybe<DecimalOperationFilterInput>;
  subtotalAmount?: InputMaybe<DecimalOperationFilterInput>;
  taxAmount?: InputMaybe<DecimalOperationFilterInput>;
  totalAmount?: InputMaybe<DecimalOperationFilterInput>;
  totalItems?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type CartItem = IAuditable & IEntityNode & {
  __typename?: 'CartItem';
  addedAt: Scalars['DateTime']['output'];
  cart: Cart;
  cartId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  productVariant?: Maybe<ProductVariant>;
  productVariantId?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Int']['output'];
  totalPrice: Scalars['Decimal']['output'];
  unitPrice: Scalars['Decimal']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CartItemFilterInput = {
  addedAt?: InputMaybe<DateTimeOperationFilterInput>;
  and?: InputMaybe<Array<CartItemFilterInput>>;
  cart?: InputMaybe<CartFilterInput>;
  cartId?: InputMaybe<IntOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<CartItemFilterInput>>;
  product?: InputMaybe<ProductFilterInput>;
  productId?: InputMaybe<IntOperationFilterInput>;
  productVariant?: InputMaybe<ProductVariantFilterInput>;
  productVariantId?: InputMaybe<IntOperationFilterInput>;
  quantity?: InputMaybe<IntOperationFilterInput>;
  totalPrice?: InputMaybe<DecimalOperationFilterInput>;
  unitPrice?: InputMaybe<DecimalOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type CartPayload = {
  __typename?: 'CartPayload';
  cart?: Maybe<Cart>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Category = IAuditable & IEntityNode & {
  __typename?: 'Category';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['URL']['output']>;
  isActive: Scalars['Boolean']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parentCategory?: Maybe<Category>;
  parentCategoryId?: Maybe<Scalars['Int']['output']>;
  products: Array<Product>;
  slug?: Maybe<Scalars['String']['output']>;
  sortOrder: Scalars['Int']['output'];
  subCategories: Array<Category>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CategoryFilterInput = {
  and?: InputMaybe<Array<CategoryFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  metaDescription?: InputMaybe<StringOperationFilterInput>;
  metaTitle?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CategoryFilterInput>>;
  parentCategory?: InputMaybe<CategoryFilterInput>;
  parentCategoryId?: InputMaybe<IntOperationFilterInput>;
  products?: InputMaybe<ListFilterInputTypeOfProductFilterInput>;
  slug?: InputMaybe<StringOperationFilterInput>;
  sortOrder?: InputMaybe<IntOperationFilterInput>;
  subCategories?: InputMaybe<ListFilterInputTypeOfCategoryFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type CategorySortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageUrl?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  metaDescription?: InputMaybe<SortEnumType>;
  metaTitle?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  parentCategory?: InputMaybe<CategorySortInput>;
  parentCategoryId?: InputMaybe<SortEnumType>;
  slug?: InputMaybe<SortEnumType>;
  sortOrder?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type CreateNotificationInput = {
  actionText?: InputMaybe<Scalars['String']['input']>;
  actionUrl?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  message: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['String']['input']>;
  priority: NotificationPriority;
  title: Scalars['String']['input'];
  type: NotificationType;
  userId: Scalars['Int']['input'];
};

export type CreateOrderInput = {
  billingAddressId?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  shippingAddressId?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['Int']['input'];
};

export type CreateProductInput = {
  categoryId: Scalars['Int']['input'];
  compareAtPrice?: InputMaybe<Scalars['Decimal']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  sku?: InputMaybe<Scalars['String']['input']>;
  stockQuantity: Scalars['Int']['input'];
  weight?: InputMaybe<Scalars['Decimal']['input']>;
  weightUnit?: InputMaybe<Scalars['String']['input']>;
};

export type CreateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['Int']['input'];
  rating: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['Int']['input'];
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['Email']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type CreditCardPayment = IAuditable & IEntityNode & {
  __typename?: 'CreditCardPayment';
  amount: Scalars['Decimal']['output'];
  authorizationCode?: Maybe<Scalars['String']['output']>;
  cardBrand: Scalars['String']['output'];
  cardHolderName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  expiryMonth: Scalars['Int']['output'];
  expiryYear: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lastFourDigits: Scalars['String']['output'];
  payment: Payment;
  paymentId: Scalars['Int']['output'];
  processorName?: Maybe<Scalars['String']['output']>;
  status: PaymentStatus;
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CreditCardPaymentFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<CreditCardPaymentFilterInput>>;
  authorizationCode?: InputMaybe<StringOperationFilterInput>;
  cardBrand?: InputMaybe<StringOperationFilterInput>;
  cardHolderName?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  expiryMonth?: InputMaybe<IntOperationFilterInput>;
  expiryYear?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  lastFourDigits?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CreditCardPaymentFilterInput>>;
  payment?: InputMaybe<PaymentFilterInput>;
  paymentId?: InputMaybe<IntOperationFilterInput>;
  processorName?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<PaymentStatusOperationFilterInput>;
  transactionId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type CreditCardPaymentSortInput = {
  amount?: InputMaybe<SortEnumType>;
  authorizationCode?: InputMaybe<SortEnumType>;
  cardBrand?: InputMaybe<SortEnumType>;
  cardHolderName?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  expiryMonth?: InputMaybe<SortEnumType>;
  expiryYear?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  lastFourDigits?: InputMaybe<SortEnumType>;
  payment?: InputMaybe<PaymentSortInput>;
  paymentId?: InputMaybe<SortEnumType>;
  processorName?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  transactionId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  totalOrders: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
  totalRevenue: Scalars['Decimal']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  neq?: InputMaybe<Scalars['Decimal']['input']>;
  ngt?: InputMaybe<Scalars['Decimal']['input']>;
  ngte?: InputMaybe<Scalars['Decimal']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  nlt?: InputMaybe<Scalars['Decimal']['input']>;
  nlte?: InputMaybe<Scalars['Decimal']['input']>;
};

export type DeleteOrderInput = {
  cancellationReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type ExampleType = {
  __typename?: 'ExampleType';
  email?: Maybe<Scalars['Email']['output']>;
  id: Scalars['Int']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  website?: Maybe<Scalars['URL']['output']>;
};

export type IAuditable = {
  createdAt: Scalars['DateTime']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IEntityNode = {
  id: Scalars['Int']['output'];
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type ListFilterInputTypeOfAddressFilterInput = {
  all?: InputMaybe<AddressFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<AddressFilterInput>;
  some?: InputMaybe<AddressFilterInput>;
};

export type ListFilterInputTypeOfCartFilterInput = {
  all?: InputMaybe<CartFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CartFilterInput>;
  some?: InputMaybe<CartFilterInput>;
};

export type ListFilterInputTypeOfCartItemFilterInput = {
  all?: InputMaybe<CartItemFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CartItemFilterInput>;
  some?: InputMaybe<CartItemFilterInput>;
};

export type ListFilterInputTypeOfCategoryFilterInput = {
  all?: InputMaybe<CategoryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CategoryFilterInput>;
  some?: InputMaybe<CategoryFilterInput>;
};

export type ListFilterInputTypeOfNotificationFilterInput = {
  all?: InputMaybe<NotificationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<NotificationFilterInput>;
  some?: InputMaybe<NotificationFilterInput>;
};

export type ListFilterInputTypeOfOrderFilterInput = {
  all?: InputMaybe<OrderFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<OrderFilterInput>;
  some?: InputMaybe<OrderFilterInput>;
};

export type ListFilterInputTypeOfOrderItemFilterInput = {
  all?: InputMaybe<OrderItemFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<OrderItemFilterInput>;
  some?: InputMaybe<OrderItemFilterInput>;
};

export type ListFilterInputTypeOfOrderStatusHistoryFilterInput = {
  all?: InputMaybe<OrderStatusHistoryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<OrderStatusHistoryFilterInput>;
  some?: InputMaybe<OrderStatusHistoryFilterInput>;
};

export type ListFilterInputTypeOfOrderTagFilterInput = {
  all?: InputMaybe<OrderTagFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<OrderTagFilterInput>;
  some?: InputMaybe<OrderTagFilterInput>;
};

export type ListFilterInputTypeOfPaymentFilterInput = {
  all?: InputMaybe<PaymentFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PaymentFilterInput>;
  some?: InputMaybe<PaymentFilterInput>;
};

export type ListFilterInputTypeOfPaymentHistoryFilterInput = {
  all?: InputMaybe<PaymentHistoryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PaymentHistoryFilterInput>;
  some?: InputMaybe<PaymentHistoryFilterInput>;
};

export type ListFilterInputTypeOfProductFilterInput = {
  all?: InputMaybe<ProductFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ProductFilterInput>;
  some?: InputMaybe<ProductFilterInput>;
};

export type ListFilterInputTypeOfProductImageFilterInput = {
  all?: InputMaybe<ProductImageFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ProductImageFilterInput>;
  some?: InputMaybe<ProductImageFilterInput>;
};

export type ListFilterInputTypeOfProductTagFilterInput = {
  all?: InputMaybe<ProductTagFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ProductTagFilterInput>;
  some?: InputMaybe<ProductTagFilterInput>;
};

export type ListFilterInputTypeOfProductVariantAttributeFilterInput = {
  all?: InputMaybe<ProductVariantAttributeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ProductVariantAttributeFilterInput>;
  some?: InputMaybe<ProductVariantAttributeFilterInput>;
};

export type ListFilterInputTypeOfProductVariantFilterInput = {
  all?: InputMaybe<ProductVariantFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ProductVariantFilterInput>;
  some?: InputMaybe<ProductVariantFilterInput>;
};

export type ListFilterInputTypeOfReviewFilterInput = {
  all?: InputMaybe<ReviewFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ReviewFilterInput>;
  some?: InputMaybe<ReviewFilterInput>;
};

export type ListFilterInputTypeOfReviewImageFilterInput = {
  all?: InputMaybe<ReviewImageFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ReviewImageFilterInput>;
  some?: InputMaybe<ReviewImageFilterInput>;
};

export type ListFilterInputTypeOfReviewVoteFilterInput = {
  all?: InputMaybe<ReviewVoteFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ReviewVoteFilterInput>;
  some?: InputMaybe<ReviewVoteFilterInput>;
};

export type ListFilterInputTypeOfUserRoleFilterInput = {
  all?: InputMaybe<UserRoleFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<UserRoleFilterInput>;
  some?: InputMaybe<UserRoleFilterInput>;
};

export type ListFilterInputTypeOfUserTagFilterInput = {
  all?: InputMaybe<UserTagFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<UserTagFilterInput>;
  some?: InputMaybe<UserTagFilterInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addToCart: CartPayload;
  clearCart: CartPayload;
  createNotification: NotificationPayload;
  createOrder: OrderPayload;
  createProduct: ProductPayload;
  createReview: ReviewPayload;
  createUser: UserPayload;
  deleteOrder: OrderPayload;
  deleteProduct: ProductPayload;
  deleteUser: UserPayload;
  removeFromCart: CartPayload;
  updateCartItem: CartPayload;
  updateOrder: OrderPayload;
  updateProduct: ProductPayload;
  updateUser: UserPayload;
};


export type MutationAddToCartArgs = {
  input: AddToCartInput;
};


export type MutationClearCartArgs = {
  userId: Scalars['Int']['input'];
};


export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteOrderArgs = {
  input: DeleteOrderInput;
};


export type MutationDeleteProductArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveFromCartArgs = {
  input: RemoveFromCartInput;
};


export type MutationUpdateCartItemArgs = {
  input: UpdateCartItemInput;
};


export type MutationUpdateOrderArgs = {
  input: UpdateOrderInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Notification = IAuditable & IEntityNode & {
  __typename?: 'Notification';
  actionText?: Maybe<Scalars['String']['output']>;
  actionUrl?: Maybe<Scalars['URL']['output']>;
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['URL']['output']>;
  isArchived: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  priority: NotificationPriority;
  readAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  type: NotificationType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type NotificationFilterInput = {
  actionText?: InputMaybe<StringOperationFilterInput>;
  actionUrl?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<NotificationFilterInput>>;
  archivedAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  expiresAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  isArchived?: InputMaybe<BooleanOperationFilterInput>;
  isRead?: InputMaybe<BooleanOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  metadata?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<NotificationFilterInput>>;
  priority?: InputMaybe<NotificationPriorityOperationFilterInput>;
  readAt?: InputMaybe<DateTimeOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<NotificationTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type NotificationPayload = {
  __typename?: 'NotificationPayload';
  message: Scalars['String']['output'];
  notification?: Maybe<Notification>;
  success: Scalars['Boolean']['output'];
};

export enum NotificationPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Normal = 'NORMAL'
}

export type NotificationPriorityOperationFilterInput = {
  eq?: InputMaybe<NotificationPriority>;
  in?: InputMaybe<Array<NotificationPriority>>;
  neq?: InputMaybe<NotificationPriority>;
  nin?: InputMaybe<Array<NotificationPriority>>;
};

export type NotificationSortInput = {
  actionText?: InputMaybe<SortEnumType>;
  actionUrl?: InputMaybe<SortEnumType>;
  archivedAt?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  expiresAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageUrl?: InputMaybe<SortEnumType>;
  isArchived?: InputMaybe<SortEnumType>;
  isRead?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  metadata?: InputMaybe<SortEnumType>;
  priority?: InputMaybe<SortEnumType>;
  readAt?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export enum NotificationType {
  Marketing = 'MARKETING',
  Order = 'ORDER',
  Payment = 'PAYMENT',
  Product = 'PRODUCT',
  Promotion = 'PROMOTION',
  Review = 'REVIEW',
  Security = 'SECURITY',
  Shipping = 'SHIPPING',
  Social = 'SOCIAL',
  System = 'SYSTEM'
}

export type NotificationTypeOperationFilterInput = {
  eq?: InputMaybe<NotificationType>;
  in?: InputMaybe<Array<NotificationType>>;
  neq?: InputMaybe<NotificationType>;
  nin?: InputMaybe<Array<NotificationType>>;
};

export type Order = IAuditable & IEntityNode & {
  __typename?: 'Order';
  billingAddress?: Maybe<Address>;
  billingAddressId?: Maybe<Scalars['Int']['output']>;
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount: Scalars['Decimal']['output'];
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  orderItems: Array<OrderItem>;
  orderNumber: Scalars['String']['output'];
  orderTags: Array<OrderTag>;
  payments: Array<Payment>;
  shippedAt?: Maybe<Scalars['DateTime']['output']>;
  shippingAddress?: Maybe<Address>;
  shippingAddressId?: Maybe<Scalars['Int']['output']>;
  shippingAmount: Scalars['Decimal']['output'];
  status: OrderStatus;
  statusHistory: Array<OrderStatusHistory>;
  subtotalAmount: Scalars['Decimal']['output'];
  taxAmount: Scalars['Decimal']['output'];
  totalAmount: Scalars['Decimal']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type OrderFilterInput = {
  and?: InputMaybe<Array<OrderFilterInput>>;
  billingAddress?: InputMaybe<AddressFilterInput>;
  billingAddressId?: InputMaybe<IntOperationFilterInput>;
  cancellationReason?: InputMaybe<StringOperationFilterInput>;
  cancelledAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  deliveredAt?: InputMaybe<DateTimeOperationFilterInput>;
  discountAmount?: InputMaybe<DecimalOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<OrderFilterInput>>;
  orderItems?: InputMaybe<ListFilterInputTypeOfOrderItemFilterInput>;
  orderNumber?: InputMaybe<StringOperationFilterInput>;
  orderTags?: InputMaybe<ListFilterInputTypeOfOrderTagFilterInput>;
  payments?: InputMaybe<ListFilterInputTypeOfPaymentFilterInput>;
  shippedAt?: InputMaybe<DateTimeOperationFilterInput>;
  shippingAddress?: InputMaybe<AddressFilterInput>;
  shippingAddressId?: InputMaybe<IntOperationFilterInput>;
  shippingAmount?: InputMaybe<DecimalOperationFilterInput>;
  status?: InputMaybe<OrderStatusOperationFilterInput>;
  statusHistory?: InputMaybe<ListFilterInputTypeOfOrderStatusHistoryFilterInput>;
  subtotalAmount?: InputMaybe<DecimalOperationFilterInput>;
  taxAmount?: InputMaybe<DecimalOperationFilterInput>;
  totalAmount?: InputMaybe<DecimalOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type OrderItem = IAuditable & IEntityNode & {
  __typename?: 'OrderItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  order: Order;
  orderId: Scalars['Int']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  productName: Scalars['String']['output'];
  productSku?: Maybe<Scalars['String']['output']>;
  productVariant?: Maybe<ProductVariant>;
  productVariantId?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Int']['output'];
  totalPrice: Scalars['Decimal']['output'];
  unitPrice: Scalars['Decimal']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  variantName?: Maybe<Scalars['String']['output']>;
};

export type OrderItemFilterInput = {
  and?: InputMaybe<Array<OrderItemFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<OrderItemFilterInput>>;
  order?: InputMaybe<OrderFilterInput>;
  orderId?: InputMaybe<IntOperationFilterInput>;
  product?: InputMaybe<ProductFilterInput>;
  productId?: InputMaybe<IntOperationFilterInput>;
  productName?: InputMaybe<StringOperationFilterInput>;
  productSku?: InputMaybe<StringOperationFilterInput>;
  productVariant?: InputMaybe<ProductVariantFilterInput>;
  productVariantId?: InputMaybe<IntOperationFilterInput>;
  quantity?: InputMaybe<IntOperationFilterInput>;
  totalPrice?: InputMaybe<DecimalOperationFilterInput>;
  unitPrice?: InputMaybe<DecimalOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  variantName?: InputMaybe<StringOperationFilterInput>;
};

export type OrderPayload = {
  __typename?: 'OrderPayload';
  message: Scalars['String']['output'];
  order?: Maybe<Order>;
  success: Scalars['Boolean']['output'];
};

export type OrderSortInput = {
  billingAddress?: InputMaybe<AddressSortInput>;
  billingAddressId?: InputMaybe<SortEnumType>;
  cancellationReason?: InputMaybe<SortEnumType>;
  cancelledAt?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  deliveredAt?: InputMaybe<SortEnumType>;
  discountAmount?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  orderNumber?: InputMaybe<SortEnumType>;
  shippedAt?: InputMaybe<SortEnumType>;
  shippingAddress?: InputMaybe<AddressSortInput>;
  shippingAddressId?: InputMaybe<SortEnumType>;
  shippingAmount?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  subtotalAmount?: InputMaybe<SortEnumType>;
  taxAmount?: InputMaybe<SortEnumType>;
  totalAmount?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

/** Represents the current status of an order */
export enum OrderStatus {
  /** Order has been cancelled before fulfillment */
  Cancelled = 'CANCELLED',
  /** Order has been confirmed and accepted */
  Confirmed = 'CONFIRMED',
  /** Order has been successfully delivered to the customer */
  Delivered = 'DELIVERED',
  /** Order has been created but not yet confirmed */
  Pending = 'PENDING',
  /** Order is being processed and prepared for shipment */
  Processing = 'PROCESSING',
  /** Order has been refunded after payment */
  Refunded = 'REFUNDED',
  /** Order has been returned by the customer */
  Returned = 'RETURNED',
  /** Order has been shipped to the customer */
  Shipped = 'SHIPPED'
}

export type OrderStatusHistory = IAuditable & IEntityNode & {
  __typename?: 'OrderStatusHistory';
  changedAt: Scalars['DateTime']['output'];
  changedBy?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  order: Order;
  orderId: Scalars['Int']['output'];
  status: OrderStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderStatusHistoryFilterInput = {
  and?: InputMaybe<Array<OrderStatusHistoryFilterInput>>;
  changedAt?: InputMaybe<DateTimeOperationFilterInput>;
  changedBy?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<OrderStatusHistoryFilterInput>>;
  order?: InputMaybe<OrderFilterInput>;
  orderId?: InputMaybe<IntOperationFilterInput>;
  status?: InputMaybe<OrderStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type OrderStatusOperationFilterInput = {
  eq?: InputMaybe<OrderStatus>;
  in?: InputMaybe<Array<OrderStatus>>;
  neq?: InputMaybe<OrderStatus>;
  nin?: InputMaybe<Array<OrderStatus>>;
};

export type OrderTag = IAuditable & IEntityNode & {
  __typename?: 'OrderTag';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  order: Order;
  orderId: Scalars['Int']['output'];
  tag: Tag;
  tagId: Scalars['Int']['output'];
  taggedAt: Scalars['DateTime']['output'];
  taggedBy?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderTagFilterInput = {
  and?: InputMaybe<Array<OrderTagFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<OrderTagFilterInput>>;
  order?: InputMaybe<OrderFilterInput>;
  orderId?: InputMaybe<IntOperationFilterInput>;
  tag?: InputMaybe<TagFilterInput>;
  tagId?: InputMaybe<IntOperationFilterInput>;
  taggedAt?: InputMaybe<DateTimeOperationFilterInput>;
  taggedBy?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type Payment = IAuditable & IEntityNode & {
  __typename?: 'Payment';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  failedAt?: Maybe<Scalars['DateTime']['output']>;
  failureReason?: Maybe<Scalars['String']['output']>;
  gatewayResponse?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  method: PaymentMethod;
  notes?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Order>;
  orderId?: Maybe<Scalars['Int']['output']>;
  paymentGateway?: Maybe<Scalars['String']['output']>;
  paymentHistory: Array<PaymentHistory>;
  paymentIntentId?: Maybe<Scalars['String']['output']>;
  paymentNumber: Scalars['String']['output'];
  processedAt?: Maybe<Scalars['DateTime']['output']>;
  refundedAmount: Scalars['Decimal']['output'];
  refundedAt?: Maybe<Scalars['DateTime']['output']>;
  status: PaymentStatus;
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type PaymentFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<PaymentFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  failedAt?: InputMaybe<DateTimeOperationFilterInput>;
  failureReason?: InputMaybe<StringOperationFilterInput>;
  gatewayResponse?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  method?: InputMaybe<PaymentMethodOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PaymentFilterInput>>;
  order?: InputMaybe<OrderFilterInput>;
  orderId?: InputMaybe<IntOperationFilterInput>;
  paymentGateway?: InputMaybe<StringOperationFilterInput>;
  paymentHistory?: InputMaybe<ListFilterInputTypeOfPaymentHistoryFilterInput>;
  paymentIntentId?: InputMaybe<StringOperationFilterInput>;
  paymentNumber?: InputMaybe<StringOperationFilterInput>;
  processedAt?: InputMaybe<DateTimeOperationFilterInput>;
  refundedAmount?: InputMaybe<DecimalOperationFilterInput>;
  refundedAt?: InputMaybe<DateTimeOperationFilterInput>;
  status?: InputMaybe<PaymentStatusOperationFilterInput>;
  transactionId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type PaymentHistory = IAuditable & IEntityNode & {
  __typename?: 'PaymentHistory';
  changedAt: Scalars['DateTime']['output'];
  changedBy?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  payment: Payment;
  paymentId: Scalars['Int']['output'];
  status: PaymentStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PaymentHistoryFilterInput = {
  and?: InputMaybe<Array<PaymentHistoryFilterInput>>;
  changedAt?: InputMaybe<DateTimeOperationFilterInput>;
  changedBy?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PaymentHistoryFilterInput>>;
  payment?: InputMaybe<PaymentFilterInput>;
  paymentId?: InputMaybe<IntOperationFilterInput>;
  status?: InputMaybe<PaymentStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export enum PaymentMethod {
  ApplePay = 'APPLE_PAY',
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH',
  CreditCard = 'CREDIT_CARD',
  Cryptocurrency = 'CRYPTOCURRENCY',
  DebitCard = 'DEBIT_CARD',
  GooglePay = 'GOOGLE_PAY',
  PayPal = 'PAY_PAL',
  Stripe = 'STRIPE'
}

export type PaymentMethodOperationFilterInput = {
  eq?: InputMaybe<PaymentMethod>;
  in?: InputMaybe<Array<PaymentMethod>>;
  neq?: InputMaybe<PaymentMethod>;
  nin?: InputMaybe<Array<PaymentMethod>>;
};

export type PaymentMethodResult = CreditCardPayment | PaypalPayment;

export type PaymentMethodResults = {
  __typename?: 'PaymentMethodResults';
  creditCardPayments: Array<CreditCardPayment>;
  paypalPayments: Array<PaypalPayment>;
};

export type PaymentSortInput = {
  amount?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  failedAt?: InputMaybe<SortEnumType>;
  failureReason?: InputMaybe<SortEnumType>;
  gatewayResponse?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  method?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  order?: InputMaybe<OrderSortInput>;
  orderId?: InputMaybe<SortEnumType>;
  paymentGateway?: InputMaybe<SortEnumType>;
  paymentIntentId?: InputMaybe<SortEnumType>;
  paymentNumber?: InputMaybe<SortEnumType>;
  processedAt?: InputMaybe<SortEnumType>;
  refundedAmount?: InputMaybe<SortEnumType>;
  refundedAt?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  transactionId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

/** Represents the current status of a payment transaction */
export enum PaymentStatus {
  /** Payment was cancelled before completion */
  Cancelled = 'CANCELLED',
  /** Payment has been successfully completed */
  Completed = 'COMPLETED',
  /** Payment processing failed due to an error */
  Failed = 'FAILED',
  /** Payment has been partially refunded to the customer */
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  /** Payment has been initiated but not yet processed */
  Pending = 'PENDING',
  /** Payment is currently being processed by the payment gateway */
  Processing = 'PROCESSING',
  /** Payment has been fully refunded to the customer */
  Refunded = 'REFUNDED'
}

export type PaymentStatusOperationFilterInput = {
  eq?: InputMaybe<PaymentStatus>;
  in?: InputMaybe<Array<PaymentStatus>>;
  neq?: InputMaybe<PaymentStatus>;
  nin?: InputMaybe<Array<PaymentStatus>>;
};

export type PaypalPayment = IAuditable & IEntityNode & {
  __typename?: 'PaypalPayment';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  payerEmail?: Maybe<Scalars['String']['output']>;
  payerId?: Maybe<Scalars['String']['output']>;
  payerName?: Maybe<Scalars['String']['output']>;
  payment: Payment;
  paymentId: Scalars['Int']['output'];
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paypalResponse?: Maybe<Scalars['String']['output']>;
  paypalTransactionId: Scalars['String']['output'];
  status: PaymentStatus;
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PaypalPaymentFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<PaypalPaymentFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<PaypalPaymentFilterInput>>;
  payerEmail?: InputMaybe<StringOperationFilterInput>;
  payerId?: InputMaybe<StringOperationFilterInput>;
  payerName?: InputMaybe<StringOperationFilterInput>;
  payment?: InputMaybe<PaymentFilterInput>;
  paymentId?: InputMaybe<IntOperationFilterInput>;
  paymentMethod?: InputMaybe<StringOperationFilterInput>;
  paypalResponse?: InputMaybe<StringOperationFilterInput>;
  paypalTransactionId?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<PaymentStatusOperationFilterInput>;
  transactionId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type PaypalPaymentSortInput = {
  amount?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  payerEmail?: InputMaybe<SortEnumType>;
  payerId?: InputMaybe<SortEnumType>;
  payerName?: InputMaybe<SortEnumType>;
  payment?: InputMaybe<PaymentSortInput>;
  paymentId?: InputMaybe<SortEnumType>;
  paymentMethod?: InputMaybe<SortEnumType>;
  paypalResponse?: InputMaybe<SortEnumType>;
  paypalTransactionId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  transactionId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type Product = IAuditable & IEntityNode & {
  __typename?: 'Product';
  cartItems: Array<CartItem>;
  category: Category;
  categoryId: Scalars['Int']['output'];
  compareAtPrice?: Maybe<Scalars['Decimal']['output']>;
  costPrice?: Maybe<Scalars['Decimal']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  images: Array<ProductImage>;
  isActive: Scalars['Boolean']['output'];
  isDigital: Scalars['Boolean']['output'];
  isFeatured: Scalars['Boolean']['output'];
  lowStockThreshold?: Maybe<Scalars['Int']['output']>;
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  orderItems: Array<OrderItem>;
  price: Scalars['Decimal']['output'];
  productTags: Array<ProductTag>;
  reviews: Array<Review>;
  sku?: Maybe<Scalars['String']['output']>;
  stockQuantity: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  variants: Array<ProductVariant>;
  weight?: Maybe<Scalars['Decimal']['output']>;
  weightUnit?: Maybe<Scalars['String']['output']>;
};

export type ProductFilterInput = {
  and?: InputMaybe<Array<ProductFilterInput>>;
  cartItems?: InputMaybe<ListFilterInputTypeOfCartItemFilterInput>;
  category?: InputMaybe<CategoryFilterInput>;
  categoryId?: InputMaybe<IntOperationFilterInput>;
  compareAtPrice?: InputMaybe<DecimalOperationFilterInput>;
  costPrice?: InputMaybe<DecimalOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  images?: InputMaybe<ListFilterInputTypeOfProductImageFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isDigital?: InputMaybe<BooleanOperationFilterInput>;
  isFeatured?: InputMaybe<BooleanOperationFilterInput>;
  lowStockThreshold?: InputMaybe<IntOperationFilterInput>;
  metaDescription?: InputMaybe<StringOperationFilterInput>;
  metaTitle?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ProductFilterInput>>;
  orderItems?: InputMaybe<ListFilterInputTypeOfOrderItemFilterInput>;
  price?: InputMaybe<DecimalOperationFilterInput>;
  productTags?: InputMaybe<ListFilterInputTypeOfProductTagFilterInput>;
  reviews?: InputMaybe<ListFilterInputTypeOfReviewFilterInput>;
  sku?: InputMaybe<StringOperationFilterInput>;
  stockQuantity?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  variants?: InputMaybe<ListFilterInputTypeOfProductVariantFilterInput>;
  weight?: InputMaybe<DecimalOperationFilterInput>;
  weightUnit?: InputMaybe<StringOperationFilterInput>;
};

export type ProductImage = IAuditable & IEntityNode & {
  __typename?: 'ProductImage';
  altText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['URL']['output']>;
  isPrimary: Scalars['Boolean']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductImageFilterInput = {
  altText?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<ProductImageFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  isPrimary?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ProductImageFilterInput>>;
  product?: InputMaybe<ProductFilterInput>;
  productId?: InputMaybe<IntOperationFilterInput>;
  sortOrder?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ProductPayload = {
  __typename?: 'ProductPayload';
  message: Scalars['String']['output'];
  product?: Maybe<Product>;
  success: Scalars['Boolean']['output'];
};

export type ProductSortInput = {
  category?: InputMaybe<CategorySortInput>;
  categoryId?: InputMaybe<SortEnumType>;
  compareAtPrice?: InputMaybe<SortEnumType>;
  costPrice?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isDigital?: InputMaybe<SortEnumType>;
  isFeatured?: InputMaybe<SortEnumType>;
  lowStockThreshold?: InputMaybe<SortEnumType>;
  metaDescription?: InputMaybe<SortEnumType>;
  metaTitle?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  price?: InputMaybe<SortEnumType>;
  sku?: InputMaybe<SortEnumType>;
  stockQuantity?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  weight?: InputMaybe<SortEnumType>;
  weightUnit?: InputMaybe<SortEnumType>;
};

export type ProductTag = IAuditable & IEntityNode & {
  __typename?: 'ProductTag';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  tag: Tag;
  tagId: Scalars['Int']['output'];
  taggedAt: Scalars['DateTime']['output'];
  taggedBy?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductTagFilterInput = {
  and?: InputMaybe<Array<ProductTagFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<ProductTagFilterInput>>;
  product?: InputMaybe<ProductFilterInput>;
  productId?: InputMaybe<IntOperationFilterInput>;
  tag?: InputMaybe<TagFilterInput>;
  tagId?: InputMaybe<IntOperationFilterInput>;
  taggedAt?: InputMaybe<DateTimeOperationFilterInput>;
  taggedBy?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ProductVariant = IAuditable & IEntityNode & {
  __typename?: 'ProductVariant';
  attributes: Array<ProductVariantAttribute>;
  compareAtPrice?: Maybe<Scalars['Decimal']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['URL']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  sortOrder: Scalars['Int']['output'];
  stockQuantity: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  weight?: Maybe<Scalars['Decimal']['output']>;
};

export type ProductVariantAttribute = IAuditable & IEntityNode & {
  __typename?: 'ProductVariantAttribute';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  productVariant: ProductVariant;
  productVariantId: Scalars['Int']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  value: Scalars['String']['output'];
};

export type ProductVariantAttributeFilterInput = {
  and?: InputMaybe<Array<ProductVariantAttributeFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ProductVariantAttributeFilterInput>>;
  productVariant?: InputMaybe<ProductVariantFilterInput>;
  productVariantId?: InputMaybe<IntOperationFilterInput>;
  sortOrder?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  value?: InputMaybe<StringOperationFilterInput>;
};

export type ProductVariantFilterInput = {
  and?: InputMaybe<Array<ProductVariantFilterInput>>;
  attributes?: InputMaybe<ListFilterInputTypeOfProductVariantAttributeFilterInput>;
  compareAtPrice?: InputMaybe<DecimalOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ProductVariantFilterInput>>;
  price?: InputMaybe<DecimalOperationFilterInput>;
  product?: InputMaybe<ProductFilterInput>;
  productId?: InputMaybe<IntOperationFilterInput>;
  sku?: InputMaybe<StringOperationFilterInput>;
  sortOrder?: InputMaybe<IntOperationFilterInput>;
  stockQuantity?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  weight?: InputMaybe<DecimalOperationFilterInput>;
};

export type Query = {
  __typename?: 'Query';
  activeCart?: Maybe<Cart>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  creditCardPayments: Array<CreditCardPayment>;
  dashboardStats: DashboardStats;
  exampleWithCustomTypes: ExampleType;
  notifications: Array<Notification>;
  order?: Maybe<Order>;
  orderStatuses: Array<OrderStatus>;
  orders: Array<Order>;
  paymentMethods: PaymentMethodResults;
  paymentStatuses: Array<PaymentStatus>;
  paypalPayments: Array<PaypalPayment>;
  product?: Maybe<Product>;
  products: Array<Product>;
  reviews: Array<Review>;
  search: SearchResults;
  tags: Array<Tag>;
  user?: Maybe<User>;
  users: Array<User>;
  version: ApiVersion;
};


export type QueryActiveCartArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryCategoriesArgs = {
  order?: InputMaybe<Array<CategorySortInput>>;
  where?: InputMaybe<CategoryFilterInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCreditCardPaymentsArgs = {
  order?: InputMaybe<Array<CreditCardPaymentSortInput>>;
  where?: InputMaybe<CreditCardPaymentFilterInput>;
};


export type QueryNotificationsArgs = {
  order?: InputMaybe<Array<NotificationSortInput>>;
  userId: Scalars['Int']['input'];
  where?: InputMaybe<NotificationFilterInput>;
};


export type QueryOrderArgs = {
  id: Scalars['Int']['input'];
};


export type QueryOrdersArgs = {
  order?: InputMaybe<Array<OrderSortInput>>;
  where?: InputMaybe<OrderFilterInput>;
};


export type QueryPaymentMethodsArgs = {
  paymentId: Scalars['Int']['input'];
};


export type QueryPaypalPaymentsArgs = {
  order?: InputMaybe<Array<PaypalPaymentSortInput>>;
  where?: InputMaybe<PaypalPaymentFilterInput>;
};


export type QueryProductArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductsArgs = {
  order?: InputMaybe<Array<ProductSortInput>>;
  where?: InputMaybe<ProductFilterInput>;
};


export type QueryReviewsArgs = {
  order?: InputMaybe<Array<ReviewSortInput>>;
  where?: InputMaybe<ReviewFilterInput>;
};


export type QuerySearchArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryTagsArgs = {
  order?: InputMaybe<Array<TagSortInput>>;
  where?: InputMaybe<TagFilterInput>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type RemoveFromCartInput = {
  productId: Scalars['Int']['input'];
  productVariantId?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['Int']['input'];
};

export type Review = IAuditable & IEntityNode & {
  __typename?: 'Review';
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  approvedBy?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  helpfulVotes: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isApproved: Scalars['Boolean']['output'];
  isFeatured: Scalars['Boolean']['output'];
  isVerifiedPurchase: Scalars['Boolean']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  reviewImages: Array<ReviewImage>;
  reviewVotes: Array<ReviewVote>;
  title?: Maybe<Scalars['String']['output']>;
  unhelpfulVotes: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type ReviewFilterInput = {
  and?: InputMaybe<Array<ReviewFilterInput>>;
  approvedAt?: InputMaybe<DateTimeOperationFilterInput>;
  approvedBy?: InputMaybe<StringOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  helpfulVotes?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isApproved?: InputMaybe<BooleanOperationFilterInput>;
  isFeatured?: InputMaybe<BooleanOperationFilterInput>;
  isVerifiedPurchase?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ReviewFilterInput>>;
  product?: InputMaybe<ProductFilterInput>;
  productId?: InputMaybe<IntOperationFilterInput>;
  rating?: InputMaybe<IntOperationFilterInput>;
  reviewImages?: InputMaybe<ListFilterInputTypeOfReviewImageFilterInput>;
  reviewVotes?: InputMaybe<ListFilterInputTypeOfReviewVoteFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  unhelpfulVotes?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type ReviewImage = IAuditable & IEntityNode & {
  __typename?: 'ReviewImage';
  altText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  review: Review;
  reviewId: Scalars['Int']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReviewImageFilterInput = {
  altText?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<ReviewImageFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ReviewImageFilterInput>>;
  review?: InputMaybe<ReviewFilterInput>;
  reviewId?: InputMaybe<IntOperationFilterInput>;
  sortOrder?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ReviewPayload = {
  __typename?: 'ReviewPayload';
  message: Scalars['String']['output'];
  review?: Maybe<Review>;
  success: Scalars['Boolean']['output'];
};

export type ReviewSortInput = {
  approvedAt?: InputMaybe<SortEnumType>;
  approvedBy?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  helpfulVotes?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isApproved?: InputMaybe<SortEnumType>;
  isFeatured?: InputMaybe<SortEnumType>;
  isVerifiedPurchase?: InputMaybe<SortEnumType>;
  product?: InputMaybe<ProductSortInput>;
  productId?: InputMaybe<SortEnumType>;
  rating?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  unhelpfulVotes?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type ReviewVote = IAuditable & IEntityNode & {
  __typename?: 'ReviewVote';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  isHelpful: Scalars['Boolean']['output'];
  review: Review;
  reviewId: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type ReviewVoteFilterInput = {
  and?: InputMaybe<Array<ReviewVoteFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isHelpful?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ReviewVoteFilterInput>>;
  review?: InputMaybe<ReviewFilterInput>;
  reviewId?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type Role = IAuditable & IEntityNode & {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userRoles: Array<UserRole>;
};

export type RoleFilterInput = {
  and?: InputMaybe<Array<RoleFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<RoleFilterInput>>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userRoles?: InputMaybe<ListFilterInputTypeOfUserRoleFilterInput>;
};

export type SearchResult = Category | Product | User;

export type SearchResults = {
  __typename?: 'SearchResults';
  categories: Array<Category>;
  products: Array<Product>;
  users: Array<User>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onNotificationReceived: Notification;
  onOrderCreated: Order;
};

export type Tag = IAuditable & IEntityNode & {
  __typename?: 'Tag';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  orderTags: Array<OrderTag>;
  productTags: Array<ProductTag>;
  slug?: Maybe<Scalars['String']['output']>;
  type: TagType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usageCount: Scalars['Int']['output'];
  userTags: Array<UserTag>;
};

export type TagFilterInput = {
  and?: InputMaybe<Array<TagFilterInput>>;
  color?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  icon?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TagFilterInput>>;
  orderTags?: InputMaybe<ListFilterInputTypeOfOrderTagFilterInput>;
  productTags?: InputMaybe<ListFilterInputTypeOfProductTagFilterInput>;
  slug?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<TagTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  usageCount?: InputMaybe<IntOperationFilterInput>;
  userTags?: InputMaybe<ListFilterInputTypeOfUserTagFilterInput>;
};

export type TagSortInput = {
  color?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  icon?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  slug?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  usageCount?: InputMaybe<SortEnumType>;
};

export enum TagType {
  Brand = 'BRAND',
  Category = 'CATEGORY',
  Color = 'COLOR',
  Feature = 'FEATURE',
  General = 'GENERAL',
  Material = 'MATERIAL',
  Promotion = 'PROMOTION',
  Season = 'SEASON',
  Size = 'SIZE',
  Style = 'STYLE'
}

export type TagTypeOperationFilterInput = {
  eq?: InputMaybe<TagType>;
  in?: InputMaybe<Array<TagType>>;
  neq?: InputMaybe<TagType>;
  nin?: InputMaybe<Array<TagType>>;
};

export type UpdateCartItemInput = {
  productId: Scalars['Int']['input'];
  productVariantId?: InputMaybe<Scalars['Int']['input']>;
  quantity: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type UpdateOrderInput = {
  billingAddressId?: InputMaybe<Scalars['Int']['input']>;
  cancellationReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  shippingAddressId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
  statusNotes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  compareAtPrice?: InputMaybe<Scalars['Decimal']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
  weight?: InputMaybe<Scalars['Decimal']['input']>;
  weightUnit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['Email']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = IAuditable & IEntityNode & {
  __typename?: 'User';
  addresses: Array<Address>;
  carts: Array<Cart>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['Email']['output']>;
  emailConfirmed: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  notifications: Array<Notification>;
  orders: Array<Order>;
  passwordHash: Scalars['String']['output'];
  payments: Array<Payment>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  preferences?: Maybe<UserPreferences>;
  profile?: Maybe<UserProfile>;
  reviewVotes: Array<ReviewVote>;
  reviews: Array<Review>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userRoles: Array<UserRole>;
  userTags: Array<UserTag>;
  username: Scalars['String']['output'];
};

export type UserFilterInput = {
  addresses?: InputMaybe<ListFilterInputTypeOfAddressFilterInput>;
  and?: InputMaybe<Array<UserFilterInput>>;
  carts?: InputMaybe<ListFilterInputTypeOfCartFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  emailConfirmed?: InputMaybe<BooleanOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  lastLoginAt?: InputMaybe<DateTimeOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  orders?: InputMaybe<ListFilterInputTypeOfOrderFilterInput>;
  passwordHash?: InputMaybe<StringOperationFilterInput>;
  payments?: InputMaybe<ListFilterInputTypeOfPaymentFilterInput>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  preferences?: InputMaybe<UserPreferencesFilterInput>;
  profile?: InputMaybe<UserProfileFilterInput>;
  reviewVotes?: InputMaybe<ListFilterInputTypeOfReviewVoteFilterInput>;
  reviews?: InputMaybe<ListFilterInputTypeOfReviewFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userRoles?: InputMaybe<ListFilterInputTypeOfUserRoleFilterInput>;
  userTags?: InputMaybe<ListFilterInputTypeOfUserTagFilterInput>;
  username?: InputMaybe<StringOperationFilterInput>;
};

export type UserPayload = {
  __typename?: 'UserPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type UserPreferences = IAuditable & IEntityNode & {
  __typename?: 'UserPreferences';
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  emailNotifications: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  language: Scalars['String']['output'];
  marketingEmails: Scalars['Boolean']['output'];
  pushNotifications: Scalars['Boolean']['output'];
  smsNotifications: Scalars['Boolean']['output'];
  theme: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type UserPreferencesFilterInput = {
  and?: InputMaybe<Array<UserPreferencesFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  emailNotifications?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  language?: InputMaybe<StringOperationFilterInput>;
  marketingEmails?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserPreferencesFilterInput>>;
  pushNotifications?: InputMaybe<BooleanOperationFilterInput>;
  smsNotifications?: InputMaybe<BooleanOperationFilterInput>;
  theme?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type UserPreferencesSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  emailNotifications?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  language?: InputMaybe<SortEnumType>;
  marketingEmails?: InputMaybe<SortEnumType>;
  pushNotifications?: InputMaybe<SortEnumType>;
  smsNotifications?: InputMaybe<SortEnumType>;
  theme?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type UserProfile = IAuditable & IEntityNode & {
  __typename?: 'UserProfile';
  avatarUrl?: Maybe<Scalars['URL']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  timeZone?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type UserProfileFilterInput = {
  and?: InputMaybe<Array<UserProfileFilterInput>>;
  avatarUrl?: InputMaybe<StringOperationFilterInput>;
  bio?: InputMaybe<StringOperationFilterInput>;
  city?: InputMaybe<StringOperationFilterInput>;
  country?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  dateOfBirth?: InputMaybe<DateTimeOperationFilterInput>;
  gender?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<UserProfileFilterInput>>;
  timeZone?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type UserProfileSortInput = {
  avatarUrl?: InputMaybe<SortEnumType>;
  bio?: InputMaybe<SortEnumType>;
  city?: InputMaybe<SortEnumType>;
  country?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  dateOfBirth?: InputMaybe<SortEnumType>;
  gender?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  timeZone?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type UserRole = IAuditable & IEntityNode & {
  __typename?: 'UserRole';
  assignedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  role: Role;
  roleId: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type UserRoleFilterInput = {
  and?: InputMaybe<Array<UserRoleFilterInput>>;
  assignedAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  expiresAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserRoleFilterInput>>;
  role?: InputMaybe<RoleFilterInput>;
  roleId?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type UserSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  emailConfirmed?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  lastLoginAt?: InputMaybe<SortEnumType>;
  lastName?: InputMaybe<SortEnumType>;
  passwordHash?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  preferences?: InputMaybe<UserPreferencesSortInput>;
  profile?: InputMaybe<UserProfileSortInput>;
  updatedAt?: InputMaybe<SortEnumType>;
  username?: InputMaybe<SortEnumType>;
};

export type UserTag = IAuditable & IEntityNode & {
  __typename?: 'UserTag';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  tag: Tag;
  tagId: Scalars['Int']['output'];
  taggedAt: Scalars['DateTime']['output'];
  taggedBy?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type UserTagFilterInput = {
  and?: InputMaybe<Array<UserTagFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<UserTagFilterInput>>;
  tag?: InputMaybe<TagFilterInput>;
  tagId?: InputMaybe<IntOperationFilterInput>;
  taggedAt?: InputMaybe<DateTimeOperationFilterInput>;
  taggedBy?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserPayload', success: boolean, message: string, user?: { __typename?: 'User', id: number, firstName: string, lastName: string, email?: any | null, username: string, isActive: boolean, createdAt: any } | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserPayload', success: boolean, message: string, user?: { __typename?: 'User', id: number, firstName: string, lastName: string, email?: any | null, username: string, phoneNumber?: string | null, isActive: boolean, updatedAt?: any | null } | null } };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'ProductPayload', success: boolean, message: string, product?: { __typename?: 'Product', id: number, name: string, description?: string | null, price: any, stockQuantity: number, isActive: boolean, createdAt: any } | null } };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'ProductPayload', success: boolean, message: string, product?: { __typename?: 'Product', id: number, name: string, description?: string | null, price: any, stockQuantity: number, isActive: boolean, updatedAt?: any | null } | null } };

export type GetVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVersionQuery = { __typename?: 'Query', version: { __typename?: 'ApiVersion', version: string, environment: string, buildDate: any } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: number, firstName: string, lastName: string, email?: any | null, username: string, isActive: boolean, createdAt: any, updatedAt?: any | null }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: number, firstName: string, lastName: string, email?: any | null, username: string, phoneNumber?: string | null, isActive: boolean, emailConfirmed: boolean, createdAt: any, updatedAt?: any | null, profile?: { __typename?: 'UserProfile', id: number, bio?: string | null, avatarUrl?: any | null, dateOfBirth?: any | null } | null } | null };

export type GetProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', id: number, name: string, description?: string | null, price: any, stockQuantity: number, isActive: boolean, createdAt: any, updatedAt?: any | null }> };

export type GetProductQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: number, name: string, description?: string | null, price: any, stockQuantity: number, isActive: boolean, createdAt: any, updatedAt?: any | null, category: { __typename?: 'Category', id: number, name: string }, images: Array<{ __typename?: 'ProductImage', id: number, imageUrl?: any | null, altText?: string | null, isPrimary: boolean }> } | null };


export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    success
    message
    user {
      id
      firstName
      lastName
      email
      username
      isActive
      createdAt
    }
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    success
    message
    user {
      id
      firstName
      lastName
      email
      username
      phoneNumber
      isActive
      updatedAt
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    success
    message
    product {
      id
      name
      description
      price
      stockQuantity
      isActive
      createdAt
    }
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    success
    message
    product {
      id
      name
      description
      price
      stockQuantity
      isActive
      updatedAt
    }
  }
}
    `;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const GetVersionDocument = gql`
    query GetVersion {
  version {
    version
    environment
    buildDate
  }
}
    `;

/**
 * __useGetVersionQuery__
 *
 * To run a query within a React component, call `useGetVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVersionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVersionQuery(baseOptions?: Apollo.QueryHookOptions<GetVersionQuery, GetVersionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVersionQuery, GetVersionQueryVariables>(GetVersionDocument, options);
      }
export function useGetVersionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVersionQuery, GetVersionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVersionQuery, GetVersionQueryVariables>(GetVersionDocument, options);
        }
export function useGetVersionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVersionQuery, GetVersionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVersionQuery, GetVersionQueryVariables>(GetVersionDocument, options);
        }
export type GetVersionQueryHookResult = ReturnType<typeof useGetVersionQuery>;
export type GetVersionLazyQueryHookResult = ReturnType<typeof useGetVersionLazyQuery>;
export type GetVersionSuspenseQueryHookResult = ReturnType<typeof useGetVersionSuspenseQuery>;
export type GetVersionQueryResult = Apollo.QueryResult<GetVersionQuery, GetVersionQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  users {
    id
    firstName
    lastName
    email
    username
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: Int!) {
  user(id: $id) {
    id
    firstName
    lastName
    email
    username
    phoneNumber
    isActive
    emailConfirmed
    createdAt
    updatedAt
    profile {
      id
      bio
      avatarUrl
      dateOfBirth
    }
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetProductsDocument = gql`
    query GetProducts {
  products {
    id
    name
    description
    price
    stockQuantity
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
      }
export function useGetProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsSuspenseQueryHookResult = ReturnType<typeof useGetProductsSuspenseQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export const GetProductDocument = gql`
    query GetProduct($id: Int!) {
  product(id: $id) {
    id
    name
    description
    price
    stockQuantity
    isActive
    createdAt
    updatedAt
    category {
      id
      name
    }
    images {
      id
      imageUrl
      altText
      isPrimary
    }
  }
}
    `;

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductQuery(baseOptions: Apollo.QueryHookOptions<GetProductQuery, GetProductQueryVariables> & ({ variables: GetProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
      }
export function useGetProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductSuspenseQueryHookResult = ReturnType<typeof useGetProductSuspenseQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProductQuery, GetProductQueryVariables>;