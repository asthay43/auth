module.exports = (res, code, message, data, total, token) => {
    if (res && code && (data || message)) {
        let obj = {
            code: code
        }
        if (data) obj['data'] = data;
        if (message) obj['message'] = message;
        if (total) obj['total'] = total;
        if (token) obj['token'] = token;
        return res.json(obj);
    } else throw 'not proper';
}