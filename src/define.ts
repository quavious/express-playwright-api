export interface User {
    email: string;
    password: string;
}

export interface Search {
    cookie: string;
    auth: string;
    keyword: string;
    page: number;
}

export interface Product {
    type: string;
    productId : number;
    itemId: number;
    vendorItemId: number;
    originPrice: number;
    salesPrice: number;
    discountRate: number;
    title: string;
    image: string;
    company: string;
    linkUrl?: string;
}