var path = require('path')
module.exports = {
    debug: true,
    port: 3000,
    session: {
        key: 'SID',
        secret: 'SID',
        maxAge: 24 * 60 * 60 * 1000
    },
    mongodb: 'mongodb://localhost:27017/tongfu',
    imageHost: 'http://localhost:3000/static/images/',
    qrHost: 'http://localhost:3000/static/qrcode/',
    notifyUrl: 'http://iwhqpf.natappfree.cc/order/alipay_callback.do',
    images: path.join(__dirname, 'public/images'),
    qrcode: path.join(__dirname, 'public/qrcode'),
    tokenTime: 1000 * 60 * 5,                    // token保存的时间，5分钟
    appId: '2016091900547362',
    pid: '2088102176326767',
    open_api_domain: 'https://openapi.alipaydev.com/gateway.do',
    privateKey: 'MIIEpAIBAAKCAQEA5Kg2Y7cYPdUwFHkeXYDYpzYehHVsumogxb7s8h/J6X18dsxSFmoMJlrOjnqshJRLp1Au1Khm046WBuN3vra7vi7yrd1MuONdPf4OdhpBO1oabnMOkowOdoepP2xbBfZR/I9UhN0pbF4yTPDcvpeZOs02OoFxOz9NhTKeOFgRB0iYJUd037qzPFP7f/rZiqkrPqGww6ybZgaEC0QTADiRVk5B2Wg1pYs4nQy7J+fzEFe5Nj3S6L212XFHodHq5eBCbhS2BLR/flKaZWHxAD/PI2II9E9O/0YlD2K0GkAWtzlxo0qicyXtP8P2RJIp0cO44+5VTUN38v9uFbPUk9akjwIDAQABAoIBAHwRabGhX13tlzEEpx1FFElmbBijPmPHwhCKEDcwWHaAyFANfVz8HauSChH1Ljah4IrgTwjEd0bDT1RdiFPLAwOmpbcBJOgNNkK031Pl2w9BTKYxd+68X/ygj40CVkFd7g6EFvAgsKFEWza0WpJv34ywXIRSSAZFyuJDHOalole4XTR9yODhmZOjaDcfinDbu988wgwpoVNDHxzPcWgZm9IXFqnK1ShTPZF6Iv1qwSdAX+iY/hRHUKvsFDTrLxqYQmXmmdy8HKSsDfFtUCmQkiK5gv0PEn+eBVVnaO6lQguYCMK1xZHwdG5XgJHhs/e2rtX0JsGewn0dzSV/hVxXKgECgYEA/joGNRGVpmHSyCktiuHIut+li0A0UgPnMqX+5Vj9BvI+FphZ6BLe5BZ9wHgWdE/KHjmWrES9m1OFikLj4pwyAGwvwcBveR2I6YbUEzqLJMhXFkjL/a/Fh6+tf/kRzonAnmpgqYRKcHI1PFTrfjwki6fF1qKUlR2gLK4h6e/rheECgYEA5kCHPlFEBHcBjBJEr5XiXPDc7AeA8ZOewPQNnTa7bQyshyp3/k1xmcaalLFyejAZcmCDKjskhjLHvkj9yKnsP9UFueayJ0IHPSA+ffIpfp51Kl9cRdvo7+/xkqdFFW6m7PJQ1MRPfbus6aus2SFSpXST3xfW4iwMEz+9YOh6mG8CgYEAwXbEnIQKPzi4YAw+FS9nQxbI8uRkLHm96mQ6SqxiuXOFXkqIOLyLlEWtYtfANrk1lbS7fdM9+0MfH61xoFS/FGVAHpDkA+Y+93/cSdnGY7J124aAfkjR6ET/oqCXNXbM94D6mGYNA+9Vpdj18PWx1flR69mDesq1xuqo8k7bC+ECgYEA4TQUE5ugj01msf3cOHC9KnJbYnAkaiQcjlUmS7KQtyRCSyH6ozxT9DgQUYcNlP0epoRHRjL6kldwjmkN8ApjDDvqkd1WOpeWRO8YsE7+zt1lc8A5nApvVt60xN/d7gyAMBkBfllT9oJtqU9EjErPbw0K5JWIk0bJuLoLHJHF9vkCgYBM95zhNogZiR3/8OjiVtm0TQfZPhksr1p3QbuJezKVYjtqaeKlw4sDrWO/OHFNqrIEGP9pRWC9eJ7QNbrf0uPf4Aqy7yb6ihHni0/JvtUV4CTXby9CmvJrwmrb+PB9fQH3rqOLdRmq3bvtSIzKYiESiYtSYP+ImlU1UPCi0cjxfQ==',
    alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0+6rAukaHirnLxDqbI8yVrwobi42jWzpkegJOhlc27iwmo62egWKSdh4/zGBQ41b+DytQvWzVU33wEd+7Om2l4hszJP60igDcMgzpdQS/dYPiTDATXtm7IFL9L57vwxaUgS88zxfWPHS1TlnuHB1pqA4ah6IWk26aHAUjaVCcDSyVG7jlibbsc6MIAo6493Y5PCY2WKRR/lOLujVEMjKql48CCSl32QpNu3T0j+OqCBW44G+zUWjm5MXIoZeSKDp/OCEq1EaLrILEa/5kVB1U7fMo0w2mznRZv1gbTwlSEGQ0QoxQJIAugXgcwOhBvBR6y76/8iavR9rhtHWXALGRQIDAQAB'
}