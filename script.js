const soundArray = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  }, 
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  }, 
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  }, 
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  }, 
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  }, 
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  }, 
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  }, 
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  }, 
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];

const sampleArray = [81, 87, 69, 65, 83, 68, 90, 88, 67];

const recordArray = [];

class DrumKey extends React.Component{
  constructor(props){
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.playSound = this.playSound.bind(this);
  }
  handleKeyPress(e) {
    if (e.keyCode === this.props.keyCode) {
      this.playSound();
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  playSound(e) {
    if (this.props.power) {
      const sound = document.getElementById(this.props.keyTrigger);
      sound.currentTime = 0;
      sound.play();

      const button = document.getElementById(this.props.id);
      button.style.backgroundColor = "green";
      setTimeout(() => { button.style.backgroundColor = '#340D65'; }, 500);
      this.props.updateDisplay(this.props.id, 500);

      if (this.props.record){
        recordArray.push(this.props.keyCode);
      }
    }
  }
  render(){
    return(
      <div id={this.props.id} 
        onClick={this.playSound} 
        className="drum-pad" >
          <audio className='clip' id={this.props.keyTrigger} src={this.props.url}></audio>
          {this.props.keyTrigger}
      </div>
    );
  }
}

class DrumMachine extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      power: false,
      record: false,
      play: false,
      display: ''
    }
    this.powerButton = this.powerButton.bind(this);
    this.playButton = this.playButton.bind(this);
    this.recordButton = this.recordButton.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
  }
  updateDisplay(message, duration) {
    this.setState({ display: message });
    setTimeout(() => this.clearDisplay(), duration);
  }
  clearDisplay() { this.setState({ display: ''}); }
  powerButton() {
    if (!this.state.power) {
      document.getElementById("btn-power").style.color="green";
      this.setState({ power: true })
      this.updateDisplay ('Initializing...', 750);
      this.playButton();
    }
    else {
      document.getElementById("btn-power").style.color="red"
      document.getElementById("btn-record").style.color="red";
      document.getElementById("btn-play").style.color="red";
      this.setState({
        power: false,
        record: false,
        play: false
      })
      this.updateDisplay ('Shutting down...', 750);
    }
  }
  recordButton() {
    if (this.state.power && !this.state.play) {
      if (!this.state.record) {
        recordArray.length = 0;
        this.setState({ record: true });
        document.getElementById("btn-record").style.color="green";
        updateDisplay('Start recording...', 500);
      }
      else {
        this.setState({ record: false });
        document.getElementById("btn-record").style.color="red";
      }
    }
  }
  playButton() {
    if (this.state.power && !this.state.record && !this.state.play) {
        this.setState({ play: true });
        document.getElementById("btn-play").style.color="green";
        var arr = (recordArray.length > 0 ? recordArray : sampleArray);
        arr.forEach(function(key, index){
          setTimeout(function(){
            fireKeyboardEvent('keydown', key);
          }, 500 * index );    
        });
        setTimeout(() => {
          this.setState({ play: false });
          document.getElementById("btn-play").style.color="red";
        }, 500 * arr.length);
      }
  }
  render() {
    return (
      <div id="drum-machine">
        <div id="title">Drum Machine</div>
        <div className="btn-control">
          <div id="btn-power"
            className="btn" 
            onClick={this.powerButton}>
            <i className="fa fa-power-off"></i>
					</div>
					<div id="btn-record"
            className="btn"
            onClick={this.recordButton}>
            <i className="fa fa-microphone"></i>
					</div>
          <div id="btn-play"
            className="btn" 
            onClick={this.playButton}>
            <i className="fa fa-play"></i>
					</div>
				</div>
        <div id="display">
          {this.state.display}
        </div>
        <div id="drum-pad-set">
          {soundArray.map((item)=>{
            return <DrumKey 
                     power={this.state.power}
                     record={this.state.record}
                     keyTrigger={item.keyTrigger}
                     keyCode={item.keyCode}
                     id={item.id}
                     url={item.url}
                     updateDisplay={this.updateDisplay}
                     />
          })}
        </div>
      </div>
    );
  }
}

function fireKeyboardEvent(event, keycode) {
  console.log('in fireKeyboardEvent=' + keycode);
    var keyboardEvent = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");
    if(keyboardEvent.initEvent) {
        keyboardEvent.initEvent(event, true, true);
    }
    keyboardEvent.keyCode = keycode;
    keyboardEvent.which = keycode;
    document.dispatchEvent ? document.dispatchEvent(keyboardEvent) 
                           : document.fireEvent(event, keyboardEvent);
  }

ReactDOM.render(
  <DrumMachine />,
  document.getElementById('root')
);
