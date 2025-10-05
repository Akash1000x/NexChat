export type ModelsCategory = {
  id: string,
  name: string,
  models: Models[]
}

export type Models = {
  id: string,
  name: string,
  isActive: boolean,
  isPremium: boolean,
  isDefault: boolean,
  categoryId: string
}