import axios from "axios"
import { Product } from "../define"
import Agent from 'agentkeepalive';
import * as dotenv from 'dotenv';


export default async function attachUrl(product: Product[], cookie: string, auth: string): Promise<boolean> {
    dotenv.config()
    try {
        const url = process.env.API_ADDRESS_GENERATE!;
        const httpReq = axios.create({
            headers: {
                "Cookie": cookie,
                "Content-Type": "application/json;charset=UTF-8",
                "x-token": auth,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.56"
            },
            httpAgent: new Agent({
                maxSockets: 100,
                maxFreeSockets: 10,
                timeout: 60000,
                freeSocketTimeout: 30000,
            }),
        })
        for(let i = 0; i < product.length; i++){
            const {productId, itemId, vendorItemId, originPrice, salesPrice, discountRate, title, image, type} = product[i]
            const {data} = await httpReq.post(url, {
                group: "rocket-fresh",
                product: {
                    discountRate,
                    image,
                    itemId,
                    originPrice,
                    productId,
                    salesPrice,
                    title,
                    type,
                    vendorItemId,
                }
            })
            product[i].linkUrl = await data.data.shortUrl
        }
        return true
    } catch(err) {
        console.error(err.message);
        return false;
    }
};