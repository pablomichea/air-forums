import mongoose from 'mongoose';
import { Password } from '../util/password';

//Describe las propiedades que se requieren para crear un nuevo usuario
interface UserAttrs {
  //   id: number;
  username: string;
  email: string;
  password: string;
  postCount: number;
  rep: number;
  role: 'anon' | 'user' | 'mod' | 'admin';
}
//Describe las propiedades que tiene un User model, este los metodos que tiene el User model. Para decirle a TS que habra una funcion build disponible en el User model.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Describe las propiedades que un documento usuario tiene o las que un solo usuario tiene.
interface UserDoc extends mongoose.Document {
  //Si mongo agrega meta-propiedades es aqui donde hay que declararlas.
  username: string;
  email: string;
  password: string;
  postCount: number;
  rep: number;
  role: 'anon' | 'user' | 'mod' | 'admin';
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  postCount: { type: Number, required: true },
  rep: { type: Number, required: true },
  role: {
    type: String,
    enum: ['anon', 'user', 'mod', 'admin'],
    required: true,
    default: 'user',
  },
});

//ejecutamos una funcion en cada save()
userSchema.pre('save', async function (next) {
  //this === user
  //encriptar la clave solo si ha sido modificada. Si intentamos guardar un usuario que ya existe utilizando todas las propiedades, aunque no hayan cambiado isModified retorna true.
  if (this.isModified('password')) {
    // const hashed = await Password.toHash(this.get('password'));
    // this.set('password', hashed);
  }
  // next();
});

userSchema.statics.build = function (attrs: UserAttrs) {
  return new User(attrs);
};

export const User: UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema);
