class DriveTrain {
    constructor(props) {
      this.verbose = props.verbose || false;
    }
    async init() {
      if (this.verbose) console.log('DriveTrain init()');
    }
    async start() {
      if (this.verbose) console.log('DriveTrain start()');
    }
}
exports.DriveTrain = DriveTrain;