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
// import { Eventing } from './Eventing';
// import { ApiSync } from './ApiSync';
// import { Attributes } from './Attributes';

// export interface UserProps {
//   id?: number;
//   name?: string; //? '?' in interface means variable is optional
//   age?: number;
// }

// /*
//  eventing in JavaScript: An HTML event can be something the browser does, or something a user does. (.addEventListener())
// */

// const rootUrl = 'http://localhost:3000/users';

// export class User {
//   public events: Eventing = new Eventing();
//   public sync: Sync<UserProps> = new Sync<UserProps>(rootUrl);
//   public attributes: Attributes<UserProps>;

//   constructor(attrs:   UserProps) {
//     this.attributes = new Attributes<UserProps>(attrs);
//   }
// }

//! III Refactor User to be a reusable class that can represent any piece of data, not just a User

//* first type: Direct passthrough of arguments
//* second type: Need coordiation between different modules in User

import { Model } from './Models';
import { Attributes } from './Attributes';
import { ApiSync } from './ApiSync';
import { Eventing } from './Eventing';
import { Collection } from './Collection';

export interface UserProps {
  id?: number;
  name?: string; //? '?' in interface means variable is optional
  age?: number;
}

/*
 eventing in JavaScript: An HTML event can be something the browser does, or something a user does. (.addEventListener())
*/

const rootUrl = 'http://localhost:3000/users';

export class User extends Model<UserProps> {
  static buildUser(attrs: UserProps): User {
    return new User(
      new Attributes<UserProps>(attrs),
      new Eventing(),
      new ApiSync<UserProps>(rootUrl)
    );
  }

  static buildUserCollection(): Collection<User, UserProps> {
    return new Collection<User, UserProps>(
      rootUrl,
      (json: UserProps) => User.buildUser(json)
    );
  }

  setRandomAge(): void {
    const age = Math.round(Math.random() * 100);
    this.set({ age });
  }
}
