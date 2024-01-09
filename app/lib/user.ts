export class User {
    id: string;
    email: string | undefined;
    isAdmin: boolean = false;
    private _emailVerified: boolean = false;

    constructor(uuid: string, email?: string | undefined) {
        this.id = uuid;
        this.email = email;
    }

    set emailVerified(verified: boolean) {
        this._emailVerified = verified;
    }

    get emailVerified(): boolean {
        return this._emailVerified;
    }
}