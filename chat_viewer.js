const e = React.createElement;
var myName;
var cleanedData;
const fileSelector = document.getElementById('fileupload');

fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;
  console.log(fileList);
  readJSON(fileList[0]);
});

const domButton = document.querySelector('#submit-button');
ReactDOM.render(
  e('button', {onClick: () => handleSubmit()}, "Submit"),
  domButton
);

function handleSubmit(){
  ReactDOM.render(e(ChatArea), document.querySelector('#chat-area'))
  const domChat = document.querySelector('#chat-display');
  ReactDOM.render(e(ChatBubble, cleanedData.msgs), domChat);
  addChatTitle();
}

function readJSON(file) {
  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    console.log("JSON load successful");
    msgObject = JSON.parse(event.target.result);
    cleanedData = cleanData(msgObject);
    promptParticipantRadio(cleanedData.participants);
  });

  reader.readAsText(file);
}

function cleanData(raw) {
  var participants = raw.participants.map(person => person);
  var title = raw.title;
  var msgs = raw.messages.reverse();
  var cleaned = {
    "participants": participants,
    "title": title,
    "msgs": msgs,
  }

  return cleaned;
}

function addChatTitle() {
  const chatTitle = document.querySelector('#chat-title')
  ReactDOM.render(e('h2', {}, cleanedData.title), chatTitle);
}

function promptParticipantRadio(participants){
  const participantsRadio = document.querySelector('#participants-radio');
  var radioElements = []

  radioElements.push(e('p', {}, 'Which participant are you?'))

  participants.forEach(function (n, i) {
    radioElements.push(
      e('input', {
        type: 'radio',
        name: 'participant',
        onClick: () => radioClick(n),
        id: ("radio-button-" + i)
      })
    );
    radioElements.push(
      e('label', {onClick: () => document.getElementById('radio-button-' + i).click()}, n)
    );
    radioElements.push(e('br'));
  });
  ReactDOM.render(radioElements,
                  participantsRadio);

  document.querySelector("#radio-button-0").click();
}

function radioClick(name) {
  myName = name;
  console.log(`Setting ${name} as blue bubble`);
}

class ChatBubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isImageFullScreen: false,
      fullScreenImageUri: null
    };
  }

  openFullSizeImage = (uri) => {
    this.setState({ isImageFullScreen: true, fullScreenImageUri: uri });
  }

  closeFullSizeImage = () => {
    this.setState({ isImageFullScreen: false, fullScreenImageUri: null });
  }

  generateReactions(reactions) {
    if (!reactions || reactions.length === 0) return null;
    
    return e(
      'div',
      { className: 'reaction-container' },
      reactions.map((reaction, index) => 
        e('span', { key: index, className: 'reaction', title: reaction.reaction }, 
          `${reaction.reaction} ${reaction.actor}`
        )
      )
    );
  }

  generateBubbles(msg) {
    const isOwnMessage = msg.senderName === myName;
    const bubbleClass = isOwnMessage ? "bubble-left" : "bubble-right";
    const nameClass = isOwnMessage ? "name-left" : "name-right";
    const tooltipClass = isOwnMessage ? "tooltip-left" : "tooltip-right";

    let content = this.wrapEmojis(msg.text);
    if (this.isValidURL(content)) {
      if (this.isAudioOrVideoURL(content)) {
        content = e(this.getMediaType(content), { controls: true, src: content });
      } else {
        content = e('a', { href: content, target: '_blank' }, content);
      }
    }

    return e(
      'div', {className: "message-container"},
      e('div', {className: nameClass}, 
        e('span', null, msg.senderName),
        e('span', {className: 'timestamp'}, timeConverter(msg.timestamp))
      ),
      e('div', {className: bubbleClass}, 
        content,
        msg.media && msg.media.length > 0 && this.generateMedia(msg.media[0].uri),
        this.generateReactions(msg.reactions)
      )
    );
  }

  wrapEmojis(text) {
    const emojiRegex = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F201}-\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F393}\u{1F3A0}-\u{1F3CA}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F4}\u{1F3F8}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F57A}\u{1F595}\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CC}\u{1F6D0}-\u{1F6D2}\u{1F6EB}-\u{1F6EC}\u{1F6F4}-\u{1F6F9}\u{1F910}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F9FF}\u{1FA70}-\u{1FA73}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA82}\u{1FA90}-\u{1FA95}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F201}-\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F393}\u{1F3A0}-\u{1F3CA}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F4}\u{1F3F8}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F57A}\u{1F595}\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CC}\u{1F6D0}-\u{1F6D2}\u{1F6EB}-\u{1F6EC}\u{1F6F4}-\u{1F6F9}\u{1F910}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F9FF}\u{1FA70}-\u{1FA73}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA82}\u{1FA90}-\u{1FA95}])/gu;
    return text.split(emojiRegex).map((part, i) => {
      if (emojiRegex.test(part)) {
        return e('span', { key: i, className: 'emoji-hover', title: part }, part);
      }
      return part;
    });
  }

  generateMedia(uri) {
    if (this.isAudioOrVideoURL(uri)) {
      return e(this.getMediaType(uri), { controls: true, src: uri });
    } else {
      return e('img', {
        src: uri,
        alt: "Chat image",
        className: "chat-image",
        onClick: () => this.openFullSizeImage(uri)
      });
    }
  }

  isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  isAudioOrVideoURL(url) {
    return /\.(mp3|wav|ogg|mp4|webm|ogv)$/i.test(url);
  }

  getMediaType(url) {
    return /\.(mp3|wav|ogg)$/i.test(url) ? 'audio' : 'video';
  }

  render() {
    return e(
      React.Fragment,
      null,
      cleanedData.msgs.map(msg => this.generateBubbles(msg)),
      e(
        'div',
        {
          className: "full-screen-image-container",
          style: { display: this.state.isImageFullScreen ? 'flex' : 'none' },
          onClick: this.closeFullSizeImage
        },
        e('img', {
          src: this.state.fullScreenImageUri,
          alt: "Full-size image",
          className: "full-screen-image"
        })
      )
    );
  }
}

class ChatArea extends React.Component {
  render() {
    return (
      e('div', {id: "chat-display"}, null)
    );
  }
}

function timeConverter(UNIX_timestamp) {
  const date = new Date(UNIX_timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'EST'
  });
}
