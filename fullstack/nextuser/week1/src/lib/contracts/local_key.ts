//用于本地测试数据获取接口,使用nodejs

import * as fs from 'fs';
import * as  dotenv from 'dotenv';
import * as path from 'path'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import {fromBase64} from '@mysten/bcs'
dotenv.config();
// 初始化SUI Client, 用于和主网(mainnet)交互
// 从环境变量读取secretKey
//AAa...   ~/keys/*.key
const secretKey = process.env.SECRET_KEY || get_key();;
/** 这里把base64编码的secretKey转换为字节数组后截掉第一个元素，是因为第一位是一个私钥类型的标记位，后续派生签名者时不需要 **/
const secretKeyBytes = fromBase64(secretKey).slice(1); // 发起方账户私钥
export const signer = Ed25519Keypair.fromSecretKey(secretKeyBytes); // 生成签名者

/**
 * 
 * @returns read .key
 */
export function get_local_key() : string{
    let fd = fs.openSync('.key','r')
    let buffer = Buffer.alloc(100);
    let buffer_size = 100;
    let read_len = fs.readSync(fd,buffer,0,buffer_size,null);

    fs.closeSync(fd);
    let ret = buffer.toString().trim().substring(0,read_len);
    return ret;
}



/**
 * read  ~/.sui/sui_config/sui.keystore  keys 
 * @returns private_key
 */
export function get_keys() : string[] {
    dotenv.config();
    let home_dir = process.env.HOME || "~/";

    let file = path.join(home_dir, ".sui/sui_config/sui.keystore");
    let buffer = fs.readFileSync(file);
    let keys = JSON.parse(buffer.toString());
    //console.log(keys);
    return keys as unknown as string[];
}

export function get_key() : string{
    return get_keys()[0];
}

