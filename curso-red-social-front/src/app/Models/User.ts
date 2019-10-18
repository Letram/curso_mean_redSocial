export class User {

  // When initializing attributes via constructor we dont really have to write them first in the class or initialize them in oninit()
  // tslint:disable-next-line:variable-name
  constructor(public _id: string,
              public name: string,
              public surname: string,
              public nick: string,
              public email: string,
              public password: string,
              public role: string,
              public image: string
              ) {}
}


