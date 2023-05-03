// //
// import { Db, MongoClient, ServerApiVersion } from 'mongodb';
// const uri: string = 'mongodb+srv://pablomichea:pSGHPfNi4cpZNZuq@war-zdb.gkhztem.mongodb.net/?retryWrites=true&w=majority';

// let _db: Db;

// export async function mongoConnect(cb: CallableFunction) {
//   const client: MongoClient = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     },
//   });
//   try {
//     await client.connect();
//     _db = client.db('war-z');
//     console.log('You successfully connected to MongoDB!');
//     // _db
//     //   .collection('boards')
//     //   .find()
//     //   .toArray()
//     //   .then(res => console.log(res))
//     //   .catch(err => console.error(err));
//     cb();
//   } catch (err) {
//     console.error(err);
//   }
// }

// export function getDb(): Promise<Db> {
//   return new Promise((resolve, reject) => {
//     if (!_db) {
//       return reject('No database found');
//     }
//     resolve(_db);
//   });
// }

// // //exporto 2 metodos, uno para conectar y mantener la coneccion con la DB
// // //y otro metodo donde retornamos acceso a la DB si existe

// // //solamente si devuelve el cliente inicia el servidor con la funcion callback
