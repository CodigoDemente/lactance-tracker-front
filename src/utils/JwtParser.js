export class JwtParser {

    constructor(jwt = '') {
        this.jwt = jwt;
    }

    get payLoad() {
        try {
            const payload = this.jwt.split('.')[1].replace(/([-_])/g, c => {
                switch (c) {
                    case '-': return '+';
                    case '_': return '/';
                }
            });

            const b64DecodeUnicode = str => {
                const atobArray = atob(str).split('');
                const decodeArray = atobArray.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2));
                return decodeURIComponent(decodeArray.join(''));
            };

            return JSON.parse(b64DecodeUnicode(payload));

        } catch (e) {
            throw new Error('Error parsing jwt');
        }
    }
}