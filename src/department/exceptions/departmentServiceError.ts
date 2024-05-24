export class DepartmentServiceError extends Error {
  constructor(message) {
    super('Department Service Error: ' + message);
  }
}
