export const getPublicAndPrivateKey = () => {
    let PublicAndPrivateKey = JSON.parse(localStorage.getItem('PublicAndPrivateKey'));
    let publicKey, privateKey, signKey, clientKey;

    if (PublicAndPrivateKey) {
        let {b, j, d, g, y, z, h, m, r, t} = PublicAndPrivateKey;

        b = b.substring(0, b.length - 32) // 去掉后 32 位
        j = j.slice(32); // 去掉前 32 位
        d = d.substring(0, d.length - 32);
        privateKey = `${b}${j}${d}`;

        g = g.slice(32);
        y = y.substring(0, y.length - 32);
        z = z.slice(32);
        publicKey = `${g}${y}${z}`;

        h = h.substring(0, h.length - 32);
        m = m.slice(32)
        clientKey = Base64.decode(`${h}${m}`);

        r = r.substring(0, r.length - 32);
        t = t.slice(32)
        signKey = `${r}${t}`;
    }

    return {
        publicKey, privateKey, signKey, clientKey
    }
}

export const setPublicAndPrivateKey = (data) => {
    localStorage.setItem('PublicAndPrivateKey', JSON.stringify(data))
}