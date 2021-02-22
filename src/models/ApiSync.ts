// ! Extraction Approach II: Pefactor User to use composition: ########################################################################################################################
// import axios, { AxiosPromise } from 'axios';

// interface HasId {
//   id?: number
// }



// export class Sync<T extends HasId> {
//   constructor(public rootUrl: string) { };

//   fetch(id: number): AxiosPromise {
//     return axios.get(`${this.rootUrl}/${id}`);
//   }

//   save(data: T): AxiosPromise {
//     /*
//       $ tsc --init
//       generate the tsconfig.json
//       in Strict Type-Checking Options
//       turn "strict": true                           /* Enable all strict type-checking options
//       make id: number | undefined (default id: number)
//     */
//     const { id } = data;

//     if (id) {
//       // update
//       return axios.put(`${this.rootUrl}/${id}`, data);
//     } else {
//       // create
//       return axios.post(this.rootUrl, data);
//     }
//   }
// }

//! III Refactor User to be a reusable class that can represent any piece of data, not just a User

import axios, { AxiosPromise } from 'axios';

interface HasId {
  id?: number
}



export class ApiSync<T extends HasId> {
  constructor(public rootUrl: string) { };

  fetch(id: number): AxiosPromise {
    return axios.get(`${this.rootUrl}/${id}`);
  }

  save(data: T): AxiosPromise {
    /*
      $ tsc --init
      generate the tsconfig.json
      in Strict Type-Checking Options
      turn "strict": true                           /* Enable all strict type-checking options
      make id: number | undefined (default id: number)
    */
    const { id } = data;

    if (id) {
      // update
      return axios.put(`${this.rootUrl}/${id}`, data);
    } else {
      // create
      return axios.post(this.rootUrl, data);
    }
  }
}