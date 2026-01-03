export interface ISignIn {
  email: string
  password: string
}

export interface IRegister {
  fullName: string
  email: string
  password: string
  phoneNumber: string
  role?: 'CUSTOMER' | 'STAFF' | 'ADMIN'
  gender?: 'male' | 'female' | 'other'
  birthday?: Date
  citizenId?: string
}
