import express from 'express'
import browserGenerate from './util/browser';
import getAuthToken from './token'
import {Search, User, Product} from './define'
import axios from 'axios';
import attachUrl from './url/generate';
import * as path from 'path';
import * as dotenv from 'dotenv';

let browserReturn:Function;
dotenv.config()

const app = express()

app.use(express.json())
app.use("/", express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
    res.sendFile("/index.html")
})

app.post("/authenticate", async (req, res) => {
    try {
        if(!browserReturn) {
            throw new Error("The function that returns browser context has error")
        };
        const {body} = req;
        const {email, password} = body as User;
        const browser = browserReturn()
        const resp = await getAuthToken(browser, email, password)
        if(!resp) {
            throw new Error("The token was not generated.")
        }
        res.status(200).json({
            "status": true,
            "msg": resp
        })
        return;
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server ERROR");
        return;
    }
})

app.post("/search", async (req, res) => {
    try {
        const {body} = req;
        const {cookie, auth, keyword, page} = body as Search;
        if(!keyword || keyword.length < 2 || keyword.length > 12) {
            throw new Error("The parameter Keyword was invalid.")
        } 
        if(page < 0 || page >= 25) {
            throw new Error("The parameter Page was invalid.")
        }
        if(!cookie || !auth) {
            throw new Error("The data Auth was invalid.")
        }
        const apiUrl = process.env.API_ADDRESS_SEARCH!;
        const {data} = await axios.post(apiUrl, {
            page: {pageNumber: page, size: 36}, filter: keyword
        }, {
            headers: {
                "Cookie": cookie,
                "Content-Type": "application/json;charset=UTF-8",
                "x-token": auth,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.56"
            }
        })
        if(!data) {
            throw new Error("Server ERROR")
        }
        const products: Product[] = data.data.products
        const flag = await attachUrl(products, cookie, auth)
        let message:string="";
        if(!flag) {
            message = "Urls were not generated normally."
        } else {
            message = "All url was generated successfully."
        }
        res.json({
            "status": true,
            "response": products,
            "message": message
        });
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server ERROR")
    }
})

app.listen(5000, async () => {
    browserReturn = await browserGenerate()
    console.log("Server On")
})