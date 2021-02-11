import {firefox} from 'playwright';

const browserGenerate = async () => {
    const browser = await firefox.launch({
        headless: true,
    })
    console.log("Browser is being generated")
    return function() {
        return browser
    }
}

export default browserGenerate;