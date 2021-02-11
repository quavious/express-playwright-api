export default async function sleep(sec?: number):Promise<string> {
    return await new Promise((res, rej) => {
        setTimeout(() => res(""), !sec ? 1000 : sec*1000)
    })
}