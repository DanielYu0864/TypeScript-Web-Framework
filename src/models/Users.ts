interface UserProps {
  name?: string; //? '?' in interface means variable is optional
  age?: number;
}

export class User {
  constructor(private data: UserProps) { }

  get(propName: string): (string | number) {
    return this.data[propName];
  }

  set(update: UserProps): void {
    Object.assign(this.data, update);
  }
}