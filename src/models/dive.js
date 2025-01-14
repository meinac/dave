import { ASCENT_RATE, MIN_TIME } from '../constants/diving';

export default class Dive {
  constructor(diver) {
    this.diver = diver;
    this.time = 0;
    this.history = []
    this.maxDepth = 0;
    this.decoStops = [];
    this.autoEnding = false;
  }

  execute(events) {
    events.forEach(event => this.processEvent(event));
  }

  autoComplete() {
    if(this.diver.currentDepth == 0) return;

    this.autoEnding = true;

    if(this.diver.hasDeco()) this.completeDeco();

    this.autoMoveTo(0);
  }

  /*
  * Auto pilot
  */

  completeDeco() {
    while(this.diver.hasDeco()) {
      this.moveToDecoCeiling();
      this.doDeco();
    }

    /*
    * We repeat the last deco information.
    * Otherwise the last decompression stop looks as it was
    * unnecessary on the graph.
    */
    this.addLastDecoInformation();
  }

  /*
  * Deco obligation can change while we are ascending,
  * that's why we are ascending until the current depth
  * is the deco ceiling.
  *
  * TODO: Find where the deco clears and ascend to that depth
  * first to update the data.
  *
  * TODO: We can get another deco obligation while ascending,
  * so we need to check it and stop at new dept if there is.
  */
  moveToDecoCeiling() {
    while(this.diver.currentDepth > this.diver.decoCeiling())
      this.autoMoveTo(this.diver.decoCeiling());
  }

  doDeco() {
    this.stay(this.diver.currentDecoDuration());
  }

  autoMoveTo(depth) {
    const duration = Math.abs(this.diver.currentDepth - depth) / ASCENT_RATE;

    this.changeDepth(depth, duration);
  }

  /*
  * Processing events
  */

  processEvent(event) {
    event.type === 'NOTOX' ? this.processNotox(event) : this.processWaypoint(event);
  }

  processNotox(event) {
    this.diver.currentGas = event.gas;

    this.updateHistory('NOTOX', 0, { name: event.gas.name() });
  }

  processWaypoint(event) {
    if(this.isDescent(event)) this.maxDepth = event.depth;

    this.isDepthChange(event) ? this.changeDepth(event.depth, event.duration) : this.stay(event.duration);
  }

  changeDepth(depth, duration) {
    if(duration <= 0) return;

    const timeToNextDecoDepth = this.diver.timeToNextDecoDepthWhileMoving(depth, duration);

    if(duration <= timeToNextDecoDepth) return this.changeDepthWithoutDecoCheck(depth, duration);

    const timeToPassDecoPoint = timeToNextDecoDepth + MIN_TIME;
    const pace = (depth - this.diver.currentDepth) / duration;
    const toDecoDepth = this.diver.currentDepth + (pace * timeToPassDecoPoint);
    const remainingTime = duration - timeToPassDecoPoint;

    this.changeDepthWithoutDecoCheck(toDecoDepth, timeToPassDecoPoint);

    /*
    * If we are running auto pilot and found that there is a new deco obligation,
    * we stop ascending and continue the decompression routine.
    */
    if(this.autoEnding) return this.autoComplete();

    this.changeDepth(depth, remainingTime);
  }

  changeDepthWithoutDecoCheck(depth, duration) {
    this.diver.moveTo(depth, duration);

    this.updateHistory('Waypoint', duration);
  }

  stay(duration) {
    if(duration <= 0) return;

    const timeToNextDecoDepth = this.diver.timeToNextDecoDepth();

    if(timeToNextDecoDepth <= 0 || duration <= timeToNextDecoDepth)
      return this.stayWithoutDecoCheck(duration);

    const timeToPassDecoPoint = timeToNextDecoDepth + MIN_TIME;

    this.stayWithoutDecoCheck(timeToPassDecoPoint);
    this.stay(duration - timeToPassDecoPoint);
  }

  stayWithoutDecoCheck(duration) {
    this.diver.stay(duration);

    this.updateHistory('Waypoint', duration);
  }

  isDepthChange(event) {
    return this.isDescent(event) || this.isAscent(event);
  }

  isAscent(event) {
    return this.diver.currentDepth > event.depth;
  }

  isDescent(event) {
    return this.diver.currentDepth < event.depth;
  }

  updateHistory(type, duration, extra = {}) {
    this.time += duration;

    this.history.push({
      type: type,
      depth: this.diver.currentDepth,
      time: this.time,
      TTS: this.diver.TTS(),
      extra: extra
    });

    this.updateDecoInformation();
  }

  updateDecoInformation() {
    const decoCeiling = this.diver.decoCeiling();

    // Otherwise we don't clear the last deco.
    if(this.decoStops.length === 0 && decoCeiling === 0) return;

    this.decoStops.push({ depth: decoCeiling, time: this.time });
  }

  addLastDecoInformation() {
    const lastDecoInformation = this.decoStops.at(-1)

    this.decoStops.push({ depth: lastDecoInformation.depth, time: this.time });
  }
}
