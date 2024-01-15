export class Routes {
  static home = '/'
  static login = '/login'
  static logout = '/logout'
  static users = '/users'
  static user(id: string) {
    return `${Routes.users}/${id}`
  }
}
