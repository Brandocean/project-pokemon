import mongoose, { Schema } from 'mongoose'

interface Favorite {
  owner: mongoose.Types.ObjectId
  pokemonId: number
  name: string
  image: string
  types: string[]
}

const favoriteSchema = new Schema<Favorite>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pokemonId: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'El id del Pokémon debe ser un número entero',
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        try {
          const imageUrl = new URL(value)
          return imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:'
        } catch {
          return false
        }
      },
      message: 'La imagen debe ser una URL HTTP o HTTPS válida',
    },
  },
  types: {
    type: [{ type: String, required: true, trim: true }],
    required: true,
    default: undefined,
    validate: {
      validator: (types: string[]) =>
        types.length > 0 && types.every((type) => type.length > 0),
      message: 'El Pokémon debe tener al menos un tipo válido',
    },
  },
})

favoriteSchema.index({ owner: 1, pokemonId: 1 }, { unique: true })

const FavoriteModel = mongoose.model<Favorite>('Favorite', favoriteSchema)

export default FavoriteModel
