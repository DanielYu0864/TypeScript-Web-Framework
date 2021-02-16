// ! Extraction Approach I: Build class User as a 'mega' class with tons of methods (in src/models/User.ts)
// import axios, { AxiosResponse } from 'axios';

// interface UserProps {
//   id?: number;
//   name?: string; //? '?' in interface means variable is optional
//   age?: number;
// }

// // type alias
// type Callback = () => void; // a function take no argument and return nothing
// type obj = () => {}; // a function take no argument and return an object

// /*
//  eventing in JavaScript: An HTML event can be something the browser does, or something a user does. (.addEventListener())
// */

// export class User {
//   events: { [key: string]: Callback[] } = {};


//   constructor(private data: UserProps) { }

//   get(propName: string): (string | number) {
//     return this.data[propName];
//   }

//   set(update: UserProps): void {
//     Object.assign(this.data, update);
//   }

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

//   fetch(): void {
//     axios.get(`http://localhost:3000/users/${this.get('id')}`)
//       .then((response: AxiosResponse): void => {
//         this.set(response.data);
//       });
//   }

//   save(): void {
//     const id = this.get('id');

//     if (id) {
//       // update
//       axios.put(`http://localhost:3000/users/${id}`, this.data);
//     } else {
//       // create
//       axios.post('http://localhost:3000/users', this.data);
//     }
//   }
// }


// ! Extraction Approach II: Pefactor User to use composition: ########################################################################################################################
import axios, { AxiosResponse } from 'axios';
import { Eventing } from './Eventing';
interface UserProps {
  id?: number;
  name?: string; //? '?' in interface means variable is optional
  age?: number;
}

/*
 eventing in JavaScript: An HTML event can be something the browser does, or something a user does. (.addEventListener())
*/

export class User {
  public events: Eventing = new Eventing();

  constructor(private data: UserProps) { }

  get(propName: string): (string | number) {
    return this.data[propName];
  }

  set(update: UserProps): void {
    Object.assign(this.data, update);
  }

  fetch(): void {
    axios.get(`http://localhost:3000/users/${this.get('id')}`)
      .then((response: AxiosResponse): void => {
        this.set(response.data);
      });
  }

  save(): void {
    const id = this.get('id');

    if (id) {
      // update
      axios.put(`http://localhost:3000/users/${id}`, this.data);
    } else {
      // create
      axios.post('http://localhost:3000/users', this.data);
    }
  }
}