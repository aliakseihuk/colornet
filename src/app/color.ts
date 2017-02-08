export class Color {
  constructor(
    public hex: string,
    public rgb: { red: number, green: number, blue: number },
    public likes: number,
    public real: number,
    public result: number,
    public error: number) {
  }
}