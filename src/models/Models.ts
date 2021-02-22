import { AxiosPromise, AxiosResponse } from "axios";
//! III Refactor User to be a reusable class that can represent any piece of data, not just a User

interface ModelAttributes<T> {
  set(update: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

interface HasId {
  id?: number;
}


export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) { }
  //* first type: Direct passthrough of arguments
  get on() {
    return this.events.on; //* return a reference to the events.on() instead call the function
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  //* second type: Need coordiation between different modules in User

  set(update: T): void {
    // set() then trigger()
    this.attributes.set(update);
    this.events.trigger('change');
  }

  fetch(): void {
    // get() then fetch()
    const id = this.get('id'); // the get() in the Users.ts

    if (typeof id !== 'number') {
      throw new Error('Cannot fetch without an id');
    }

    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data); // the set() inside of Users.ts
    })

  }

  save(): void {
    // getAll() then save()
    this.sync.save(this.attributes.getAll())
      .then((response: AxiosResponse): void => {
        this.trigger('save');
      })
      .catch(() => {
        this.trigger('error');
      })
  }

}