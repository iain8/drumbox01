import { Component, h } from 'preact';

export default class Knob extends Component<any, any> {
  public static defaultProps = {
    angleArc: 360,
    angleOffset: 0,
    bgColor: '#EEE',
    canvasClassName: null,
    className: null,
    clockwise: true,
    cursor: false,
    disableMouseWheel: false,
    disableTextInput: false,
    displayInput: true,
    fgColor: '#EA2',
    font: 'Arial',
    fontWeight: 'bold',
    height: 200,
    inputColor: '',
    lineCap: 'butt',
    log: false,
    max: 100,
    min: 0,
    onChangeEnd: () => ({}),
    readOnly: false,
    step: 1,
    stopper: true,
    thickness: 0.35,
    width: 200,
  };

  private angleArc: number;
  private angleOffset: number;
  private canvasRef: HTMLCanvasElement;
  private cursorExt: number;
  private digits: number;
  private endAngle: number;
  private h: number;
  private lineWidth: number;
  private radius: number;
  private startAngle: number;
  private touchIndex: number;
  private w: number;
  private xy: number;

  constructor(props) {
    super(props);
    this.w = this.props.width || 200;
    this.h = this.props.height || this.w;
    this.cursorExt = this.props.cursor === true ? 0.3 : this.props.cursor / 100;
    this.angleArc = this.props.angleArc * Math.PI / 180;
    this.angleOffset = this.props.angleOffset * Math.PI / 180;
    this.startAngle = (1.5 * Math.PI) + this.angleOffset;
    this.endAngle = (1.5 * Math.PI) + this.angleOffset + this.angleArc;
    this.digits = Math.max(
      String(Math.abs(this.props.min)).length,
      String(Math.abs(this.props.max)).length,
      2,
    ) + 2;
  }

  public componentDidMount() {
    this.drawCanvas();
    if (!this.props.readOnly) {
      // TODO: { passive: false }
      this.canvasRef.addEventListener('touchstart', this.handleTouchStart);
    }
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.width && this.w !== nextProps.width) {
      this.w = nextProps.width;
    }
    if (nextProps.height && this.h !== nextProps.height) {
      this.h = nextProps.height;
    }
  }

  public componentDidUpdate() {
    this.drawCanvas();
  }

  public componentWillUnmount() {
    this.canvasRef.removeEventListener('touchstart', this.handleTouchStart);
  }

  public render() {
    const {
      canvasClassName,
      className,
      disableMouseWheel,
      id, // TODO: shouldn't be necessary anyway
      readOnly,
      title,
      value,
    } = this.props;

    return (
      <div
        class='knob'
        id={ id }
        style={{ width: this.w, height: this.h, display: 'inline-block' }}
        onWheel={readOnly || disableMouseWheel ? null : this.handleWheel}
      >
        <canvas
          ref={(ref) => { this.canvasRef = ref as HTMLCanvasElement; }}
          className={canvasClassName}
          style={{ width: '100%', height: '100%' }}
          onMouseDown={readOnly ? null : this.handleMouseDown}
          title={title ? `${title}: ${value}` : value}
        />
        {this.renderCenter()}
      </div>
    );
  }

  private getArcToValue = (v) => {
    let startAngle;
    let endAngle;
    const angle = !this.props.log
    ? ((v - this.props.min) * this.angleArc) / (this.props.max - this.props.min)
    : Math.log(Math.pow((v / this.props.min), this.angleArc)) / Math.log(this.props.max / this.props.min);
    if (!this.props.clockwise) {
      startAngle = this.endAngle + 0.00001;
      endAngle = startAngle - angle - 0.00001;
    } else {
      startAngle = this.startAngle - 0.00001;
      endAngle = startAngle + angle + 0.00001;
    }
    if (this.props.cursor) {
      startAngle = endAngle - this.cursorExt;
      endAngle += this.cursorExt;
    }
    return {
      acw: !this.props.clockwise && !this.props.cursor,
      endAngle,
      startAngle,
    };
  }

  // Calculate ratio to scale canvas to avoid blurriness on HiDPI devices
  private getCanvasScale = (ctx) => {
    const devicePixelRatio = window.devicePixelRatio ||
      window.screen.deviceXDPI / window.screen.logicalXDPI || // IE10
      1;
    const backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1;
    return devicePixelRatio / backingStoreRatio;
  }

  private coerceToStep = (v) => {
    let val = !this.props.log
    ? (~~(((v < 0) ? -0.5 : 0.5) + (v / this.props.step))) * this.props.step
    : Math.pow(this.props.step, ~~(((Math.abs(v) < 1) ? -0.5 : 0.5) + (Math.log(v) / Math.log(this.props.step))));
    val = Math.max(Math.min(val, this.props.max), this.props.min);
    if (isNaN(val)) { val = 0; }
    return Math.round(val * 1000) / 1000;
  }

  private eventToValue = (e) => {
    const bounds = this.canvasRef.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    let a = Math.atan2(x - (this.w / 2), (this.w / 2) - y) - this.angleOffset;
    if (!this.props.clockwise) {
      a = this.angleArc - a - (2 * Math.PI);
    }
    if (this.angleArc !== Math.PI * 2 && (a < 0) && (a > -0.5)) {
      a = 0;
    } else if (a < 0) {
      a += Math.PI * 2;
    }
    const val = !this.props.log
    ? (a * (this.props.max - this.props.min) / this.angleArc) + this.props.min
    : Math.pow(this.props.max / this.props.min, a / this.angleArc) * this.props.min;
    return this.coerceToStep(val);
  }

  private handleMouseDown = (e) => {
    this.props.onChange(this.eventToValue(e));
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('keyup', this.handleEsc);
  }

  private handleMouseMove = (e) => {
    e.preventDefault();
    this.props.onChange(this.eventToValue(e));
  }

  private handleMouseUp = (e) => {
    this.props.onChangeEnd(this.eventToValue(e));
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('keyup', this.handleEsc);
  }

  private handleTouchStart = (e) => {
    e.preventDefault();
    this.touchIndex = e.targetTouches.length - 1;
    this.props.onChange(this.eventToValue(e.targetTouches[this.touchIndex]));
    // TODO: { passive: false }
    document.addEventListener('touchmove', this.handleTouchMove);
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchcancel', this.handleTouchEnd);
  }

  private handleTouchMove = (e) => {
    e.preventDefault();
    this.props.onChange(this.eventToValue(e.targetTouches[this.touchIndex]));
  }

  private handleTouchEnd = (e) => {
    this.props.onChangeEnd(this.eventToValue(e));
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchcancel', this.handleTouchEnd);
  }

  private handleEsc = (e) => {
    if (e.keyCode === 27) {
      e.preventDefault();
      this.handleMouseUp(e);
    }
  }

  private handleTextInput = (e) => {
    const val = Math.max(Math.min(+e.target.value, this.props.max), this.props.min) || this.props.min;
    this.props.onChange(val);
  }

  private handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaX > 0 || e.deltaY > 0) {
      this.props.onChange(this.coerceToStep(
        !this.props.log
        ? this.props.value + this.props.step
        : this.props.value * this.props.step,
      ));
    } else if (e.deltaX < 0 || e.deltaY < 0) {
      this.props.onChange(this.coerceToStep(
        !this.props.log
        ? this.props.value - this.props.step
        : this.props.value / this.props.step,
      ));
    }
  }

  private handleArrowKey = (e) => {
    if (e.keyCode === 37 || e.keyCode === 40) {
      e.preventDefault();
      this.props.onChange(this.coerceToStep(
        this.props.log
          ? this.props.value / this.props.stepthis.props.value - this.props.step
          : this.props.value - this.props.step,
      ));
    } else if (e.keyCode === 38 || e.keyCode === 39) {
      e.preventDefault();
      this.props.onChange(this.coerceToStep(
        this.props.log ? this.props.value * this.props.step : this.props.value + this.props.step,
      ));
    }
  }

  private inputStyle = () => ({
    WebkitAppearance: 'none',
    background: 'none',
    border: 0,
    color: this.props.inputColor || this.props.fgColor,
    font: `${this.props.fontWeight} ${(this.w / this.digits) >> 0}px ${this.props.font}`,
    height: `${(this.w / 3) >> 0}px`,
    marginLeft: `-${((this.w * 3 / 4) + 2) >> 0}px`,
    marginTop: `${(this.w / 3) >> 0}px`,
    padding: '0px',
    position: 'absolute',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: `${((this.w / 2) + 4) >> 0}px`,
  })

  private drawCanvas() {
    const ctx = this.canvasRef.getContext('2d');
    const scale = this.getCanvasScale(ctx);
    this.canvasRef.width = this.w * scale; // clears the canvas
    this.canvasRef.height = this.h * scale;
    ctx.scale(scale, scale);
    this.xy = this.w / 2; // coordinates of canvas center
    this.lineWidth = this.xy * this.props.thickness;
    this.radius = this.xy - (this.lineWidth / 2);
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = this.props.lineCap;
    // background arc
    ctx.beginPath();
    ctx.strokeStyle = this.props.bgColor;
    ctx.arc(
      this.xy,
      this.xy,
      this.radius,
      this.endAngle - 0.00001,
      this.startAngle + 0.00001,
      true,
    );
    ctx.stroke();
    // foreground arc
    const a = this.getArcToValue(this.props.value);
    ctx.beginPath();
    ctx.strokeStyle = this.props.fgColor;
    ctx.arc(
      this.xy,
      this.xy,
      this.radius,
      a.startAngle,
      a.endAngle,
      a.acw,
    );
    ctx.stroke();
  }

  private renderCenter = () => {
    const {
      displayCustom,
      displayInput,
      disableTextInput,
      readOnly,
      value,
    } = this.props;

    if (displayInput) {
      return (
        <input
          style={this.inputStyle()}
          type='text'
          value={value}
          onChange={this.handleTextInput}
          onKeyDown={this.handleArrowKey}
          readOnly={readOnly || disableTextInput}
        />
      );
    } else if (displayCustom && typeof displayCustom === 'function') {
      return displayCustom();
    }
    return null;
  }
}
