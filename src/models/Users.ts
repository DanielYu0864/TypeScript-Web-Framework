interface UserProps {
  name?: string; //? '?' in interface means variable is optional
  age?: number;
}

// type alias
type Callback = () => void; // a function take no argument and return nothing
type obj = () => {}; // a function take no argument and return an object

/*
 eventing in JavaScript: An HTML event can be something the browser does, or something a user does. (.addEventListener())
*/

export class User {
  events: { [key: string]: Callback[] } = {};


  constructor(private data: UserProps) { }

  get(propName: string): (string | number) {
    return this.data[propName];
  }

  set(update: UserProps): void {
    Object.assign(this.data, update);
  }

  on(eventName: string, callback: Callback): void {
    // first step: assign eventName as key in events obj
    const handlers = this.events[eventName] || [];
    handlers.push(callback);

    this.events[eventName] = handlers
  }

  trigger(eventName: string): void {
    const handlers = this.events[eventName];

    if (!handlers || handlers.length === 0) {
      return;
    }

    handlers.forEach(callback => {
      callback();
    })
  }
}