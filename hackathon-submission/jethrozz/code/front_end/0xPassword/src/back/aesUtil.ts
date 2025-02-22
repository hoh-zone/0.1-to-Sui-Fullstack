export async function aesEncrypt(pwd: string, mk: string | null): Promise<{ encryptedData: string; iv: string; salt: string }> {
    if (!mk) {
        throw new Error("加密密钥不能为空");
    }
    // 生成随机盐值
    const salt = self.crypto.getRandomValues(new Uint8Array(16));
    // 密钥派生：从密码和盐值中派生出AES密钥
    const keyMaterial = new TextEncoder().encode(mk);
    const key = await self.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    const derivedKey = await self.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    // 生成随机IV
    const iv = self.crypto.getRandomValues(new Uint8Array(16));

    // 加密数据
    const encryptedData = await self.crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            iv: iv
        },
        derivedKey,
        new TextEncoder().encode(pwd)
    );

    // 将加密数据、IV和盐值转换为Base64格式
    const encryptedDataBase64 = arrayBufferToBase64(encryptedData);
    const ivBase64 = arrayBufferToBase64(iv);
    const saltBase64 = arrayBufferToBase64(salt);

    return {
        encryptedData: encryptedDataBase64,
        iv: ivBase64,
        salt: saltBase64
    };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...uint8Array));
}

export async function aesDecrypt(encryptedDataBase64: string, ivBase64: string, saltBase64: string, mk: string): Promise<string> {
    // 将Base64格式的加密数据、IV和盐值还原为ArrayBuffer
    console.log("encryptedDataBase64: "+encryptedDataBase64+", ivBase64:"+ivBase64+", saltBase64:"+saltBase64+", mk:"+mk);
    const encryptedData = base64ToArrayBuffer(encryptedDataBase64);
    const iv = base64ToArrayBuffer(ivBase64);
    const salt = base64ToArrayBuffer(saltBase64);

    // 密钥派生：从密码和盐值中派生出AES密钥
    const keyMaterial = new TextEncoder().encode(mk);
    const key = await self.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    const derivedKey = await self.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    // 解密数据
    const decryptedData = await self.crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv: iv
        },
        derivedKey,
        encryptedData
    );

    // 将解密后的数据转换为字符串
    return new TextDecoder().decode(decryptedData);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array.buffer;
}