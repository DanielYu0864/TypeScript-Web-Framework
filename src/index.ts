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

//! Framework steps
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

    II Pefactor User to use composition
    III Refactor User to be a reusable class that can represent any piece of data, not just a User
*/


import { User } from './models/Users';

const user = new User({ name: 'dan', age: 25 });
const newUser = new User({}); // also works 'cause the ? in the interface make variable is optional

user.on('change', () => {
  console.log('Change#1');
});
user.on('click', () => {
  console.log('clicked');
});
user.on('change', () => {
  console.log('Change#2')
});

console.log(user);

user.trigger('change');
user.trigger('click');