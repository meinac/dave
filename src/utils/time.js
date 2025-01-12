export default class Time {
  static humanizeMinutes(input) {
    const seconds = Math.floor((input % 1) * 60);
    const paddedSeconds = seconds.toString().padStart(2, '0');
    const minutes = Math.floor(input);

    return `${minutes}m ${seconds}s`;
  }
}
