// ! Extraction Approach II: Pefactor User to use composition: ########################################################################################################################


// export class Attributes<T> {
//   constructor(private data: T) { }

//   get<K extends keyof T>(key: K): T[K] {
//     return this.data[key];
//   }

//   set(update: T): void {
//     Object.assign(this.data, update);
//   }
// }

//! III Refactor User to be a reusable class that can represent any piece of data, not just a User

export class Attributes<T> {
  constructor(private data: T) { }

  get = <K extends keyof T>(key: K): T[K] => { // use arrow function to avoid error
    return this.data[key];
  }

  set(update: T): void {
    Object.assign(this.data, update);
  }

  getAll(): T {
    return this.data;
  }
}
