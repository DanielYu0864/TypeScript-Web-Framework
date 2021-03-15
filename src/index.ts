// $ parcel index.html -> ts run client server
// $ json-server -w db.json  - to run json (backend) server in terminal

/*
! assign backend and client in the package.json so now can just run:
  $ npm run start:db - run backend server
  $ npm run start:parcel - run client server
*/
//! Framework idea
/*
  Model Classes => Handle data, used to represent Users, Blog Posts, Images, etc
  View Classes => Handle HTML and events caused by the user (like clicks)
*/

//! backend servers
/*
  $ npm install -g json-server
  use 'JSON Server' to contain the user data
    User Instance | axios -> save()  ->  JSON Server
                          <- fetch() <-
*/

//! Framework steps and needs
/*
  1. Create a class to represent a User and all of its data (like name and age)
    a. User class needs to have the ability to store some data, retrieve it, and change it
    b. Also needs to have the ability to notify the rest of the app when some data is changed
    c. User needs to be able to persist dat to an outside server, and the retrieve it at some future point

    *Extraction Approach:
    I Build class User as a 'mega' class with tons of methods (in src/models/User.ts):
      class User {
        private data: UserProps; -> Object to store info about a particular user (name, age)
        get(propName:string): (string | number); -> Gets a single piece of info about this user (name, age)
        set(update: UserProps):void; -> Changes info about this user (name, age) (using Object.assign)
        on(eventName: string, callback:() => {}); -> Registers an event handler with this object, so other parts of the app know when something changes
        trigger(eventName:string):void; -> Triggers an event to tell other parts of the app that someting has changed
        fetch(): Promise; -> Fetches some data from the server about a particular user
        save (): Promise; -> Saves some data about this user to the server
      }

    II Pefactor User to use composition:
      class User {
        attributes:Attributes; -> Gives us the ability to store properties tied to this user (name, age, etc)
          \=> class Attributes<T> { ** T = generic type
            private data: T;
            get<K extends keyof T>(key: K): T[K];
            set(update: T):void;
          }
        events: Events; -> Gives us the ability to tell other parts of our application whenever data tied to a particular user is changed
          \=> class Eventing {
            on(eventName: string, callback:() => {});
            trigger(eventName:string):void;
          }
        sync:Sync<UserProps>; -> Gives us the ability to save this persons data to a remote server, then retrieve it in the future
          \=> class Sync<T> {
            save(id:num, data:T): AxoisPromise<T>;
            fetch(id:number):AxiosPromise<T>;
          }
      }

    III Refactor User to be a reusable class that can represent any piece of data, not just a User
      Caller function
        \=> class User {
          get()
          set()
          on()
          trigger()
          fetch()
          save()
        }
          \=> class attributes<T> {
            get(key:K):T[K]
            set(update:void)
          }
          \=> class Eventing {
            on(eventName:string, callback: () => {})
            trigger(eventName: string): void
          }
          \=> class Sync<T> {
            fetch(id: number): Promise
            save(data: T): Promise
          }
*/

//* inheritance in this project

// import { User } from './models/Users';

// const user = User.buildUser({ id: 1 });

//* Reminder on accessores "get"

// class Person {
//   constructor(public firstName: string, public lastName: string) { }

//   get fullName(): string { // not really calling a function * don't need "()"
//     return `${this.firstName} ${this.lastName}`;
//   }
// }

//* Reminder on how 'this' works in javascript

/*
const colors = {
  color: 'red',
  printColor() {
    console.log(this.color);
  }
}

colors.printColor(); // works

const printColor = colors.printColor;

printColor(); // cause error 'cause the 'this' is undefined
*/


// user.on('change', () => {
//   console.log(user);
// });

// // user.trigger('change');
// // user.set({ name: 'New name' })
// user.fetch();


//!

import { UserForm } from './views/UserForm'
import { User } from './models/Users'

const user = User.buildUser({ name: 'NAME', age: 20 })

const userForm = new UserForm(
  document.getElementById('root'),
  user
);

userForm.render();
