export class User {
  id: string;
  email: string | undefined;
  isAdmin = false;
  private _emailVerified = false;

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
