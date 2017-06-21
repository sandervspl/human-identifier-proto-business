// dependencies

class IdentitiesFetcher {
  private static firstInstance: IdentitiesFetcher = null;

  public static getInstance(): IdentitiesFetcher {
    if (this.firstInstance === null) {
      this.firstInstance = new IdentitiesFetcher();
    }

    return this.firstInstance;
  }

  public async fetchIdentities(): Promise<any> {
    let result: any = await fetch('https://randomuser.me/api/?results=100');
    result = await result.json();

    const personalities = result.results.map(identity => ({
      firstName: identity.name.first,
      lastName: identity.name.last,
      gender: identity.gender,
      dateOfBirth: identity.dob.substring(0, identity.dob.indexOf(' ')),
      passportId: identity.login.salt,
      picture: identity.picture.thumbnail,
      nationality: identity.nat,
    }));

    return personalities;
  }
}

export default IdentitiesFetcher;
