import mongoose, { Schema } from 'mongoose'

interface User {
  email: string
  password: string
  name: string
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'El correo electrónico no es válido',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
})

const UserModel = mongoose.model<User>('User', userSchema)

export default UserModel
