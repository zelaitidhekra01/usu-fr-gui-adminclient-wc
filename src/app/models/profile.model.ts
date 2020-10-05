export class Profile {
    identifier: string;
    name: string;
  
  
    constructor(identifier?: string, name?: string) {
      this.identifier = identifier || undefined;
      this.name = name || undefined;
    }
  }
  