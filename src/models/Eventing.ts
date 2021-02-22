// ! Extraction Approach II:Pefactor User to use composition:
// type alias
// type Callback = () => void; // a function take no argument and return nothing

// export class Eventing {
//   events: { [key: string]: Callback[] } = {};

//   on(eventName: string, callback: Callback): void {
//     // first step: assign eventName as key in events obj
//     const handlers = this.events[eventName] || [];
//     handlers.push(callback);

//     this.events[eventName] = handlers
//   }

//   trigger(eventName: string): void {
//     const handlers = this.events[eventName];

//     if (!handlers || handlers.length === 0) {
//       return;
//     }

//     handlers.forEach(callback => {
//       callback();
//     })
//   }
// }

//! III Refactor User to be a reusable class that can represent any piece of data, not just a User

type Callback = () => void; // a function take no argument and return nothing

export class Eventing {
  events: { [key: string]: Callback[] } = {};

  on = (eventName: string, callback: Callback): void => {
    // first step: assign eventName as key in events obj
    const handlers = this.events[eventName] || [];
    handlers.push(callback);

    this.events[eventName] = handlers
  }

  trigger = (eventName: string): void => {
    const handlers = this.events[eventName];

    if (!handlers || handlers.length === 0) {
      return;
    }

    handlers.forEach(callback => {
      callback();
    })
  }
}