export class ChildDoesNotExistError extends Error {
  constructor(childId: string) {
    super(`Child with id ${childId} does not exist`);
  }
}