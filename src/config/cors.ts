import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' })

export const getAllowedURL = () => {
    let url = "";
    if(process.env["NODE_ENV "] === 'development'){
        url = process.env.DEV_CLIENT || "*"
    }else{
        if(process.env.PROD_CLIENT){
            url = process.env.PROD_CLIENT
        }
    }
    return url
}