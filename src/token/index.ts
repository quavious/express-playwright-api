import {FirefoxBrowser} from 'playwright';
import sleep from '../util/sleep';

export default async function getAuthToken(browser: FirefoxBrowser, email: string, password: string){
    let auth: string = ""
    let cookie: string = ""
    
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.56",
        
    })
    const page = await context.newPage()
    try {
        await page.goto("https://partners.coupang.com", {
            waitUntil: "networkidle",
        })
        await sleep()
        const btns = await page.$$(".ant-btn")
        
        await btns[0].click()
        await page.click("._loginIdInput")
        await sleep()
        await page.fill("._loginIdInput", email)
        await sleep()
        await page.fill("._loginPasswordInput", password)
        await sleep()
        await page.click("._loginSubmitButton", {
            timeout: 20000
        })

        await sleep(5);
        const {cookies} = await context.storageState()
        const token = cookies.find(el => el.name === "AFATK")
        if (!token) {
            throw new Error("No Tokens")
        }
        for(let i = 0; i < cookies.length; i++) {
            cookie += `${cookies[i].name}=${cookies[i].value}; `
        }
        cookie = cookie.trim()
        auth = token.value
    } catch(err) {
        console.error(err.message)
        return null;
    } finally {
        await page.close()
        await context.close()
        return {auth, cookie}
    }
};